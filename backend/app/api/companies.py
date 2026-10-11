
from fastapi import APIRouter, HTTPException, Query

from app.services.recommendation import (
    companies,
    get_similar_companies
)

router = APIRouter(
    prefix="/api/v1/companies",
    tags=["Companies"]
)


# API 1: Lấy danh sách tất cả công ty
@router.get("")
def get_all_companies():
    results = []

    for company in companies:
        results.append({
            "id": int(company["id"]),
            "name": company["Company Name"],
            "industry": company.get("Company industry"),
            "type": company.get("Company Type"),
            "size": company.get("Company size"),
            "country": company.get("Country"),
            "url": company.get("Href")
        })

    return {
        "total": len(results),
        "companies": results
    }


# API 2: Gợi ý các công ty tương tự
@router.get("/{company_id}/similar")
def similar_companies(
    company_id: int,
    top_k: int = Query(default=5, ge=1, le=20)
):
    result = get_similar_companies(company_id, top_k)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Company not found"
        )

    return result
