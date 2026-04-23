import Head from "next/head";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";

const PASS_KEY = "admin_pass";

const STATUS_LABELS = {
  new: "신규",
  contacted: "상담중",
  done: "완료",
};

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function escapeCsv(v) {
  const s = String(v == null ? "" : v);
  return `"${s.replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
}

export default function Admin() {
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [memoDraft, setMemoDraft] = useState({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = sessionStorage.getItem(PASS_KEY);
    if (saved) {
      setPass(saved);
      setAuthed(true);
    }
  }, []);

  const loadItems = useCallback(
    async (passOverride) => {
      const p = passOverride || pass;
      if (!p) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/inquiries", {
          headers: { "x-admin-pass": p },
        });
        if (res.status === 401) {
          sessionStorage.removeItem(PASS_KEY);
          setAuthed(false);
          setPass("");
          setLoginError("인증이 만료되었거나 비밀번호가 올바르지 않습니다.");
          return;
        }
        const data = await res.json();
        setItems(data.items || []);
      } catch (e) {
        setError("불러오기 실패");
      } finally {
        setLoading(false);
      }
    },
    [pass]
  );

  useEffect(() => {
    if (authed) loadItems();
  }, [authed, loadItems]);

  async function updateItem(id, patch) {
    const res = await fetch("/api/admin/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-pass": pass },
      body: JSON.stringify({ id, action: "update", ...patch }),
    });
    if (res.ok) {
      const data = await res.json();
      setItems((prev) => prev.map((i) => (i.id === id ? data.item : i)));
    }
  }

  async function removeItem(id) {
    if (!confirm("이 문의를 삭제하시겠습니까? 되돌릴 수 없습니다.")) return;
    const res = await fetch("/api/admin/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-pass": pass },
      body: JSON.stringify({ id, action: "delete" }),
    });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  }

  async function onLogin(e) {
    e.preventDefault();
    setLoginError(null);
    const res = await fetch("/api/admin/inquiries", {
      headers: { "x-admin-pass": pass },
    });
    if (res.status === 401) {
      setLoginError("비밀번호가 올바르지 않습니다.");
      return;
    }
    sessionStorage.setItem(PASS_KEY, pass);
    setAuthed(true);
  }

  function logout() {
    sessionStorage.removeItem(PASS_KEY);
    setPass("");
    setAuthed(false);
    setItems([]);
  }

  const stats = useMemo(
    () => ({
      all: items.length,
      new: items.filter((i) => i.status === "new").length,
      contacted: items.filter((i) => i.status === "contacted").length,
      done: items.filter((i) => i.status === "done").length,
    }),
    [items]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (filter !== "all" && i.status !== filter) return false;
      if (!q) return true;
      return (
        (i.name || "").toLowerCase().includes(q) ||
        (i.phone || "").toLowerCase().includes(q) ||
        (i.message || "").toLowerCase().includes(q) ||
        (i.unit || "").toLowerCase().includes(q)
      );
    });
  }, [items, filter, query]);

  function exportCsv() {
    const headers = ["일시", "성함", "연락처", "관심타입", "문의내용", "상태", "메모"];
    const rows = filtered.map((i) => [
      formatDate(i.at),
      i.name,
      i.phone,
      i.unit || "",
      i.message || "",
      STATUS_LABELS[i.status] || i.status,
      i.memo || "",
    ]);
    const csv =
      "﻿" +
      [headers, ...rows].map((r) => r.map(escapeCsv).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  if (!authed) {
    return (
      <>
        <Head>
          <title>관리자 로그인 · 더샵 오산역아크시티</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="admin-auth">
          <form className="admin-auth-box" onSubmit={onLogin}>
            <div className="admin-auth-brand">더샵 오산역아크시티</div>
            <h1>관리자 로그인</h1>
            <p className="admin-auth-sub">문의 관리 시스템 접근을 위해 비밀번호를 입력해주세요.</p>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="비밀번호"
              autoFocus
              required
            />
            <button type="submit">로그인</button>
            {loginError && <div className="admin-error">{loginError}</div>}
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>문의 관리 · 더샵 오산역아크시티</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="admin">
        <header className="admin-header">
          <div>
            <div className="admin-brand">더샵 오산역아크시티</div>
            <h1>문의 관리</h1>
          </div>
          <div className="admin-actions">
            <button onClick={() => loadItems()} className="admin-btn admin-btn-ghost">
              ↻ 새로고침
            </button>
            <button onClick={exportCsv} className="admin-btn admin-btn-ghost" disabled={!items.length}>
              CSV 내보내기
            </button>
            <button onClick={logout} className="admin-btn">
              로그아웃
            </button>
          </div>
        </header>

        <div className="admin-stats">
          {["all", "new", "contacted", "done"].map((k) => (
            <button
              key={k}
              className={`admin-stat ${k} ${filter === k ? "active" : ""}`}
              onClick={() => setFilter(k)}
            >
              <div className="num">{stats[k]}</div>
              <div className="label">{k === "all" ? "전체" : STATUS_LABELS[k]}</div>
            </button>
          ))}
        </div>

        <div className="admin-toolbar">
          <input
            className="admin-search"
            type="text"
            placeholder="이름 · 연락처 · 관심타입 · 문의내용 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="admin-count">
            {filter === "all" ? "전체" : STATUS_LABELS[filter]} {filtered.length}건
          </div>
        </div>

        {loading && <div className="admin-loading">불러오는 중…</div>}
        {error && <div className="admin-error-banner">{error}</div>}

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 150 }}>일시</th>
                <th style={{ width: 100 }}>성함</th>
                <th style={{ width: 140 }}>연락처</th>
                <th style={{ width: 100 }}>관심타입</th>
                <th>문의내용</th>
                <th style={{ width: 120 }}>상태</th>
                <th style={{ width: 80 }}>액션</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="admin-empty">
                    {items.length === 0 ? "아직 문의 내역이 없습니다." : "조건에 해당하는 문의가 없습니다."}
                  </td>
                </tr>
              ) : (
                filtered.map((i) => {
                  const isOpen = expandedId === i.id;
                  const draft = memoDraft[i.id] ?? i.memo ?? "";
                  return (
                    <Fragment key={i.id}>
                      <tr
                        className={`admin-row ${isOpen ? "open" : ""} ${i.status}`}
                        onClick={() => setExpandedId(isOpen ? null : i.id)}
                      >
                        <td className="admin-date">{formatDate(i.at)}</td>
                        <td className="admin-name">{i.name}</td>
                        <td className="admin-phone">
                          <a href={`tel:${i.phone}`} onClick={(e) => e.stopPropagation()}>
                            {i.phone}
                          </a>
                        </td>
                        <td>{i.unit || "-"}</td>
                        <td className="admin-message">{i.message || <span className="muted">(없음)</span>}</td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <select
                            className={`admin-status ${i.status}`}
                            value={i.status}
                            onChange={(e) => updateItem(i.id, { status: e.target.value })}
                          >
                            <option value="new">신규</option>
                            <option value="contacted">상담중</option>
                            <option value="done">완료</option>
                          </select>
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <button className="admin-del" onClick={() => removeItem(i.id)}>
                            삭제
                          </button>
                        </td>
                      </tr>
                      {isOpen && (
                        <tr className="admin-detail">
                          <td colSpan={7}>
                            <div className="admin-detail-grid">
                              <div>
                                <div className="admin-detail-label">전체 문의내용</div>
                                <div className="admin-detail-message">
                                  {i.message || "(문의내용 없음)"}
                                </div>
                              </div>
                              <div>
                                <div className="admin-detail-label">담당자 메모</div>
                                <textarea
                                  className="admin-memo"
                                  value={draft}
                                  onChange={(e) =>
                                    setMemoDraft((prev) => ({ ...prev, [i.id]: e.target.value }))
                                  }
                                  placeholder="상담 진행 기록·특이사항을 남겨주세요"
                                  rows={4}
                                />
                                <button
                                  className="admin-btn admin-btn-small"
                                  onClick={() => updateItem(i.id, { memo: draft })}
                                  disabled={draft === (i.memo || "")}
                                >
                                  메모 저장
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
