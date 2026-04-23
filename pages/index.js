import Head from "next/head";
import { useState } from "react";

const UNITS = {
  "84A": {
    tag: "판상형 3룸+α",
    households: "346세대",
    exclusive: "84.87㎡",
    supply: "118.35㎡ (35.80평)",
    contract: "176.47㎡",
    useful: "37.60평",
    view: "단지 VIEW / CITY VIEW / 오산천 VIEW",
    feature: "4BAY 맞통풍 판상형 구조 · 3룸+알파룸 · 대형 현관창고 특화",
    img: "/img/unit-84a.jpg",
  },
  "84B": {
    tag: "스타일리쉬 이면개방형",
    households: "233세대",
    exclusive: "84.98㎡",
    supply: "119.49㎡ (36.14평)",
    contract: "177.70㎡",
    useful: "36.11평",
    view: "단지 VIEW / CITY VIEW / 오산천 VIEW",
    feature: "스타일리쉬 이면개방형 · 3룸+알파룸 · 케어룸 · 현관창고 특화",
    img: "/img/unit-84b.jpg",
  },
  "104A": {
    tag: "쾌적한 오산천뷰",
    households: "318세대",
    exclusive: "104.81㎡",
    supply: "145.46㎡ (44.00평)",
    contract: "217.25㎡",
    useful: "45.56평",
    view: "오산천 VIEW (전세대)",
    feature: "희소가치 高 중대형 · 3룸+알파룸 · 쾌적한 오산천 조망 · 대형 현관창고",
    img: "/img/unit-104a.jpg",
  },
};

const FAQS = [
  {
    q: "공공지원민간임대주택이란 무엇인가요?",
    a: "민간임대주택에 관한 특별법에 근거해 공공지원을 받아 건설·운영되는 임대주택으로, 10년 이상 장기임대가 보장되고 HUG 보증으로 안전합니다. 무주택 자격이 유지되며 청약통장도 사용하지 않아 신규 분양 청약이 그대로 가능합니다.",
  },
  {
    q: "1주택자도 임차 및 중도금 대출이 가능한가요?",
    a: "1주택자도 중도금 대출이 가능하며, 기존 주택 처분 조건은 해당되지 않습니다. 다만 2주택 이상 보유자는 당 사업지 중도금 대출이 불가합니다.",
  },
  {
    q: "입주 시 전세자금 대출 한도는 어느 정도인가요?",
    a: "임대보증금의 최대 80%까지 가능합니다. 금융기관, 개인 신용도, 기존 보유 대출금액 등에 따라 개인별 한도는 차이가 있을 수 있습니다.",
  },
  {
    q: "임차 계약 후 퇴거 조건이 궁금합니다.",
    a: "2년 단위 계약이며, 계약 갱신 시점이 아닐 때 중도 퇴거할 경우 임차권 양도·양수 또는 전세 보증금에서 위약금 공제 후 퇴거 처리됩니다.",
  },
  {
    q: "임차 계약 갱신 시 보증금은 얼마나 오르나요?",
    a: "2년마다 계약을 갱신하며, 갱신 시 최대 5% 범위 내에서 임대보증금 상향이 가능합니다.",
  },
  {
    q: "10년 후 분양 전환은 어떻게 진행되나요?",
    a: "임차인에게 분양 우선권이 부여됩니다. 10년 후 분양 전환 시점의 계약 조건 및 분양가는 현재 미정이며, 추후 별도 공지됩니다.",
  },
  {
    q: "1주택자가 계약 후 다른 분양권·주택 매입 시 입주자격 유지가 되나요?",
    a: "2026년 5월 1일 이후 계약자는 분양권 또는 주택 매입 시에도 당 상품의 입주자격이 그대로 유지됩니다.",
  },
  {
    q: "청년주택 거주자도 임차 계약이 가능한가요?",
    a: "청년주택 거주자의 당 상품 임차계약이 가능합니다. 다만 법인사업자 및 외국인은 임차계약이 불가합니다.",
  },
];

const LOCATION = [
  { no: "01", title: "1호선 오산역 도보 10분 내", desc: "GTX-C 오산역 연장·정차, KTX 수원발 오산역 정차 추진으로 광역 교통 접근성 확대." },
  { no: "02", title: "광역 교통망 확충", desc: "동탄 트램(예정), 분당선 연장(추진) 등 서울 강남·분당권 접근성 대폭 향상." },
  { no: "03", title: "오산역 환승주차장 연결도로", desc: "경부선철도 횡단도로 신설(약 1.54km)로 오산IC·경부고속도로 접근 소요거리 1.76~2.26km 단축." },
  { no: "04", title: "세계 최대 반도체 클러스터 배후", desc: "삼성전자·SK하이닉스 2047년까지 622조 투자 346만명 고용 창출 계획 - 직주근접 수혜 도시." },
  { no: "05", title: "우수한 교육·생활 인프라", desc: "2km 내 초·중·고 다수 위치, 롯데마트·이마트·한국병원 등 대형 생활 인프라 인접." },
  { no: "06", title: "쾌적한 자연환경", desc: "단지 바로 앞 오산천 산책로, 반경 2km 물향기수목원·오산맑음터공원 인접." },
];

const COMMUNITY = [
  { ico: "⌂", t: "클럽 더샵 커뮤니티센터", d: "총 650평 규모의 대형 커뮤니티 공간" },
  { ico: "◈", t: "스포츠존 (B1F · 335평)", d: "피트니스 · 실내골프연습장 · 스크린골프 · 사우나(남/여)" },
  { ico: "✎", t: "에듀존 (B2F · 119평)", d: "북라운지 · 스터디룸 · 프라이빗 스터디 · 오픈스터디" },
  { ico: "☺", t: "키즈 인프라 (1F · 141평)", d: "국공립 어린이집 · 다함께 돌봄센터 · 어린이놀이터" },
  { ico: "❖", t: "더샵 필드 (중앙광장)", d: "대규모 중앙 광장 및 주민운동시설, 경로당, 근린공원" },
  { ico: "✦", t: "단지 내 상업시설 B2~2F", d: "약 7,700평 대규모 주상복합상업시설 - 원스톱 슬세권 라이프" },
];

const PREMIUMS = [
  {
    no: "01",
    title: "안정적 거주",
    items: ["10년 동안 새 집을 내 집처럼", "HUG 보증으로 전세사기 걱정 無"],
    highlight: "안전한 장기거주",
  },
  {
    no: "02",
    title: "합리적 가격",
    items: ["월 임대료 無 (비소멸성 보증금)", "2년 갱신 시 상승률 5% 이내"],
    highlight: "가치대비 낮은 가격",
  },
  {
    no: "03",
    title: "세금 절약",
    items: ["세금걱정 無 (취득세·종부세·재산세)", "고액 세금 절약"],
    highlight: "걱정없는 주택 세금",
  },
  {
    no: "04",
    title: "청약 FREE",
    items: ["청약 제한 無 (무주택 자격 유지)", "청약통장 미사용"],
    highlight: "신규 분양단지 청약 가능",
  },
];

export default function Home() {
  const [activeUnit, setActiveUnit] = useState("84A");
  const [openFaq, setOpenFaq] = useState(0);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    unit: "",
    message: "",
    agree: false,
  });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.agree) {
      setStatus({ ok: false, msg: "개인정보 수집·이용에 동의해주세요." });
      return;
    }
    setSubmitting(true);
    setStatus(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ ok: true, msg: "문의가 정상 접수되었습니다. 담당자가 신속히 연락드립니다." });
        setForm({ name: "", phone: "", unit: "", message: "", agree: false });
      } else {
        setStatus({ ok: false, msg: data.error || "접수 중 오류가 발생했습니다." });
      }
    } catch (err) {
      setStatus({ ok: false, msg: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요." });
    } finally {
      setSubmitting(false);
    }
  };

  const unit = UNITS[activeUnit];

  return (
    <>
      <Head>
        <title>더샵 오산역아크시티 - 세교2지구 유일 44F 주상복합 랜드마크</title>
      </Head>

      {/* Nav */}
      <nav className="nav">
        <div className="container nav-inner">
          <div className="nav-menu">
            <a href="#overview">사업개요</a>
            <a href="#premium">프리미엄</a>
            <a href="#location">입지</a>
            <a href="#units">평면</a>
            <a href="#community">커뮤니티</a>
            <a href="#faq">Q&A</a>
          </div>
          <a href="#contact" className="nav-cta">문의하기</a>
        </div>
      </nav>

      {/* Hero */}
      <section id="top" className="hero">
        <div className="hero-backdrop" aria-hidden="true">ARC CITY</div>
        <div className="hero-corner tl">
          <span className="dot" />
          THE SHARP · OSAN STATION ARC CITY
        </div>

        <div className="container hero-inner">
          <span className="hero-kicker">
            경기도 오산시 가수동 453번지 · 세교2지구 M1BL
          </span>
          <h1>
            세교2지구 유일한 슬세권,<br />
            오산 <span className="accent">최고층 44F</span> 랜드마크
          </h1>
          <p className="hero-sub">
            1호선 오산역 도보 10분, 세교2지구 유일한 주상복합 용지에 들어서는 총 987세대 대규모 단지.
            10년 장기임대 후 분양전환 우선권이 부여되는 공공지원민간임대주택으로,
            무주택 자격 유지와 합리적 가격 메리트를 동시에 누리세요.
          </p>

          <div className="hero-ctas">
            <a href="#contact" className="btn-primary">
              방문 예약·문의
              <span className="btn-arrow">→</span>
            </a>
            <a href="#overview" className="btn-ghost">사업 개요 보기</a>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="num">44<em>F</em></div>
              <div className="label">오산 최고층</div>
            </div>
            <div className="hero-stat">
              <div className="num">897<em>세대</em></div>
              <div className="label">아파트 대규모</div>
            </div>
            <div className="hero-stat">
              <div className="num">1.50<em>대</em></div>
              <div className="label">세대당 주차</div>
            </div>
            <div className="hero-stat">
              <div className="num">2029<em>년</em></div>
              <div className="label">입주 예정</div>
            </div>
          </div>
        </div>

        <a href="#overview" className="hero-scroll" aria-label="아래로 스크롤">
          <span className="hero-scroll-label">SCROLL</span>
          <span className="hero-scroll-line" />
        </a>
      </section>

      {/* Overview */}
      <section id="overview" className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-kicker">Project Overview</div>
            <h2 className="section-title">
              오산시 <span className="accent">최고층 랜드마크</span> 44F 주상복합 단지
            </h2>
            <p className="section-lead">
              세교2지구 유일한 주상복합 용지 M1블록에 들어서는 아파트 897세대 + 오피스텔 90실 대규모 단지.
              1층부터 2층 상업시설, 지하 4층~지상 44층 규모의 원스톱 슬세권 라이프 단지입니다.
            </p>
          </div>

          <div className="overview-grid">
            <div className="overview-visual">
              <img src="/img/rendering.jpg" alt="더샵 오산역아크시티 조감도" />
            </div>
            <div>
              <table className="overview-table">
                <tbody>
                  <tr>
                    <th>용도</th>
                    <td>주거시설 + 상업시설 복합 <strong>슬세권 단지</strong></td>
                  </tr>
                  <tr>
                    <th>대지위치</th>
                    <td>세교2지구 유일한 주상복합용지 M1블록</td>
                  </tr>
                  <tr>
                    <th>건축규모</th>
                    <td>지하 4층 ~ 지상 44층 <strong>오산 최고층</strong></td>
                  </tr>
                  <tr>
                    <th>세대수</th>
                    <td>총 987세대 中 아파트 <strong>897세대</strong> 대규모 단지</td>
                  </tr>
                  <tr>
                    <th>주차대수</th>
                    <td>1,346대 / <strong>세대당 1.50대</strong></td>
                  </tr>
                  <tr>
                    <th>연면적 / 대지면적</th>
                    <td>214,486.43㎡ / 33,211.10㎡</td>
                  </tr>
                  <tr>
                    <th>상업시설</th>
                    <td>B2~2F <strong>약 7,700평</strong> 대규모 계획</td>
                  </tr>
                  <tr>
                    <th>시공사</th>
                    <td>포스코이앤씨 (더샵 THE SHARP)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Premium */}
      <section id="premium" className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div className="section-kicker">4 Premium</div>
            <h2 className="section-title">
              공공지원 민간임대 <span className="accent">4가지 프리미엄</span>
            </h2>
            <p className="section-lead">
              HUG 보증으로 일반 전세아파트보다 안전하며, 무주택 자격 유지로 취득세·재산세 부담 無,
              주택청약까지 가능한 상품. 10년 동안 랜드마크를 부담없이 누리고 분양전환 우선권 부여로
              현명한 내집 마련 기회를 제공합니다.
            </p>
          </div>

          <div className="premium-grid">
            {PREMIUMS.map((p) => (
              <div className="premium-card" key={p.no}>
                <span className="badge">PREMIUM {p.no}</span>
                <h3>{p.title}</h3>
                <ul>
                  {p.items.map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ul>
                <div className="highlight">{p.highlight}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section id="location" className="section section-dark">
        <div className="container">
          <div className="section-head">
            <div className="section-kicker">No.1 Location</div>
            <h2 className="section-title">
              단연, 맨 앞의 <span className="accent">No.1 입지</span>
            </h2>
            <p className="section-lead">
              주거환경이 우수한 세교2지구 유일한 주상복합에서 다양한 인프라 이용이 수월합니다.
              오랫동안 꿈꿔온 세교2지구 NO.1 입지에서 누리는 프리미엄 라이프스타일.
            </p>
          </div>

          <div className="location-grid">
            <div className="location-visual">
              <img src="/img/aerial-view.jpg" alt="오산역 세교2지구 항공뷰 · 오산천 조망" />
            </div>
            <ul className="location-list">
              {LOCATION.map((l) => (
                <li key={l.no}>
                  <span className="ico">{l.no}</span>
                  <div className="meta">
                    <h4>{l.title}</h4>
                    <p>{l.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="full-visual">
            <img src="/img/transport.png" alt="광역 교통망 - GTX-C, KTX, 트램, 분당선 연장" />
          </div>
          <p className="visual-caption">
            FAST · CENTER · INFRA · ACCESS — 오산역을 중심으로 펼쳐질 광역교통망 최대 수혜 단지
          </p>
        </div>
      </section>

      {/* Future value */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div className="section-kicker">Future Value</div>
            <h2 className="section-title">
              세교3지구 추가 개발 + <span className="accent">세계 최대 반도체 클러스터</span>
            </h2>
            <p className="section-lead">
              세교1·2·3지구 만 6.8만 세대 대규모 신도시로 성장, 삼성전자·SK하이닉스 2047년까지
              622조 투자 346만명 고용 창출. 오산시는 반도체 메가 클러스터의 중심 배후 도시로 성장합니다.
            </p>
          </div>

          <div className="dual-panel">
            <div>
              <img src="/img/city-plan.png" alt="오산시 세교3지구 개발계획" />
              <div className="label">
                <strong>세교3지구 추가 개발 계획</strong>
                131만평 · 3.3만 가구 규모로 동탄1신도시 4.1만 세대 대비 대규모 성장
              </div>
            </div>
            <div>
              <img src="/img/semicon-cluster.png" alt="반도체 클러스터 배후 중심도시" />
              <div className="label">
                <strong>반도체 클러스터 배후 중심도시</strong>
                용인 · 화성 · 평택 파운드리·메모리 핵심 투자 벨트의 정중앙 오산시
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compare */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-kicker">Price Merit</div>
            <h2 className="section-title">
              오산 최고가 리딩단지 대비 <span className="accent">뛰어나지만 더 낮은 가격</span>
            </h2>
            <p className="section-lead">
              규모·입주시기·슬세권·신도시 가치·광역교통 모든 면에서 뛰어난 '더샵 오산역아크시티'가
              '더샵 오산센트럴' 리딩단지보다 경쟁력 있는 낮은 가격으로 공급됩니다.
            </p>
          </div>

          <table className="compare-table">
            <thead>
              <tr>
                <th>비교 항목</th>
                <th>더샵 오산센트럴 (세교1지구)</th>
                <th className="highlight">더샵 오산역아크시티 (세교2지구)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="label">규모</td>
                <td>20층 · 596세대 (중규모)</td>
                <td className="highlight">44층 · 총 897세대 (최고층 규모)</td>
              </tr>
              <tr>
                <td className="label">입주</td>
                <td>'20년 입주</td>
                <td className="highlight">'29년 입주 (10년 입주격차)</td>
              </tr>
              <tr>
                <td className="label">타입</td>
                <td>전용 66~84㎡ 중소형</td>
                <td className="highlight">전용 84~104㎡ 중대형</td>
              </tr>
              <tr>
                <td className="label">역세권</td>
                <td>1호선 오산대역 (완행)</td>
                <td className="highlight">1호선 오산역 (완행·급행)</td>
              </tr>
              <tr>
                <td className="label">광역 교통</td>
                <td>분당 연장선 (추진)</td>
                <td className="highlight">GTX-C · KTX (추진), 오산-동탄 트램(추진)</td>
              </tr>
              <tr>
                <td className="label">가격</td>
                <td>전세 시세 4.3억 (현재)</td>
                <td className="highlight">임대보증금 3.7억 (경쟁력 있는 낮은 가격)</td>
              </tr>
            </tbody>
          </table>

          <div className="full-visual">
            <img src="/img/price-chart.png" alt="더샵 오산역아크시티 vs 오산센트럴 전세가 비교 그래프" />
          </div>
          <p className="visual-caption">
            '23년~'26년 3년간 22.9% 상승 → 향후 3년간 상승 가정 시 입주 시점('29년) 시세 갭 약 1억원 이상 예상
            <br />
            <small>※ 자료: 국토교통부 아파트 실거래가, 전용면적 84타입 기준</small>
          </p>
        </div>
      </section>

      {/* Units */}
      <section id="units" className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div className="section-kicker">Unit Plan</div>
            <h2 className="section-title">
              3가지 타입, <span className="accent">최적의 라이프스타일</span>
            </h2>
            <p className="section-lead">
              84A·84B·104A 세 가지 중대형 타입 공급. 오산시 중대형 아파트 비율 5.9%의 희소가치 高 타입.
            </p>
          </div>

          <div className="unit-tabs">
            {Object.keys(UNITS).map((key) => (
              <button
                key={key}
                className={`unit-tab ${activeUnit === key ? "active" : ""}`}
                onClick={() => setActiveUnit(key)}
              >
                {key} 타입
              </button>
            ))}
          </div>

          <div className="unit-panel">
            <div className="unit-img">
              <img src={unit.img} alt={`${activeUnit} 평면도`} />
            </div>
            <div className="unit-info">
              <div className="unit-type">{unit.tag}</div>
              <h3>{activeUnit}</h3>
              <ul className="unit-specs">
                <li><span>세대수</span><span>{unit.households}</span></li>
                <li><span>전용면적</span><span>{unit.exclusive}</span></li>
                <li><span>공급면적</span><span>{unit.supply}</span></li>
                <li><span>계약면적</span><span>{unit.contract}</span></li>
                <li><span>실사용면적</span><span>{unit.useful}</span></li>
                <li><span>조망</span><span>{unit.view}</span></li>
              </ul>
              <div className="unit-feature">
                <strong>특화 설계</strong><br />
                {unit.feature}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Site Plan */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-kicker">Site Plan</div>
            <h2 className="section-title">
              오산천과 연결된 <span className="accent">쾌적한 대규모 배치</span>
            </h2>
            <p className="section-lead">
              지하 4층~지상 44층, 7개 동 897세대. 단지 바로 앞 오산천 산책로와 연결되는 자연친화 배치.
              오산역 환승센터 연결도로(예정)로 역세권 접근성이 대폭 향상됩니다.
            </p>
          </div>

          <div className="full-visual">
            <img src="/img/site-view.jpg" alt="더샵 오산역아크시티 단지 조감도" />
          </div>
          <p className="visual-caption">
            ■ 84A (346세대) · ■ 84B (233세대) · ■ 104A (318세대) · ■ E/V 위치
          </p>
        </div>
      </section>

      {/* Community */}
      <section id="community" className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div className="section-kicker">Community</div>
            <h2 className="section-title">
              클럽 더샵에서 즐기는 <span className="accent">다채로운 라이프스타일</span>
            </h2>
            <p className="section-lead">
              다함께 돌봄센터, 경로당, 어린이집, 골프연습장, 피트니스, 작은 도서관 등
              입주민의 여가활동을 더욱 쾌적하게 즐기는 클럽 더샵 커뮤니티센터.
            </p>
          </div>

          <div className="brand-strip">
            <img src="/img/community.png" alt="클럽 더샵 커뮤니티센터 - 스포츠존/에듀존/퍼블릭존" />
          </div>

          <div className="community-grid" style={{ marginTop: 24 }}>
            {COMMUNITY.map((c, i) => (
              <div className="community-card" key={i}>
                <div className="ico">{c.ico}</div>
                <h4>{c.t}</h4>
                <p>{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-kicker">Q&A</div>
            <h2 className="section-title">
              자주 묻는 <span className="accent">질문</span>
            </h2>
            <p className="section-lead">
              계약·대출·입주자격 등 궁금한 점을 빠르게 확인하세요.
            </p>
          </div>

          <div className="faq">
            {FAQS.map((item, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? "open" : ""}`}>
                <button
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  aria-expanded={openFaq === i}
                >
                  <span className="q">
                    <span className="q-mark">Q</span>
                    {item.q}
                  </span>
                  <span className="faq-toggle">+</span>
                </button>
                <div className="faq-answer">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section section-dark">
        <div className="container">
          <div className="contact-wrap">
            <div className="contact-info">
              <div className="section-kicker">Contact</div>
              <h3>
                더 자세한 정보, <br />
                방문 상담으로 직접 확인하세요.
              </h3>
              <p>
                아래 정보를 남겨주시면 담당자가 신속히 연락드려 타입·임대조건·대출·입주 일정 등
                궁금하신 모든 내용을 안내해드립니다.
              </p>

              <ul className="contact-detail">
                <li>
                  <span>대지위치</span>
                  <span>경기도 오산시 가수동 453번지 (M1BL)</span>
                </li>
                <li>
                  <span>시공사</span>
                  <span>포스코이앤씨 · 더샵 THE SHARP</span>
                </li>
                <li>
                  <span>사업주체</span>
                  <span>NTPARK Co., LTD</span>
                </li>
                <li>
                  <span>입주 예정</span>
                  <span>2029년 입주 계획</span>
                </li>
                <li>
                  <span>상담 시간</span>
                  <span>10:00 ~ 18:00 (연중무휴)</span>
                </li>
              </ul>
            </div>

            <form className="contact-form" onSubmit={onSubmit}>
              <div className="form-row">
                <label className="form-label">
                  성함<span className="req">*</span>
                </label>
                <input
                  className="form-input"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="홍길동"
                  required
                />
              </div>

              <div className="form-row two">
                <div>
                  <label className="form-label">
                    연락처<span className="req">*</span>
                  </label>
                  <input
                    className="form-input"
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="010-1234-5678"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">관심 타입</label>
                  <select className="form-select" name="unit" value={form.unit} onChange={onChange}>
                    <option value="">선택해주세요</option>
                    <option value="84A">84A (346세대)</option>
                    <option value="84B">84B (233세대)</option>
                    <option value="104A">104A (318세대)</option>
                    <option value="오피스텔">오피스텔 (90실)</option>
                    <option value="미정">미정</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">문의 내용</label>
                <textarea
                  className="form-textarea"
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  placeholder="방문 예약, 자금 계획, 분양 일정 등 자유롭게 문의해주세요."
                />
              </div>

              <div className="form-row">
                <label className="form-check">
                  <input
                    type="checkbox"
                    name="agree"
                    checked={form.agree}
                    onChange={onChange}
                  />
                  <span>
                    [필수] 상담 진행을 위한 개인정보(성함·연락처) 수집·이용에 동의합니다.
                    수집된 정보는 상담 목적 외 사용되지 않으며, 상담 완료 후 즉시 파기됩니다.
                  </span>
                </label>
              </div>

              <button type="submit" className="form-submit" disabled={submitting}>
                {submitting ? "접수 중..." : "상담 신청하기"}
              </button>

              {status && (
                <div className={`form-status ${status.ok ? "ok" : "err"}`}>{status.msg}</div>
              )}
            </form>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div>
              <div className="footer-logo">더샵 오산역아크시티</div>
              <div>경기도 오산시 가수동 453번지 (M1BL) · 공공지원 민간임대</div>
              <div>Copyright © 2026 NTPARK Co., LTD. All rights reserved.</div>
            </div>
            <div>
              <div className="footer-logo">Inquiry</div>
              <div>상담 시간 10:00 ~ 18:00 · 연중무휴</div>
              <div>문의 접수 후 담당자가 신속히 연락드립니다.</div>
            </div>
          </div>
          <div className="footer-disclaimer">
            ※ 본 홍보자료는 소비자의 이해를 돕기 위해 제작된 것으로, 실제와 다를 수 있으며, 관계 법령 및
            인허가 변경, 시공상의 이유로 사업 계획 및 내용이 일부 변경될 수 있습니다. 상기 이미지·CG·평면도는
            소비자 이해를 돕기 위한 것으로 실제와 차이가 있을 수 있습니다.
          </div>
        </div>
      </footer>

      <a href="#contact" className="floating-cta" aria-label="문의하기">
        <span>☏</span> 문의하기
      </a>
    </>
  );
}
