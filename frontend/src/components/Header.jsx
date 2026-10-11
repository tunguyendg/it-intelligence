
import { useState } from "react";
import "./Header.css";

const menuItems = [
  { id: "companies", label: "Khám phá công ty" },
  { id: "reviews", label: "Phân tích Review" },
  { id: "expansion", label: "Mở rộng V2" },
  { id: "about", label: "Giới thiệu" },
];

function Header({ activePage, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (page) => {
    onNavigate(page);
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <button
          type="button"
          className="site-logo"
          onClick={() => handleNavigate("companies")}
          aria-label="IT Intelligence - Trang chủ"
        >
          <span className="site-logo-icon">◇</span>
          <span>IT Intelligence</span>
        </button>

        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          onClick={() => setMenuOpen((previous) => !previous)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav
          id="site-navigation"
          className={`site-navigation ${menuOpen ? "is-open" : ""}`}
          aria-label="Điều hướng chính"
        >
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`site-nav-link ${
                activePage === item.id ? "is-active" : ""
              }`}
              aria-current={
                activePage === item.id ? "page" : undefined
              }
              onClick={() => handleNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
