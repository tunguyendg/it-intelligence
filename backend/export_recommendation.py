"""Export the Project 02 TF-IDF + Cosine Similarity recommender.

Run from backend/: python export_recommendation.py
Reproduces master notebook cells 27 and 29, without retraining Classification.
"""
from pathlib import Path
import json
import re

import joblib
import numpy as np
import pandas as pd
import sklearn
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

BASE = Path(__file__).resolve().parent
DATA = BASE / "data" / "Overview_Companies.xlsx"
OUT = BASE / "artifacts"
OUT.mkdir(parents=True, exist_ok=True)

PROFILE_COLS = [
    "Company overview", "Our key skills", "Why you'll love working here",
    "Company industry", "Company Type", "Company size", "Country",
]


def normalize_text(text):
    text = "" if pd.isna(text) else str(text)
    text = text.lower()
    text = re.sub(r"https?://\S+|www\.\S+", " ", text)
    text = re.sub(r"[^\w\s+#.\-]", " ", text, flags=re.UNICODE)
    return re.sub(r"\s+", " ", text).strip()


def build_profile(row):
    overview = normalize_text(row["Company overview"])
    skills = normalize_text(row["Our key skills"])
    why = normalize_text(row["Why you'll love working here"])
    industry = normalize_text(row["Company industry"])
    meta = [normalize_text(row[c]) for c in ["Company Type", "Company size", "Country"]]
    return " ".join(x for x in [industry, industry, skills, skills, *meta, overview, why] if x)


def main():
    df = pd.read_excel(DATA).reset_index(drop=True)
    required = ["id", "Company Name", *PROFILE_COLS]
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise ValueError(f"Missing columns: {missing}")
    if df["id"].duplicated().any():
        raise ValueError("Duplicate company IDs; cannot reliably map recommendations")
    for c in PROFILE_COLS:
        df[c] = df[c].fillna("").astype(str)
    df["company_profile"] = df.apply(build_profile, axis=1)
    if df["company_profile"].eq("").any():
        raise ValueError("Empty company profile detected")

    vectorizer = TfidfVectorizer(ngram_range=(1, 2), min_df=2, max_df=.95, sublinear_tf=True)
    vectors = vectorizer.fit_transform(df["company_profile"])
    similarity = cosine_similarity(vectors)
    np.fill_diagonal(similarity, 1.0)

    # Row number is the only index to use with similarity; do not sort the data afterward.
    # The saved companies table is stored in exactly the same order as the matrix.
    display_cols = [c for c in ["id", "Company Name", "Company Type", "Company industry",
        "Company size", "Country", "Working days", "Overtime Policy", "Location", "Href"]
        if c in df.columns]
    companies = df[display_cols].copy()
    companies = companies.where(pd.notna(companies), None)
    records = companies.to_dict(orient="records")
    for record in records:
        for key, val in list(record.items()):
            if isinstance(val, (np.integer,)):
                record[key] = int(val)
            elif isinstance(val, (np.floating,)):
                record[key] = float(val)
            elif val is not None and pd.isna(val):
                record[key] = None

    joblib.dump(vectorizer, OUT / "recommendation_vectorizer.joblib", compress=3)
    joblib.dump(similarity, OUT / "recommendation_similarity.joblib", compress=3)
    (OUT / "recommendation_companies.json").write_text(
        json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    metadata = {
        "algorithm": "TF-IDF + Cosine Similarity",
        "company_count": len(df),
        "vocabulary_size": len(vectorizer.vocabulary_),
        "vector_shape": list(vectors.shape),
        "similarity_shape": list(similarity.shape),
        "sklearn_version": sklearn.__version__,
        "profile_fields": PROFILE_COLS,
        "profile_weights": {"Company industry": 2, "Our key skills": 2},
        "source": DATA.name,
        "notebook_reference": "PROJECT_02_FINAL_EVIDENCE_HUNG_STYLE.ipynb cells 27 and 29",
    }
    (OUT / "recommendation_metadata.json").write_text(
        json.dumps(metadata, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"Companies: {len(df)} | Vocabulary: {len(vectorizer.vocabulary_)}")
    print(f"TF-IDF shape: {vectors.shape} | Similarity shape: {similarity.shape}")
    print("\nTOP 5 recommendations for first company:")
    top = np.argsort(-similarity[0], kind="stable")
    top = [int(i) for i in top if i != 0][:5]
    for i in top:
        print(f"  {df.iloc[i]['Company Name']} | similarity={similarity[0, i]:.4f}")
    assert (OUT / "recommendation_similarity.joblib").exists()
    loaded_similarity = joblib.load(OUT / "recommendation_similarity.joblib")
    assert loaded_similarity.shape == (len(df), len(df))
    loaded_companies = json.loads((OUT / "recommendation_companies.json").read_text(encoding="utf-8"))
    assert len(loaded_companies) == len(df)
    print("\nRELOAD TEST OK")
    print("Artifacts saved in:", OUT)


if __name__ == "__main__":
    main()
