
import re
from pathlib import Path

import joblib
import pandas as pd

from app.schemas.review import ReviewInput


# Đường dẫn tới thư mục backend/artifacts
ARTIFACT_DIR = Path(__file__).resolve().parents[2] / "artifacts"

MODEL_PATH = ARTIFACT_DIR / "classification_pipeline.joblib"

# Load model một lần khi backend khởi động
model = joblib.load(MODEL_PATH)


def normalize_text(text: str) -> str:
    text = "" if pd.isna(text) else str(text)
    text = text.lower()
    text = re.sub(r"https?://\S+|www\.\S+", " ", text)
    text = re.sub(r"[^\w\s+#.\-]", " ", text, flags=re.UNICODE)
    return re.sub(r"\s+", " ", text).strip()


def predict_review(review: ReviewInput):
    # Ghép 3 trường text giống lúc training
    review_text = normalize_text(
        review.title + " " +
        review.what_i_liked + " " +
        review.suggestions_for_improvement
    )

    # Tạo đúng 7 features mà model yêu cầu
    features = pd.DataFrame([{
        "review_text": review_text,
        "Rating": review.rating,
        "Salary & benefits": review.salary_benefits,
        "Training & learning": review.training_learning,
        "Management cares about me": review.management_cares,
        "Culture & fun": review.culture_fun,
        "Office & workspace": review.office_workspace
    }])

    prediction = int(model.predict(features)[0])

    probabilities = model.predict_proba(features)[0]

    probability_by_class = {
        int(label): float(prob)
        for label, prob in zip(model.classes_, probabilities)
    }

    return {
        "prediction": "No" if prediction == 1 else "Yes",
        "probability_yes": round(probability_by_class[0], 4),
        "probability_no": round(probability_by_class[1], 4),
        "model": "Random Forest"
    }
