
import { useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";

import CompanyExplorer from "./pages/CompanyExplorer";
import ReviewIntelligence from "./pages/ReviewIntelligence";
import ExpansionV2 from "./pages/ExpansionV2";
import About from "./pages/About";

function App() {
  const [activePage, setActivePage] = useState("companies");

  const handleNavigate = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (activePage) {
      case "companies":
        return <CompanyExplorer />;

      case "reviews":
        return <ReviewIntelligence />;

      case "expansion":
        return <ExpansionV2 />;

      case "about":
        return <About />;

      default:
        return <CompanyExplorer />;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header
        activePage={activePage}
        onNavigate={handleNavigate}
      />

      <div style={{ flex: 1 }}>
        {renderPage()}
      </div>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
