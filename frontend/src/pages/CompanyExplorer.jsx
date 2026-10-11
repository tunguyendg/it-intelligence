
import { useEffect, useState } from "react";
import {
  getCompanies,
  getSimilarCompanies,
} from "../services/api";

function CompanyExplorer() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [recommending, setRecommending] = useState(false);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    getCompanies()
      .then((data) => setCompanies(data.companies))
      .catch(() => setError("Không thể tải dữ liệu công ty."))
      .finally(() => setLoading(false));
  }, []);

  const keyword = search.trim().toLowerCase();

  const filteredCompanies = keyword
    ? companies
      .filter((company) => {
        const name = company.name.toLowerCase();
        return name.includes(keyword);
      })
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        const aStarts = aName.startsWith(keyword);
        const bStarts = bName.startsWith(keyword);

        return Number(bStarts) - Number(aStarts);
      })
      .slice(0, 8)
    : [];

  const handleSelectCompany = (company) => {
    setSelectedCompany(company);
    setSearch(company.name);
    setShowSuggestions(false);
    setRecommendations([]);
    setHasSearched(false);
    setError("");
  };

  const handleRecommend = async () => {
    if (!selectedCompany) return;

    setRecommending(true);
    setHasSearched(true);
    setRecommendations([]);
    setError("");

    try {
      const data = await getSimilarCompanies(selectedCompany.id);
      setRecommendations(data.recommendations ?? []);
    } catch (err) {
      console.error(err);
      setError("Không thể lấy kết quả gợi ý. Vui lòng thử lại.");
    } finally {
      setRecommending(false);
    }
  };

  return (
    <main>
      {/* HERO SECTION */}
      <section
        style={{
          background: "var(--color-navy)",
          color: "#fff",
          padding: "65px 20px 72px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p
            style={{
              color: "#5eead4",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              marginBottom: 16,
            }}
          >
            COMPANY DISCOVERY
          </p>

          <h1
            style={{
              fontSize: "clamp(26px, 4vw, 42px)",
              fontWeight: 800,
              lineHeight: 1.3,
              marginBottom: 16,
            }}
          >
            Khám phá doanh nghiệp IT phù hợp với bạn
          </h1>

          <p
            style={{
              color: "#cbd5e1",
              fontSize: 15,
              lineHeight: 1.8,
              marginBottom: 32,
            }}
          >
            Tìm những công ty có đặc điểm tương đồng
            bằng công nghệ Machine Learning.
          </p>

          {/* SEARCH BOX */}
          <div
            className="company-search-box"
            style={{
              position: "relative",
              background: "#fff",
              borderRadius: 12,
              padding: 8,
              display: "flex",
              gap: 8,
              alignItems: "center",
              boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                paddingLeft: 12,
                color: "#64748b",
                fontSize: 20,
              }}
            >
              ⌕
            </span>

            <input
              type="text"
              aria-label="Tên công ty cần tìm"
              placeholder="Nhập tên công ty bạn quan tâm..."
              value={search}
              disabled={loading}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedCompany(null);
                setRecommendations([]);
                setHasSearched(false);
                setShowSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (selectedCompany) {
                    handleRecommend();
                  } else if (filteredCompanies.length === 1) {
                    handleSelectCompany(filteredCompanies[0]);
                  }
                }
                if (e.key === "Escape") {
                  setShowSuggestions(false);
                }
              }}
              style={{
                flex: 1,
                minWidth: 0,
                border: "none",
                outline: "none",
                background: "transparent",
                color: "#101d35",
                padding: "13px 4px",
                fontSize: 14,
              }}
            />

            <button
              type="button"
              className="company-search-button"
              disabled={!selectedCompany || recommending || loading}
              onClick={handleRecommend}
              style={{
                background: "var(--color-teal)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "15px 18px",
                fontSize: 13,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {recommending ? "Đang phân tích..." : "Tìm tương tự"}
            </button>

            {/* AUTOCOMPLETE */}
            {showSuggestions && keyword && !selectedCompany && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  maxHeight: 300,
                  overflowY: "auto",
                  zIndex: 20,
                  textAlign: "left",
                  boxShadow: "0 16px 32px rgba(0,0,0,0.12)",
                }}
              >
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company) => (
                    <button
                      key={company.id}
                      type="button"
                      onClick={() => handleSelectCompany(company)}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        background: "#fff",
                        color: "#101d35",
                        border: "none",
                        borderBottom: "1px solid #f1f5f9",
                        borderRadius: 0,
                        padding: "13px 16px",
                      }}
                    >
                      <strong>{company.name}</strong>
                      <div
                        style={{
                          color: "#64748b",
                          fontSize: 12,
                          marginTop: 4,
                        }}
                      >
                        {company.industry || "Chưa có thông tin ngành"}
                      </div>
                    </button>
                  ))
                ) : (
                  <div
                    style={{
                      padding: 16,
                      color: "#64748b",
                      fontSize: 13,
                    }}
                  >
                    Công ty này chưa có trong dữ liệu hiện tại.
                    Hệ thống sẽ tiếp tục mở rộng dữ liệu.
                  </div>
                )}
              </div>
            )}
          </div>

          {loading && (
            <p style={{ marginTop: 16, color: "#cbd5e1" }}>
              Đang tải dữ liệu...
            </p>
          )}

          {error && (
            <p style={{ marginTop: 16, color: "#fca5a5" }}>
              {error}
            </p>
          )}
        </div>
      </section>

      {/* RESULTS SECTION */}
      <section
        style={{
          background: "var(--color-background)",
          padding: "48px 20px 64px",
          minHeight: 350,
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {recommendations.length > 0 && (
            <>
              <h2 style={{ fontSize: 24, marginBottom: 8 }}>
                Các công ty có thể bạn quan tâm
              </h2>

              <p style={{ color: "#64748b", marginBottom: 24 }}>
                Các doanh nghiệp có hồ sơ tương đồng với{" "}
                <strong>{selectedCompany?.name}</strong>.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
                  gap: 16,
                }}
              >
                {recommendations.map((company) => (
                  <article
                    key={company.id}
                    style={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                      padding: 24,
                      textAlign: "left",
                      boxShadow: "var(--shadow-card)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 12,
                      }}
                    >
                      <span
                        style={{
                          background: "#e6f5f3",
                          color: "#0d9488",
                          padding: 12,
                          borderRadius: 10,
                        }}
                      >
                        ▣
                      </span>

                      <h3
                        style={{
                          fontSize: 15,
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
                        {company.name}
                      </h3>
                    </div>

                    <p
                      style={{
                        fontSize: 13,
                        color: "#64748b",
                      }}
                    >
                      {company.industry || "Chưa có thông tin ngành"}
                    </p>

                    {company.url && (
                      <a
                        href={company.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: 13, fontWeight: 600 }}
                      >
                        Xem hồ sơ công ty ↗
                      </a>
                    )}
                  </article>
                ))}
              </div>
            </>
          )}

          {hasSearched &&
            !recommending &&
            !error &&
            recommendations.length === 0 && (
              <p>Chưa tìm thấy công ty tương đồng phù hợp.</p>
            )}

          {/* DATA NOTICE */}
          <aside
            style={{
              marginTop: 36,
              border: "1px solid #e2e8f0",
              background: "#fff",
              borderRadius: 12,
              padding: 20,
              color: "#64748b",
              fontSize: 13,
              lineHeight: 1.8,
            }}
          >
            <strong style={{ color: "#101d35" }}>
              Thông tin dữ liệu
            </strong>

            <p style={{ margin: "6px 0 0" }}>
              Các đề xuất được tạo từ bộ dữ liệu doanh nghiệp
              do nhóm nghiên cứu xây dựng. Một số công ty có
              thể chưa được cập nhật. Hệ thống sẽ tiếp tục
              mở rộng dữ liệu và cải thiện khả năng gợi ý
              trong những phiên bản tiếp theo.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default CompanyExplorer;
