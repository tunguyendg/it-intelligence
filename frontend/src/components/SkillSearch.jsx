import { useState } from 'react';
import './SkillSearch.css';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

export default function SkillSearch({ onToggleCompany }) {
  const [query, setQuery] = useState('React, Node.js, PostgreSQL');
  const [topK, setTopK] = useState(5);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    if (!query.trim()) return;
    setLoading(true); setError(''); setData(null);
    try {
      const res = await fetch(`${API}/api/v1/companies/search-by-skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, top_k: Number(topK) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(typeof json.detail === 'string' ? json.detail : `HTTP ${res.status}`);
      setData(json);
    } catch (err) {
      setError(err.message || 'Không kết nối được API.');
    } finally { setLoading(false); }
  }

  return (
    <section className="skill-search">
      <header className="skill-search__header">
        <span className="skill-search__eyebrow">IT INTELLIGENCE · SKILL DISCOVERY</span>
        <h2>Tìm công ty theo kỹ năng</h2>
        <p>Nhập công nghệ bạn quan tâm. Hệ thống ưu tiên công ty có nhiều kỹ năng khớp hơn.</p>
      </header>
      <form className="skill-search__form" onSubmit={submit}>
        <label htmlFor="skill-query">Kỹ năng (phân cách bằng dấu phẩy)</label>
        <div className="skill-search__controls">
          <input id="skill-query" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="React, Node.js, PostgreSQL" maxLength={250} required />
          <select value={topK} onChange={e => setTopK(Number(e.target.value))} aria-label="Số kết quả">
            <option value={5}>Top 5</option><option value={10}>Top 10</option><option value={20}>Top 20</option>
          </select>
          <button type="button" className="skill-search__switch" onClick={onToggleCompany}>🏢 Tìm theo công ty</button>
          <button type="submit" disabled={loading}>{loading ? 'Đang tìm...' : '✨ Tìm theo kỹ năng'}</button>
        </div>
        <small>Gợi ý dựa trên hồ sơ kỹ năng công ty, không phải tin tuyển dụng đang mở.</small>
      </form>
      {error && <p className="skill-search__error" role="alert">{error}</p>}
      {data && <div className="skill-search__results">
        <p className="skill-search__count">Tìm thấy {data.total_matches} công ty có ít nhất một kỹ năng được đề cập · Hiển thị {data.results.length}</p>
        {data.results.length === 0 && <p>Chưa tìm thấy công ty phù hợp trong dữ liệu hiện có.</p>}
        {data.results.map((c, i) => <article className="skill-search__card" key={c.id}>
          <div className="skill-search__cardHead">
            <div><span className="skill-search__rank">#{i + 1}</span><h3>{c.name}</h3>
            <p>{[c.industry, c.company_size, c.country].filter(Boolean).join(' · ')}</p></div>
            <div className="skill-search__coverage"><strong>{c.matched_count}/{c.requested_count}</strong><span>kỹ năng khớp</span></div>
          </div>
          <div className="skill-search__pills">{c.matched_skills.map(s => <span className="skill-search__pill is-match" key={s}>✓ {s}</span>)}
            {c.missing_skills.map(s => <span className="skill-search__pill is-missing" key={s}>— {s}</span>)}</div>
          {c.href && <a href={c.href} target="_blank" rel="noopener noreferrer">Xem hồ sơ công ty ↗</a>}
        </article>)}
      </div>}
    </section>
  );
}
