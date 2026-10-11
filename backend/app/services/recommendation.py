
import json
from pathlib import Path

import joblib
import numpy as np

# backend/artifacts/
ARTIFACT_DIR = Path(__file__).resolve().parents[2] / "artifacts"

# Load dữ liệu/model một lần khi module được import
companies = json.loads(
    (ARTIFACT_DIR / "recommendation_companies.json").read_text(
        encoding="utf-8"
    )
)

similarity = joblib.load(
    ARTIFACT_DIR / "recommendation_similarity.joblib"
)


def get_similar_companies(company_id: int, top_k: int = 5):
    # Tìm đúng vị trí company trong danh sách
    idx = next(
        (
            i for i, company in enumerate(companies)
            if int(company["id"]) == company_id
        ),
        None
    )

    if idx is None:
        return None

    # Lấy điểm similarity của công ty đang chọn
    scores = np.asarray(similarity[idx]).ravel()

    # Sắp xếp điểm từ cao xuống thấp, bỏ chính công ty đó
    ranked_indices = np.argsort(-scores)
    ranked_indices = [
        int(i) for i in ranked_indices if i != idx
    ][:top_k]

    results = []

    for i in ranked_indices:
        company = companies[i]

        results.append({
            "id": int(company["id"]),
            "name": company["Company Name"],
            "industry": company.get("Company industry"),
            "similarity": round(float(scores[i]), 4),
            "url": company.get("Href")
        })

    return {
        "selected_company": {
            "id": company_id,
            "name": companies[idx]["Company Name"]
        },
        "recommendations": results
    }
