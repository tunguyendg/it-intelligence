# IT Intelligence

**AI-Powered IT Company Discovery & Employee Review Analysis**

A full-stack web application that combines **React, FastAPI, and Machine Learning** to help users discover similar IT companies and analyze employee review sentiment through a structured recommendation and classification workflow.

Built as an end-to-end Machine Learning application, from data preprocessing and model training to REST API integration, responsive frontend development, and cloud deployment.

**[Live Demo](https://it-intelligence.vercel.app)** · **[API Documentation](https://it-intelligence.onrender.com/docs)**

---

## Project Overview

IT Intelligence demonstrates how Machine Learning models can be integrated into a functional, user-facing web application.

The platform currently provides two independent features:

**1. IT Company Recommendation**

Users search for a company from the research dataset and discover other companies with similar characteristics.

The recommendation engine uses **TF-IDF vectorization and Cosine Similarity** to compare company profiles based on industry, skills, and descriptive information.

**2. Employee Review Intelligence**

Users select a company, submit a workplace review, and rate six aspects of their working experience.

A **Random Forest classifier** analyzes the review text and rating features to predict whether the review indicates a *Recommend* or *Not Recommend* tendency.

The prediction reflects the submitted review, not the overall reputation or recommendation rate of the company.

## Live Application

| Component | Deployment |
|---|---|
| Frontend | [Vercel](https://it-intelligence.vercel.app) |
| Backend API | [Render](https://it-intelligence.onrender.com) |
| Interactive API Docs | [FastAPI Swagger](https://it-intelligence.onrender.com/docs) |
| Source Code | [GitHub](https://github.com/tunguyendg/it-intelligence) |

The backend runs on a free-tier instance and may require additional startup time after inactivity.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, JavaScript, Vite, CSS, Axios |
| Backend | Python, FastAPI, Pydantic, Uvicorn |
| Machine Learning | Scikit-learn, Random Forest, TF-IDF, Cosine Similarity |
| Data Processing | Pandas, NumPy, SciPy |
| Model Serialization | Joblib |
| Deployment | Vercel, Render |
| Version Control | Git, GitHub |

## System Architecture

The application follows a separated frontend–backend architecture.

**Client (React + Vite)** → **REST API (FastAPI)** → **Machine Learning Services** → **Model Artifacts** → **JSON Response**

The React application communicates with FastAPI through HTTP requests.

FastAPI validates incoming data, invokes the relevant ML service, and returns structured prediction or recommendation results.

Pretrained model artifacts are loaded by the backend for inference, so retraining is not required for every request.

## Machine Learning Models

### 1. Content-Based Company Recommendation

**Approach:** TF-IDF + Cosine Similarity

The model processes company profile information and represents textual characteristics as numerical vectors.

Cosine similarity is used to identify companies whose profiles are most similar to the selected company.

**Workflow:** Company selection → Profile representation → Similarity ranking → Top recommended companies.

The recommendation results are limited to the available research dataset.

### 2. Employee Review Classification

**Algorithm:** Random Forest Classifier

The classifier combines review text with six numerical rating features:

- Overall rating
- Salary and benefits
- Training and learning
- Management support
- Company culture
- Office and workspace

Text features are generated from the review title, positive experiences, and suggested improvements.

**Workflow:** Review submission → Input validation → Feature transformation → Random Forest inference → Predicted classification.

### Model Evaluation

The exported Random Forest pipeline was evaluated on a held-out test set.

| Metric | Result |
|---|---:|
| Accuracy | 88.96% |
| F1-score — Not Recommend class | 0.6543 |
| Recall — Not Recommend class | 0.8544 |
| ROC-AUC | 0.9495 |

These metrics describe performance on the project's held-out dataset. They should not be interpreted as guaranteed accuracy on new, independently collected reviews.

## Application Features

**Company Explorer**

- Search and select IT companies using autocomplete.
- Retrieve similar company recommendations.
- Explore company information and external profile links.
- Responsive interface for desktop and mobile.

**Review Intelligence**

- Select a company from the available dataset.
- Submit a structured employee experience review.
- Rate six workplace criteria using an interactive five-star interface.
- Receive a Machine Learning classification with estimated model probabilities.

**User Experience**

- Responsive navigation and mobile menu.
- Unified design system with Navy and Teal branding.
- Project information, technology overview, and development roadmap.
- Clear disclosure of dataset coverage and model limitations.

## REST API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/health` | Service health check |
| GET | `/api/v1/companies` | Retrieve available company profiles |
| GET | `/api/v1/companies/{company_id}/similar` | Retrieve similar companies |
| POST | `/api/v1/reviews/predict` | Classify an employee review |

Interactive endpoint documentation is available through [Swagger UI](https://it-intelligence.onrender.com/docs).

## Project Structure

The repository is organized into independent frontend and backend applications.

| Path | Responsibility |
|---|---|
| `frontend/src/pages/` | Application pages |
| `frontend/src/components/` | Reusable UI components |
| `frontend/src/services/api.js` | HTTP integration with FastAPI |
| `backend/app/api/` | API routes |
| `backend/app/schemas/` | Request validation schemas |
| `backend/app/services/` | ML inference services |
| `backend/artifacts/` | Exported model artifacts |
| `backend/export_classification.py` | Classification model export script |
| `backend/export_recommendation.py` | Recommendation artifact export script |

## Getting Started

**Prerequisites:** Node.js, npm, and Python 3.12.

Clone the repository:

`git clone https://github.com/tunguyendg/it-intelligence.git`

`cd it-intelligence`

**Backend setup**

1. Navigate to the backend: `cd backend`
2. Create the virtual environment: `python3.12 -m venv .venv`
3. Activate it on macOS/Linux: `source .venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Start the API: `uvicorn app.main:app --reload --port 8000`

The backend is available at `http://localhost:8000`, with API documentation at `http://localhost:8000/docs`.

**Frontend setup**

Open another terminal from the repository root:

1. Navigate to the frontend: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env.local` file containing `VITE_API_URL=http://localhost:8000`
4. Start the development server: `npm run dev`

Open `http://localhost:5173` to access the application.

The development environment requires both frontend and backend services to be running.

## Deployment

The production application uses two separate deployment services.

**Frontend — Vercel**

- Framework: Vite
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://it-intelligence.onrender.com`

**Backend — Render**

- Runtime: Python 3
- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Python version: `3.12.15`
- Health check: `/api/v1/health`

Production CORS configuration permits the deployed Vercel frontend to access the FastAPI backend.

## Dataset and Limitations

The application uses company and employee review datasets collected and processed by the research team for academic purposes.

The current version has several limitations:

- Company recommendations are limited to the available company dataset.
- The review classifier does not use company identity as a predictive feature.
- Review submissions are analyzed but are not persisted in a database.
- Classification probabilities are model estimates, not verified employee recommendation rates.
- Results are intended for research and informational purposes, not definitive assessments of employers.

Raw research datasets and