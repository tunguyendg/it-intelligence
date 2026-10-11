
const footerLinks = [
    { id: "companies", label: "Khám phá công ty" },
    { id: "reviews", label: "Đánh giá doanh nghiệp" },
    { id: "expansion", label: "Mở rộng V2" },
    { id: "about", label: "Giới thiệu dự án" },
];

const CURRENT_YEAR = new Date().getFullYear();

function Footer({ onNavigate }) {
    return (
        <footer
            style={{
                background: "#101d35",
                color: "#cbd5e1",
                padding: "52px 20px 20px",
                marginTop: "auto",
            }}
        >
            <div
                style={{
                    maxWidth: 1100,
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 36,
                }}
            >
                <div>
                    <h2 style={{ color: "#fff", fontSize: 20 }}>
                        <span style={{ color: "#2dd4bf" }}>◇ </span>
                        IT Intelligence
                    </h2>

                    <p style={{ lineHeight: 1.9, fontSize: 13 }}>
                        Nền tảng nghiên cứu ứng dụng Machine Learning
                        trong khám phá doanh nghiệp IT và phân tích
                        trải nghiệm làm việc.
                    </p>
                </div>

                <div>
                    <h3 style={{ color: "#fff", fontSize: 15 }}>
                        Khám phá
                    </h3>

                    <nav
                        aria-label="Điều hướng chân trang"
                        style={{ display: "grid", gap: 12 }}
                    >
                        {footerLinks.map((item) => (
                            <button
                                type="button"
                                key={item.id}
                                onClick={() => {
                                    onNavigate(item.id);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                style={{
                                    textAlign: "left",
                                    color: "#cbd5e1",
                                    border: "none",
                                    background: "transparent",
                                    padding: 0,
                                    fontSize: 13,
                                }}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>


                <div>
                    <h3
                        style={{
                            color: "#fff",
                            fontSize: 15,
                            marginBottom: 18,
                        }}
                    >
                        Built with
                    </h3>

                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 8,
                        }}
                    >
                        {[
                            "React",
                            "Vite",
                            "FastAPI",
                            "Python",
                            "Scikit-learn",
                            "Pandas",
                            "TF-IDF",
                            "Cosine Similarity",
                            "Random Forest",
                        ].map((tech) => (
                            <span
                                key={tech}
                                style={{
                                    display: "inline-block",
                                    padding: "7px 11px",
                                    borderRadius: 7,
                                    background: "#1c304e",
                                    border: "1px solid #36516b",
                                    color: "#cbd5e1",
                                    fontSize: 11,
                                    fontWeight: 500,
                                    lineHeight: 1.5,
                                }}
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

            </div>

            <div
                style={{
                    maxWidth: 1100,
                    margin: "36px auto 0",
                    paddingTop: 20,
                    borderTop: "1px solid #334155",
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 12,
                    fontSize: 12,
                    color: "#94a3b8",
                }}
            >
                <span>© {CURRENT_YEAR} IT Intelligence</span>
            </div>
        </footer>
    );
}

export default Footer;

