
import axios from "axios";

// Địa chỉ backend FastAPI
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 15000,
});

// API lấy danh sách công ty
export const getCompanies = async () => {
  const response = await api.get("/api/v1/companies");
  return response.data;
};

// API gợi ý công ty tương tự
export const getSimilarCompanies = async (companyId) => {
  const response = await api.get(
    `/api/v1/companies/${companyId}/similar`
  );
  return response.data;
};

// API dự đoán review
export const predictReview = async (reviewData) => {
  const response = await api.post(
    "/api/v1/reviews/predict",
    reviewData
  );
  return response.data;
};

export default api;
