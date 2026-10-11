
const members = [
  {
    name: "Nguyễn Phạm Khánh Hưng",
    initials: "KH",
    role: "Thành viên nhóm nghiên cứu",
  },
  {
    name: "Nguyễn Thị Mai Quy Ri",
    initials: "QR",
    role: "Thành viên nhóm nghiên cứu",
  },
  {
    name: "Nguyễn Văn Tư",
    initials: "T",
    role: "Thành viên nhóm nghiên cứu",
  },
];

const models = [
  {
    number: "01",
    type: "CONTENT-BASED RECOMMENDATION",
    title: "Company Recommendation",
    algorithm: "TF-IDF + Cosine Similarity",
    description:
      "Phân tích nội dung hồ sơ doanh nghiệp và tìm những công ty có đặc điểm tương đồng.",
    input: "Ngành nghề, kỹ năng và nội dung hồ sơ công ty",
    output: "Danh sách doanh nghiệp tương tự",
    icon: "◎",
  },
  {
    number: "02",
    type: "REVIEW CLASSIFICATION",
    title: "Review Intelligence",
    algorithm: "Random Forest",
    description:
      "Phân loại xu hướng giới thiệu doanh nghiệp từ nội dung đánh giá và sáu tiêu chí chấm điểm.",
    input: "Nội dung review và 6 tiêu chí đánh giá",
    output: "Recommend / Not Recommend",
    icon: "▦",
  },
];

const techStack = [
  "React",
  "Vite",
  "FastAPI",
  "Python",
  "Scikit-learn",
  "Pandas",
  "TF-IDF",
  "Random Forest",
];

const panelStyle = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: "clamp(20px, 4vw, 30px)",
};

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div style={{ marginBottom: 26 }}>
      <p
        style={{
          color: "#0d9488",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 1.8,
          marginBottom: 10,
        }}
      >
        {eyebrow}
      </p>

      <h2
        style={{
          color: "#101d35",
          fontSize: "clamp(23px, 3vw, 30px)",
          marginBottom: 10,
        }}
      >
        {title}
      </h2>

      {description && (
        <p
          style={{
            color: "#64748b",
            lineHeight: 1.9,
            maxWidth: 750,
            fontSize: 14,
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

function About() {
  return (
    <main>
      {/* HERO */}
      <section
        style={{
          background:
            "radial-gradient(circle at 85% 15%, #20445a 0%, #101d35 55%)",
          color: "#fff",
          padding: "80px 20px 90px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 850, margin: "0 auto" }}>
          <p
            style={{
              color: "#5eead4",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              marginBottom: 18,
            }}
          >
            ABOUT IT INTELLIGENCE
          </p>

          <h1
            style={{
              fontSize: "clamp(30px, 5vw, 48px)",
              lineHeight: 1.3,
              marginBottom: 22,
            }}
          >
            Biến dữ liệu thành góc nhìn
            <br />
            về doanh nghiệp IT
          </h1>

          <p
            style={{
              fontSize: 15,
              lineHeight: 2,
              color: "#cbd5e1",
              maxWidth: 720,
              margin: "0 auto 28px",
            }}
          >
            IT Intelligence là dự án nghiên cứu ứng dụng
            Machine Learning, giúp khám phá doanh nghiệp
            tương đồng và phân tích trải nghiệm làm việc.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {["Company Discovery", "Review Intelligence", "Machine Learning"].map(
              (item) => (
                <span
                  key={item}
                  style={{
                    border: "1px solid #38536b",
                    color: "#a7f3d0",
                    background: "rgba(255,255,255,0.05)",
                    padding: "9px 14px",
                    borderRadius: 30,
                    fontSize: 12,
                  }}
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* PRODUCT VALUE */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "65px 20px 35px",
        }}
      >
        <SectionHeading
          eyebrow="01 / THE PRODUCT"
          title="Hai ứng dụng, một nền tảng dữ liệu"
          description="Dự án đưa các mô hình học máy từ môi trường nghiên cứu thành những tính năng web có thể trải nghiệm trực tiếp."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 310px), 1fr))",
            gap: 20,
          }}
        >
          <article style={panelStyle}>
            <div
              style={{
                background: "#e6f5f3",
                color: "#0d9488",
                width: 54,
                height: 54,
                borderRadius: 14,
                display: "grid",
                placeItems: "center",
                fontSize: 28,
                marginBottom: 20,
              }}
            >
              ◈
            </div>

            <h3 style={{ fontSize: 20 }}>
              Khám phá công ty IT
            </h3>

            <p
              style={{
                color: "#64748b",
                lineHeight: 1.9,
                fontSize: 14,
                marginBottom: 0,
              }}
            >
              Tìm kiếm doanh nghiệp và khám phá những
              công ty có hồ sơ tương đồng, hỗ trợ người
              dùng mở rộng lựa chọn khi tìm hiểu thị trường IT.
            </p>
          </article>

          <article style={panelStyle}>
            <div
              style={{
                background: "#e6f5f3",
                color: "#0d9488",
                width: 54,
                height: 54,
                borderRadius: 14,
                display: "grid",
                placeItems: "center",
                fontSize: 28,
                marginBottom: 20,
              }}
            >
              ◉
            </div>

            <h3 style={{ fontSize: 20 }}>
              Phân tích trải nghiệm làm việc
            </h3>

            <p
              style={{
                color: "#64748b",
                lineHeight: 1.9,
                fontSize: 14,
                marginBottom: 0,
              }}
            >
              Cho phép người dùng chia sẻ trải nghiệm,
              chấm điểm môi trường làm việc và xem
              xu hướng Recommend / Not Recommend
              do mô hình học máy dự đoán.
            </p>
          </article>
        </div>
      </section>

      {/* AI MODELS */}
      <section style={{ padding: "35px 20px 65px" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            background:
              "linear-gradient(135deg, #101d35 0%, #1c304e 100%)",
            borderRadius: 20,
            padding: "clamp(22px, 4vw, 42px)",
            color: "#fff",
          }}
        >
          <p
            style={{
              color: "#5eead4",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: 2,
            }}
          >
            02 / MACHINE LEARNING
          </p>

          <h2 style={{ fontSize: 28, marginBottom: 12 }}>
            Công nghệ AI phía sau sản phẩm
          </h2>

          <p
            style={{
              color: "#cbd5e1",
              lineHeight: 1.9,
              maxWidth: 750,
              fontSize: 14,
              marginBottom: 30,
            }}
          >
            Hai bài toán Machine Learning được triển khai
            thành các dịch vụ API độc lập, phục vụ trực tiếp
            cho những chức năng trên website.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 310px), 1fr))",
              gap: 18,
            }}
          >
            {models.map((model) => (
              <article
                key={model.number}
                style={{
                  background: "#20334e",
                  border: "1px solid #39506b",
                  borderRadius: 14,
                  padding: 26,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <span
                    style={{
                      color: "#5eead4",
                      fontSize: 11,
                      letterSpacing: 1,
                      fontWeight: 700,
                    }}
                  >
                    {model.type}
                  </span>

                  <span
                    style={{
                      color: "#94a3b8",
                      fontSize: 13,
                    }}
                  >
                    {model.number}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: 32,
                    color: "#5eead4",
                    marginBottom: 10,
                  }}
                >
                  {model.icon}
                </div>

                <h3 style={{ fontSize: 20, marginBottom: 8 }}>
                  {model.title}
                </h3>

                <p
                  style={{
                    color: "#5eead4",
                    fontSize: 13,
                    fontWeight: 700,
                    marginBottom: 14,
                  }}
                >
                  {model.algorithm}
                </p>

                <p
                  style={{
                    color: "#cbd5e1",
                    lineHeight: 1.9,
                    fontSize: 13,
                  }}
                >
                  {model.description}
                </p>

                <div
                  style={{
                    borderTop: "1px solid #39506b",
                    paddingTop: 16,
                    marginTop: 18,
                    fontSize: 12,
                    lineHeight: 1.9,
                  }}
                >
                  <p style={{ marginBottom: 8 }}>
                    <strong style={{ color: "#5eead4" }}>
                      Input:
                    </strong>{" "}
                    {model.input}
                  </p>

                  <p style={{ marginBottom: 0 }}>
                    <strong style={{ color: "#5eead4" }}>
                      Output:
                    </strong>{" "}
                    {model.output}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "10px 20px 65px",
        }}
      >
        <SectionHeading
          eyebrow="03 / TECHNOLOGY STACK"
          title="Công nghệ sử dụng"
          description="Kiến trúc tách biệt frontend, backend API và mô hình Machine Learning, giúp thuận tiện cho việc thử nghiệm và mở rộng."
        />

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {techStack.map((tech) => (
            <span
              key={tech}
              style={{
                background: "#fff",
                color: "#0f766e",
                border: "1px solid #d1e9e5",
                borderRadius: 10,
                padding: "13px 18px",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section
        style={{
          background: "#eaf3f3",
          padding: "65px 20px",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionHeading
            eyebrow="04 / OUR TEAM"
            title="Nhóm phát triển dự án"
            description="Dự án được thực hiện bởi nhóm học viên trong chương trình đào tạo Data Science."
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
              gap: 18,
            }}
          >
            {members.map((member) => (
              <article
                key={member.name}
                style={{
                  background: "#fff",
                  border: "1px solid #cce5e2",
                  borderRadius: 16,
                  padding: 30,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: "50%",
                    background: "#e6f5f3",
                    color: "#0f766e",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 800,
                    fontSize: 20,
                    margin: "0 auto 18px",
                  }}
                >
                  {member.initials}
                </div>

                <h3
                  style={{
                    fontSize: 16,
                    marginBottom: 8,
                    color: "#101d35",
                  }}
                >
                  {member.name}
                </h3>

                <p
                  style={{
                    fontSize: 12,
                    color: "#64748b",
                    marginBottom: 0,
                  }}
                >
                  {member.role}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* DATA TRANSPARENCY */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "65px 20px 80px",
        }}
      >
        <SectionHeading
          eyebrow="05 / DATA & TRANSPARENCY"
          title="Minh bạch về dữ liệu và giới hạn"
        />

        <div
          style={{
            ...panelStyle,
            display: "flex",
            alignItems: "flex-start",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              background: "#e6f5f3",
              borderRadius: 14,
              color: "#0d9488",
              display: "grid",
              placeItems: "center",
              fontSize: 26,
              flexShrink: 0,
            }}
          >
            ✓
          </div>

          <div style={{ flex: 1, minWidth: 230 }}>
            <h3>Về nguồn dữ liệu</h3>

            <p
              style={{
                color: "#475569",
                fontSize: 14,
                lineHeight: 1.9,
              }}
            >
              Hệ thống sử dụng bộ dữ liệu doanh nghiệp
              và đánh giá nhân viên được nhóm nghiên cứu
              thu thập, xử lý và xây dựng phục vụ đồ án.
              Do phạm vi dữ liệu còn giới hạn,
              một số doanh nghiệp có thể chưa xuất hiện
              trong kết quả tìm kiếm.
            </p>

            <h3>Về kết quả AI</h3>

            <p
              style={{
                color: "#475569",
                fontSize: 14,
                lineHeight: 1.9,
                marginBottom: 0,
              }}
            >
              Các kết quả được tạo bởi mô hình Machine Learning,
              mang tính chất tham khảo trong phạm vi dữ liệu
              nghiên cứu. Hệ thống không đưa ra kết luận
              chính thức về chất lượng hoặc uy tín
              của bất kỳ doanh nghiệp nào.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
