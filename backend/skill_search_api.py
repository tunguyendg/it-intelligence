"""Standalone FastAPI router. Put in backend/skill_search_api.py.
Needs pre-exported artifacts/skill_{vectorizer,matrix}.joblib and skill_companies.json.
"""
import json
import re
from functools import lru_cache
from pathlib import Path

import joblib
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from sklearn.metrics.pairwise import cosine_similarity

ROOT = Path(__file__).resolve().parent
ART = ROOT / "artifacts"
router = APIRouter(prefix="/api/v1/companies", tags=["Skill Search"])

ALIASES = {
    "reactjs": "react", "react.js": "react",
    "nodejs": "node.js", "node js": "node.js",
    "vuejs": "vue.js", "vue js": "vue.js",
    "postgres": "postgresql", "golang": "go", "k8s": "kubernetes",
}


def normalize(text: str) -> str:
    text = text.lower().strip()
    for alias, canonical in sorted(ALIASES.items(), key=lambda x: -len(x[0])):
        text = re.sub(rf"(?<!\w){re.escape(alias)}(?!\w)", canonical, text)
    return re.sub(r"\s+", " ", text).strip()


def has_skill(normalized_text: str, raw_text: str, skill: str) -> bool:
    if skill == "go":
        # Safe/conservative: do not count the ordinary English word 'go'.
        return bool(re.search(r"(?<!\w)golang(?!\w)", raw_text, re.I))
    text = normalized_text
    if skill == "react":
        text = re.sub(r"(?<![\w.+#])react\s+native(?![\w.+#])", " ", text)
    return bool(re.search(rf"(?<![\w.+#]){re.escape(skill)}(?![\w.+#])", text))


@lru_cache(maxsize=1)
def load_index():
    vectorizer = joblib.load(ART / "skill_vectorizer.joblib")
    matrix = joblib.load(ART / "skill_matrix.joblib")
    companies = json.loads((ART / "skill_companies.json").read_text(encoding="utf-8"))
    display_path = ART / "recommendation_companies.json"
    display = json.loads(display_path.read_text(encoding="utf-8")) if display_path.exists() else []
    by_id = {str(c["id"]): c for c in display}
    if matrix.shape[0] != len(companies):
        raise RuntimeError("Skill index rows do not match company records")
    return vectorizer, matrix, companies, by_id


class SkillSearchRequest(BaseModel):
    query: str = Field(min_length=1, max_length=250)
    top_k: int = Field(default=5, ge=1, le=20)


@router.post("/search-by-skills")
def search_by_skills(payload: SkillSearchRequest):
    requested = list(dict.fromkeys(
        normalize(x) for x in payload.query.split(",") if normalize(x)
    ))
    if not requested:
        raise HTTPException(status_code=422, detail="Enter at least one comma-separated skill")
    if len(requested) > 12:
        raise HTTPException(status_code=422, detail="Maximum 12 skills per query")
    try:
        vectorizer, matrix, companies, by_id = load_index()
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Skill index unavailable: {type(exc).__name__}") from exc
    scores = cosine_similarity(vectorizer.transform([" ".join(requested)]), matrix)[0]
    results = []
    for i, company in enumerate(companies):
        normalized_text = company["skills_normalized"]
        raw_text = company["skills_raw"]
        matched = [s for s in requested if has_skill(normalized_text, raw_text, s)]
        if not matched:
            continue
        missing = [s for s in requested if s not in matched]
        metadata = by_id.get(str(company["id"]), {})
        results.append({
            "id": company["id"], "name": company["name"],
            "matched_skills": matched, "missing_skills": missing,
            "matched_count": len(matched), "requested_count": len(requested),
            "coverage": round(len(matched) / len(requested), 4),
            "cosine": round(float(scores[i]), 4),
            "industry": metadata.get("Company industry"),
            "company_size": metadata.get("Company size"),
            "country": metadata.get("Country"),
            "href": str(metadata.get("Href") or "").strip(),
        })
    results.sort(key=lambda r: (-r["matched_count"], -r["cosine"], r["name"]))
    return {"query": payload.query, "requested_skills": requested,
            "total_matches": len(results), "results": results[:payload.top_k],
            "indexed_companies": len(companies)}


@router.get("/skill-search-health")
def skill_search_health():
    try:
        _, matrix, _, _ = load_index()
        return {"status": "ok", "indexed_companies": matrix.shape[0]}
    except Exception as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
