
import { useEffect, useState } from "react";
import { getCompanies, predictReview } from "../services/api";

const ratingFields = [
  { key: "rating", label: "Đánh giá tổng thể" },
  { key: "salary_benefits", label: "Lương và phúc lợi" },
  { key: "training_learning", label: "Đào tạo và phát triển" },
  { key: "management_cares", label: "Sự quan tâm của quản lý" },
  { key: "culture_fun", label: "Văn hóa công ty" },
  { key: "office_workspace", label: "Không gian làm việc" },
];

const initialForm = {
  title: "",
  what_i_liked: "",
  suggestions_for_improvement: "",
  rating: 3,
  salary_benefits: 3,
  training_learning: 3,
  management_cares: 3,
  culture_fun: 3,
  office_workspace: 3,
};

const inputStyle = {
  width: "100%",
  padding: "13px 14px",
  border: "1px solid #cbd5e1",
  borderRadius: 9,
  color: "#101d35",
  background: "#fff",
  outlineColor: "#0d9488",
  resize: "vertical",
};

const labelStyle = {
  display: "block",
  fontWeight: 600,
  fontSize: 14,
  marginBottom: 9,
};

function StarRating({ label, value, onChange }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: 18,
      }}
    >
      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12 }}>
        {label} <span style={{ color: "#dc2626" }}>*</span>
      </div>

      <div
        role="group"
        aria-label={label}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          flexWrap: "wrap",
        }}
      >
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => onChange(score)}
            aria-label={`${label}: ${score} trên 5 sao`}
            aria-pressed={value === score}
            title={`${score}/5`}
            style={{
              background: "transparent",
              border: "none",
              padding: "2px",
              color: score <= value ? "#e5a100" : "#cbd5e1",
              fontSize: 30,
              lineHeight: 1,
              cursor: "pointer",
            }}
          >
            {score <= value ? "★" : "☆"}
          </button>
        ))}

        <span
          style={{
            color: "#64748b",
            fontSize: 12,
            marginLeft: 8,
          }}
        >
          {value}/5
        </span>
      </div>
    </div>
  );
}

function ReviewIntelligence() {
  const [companies, setCompanies] = useState([]);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [companyError, setCompanyError] = useState("");

  const [companySearch, setCompanySearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [resultCompany, setResultCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getCompanies()
      .then((data) => setCompanies(data.companies ?? []))
      .catch((err) => {
        console.error("Company API error:", err);
        setCompanyError("Không thể tải danh sách công ty.");
      })
      .finally(() => setCompanyLoading(false));
  }, []);

  const keyword = companySearch.trim().toLowerCase();

  const filteredCompanies = keyword
    ? companies
        .filter((company) =>
          company.name.toLowerCase().includes(keyword)
        )
        .sort((a, b) => {
          const aStarts = a.name.toLowerCase().startsWith(keyword);
          const bStarts = b.name.toLowerCase().startsWith(keyword);
          return Number(bStarts) - Number(aStarts);
        })
        .slice(0, 8)
    : [];

  const updateField = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
    setResult(null);
    setError("");
  };

  const selectCompany = (company) => {
    setSelectedCompany(company);
    setCompanySearch(company.name);
    setShowSuggestions(false);
    setResult(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedCompany) {
      setError("Vui lòng chọn công ty từ danh sách gợi ý.");
      return;
    }

    if (!form.title.trim() || !form.what_i_liked.trim()) {
      setError("Vui lòng điền các trường có dấu *.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Tên công ty dùng để hiển thị kết quả.
      // Model V1 chỉ sử dụng nội dung review và 6 điểm.
      const companyName = selectedCompany.name;
      const data = await predictReview(form);

      setResultCompany(companyName);
      setResult(data);
    } catch (err) {
      console.error("Prediction error:", err);
      setError("Không thể phân tích đánh giá. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const predictionYes = result?.prediction === "Yes";

  const predictedProbability = result
    ? predictionYes
      ? result.probability_yes
      : result.probability_no
    : 0;

  return (
    <main>
      {/* HERO */}
      <section
        style={{
          background: "var(--color-navy)",
          color: "#fff",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#5eead4",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          EMPLOYEE EXPERIENCE
        </p>

        <h1
          style={{
            fontSize: "clamp(26px, 4vw, 40px)",
            lineHeight: 1.4,
          }}
        >
          Chia sẻ trải nghiệm làm việc
        </h1>

        <p style={{ color: "#cbd5e1", lineHeight: 1.8 }}>
          Đánh giá môi trường làm việc và khám phá xu hướng
          đề xuất doanh nghiệp bằng Machine Learning.
        </p>
      </section>

      <section
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "40px 20px 70px",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 16,
            padding: "clamp(20px, 4vw, 36px)",
          }}
        >
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 21 }}>01. Chọn doanh nghiệp</h2>

            <p style={{ color: "#64748b", fontSize: 13 }}>
              Chọn công ty mà bạn đã có trải nghiệm làm việc.
            </p>

            <label htmlFor="company-search" style={labelStyle}>
              Tên công ty <span style={{ color: "#dc2626" }}>*</span>
            </label>

            <div style={{ position: "relative" }}>
              <input
                id="company-search"
                type="text"
                value={companySearch}
                disabled={companyLoading || loading}
                placeholder="Ví dụ: FPT Software, SAPO..."
                autoComplete="off"
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setCompanySearch(e.target.value);
                  setSelectedCompany(null);
                  setResult(null);
                  setShowSuggestions(true);
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setShowSuggestions(false);
                  }
                }}
                style={inputStyle}
              />

              {showSuggestions && keyword && !selectedCompany && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 5px)",
                    left: 0,
                    right: 0,
                    zIndex: 30,
                    maxHeight: 270,
                    overflowY: "auto",
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                    boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
                  }}
                >
                  {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((company) => (
                      <button
                        type="button"
                        key={company.id}
                        onClick={() => selectCompany(company)}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: 13,
                          border: "none",
                          borderBottom: "1px solid #f1f5f9",
                          background: "#fff",
                          color: "#101d35",
                          borderRadius: 0,
                        }}
                      >
                        <strong>{company.name}</strong>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#64748b",
                            marginTop: 4,
                          }}
                        >
                          {company.industry || "Chưa có thông tin ngành"}
                        </div>
                      </button>
                    ))
                  ) : (
                    <p style={{ color: "#64748b", padding: 14 }}>
                      Công ty chưa có trong bộ dữ liệu hiện tại.
                    </p>
                  )}
                </div>
              )}
            </div>

            <p style={{ fontSize: 12, color: "#64748b", marginTop: 9 }}>
              {companyLoading
                ? "Đang tải dữ liệu doanh nghiệp..."
                : selectedCompany
                  ? `Đã chọn: ${selectedCompany.name}`
                  : "Hãy chọn công ty từ danh sách gợi ý."}
            </p>

            {companyError && (
              <p role="alert" style={{ color: "#dc2626" }}>
                {companyError}
              </p>
            )}
          </div>

          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 21 }}>02. Chia sẻ trải nghiệm</h2>

            <p style={{ color: "#64748b", fontSize: 13 }}>
              Những chia sẻ của bạn là dữ liệu để AI phân tích.
            </p>

            <label htmlFor="review-title" style={labelStyle}>
              Tóm tắt trải nghiệm của bạn{" "}
              <span style={{ color: "#dc2626" }}>*</span>
            </label>

            <input
              id="review-title"
              type="text"
              required
              maxLength={200}
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Ví dụ: Nhiều cơ hội học hỏi, môi trường năng động"
              style={{ ...inputStyle, marginBottom: 22 }}
            />

            <label htmlFor="review-liked" style={labelStyle}>
              Điều bạn hài lòng{" "}
              <span style={{ color: "#dc2626" }}>*</span>
            </label>

            <textarea
              id="review-liked"
              required
              rows={4}
              value={form.what_i_liked}
              onChange={(e) =>
                updateField("what_i_liked", e.target.value)
              }
              placeholder="Bạn thích điều gì ở công ty? Đồng nghiệp, công nghệ, môi trường..."
              style={{ ...inputStyle, marginBottom: 22 }}
            />

            <label htmlFor="review-improvement" style={labelStyle}>
              Điều công ty có thể cải thiện
              <span style={{ color: "#64748b", fontWeight: 400 }}>
                {" "}(Không bắt buộc)
              </span>
            </label>

            <textarea
              id="review-improvement"
              rows={4}
              value={form.suggestions_for_improvement}
              onChange={(e) =>
                updateField(
                  "suggestions_for_improvement",
                  e.target.value
                )
              }
              placeholder="Theo bạn, công ty cần cải thiện điều gì?"
              style={inputStyle}
            />
          </div>

          <div>
            <h2 style={{ fontSize: 21 }}>03. Chấm điểm môi trường làm việc</h2>

            <p style={{ color: "#64748b", fontSize: 13 }}>
              Chọn số sao phù hợp cho từng tiêu chí.
              Mỗi tiêu chí có thang điểm từ 1 đến 5.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 270px), 1fr))",
                gap: 14,
                marginTop: 22,
              }}
            >
              {ratingFields.map((field) => (
                <StarRating
                  key={field.key}
                  label={field.label}
                  value={form[field.key]}
                  onChange={(value) => updateField(field.key, value)}
                />
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: 30,
              padding: "15px 18px",
              background: "#f1f5f9",
              borderRadius: 10,
              color: "#64748b",
              fontSize: 13,
              lineHeight: 1.8,
            }}
          >
            <strong style={{ color: "#101d35" }}>
              Lưu ý về kết quả
            </strong>
            <div>
              AI dự đoán xu hướng của đánh giá dựa trên nội dung
              và điểm số bạn nhập. Kết quả không đại diện cho
              chất lượng tổng thể của doanh nghiệp.
            </div>
            <div>
              Các trường có dấu{" "}
              <span style={{ color: "#dc2626" }}>*</span>{" "}
              là bắt buộc. Điểm sao được mặc định ở mức 3/5
              và bạn có thể thay đổi.
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || companyLoading}
            style={{
              marginTop: 26,
              padding: "15px 26px",
              background: "#0d9488",
              color: "#fff",
              border: "none",
              borderRadius: 9,
              fontWeight: 700,
            }}
          >
            {loading
              ? "AI đang phân tích..."
              : "Phân tích đánh giá bằng AI →"}
          </button>

          {error && (
            <p role="alert" style={{ color: "#dc2626", marginTop: 18 }}>
              {error}
            </p>
          )}
        </form>

        {result && (
          <section
            aria-live="polite"
            style={{
              marginTop: 24,
              padding: "clamp(20px, 4vw, 32px)",
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 16,
            }}
          >
            <p
              style={{
                color: "#0d9488",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: 1.5,
              }}
            >
              AI REVIEW ANALYSIS
            </p>

            <h2>Kết quả phân tích</h2>

            <p style={{ color: "#64748b" }}>
              Đánh giá về:{" "}
              <strong style={{ color: "#101d35" }}>
                {resultCompany}
              </strong>
            </p>

            <div
              style={{
                padding: 22,
                borderRadius: 12,
                background: predictionYes ? "#ecfdf5" : "#fff7ed",
                border: `1px solid ${
                  predictionYes ? "#99f6e4" : "#fed7aa"
                }`,
              }}
            >
              <h3
                style={{
                  color: predictionYes ? "#0f766e" : "#b45309",
                  marginBottom: 10,
                }}
              >
                {predictionYes
                  ? "Có xu hướng giới thiệu công ty"
                  : "Có xu hướng không giới thiệu công ty"}
              </h3>

              <p style={{ color: "#475569", marginBottom: 0 }}>
                Xác suất ước tính cho nhãn được dự đoán:{" "}
                <strong>
                  {(predictedProbability * 100).toFixed(1)}%
                </strong>
              </p>
            </div>

            <p
              style={{
                color: "#64748b",
                fontSize: 13,
                lineHeight: 1.8,
                marginTop: 20,
              }}
            >
              Kết quả được tạo bởi mô hình Random Forest
              trên dữ liệu huấn luyện của nhóm. Đây không
              phải tỷ lệ nhân viên thực tế giới thiệu
              {` ${resultCompany}`} và không thay thế
              đánh giá độc lập về doanh nghiệp.
            </p>
          </section>
        )}
      </section>
    </main>
  );
}

export default ReviewIntelligence;
