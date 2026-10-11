
from fastapi import APIRouter

from app.schemas.review import ReviewInput
from app.services.classification import predict_review


router = APIRouter(
    prefix="/api/v1/reviews",
    tags=["Reviews"]
)


@router.post("/predict")
def predict_review_controller(review: ReviewInput):
    result = predict_review(review)
    return result
