
from pydantic import BaseModel, Field


class ReviewInput(BaseModel):
    # Nội dung review
    title: str = ""
    what_i_liked: str = ""
    suggestions_for_improvement: str = ""

    # 6 điểm đánh giá từ 1 đến 5
    rating: float = Field(ge=1, le=5)
    salary_benefits: float = Field(ge=1, le=5)
    training_learning: float = Field(ge=1, le=5)
    management_cares: float = Field(ge=1, le=5)
    culture_fun: float = Field(ge=1, le=5)
    office_workspace: float = Field(ge=1, le=5)
