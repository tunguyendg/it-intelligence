
const features = [
  {
    icon: "⌕",
    title: "Mở rộng dữ liệu doanh nghiệp",
    description:
      "Bổ sung hồ sơ công ty từ các nguồn dữ liệu phù hợp, tăng phạm vi khám phá trên thị trường Việt Nam.",
  },
  {
    icon: "◎",
    title: "Phân tích công ty mới",
    description:
      "Cho phép tìm kiếm công ty ngoài bộ dữ liệu hiện tại và phân tích hồ sơ khi có đủ thông tin đáng tin cậy.",
  },
  {
    icon: "▣",
    title: "Hồ sơ và đánh giá doanh nghiệp",
    description:
      "Phát triển khả năng lưu trữ, tổng hợp và tra cứu các đánh giá do người dùng chia sẻ.",
  },
  {
    icon: "↗",
    title: "Gợi ý thông minh hơn",
    description:
      "Nghiên cứu thêm các phương pháp recommendation và các đặc trưng dữ liệu để cải thiện kết quả.",
  },
];

function ExpansionV2() {
  return (
    <main>
      <section
        style={{
          background: "#101d35",
          color: "#fff",
          textAlign: "center",
          padding: "72px 20px",
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
          PRODUCT ROADMAP
        </p>

        <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)" }}>
          Mở rộng khả năng khám phá doanh nghiệp
        </h1>

        <p
          style={{
            color: "#cbd5e1",
            lineHeight: 1.9,
            maxWidth: 680,
            margin: "0 auto",
          }}
        >
          IT Intelligence tiếp tục nghiên cứu các giải pháp
          mở rộng dữ liệu và nâng cao trải nghiệm người dùng
          trong các phiên bản tiếp theo.
        </p>
      </section>

      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "55px 20px 80px",
        }}
      >
        <p
          style={{
            color: "#0d9488",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          UPCOMING FEATURES
        </p>

        <h2 style={{ fontSize: 26, marginBottom: 10 }}>
          Định hướng phiên bản tiếp theo
        </h2>

        <p
          style={{
            color: "#64748b",
            lineHeight: 1.9,
            marginBottom: 28,
          }}
        >
          Các tính năng dưới đây thuộc kế hoạch phát triển,
          chưa được cung cấp trong phiên bản hiện tại.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: 18,
          }}
        >
          {features.map((feature) => (
            <article
              key={feature.title}
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 14,
                padding: 26,
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  background: "#e6f5f3",
                  color: "#0d9488",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 25,
                  marginBottom: 18,
                }}
              >
                {feature.icon}
              </div>

              <h3 style={{ fontSize: 17 }}>
                {feature.title}
              </h3>

              <p
                style={{
                  color: "#64748b",
                  fontSize: 13,
                  lineHeight: 1.9,
                  marginBottom: 0,
                }}
              >
                {feature.description}
              </p>
            </article>
          ))}
        </div>

        <div
          style={{
            background: "#e6f5f3",
            border: "1px solid #99f6e4",
            borderRadius: 14,
            padding: 24,
            marginTop: 30,
          }}
        >
          <h3 style={{ color: "#0f766e" }}>
            Phiên bản hiện tại
          </h3>

          <p
            style={{
              fontSize: 14,
              color: "#334155",
              lineHeight: 1.9,
              marginBottom: 0,
            }}
          >
            Người dùng hiện có thể tìm công ty tương tự
            trong bộ dữ liệu nghiên cứu của nhóm và
            trải nghiệm tính năng AI phân tích đánh giá.
            Dữ liệu và khả năng của hệ thống sẽ tiếp tục
            được nghiên cứu, hoàn thiện và cập nhật.
          </p>
        </div>
      </section>
    </main>
  );
}

export default ExpansionV2;
