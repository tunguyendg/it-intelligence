"""Project 02: reproduce notebook cells 44-50 and export classification inference pipeline.
Run from project_02/backend with active Python 3.12 venv:
    python export_classification.py
"""
from __future__ import annotations
import json
import re
from datetime import datetime, timezone
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import sklearn
import scipy
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, roc_auc_score, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "data" / "Reviews.xlsx"
OUT = ROOT / "artifacts"
OUT.mkdir(parents=True, exist_ok=True)

RATING_COLS = [
    "Rating", "Salary & benefits", "Training & learning",
    "Management cares about me", "Culture & fun", "Office & workspace",
]
TEXT_COLS = ["Title", "What I liked", "Suggestions for improvement"]

def normalize_text(text):
    # Exact notebook cell 27 logic.
    text = "" if pd.isna(text) else str(text)
    text = text.lower()
    text = re.sub(r"https?://\S+|www\.\S+", " ", text)
    text = re.sub(r"[^\w\s+#.\-]", " ", text, flags=re.UNICODE)
    return re.sub(r"\s+", " ", text).strip()

if not SOURCE.is_file():
    raise FileNotFoundError(f"Missing source: {SOURCE}")
reviews = pd.read_excel(SOURCE)
required = TEXT_COLS + RATING_COLS + ["Recommend?"]
missing = [c for c in required if c not in reviews.columns]
if missing:
    raise ValueError(f"Missing notebook features: {missing}; actual={list(reviews.columns)}")

clf = reviews.copy()
for c in TEXT_COLS:
    clf[c] = clf[c].fillna("").astype(str)
clf["review_text"] = (
    clf["Title"] + " " + clf["What I liked"] + " " + clf["Suggestions for improvement"]
).map(normalize_text)
clf = clf[["Company Name", "Recommend?", "review_text"] + RATING_COLS].dropna(subset=["Recommend?"]).copy()
# Explicitly verify labels so unrecognized values aren't silently treated as Yes.
labels = clf["Recommend?"].astype(str).str.strip().str.lower()
unknown = sorted(set(labels) - {"yes", "no"})
if unknown:
    raise ValueError(f"Unexpected target labels: {unknown}")
clf["label_no"] = labels.eq("no").astype(int)
if clf[RATING_COLS].isna().any().any():
    raise ValueError("Ratings contain missing values: notebook pipeline has no imputer; audit before fitting")

idx_train, idx_test = train_test_split(
    np.arange(len(clf)), test_size=0.20, random_state=42, stratify=clf["label_no"]
)
X = clf[["review_text"] + RATING_COLS]
y = clf["label_no"]

preprocessor = ColumnTransformer([
    ("text", TfidfVectorizer(max_features=3000, ngram_range=(1, 2), min_df=2, sublinear_tf=True), "review_text"),
    ("num", StandardScaler(), RATING_COLS),
])
pipe = Pipeline([
    ("prep", preprocessor),
    ("model", RandomForestClassifier(
        n_estimators=250, max_depth=18, min_samples_leaf=3,
        class_weight="balanced", random_state=42, n_jobs=-1
    )),
])
print(f"Training: {len(idx_train):,} | Test: {len(idx_test):,} | Label 1 = No")
pipe.fit(X.iloc[idx_train], y.iloc[idx_train])
pred = pipe.predict(X.iloc[idx_test])
score_no = pipe.predict_proba(X.iloc[idx_test])[:, 1]
metrics = {
    "accuracy": float(accuracy_score(y.iloc[idx_test], pred)),
    "precision_No": float(precision_score(y.iloc[idx_test], pred, zero_division=0)),
    "recall_No": float(recall_score(y.iloc[idx_test], pred, zero_division=0)),
    "f1_No": float(f1_score(y.iloc[idx_test], pred, zero_division=0)),
    "roc_auc": float(roc_auc_score(y.iloc[idx_test], score_no)),
    "confusion_matrix": confusion_matrix(y.iloc[idx_test], pred).tolist(),
}
artifact = OUT / "classification_pipeline.joblib"
joblib.dump(pipe, artifact, compress=3)
metadata = {
    "trained_at_utc": datetime.now(timezone.utc).isoformat(),
    "training_source": SOURCE.name,
    "notebook_reference": "PROJECT_02_FINAL_EVIDENCE_HUNG_STYLE.ipynb cells 27, 44-50",
    "train_rows": len(idx_train), "test_rows": len(idx_test),
    "target_mapping": {"Yes": 0, "No": 1},
    "input_columns": ["review_text"] + RATING_COLS,
    "text_source_columns": TEXT_COLS,
    "versions": {"python": __import__("sys").version.split()[0], "sklearn": sklearn.__version__, "pandas": pd.__version__, "numpy": np.__version__, "scipy": scipy.__version__, "joblib": joblib.__version__},
    "metrics": metrics,
}
(OUT / "classification_metadata.json").write_text(json.dumps(metadata, ensure_ascii=False, indent=2), encoding="utf-8")
loaded = joblib.load(artifact)
assert np.array_equal(loaded.predict(X.iloc[idx_test].head(5)), pred[:5]), "Reload mismatch"
print("\nMetrics:", json.dumps(metrics, indent=2))
print("\nSaved:", artifact, f"({artifact.stat().st_size/1024/1024:.2f} MB)")
print("Saved:", OUT / "classification_metadata.json")
print("RELOAD TEST OK")
