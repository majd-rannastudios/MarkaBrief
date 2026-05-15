import { useState, useEffect, useRef } from "react";

/* ════════════════════════════════════════════════════
   RANNA STUDIOS — MARKA CLIENT BRIEF
   marka.rannastudios.com
   Brand palette · Prompt + Poppins · Scroll-tracked nav
   10% color rule: only accent touches on abyssal black
════════════════════════════════════════════════════ */

const C = {
  ember:   "#FB9203",
  burnt:   "#E3500A",
  crimson: "#C91B7A",
  veil:    "#68097D",
  dusk:    "#3F184D",
  abyssal: "#080035",
  // UI surfaces
  bg:       "#06002C",
  surface:  "#07002F",
  sidebar:  "#04001A",
  border:   "rgba(255,255,255,0.07)",
  muted:    "rgba(255,255,255,0.38)",
  white:    "#FFFFFF",
};

// Gradient helpers
const GRAD_DIAG  = `linear-gradient(135deg, ${C.ember}, ${C.burnt}, ${C.crimson}, ${C.veil})`;
const GRAD_HORIZ = `linear-gradient(90deg, ${C.ember}, ${C.crimson})`;
const GRAD_VERT  = `linear-gradient(180deg, ${C.ember}, ${C.veil})`;

// 10% colour tints (very low-opacity fills on top of abyssal)
const T = {
  ember10:   "rgba(251,146,3,0.10)",
  crimson10: "rgba(201,27,122,0.10)",
  veil10:    "rgba(104,9,125,0.10)",
  ember06:   "rgba(251,146,3,0.06)",
  crimson06: "rgba(201,27,122,0.06)",
  white04:   "rgba(255,255,255,0.04)",
  white08:   "rgba(255,255,255,0.08)",
};

/* ── Ranna Studios SVG logo ─────────────────────── */
function Logo({ h = 30 }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:9 }}>
      <img src="/ranna_logo.png" alt="Ranna Studios" style={{ height: h, objectFit: "contain" }} />
    </div>
  );
}

/* ── Sections data ──────────────────────────────── */
const SECTIONS = [
  {
    id:"brand", num:"01", title:"Brand &\nIdentity", sub:"who you are",
    questions:[
      { id:"b1", type:"text",     q:"What is the full official name of your company? Do you have a tagline or brand statement?" },
      { id:"b2", type:"textarea", q:"In 2–3 sentences, how would you describe your company to a high-end client who has never heard of you?" },
      { id:"b3", type:"checkbox", q:"Which services do you currently offer?",
        opts:["Corporate Event Management","Luxury Weddings & Social Events","Hospitality & Venue Management","Entertainment & Production","VIP Experiences & Concierge","Brand Activations","3D & Visual Production","Other"] },
      { id:"b4", type:"radio",    q:"How long has your company been operating in KSA?",
        opts:["Less than 1 year","1–3 years","3–7 years","7+ years"] },
      { id:"b5", type:"textarea", q:"What makes your company different from other luxury event companies in Saudi Arabia? What is your unfair advantage?" },
      { id:"b6", type:"radio",    q:"Do you have an existing brand identity (logo, colors, fonts)?",
        opts:["Yes — complete brand guidelines available","Yes — partial (logo only or informal guidelines)","No — we need branding as part of this project"] },
    ],
  },
  {
    id:"audience", num:"02", title:"Target\nAudience", sub:"who you serve",
    questions:[
      { id:"a1", type:"checkbox", q:"Who are your primary clients?",
        opts:["Government & Ministries","Corporate & Enterprise (C-Suite)","Royal & Ultra-HNW Individuals","Giga-projects (NEOM, PIF, etc.)","SMEs & Startups","International Companies entering KSA","Social Clients (Weddings, Private Events)"] },
      { id:"a2", type:"radio",    q:"What language(s) should the website primarily support?",
        opts:["English only","Arabic only","Bilingual — English primary","Bilingual — Arabic primary","Full bilingual parity"] },
      { id:"a3", type:"radio",    q:"Where are most of your clients based?",
        opts:["Primarily Riyadh","Primarily Jeddah","Across all KSA cities","KSA + GCC region","KSA + International"] },
      { id:"a4", type:"textarea", q:"Describe your ideal client — their profile and what they look for when searching for a company like yours." },
    ],
  },
  {
    id:"goals", num:"03", title:"Website\nGoals", sub:"what it must do",
    questions:[
      { id:"g1", type:"checkbox", q:"What is the primary purpose of this website?",
        opts:["Generate leads & inquiries","Showcase portfolio & past work","Build brand credibility & prestige","Enable direct client booking or RFQ","Attract talent & partnerships","Support existing client relationships"] },
      { id:"g2", type:"textarea", q:"What should a first-time visitor feel within 10 seconds of landing on your homepage?" },
      { id:"g3", type:"textarea", q:"What is the single most important action you want a visitor to take? (e.g. fill a form, call, view portfolio, request a quote)" },
      { id:"g4", type:"radio",    q:"Do you currently have a website?",
        opts:["No — this is a new website","Yes — we need a full redesign","Yes — we need improvements only"] },
      { id:"g5", type:"textarea", q:"If you have an existing website, what are its biggest problems? What must change?" },
    ],
  },
  {
    id:"design", num:"04", title:"Design\nDirection", sub:"how you want to be seen",
    questions:[
      { id:"d1", type:"checkbox", q:"Which words best describe the visual feeling your website should convey?",
        opts:["Ultra-luxury & premium","Bold & confident","Elegant & refined","Modern & minimalist","Cinematic & immersive","Warm & hospitality-driven","Corporate & authoritative","Creative & artistic"] },
      { id:"d2", type:"radio",    q:"What color scheme do you prefer?",
        opts:["Dark & dramatic (black, deep tones, gold accents)","Light & pristine (white, cream, soft tones)","Rich & warm (deep earth tones, burgundy, gold)","Neutral & editorial (charcoal, beige, stone)","Follow our existing brand colors","Open to recommendations"] },
      { id:"d3", type:"textarea", q:"List 2–3 competitor or reference websites whose design you admire. What specifically do you like about them?" },
      { id:"d4", type:"radio",    q:"How important is photography and video to your website?",
        opts:["Critical — it should be the centerpiece","Important — strong visuals supporting content","Moderate — balanced with text and structure","Low — content and structure take priority"] },
      { id:"d5", type:"radio",    q:"Do you have high-quality professional photos or videos of your past events?",
        opts:["Yes — extensive library available","Yes — some assets available","No — we need photography / videography","No — we will use curated stock assets"] },
      { id:"d6", type:"textarea", q:"Is there anything you absolutely do NOT want visually? Any styles, colors, or elements to avoid?" },
    ],
  },
  {
    id:"content", num:"05", title:"Content &\nStructure", sub:"what it says",
    questions:[
      { id:"c1", type:"checkbox", q:"Which pages do you want on your website?",
        opts:["Home","About Us","Services (Overview)","Individual Service Pages","Portfolio / Case Studies","Clients & Partnerships","Blog / Insights","Careers","Media / Press","Contact / RFQ Form","Team Page"] },
      { id:"c2", type:"radio",    q:"Who will be responsible for writing the website copy?",
        opts:["Our team will provide all copy","We need your team to write it","We'll provide a draft, you refine it","Not decided yet"] },
      { id:"c3", type:"radio",    q:"Do you want a portfolio or case study section showcasing past events?",
        opts:["Yes — detailed case studies with images and results","Yes — gallery-style portfolio (visual, minimal text)","Maybe — to be discussed","No"] },
      { id:"c4", type:"textarea", q:"Are there specific projects, clients, or achievements you want prominently featured?" },
      { id:"c5", type:"radio",    q:"Will you need to update the website content yourself after launch?",
        opts:["Yes — we need a simple CMS","No — we'll contact the development team for updates","Unsure"] },
    ],
  },
  {
    id:"features", num:"06", title:"Features &\nFunctionality", sub:"what it does",
    questions:[
      { id:"f1", type:"checkbox", q:"Which features do you need on your website?",
        opts:["Contact / Inquiry Form","Request a Quote (RFQ) Form","WhatsApp Chat Integration","Video Reel / Showreel on Homepage","Client Login Portal","Newsletter / Email Capture","Live Chat Support","Social Media Feed Integration","Google Maps / Location Embed","Multi-language Toggle (AR / EN)","Downloadable Company Profile (PDF)","Event Calendar / Upcoming Events"] },
      { id:"f2", type:"radio",    q:"Do you need SEO (Search Engine Optimization) to rank on Google?",
        opts:["Yes — this is a priority","Yes — basic SEO is enough","No — site is primarily for referrals","Not sure"] },
      { id:"f3", type:"radio",    q:"Will the website need to connect to any third-party systems?",
        opts:["Yes — CRM (HubSpot, Salesforce, Odoo, etc.)","Yes — Email marketing (Mailchimp, etc.)","Yes — Payment gateway","No integrations needed","To be discussed"] },
      { id:"f4", type:"radio",    q:"How important is the mobile experience?",
        opts:["Critical — most visitors are on mobile","Important — needs to be fully responsive","Secondary — desktop is primary"] },
    ],
  },
  {
    id:"timeline", num:"07", title:"Timeline &\nDelivery", sub:"when & how",
    questions:[
      { id:"tl1", type:"radio",    q:"When do you need the website to be live?",
        opts:["Urgently — within 4 weeks","1–2 months","2–3 months","3–6 months","No fixed deadline"] },
      { id:"tl2", type:"textarea", q:"Are there specific dates, events, or conferences that would influence the launch timing?" },
      { id:"tl3", type:"textarea", q:"Anything else you'd like us to know — vision, concerns, non-negotiables, or expectations?" },
    ],
  },
];

const TOTAL_Q = SECTIONS.reduce((a, s) => a + s.questions.length, 0);

/* ── Small helpers ──────────────────────────────── */
function gradText(children, grad = GRAD_HORIZ) {
  return (
    <span style={{ background: grad, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
      {children}
    </span>
  );
}

/* ── Radio option ───────────────────────────────── */
function RadioOpt({ label, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      all:"unset", display:"flex", alignItems:"center", gap:12, cursor:"pointer",
      padding:"11px 16px", borderRadius:6, width:"100%", boxSizing:"border-box",
      border:`1px solid ${selected ? C.crimson : C.border}`,
      background: selected ? T.crimson10 : T.white04,
      color: selected ? "#fff" : C.muted,
      fontFamily:"'Poppins',sans-serif", fontSize:13, fontWeight: selected ? 500 : 400,
      transition:"all 0.15s",
    }}>
      <div style={{
        width:14, height:14, borderRadius:"50%", flexShrink:0,
        border:`1.5px solid ${selected ? C.crimson : "rgba(255,255,255,0.18)"}`,
        background: selected ? T.crimson10 : "transparent",
        display:"flex", alignItems:"center", justifyContent:"center",
        transition:"all 0.15s",
      }}>
        {selected && <div style={{ width:6, height:6, borderRadius:"50%", background:C.crimson }}/>}
      </div>
      {label}
    </button>
  );
}

/* ── Checkbox pill ──────────────────────────────── */
function CheckPill({ label, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      all:"unset", display:"inline-flex", alignItems:"center", gap:7,
      padding:"8px 15px", borderRadius:20, cursor:"pointer",
      border:`1px solid ${selected ? C.ember : C.border}`,
      background: selected ? T.ember10 : T.white04,
      color: selected ? C.ember : C.muted,
      fontFamily:"'Poppins',sans-serif", fontSize:12, fontWeight: selected ? 500 : 400,
      letterSpacing:"0.01em", transition:"all 0.15s",
    }}>
      {selected && <span style={{ fontSize:9, lineHeight:1, color:C.ember }}>✓</span>}
      {label}
    </button>
  );
}

/* ── Main export ────────────────────────────────── */
export default function App() {
  const [answers, setAnswers]     = useState({});
  const [active, setActive]       = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending]     = useState(false);
  const [sendError, setSendError] = useState(null);
  const [mounted, setMounted]     = useState(false);

  const secRefs    = useRef([]);
  const mainRef    = useRef(null);
  const scrollLock = useRef(false);

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  /* ── IntersectionObserver — sidebar tracks scroll ── */
  useEffect(() => {
    if (!mounted) return;
    const observers = [];
    secRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !scrollLock.current) setActive(i);
        },
        { root: mainRef.current, threshold: 0.25 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [mounted]);

  /* ── Sidebar click → smooth scroll ── */
  const goTo = (i) => {
    const el = secRefs.current[i];
    if (!el || !mainRef.current) return;
    scrollLock.current = true;
    setActive(i);
    mainRef.current.scrollTo({ top: el.offsetTop - 0, behavior:"smooth" });
    setTimeout(() => { scrollLock.current = false; }, 900);
  };

  /* ── Answers ── */
  const set  = (id, v) => setAnswers(p => ({ ...p, [id]: v }));
  const toggle = (id, opt) => {
    const cur = answers[id] || [];
    set(id, cur.includes(opt) ? cur.filter(o => o !== opt) : [...cur, opt]);
  };

  const answered = Object.keys(answers).filter(k => {
    const v = answers[k];
    return v && (typeof v === "string" ? v.trim() : v.length > 0);
  }).length;
  const progress = Math.round((answered / TOTAL_Q) * 100);

  const secPct = s => {
    const a = s.questions.filter(q => {
      const v = answers[q.id];
      return v && (typeof v === "string" ? v.trim() : v.length > 0);
    }).length;
    return Math.round((a / s.questions.length) * 100);
  };

  /* ── Submit → local Express server ── */
  const handleSubmit = async () => {
    if (sending) return;
    
    if (progress < 100) {
      const confirmSubmit = window.confirm(`Your brief is only ${progress}% complete.\nAre you sure you want to send it with missing details?`);
      if (!confirmSubmit) return;
    }

    setSending(true);
    setSendError(null);
    try {
      const res = await fetch("http://localhost:3001/api/submit", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");
      setSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
      setSendError(`Failed to send: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;600;700;800;900&family=Poppins:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:3px; background:${C.abyssal}; }
        ::-webkit-scrollbar-thumb { background:rgba(201,27,122,0.3); border-radius:2px; }
        ::selection { background:${C.crimson}; color:#fff; }

        .q-input { transition: border-color .2s, box-shadow .2s; }
        .q-input:focus { outline:none; border-color:${C.crimson} !important; box-shadow:0 0 0 3px rgba(201,27,122,0.12); }

        .r-opt:hover { border-color:rgba(201,27,122,0.45) !important; background:rgba(201,27,122,0.06) !important; color:rgba(255,255,255,0.75) !important; }
        .c-pill:hover { border-color:rgba(251,146,3,0.45) !important; color:rgba(251,146,3,0.8) !important; }

        .nav-row { transition: background .2s, border-color .2s; }
        .nav-row:hover .nav-label { color:rgba(255,255,255,0.6) !important; }

        .continue-link { transition: opacity .2s, color .2s; }
        .continue-link:hover { opacity:1 !important; color:${C.ember} !important; }

        .scroll-anchor { scroll-margin-top: 64px; }

        @media (max-width: 768px) {
          .sidebar { display: none !important; }
          .topbar { padding: 0 16px !important; }
          .topbar-brand { display: none !important; }
          .progress-container { width: 80px !important; }
          .main-content { padding: 0 !important; }
          .section-header { padding: 40px 16px 20px !important; }
          .ghost-num { font-size: 60px !important; right: 16px !important; opacity: 0.04 !important; }
          .questions-wrapper { padding: 4px 16px 40px !important; }
          .answered-stripe { left: -16px !important; }
          .success-view { padding: 40px 24px !important; }
          .continue-wrapper { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
        }
      `}</style>

      <div style={{
        minHeight:"100vh", background:C.bg,
        fontFamily:"'Poppins',sans-serif", color:"#fff",
        opacity: mounted ? 1 : 0, transition:"opacity 0.5s",
        display:"flex", flexDirection:"column",
        position:"relative",
      }}>

        {/* ── Ambient colour blobs (10% rule) ──────────── */}
        <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
          {/* Top-right ember bloom */}
          <div style={{
            position:"absolute", top:-160, right:-120,
            width:500, height:500, borderRadius:"50%",
            background:`radial-gradient(circle, rgba(251,146,3,0.08) 0%, transparent 70%)`,
          }}/>
          {/* Bottom-left veil bloom */}
          <div style={{
            position:"absolute", bottom:-200, left:-100,
            width:600, height:600, borderRadius:"50%",
            background:`radial-gradient(circle, rgba(104,9,125,0.09) 0%, transparent 65%)`,
          }}/>
          {/* Center crimson pulse */}
          <div style={{
            position:"absolute", top:"40%", left:"40%",
            width:400, height:400, borderRadius:"50%",
            background:`radial-gradient(circle, rgba(201,27,122,0.05) 0%, transparent 65%)`,
          }}/>
        </div>

        {/* ════ TOPBAR ════════════════════════════════ */}
        <div className="topbar" style={{
          position:"sticky", top:0, zIndex:200, height:64,
          background:`linear-gradient(180deg, rgba(4,0,26,0.98) 0%, rgba(6,0,42,0.95) 100%)`,
          backdropFilter:"blur(14px)",
          borderBottom:`1px solid ${C.border}`,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 28px",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <Logo h={28}/>
            <div style={{ width:1, height:18, background:"rgba(255,255,255,0.1)" }}/>
            {/* "marka" in 10% crimson tint label */}
            <div className="topbar-brand" style={{
              padding:"3px 10px", borderRadius:4,
              background:T.crimson10,
              border:`1px solid rgba(201,27,122,0.2)`,
              fontSize:9, fontWeight:600, letterSpacing:"0.22em",
              textTransform:"uppercase", color:C.crimson,
              fontFamily:"'Poppins',sans-serif",
            }}>
              Marka · Client Brief
            </div>
          </div>

          {/* Progress */}
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <span style={{ fontSize:10, color:"rgba(255,255,255,0.22)", letterSpacing:"0.15em", textTransform:"uppercase" }}>
              {answered}&nbsp;/&nbsp;{TOTAL_Q}
            </span>
            <div className="progress-container" style={{ width:140, height:3, background:"rgba(255,255,255,0.07)", borderRadius:2, overflow:"hidden" }}>
              <div style={{
                height:"100%", background:GRAD_HORIZ, borderRadius:2,
                width:`${progress}%`, transition:"width 0.4s",
              }}/>
            </div>
            <div style={{
              fontFamily:"'Prompt',sans-serif", fontWeight:800, fontSize:15,
              background:GRAD_HORIZ, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              minWidth:40, textAlign:"right",
            }}>
              {progress}%
            </div>
          </div>
        </div>

        {/* ════ BODY ══════════════════════════════════ */}
        <div style={{ display:"flex", flex:1, position:"relative", zIndex:1 }}>

          {/* ── SIDEBAR ──────────────────────────────── */}
          <div className="sidebar" style={{
            width:224, flexShrink:0,
            background:`linear-gradient(180deg, rgba(4,0,18,0.98), rgba(6,0,28,0.98))`,
            borderRight:`1px solid ${C.border}`,
            position:"sticky", top:64, height:"calc(100vh - 64px)",
            overflowY:"auto", display:"flex", flexDirection:"column",
            padding:"20px 0",
          }}>
            {SECTIONS.map((s, i) => {
              const pct      = secPct(s);
              const isActive = i === active;
              const done     = pct === 100;

              return (
                <button key={s.id} className="nav-row" onClick={() => goTo(i)} style={{
                  all:"unset", cursor:"pointer", display:"block",
                  padding:"11px 20px",
                  borderLeft: isActive
                    ? `2px solid ${C.crimson}`
                    : "2px solid transparent",
                  background: isActive
                    ? `linear-gradient(90deg, rgba(201,27,122,0.11) 0%, transparent 80%)`
                    : "transparent",
                }}>
                  {/* Section number */}
                  <div style={{
                    fontSize:9, fontWeight:700, letterSpacing:"0.26em",
                    textTransform:"uppercase", marginBottom:5,
                    fontFamily:"'Poppins',sans-serif",
                    color: isActive ? C.ember : done ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.13)",
                  }}>
                    {s.num}{done && !isActive ? "  ✓" : ""}
                  </div>

                  {/* Title */}
                  <div className="nav-label" style={{
                    fontFamily:"'Prompt',sans-serif",
                    fontSize:12, fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#fff" : "rgba(255,255,255,0.27)",
                    whiteSpace:"pre-line", lineHeight:1.25,
                    transition:"color 0.2s",
                  }}>
                    {s.title}
                  </div>

                  {/* Mini-progress bar */}
                  <div style={{
                    marginTop:8, height:2, borderRadius:1,
                    background:"rgba(255,255,255,0.05)", overflow:"hidden",
                  }}>
                    <div style={{
                      height:"100%", borderRadius:1,
                      background: isActive ? GRAD_HORIZ : "rgba(255,255,255,0.14)",
                      width:`${pct}%`, transition:"width 0.35s",
                    }}/>
                  </div>
                </button>
              );
            })}

            {/* Sidebar submit */}
            <div style={{ marginTop:"auto", padding:"20px 20px 4px" }}>
              <button
                onClick={handleSubmit}
                disabled={sending}
                style={{
                  width:"100%", padding:"12px 0", borderRadius:6, border:"none",
                  background: progress === 100 ? GRAD_HORIZ : "rgba(255,255,255,0.04)",
                  color: progress === 100 ? "#fff" : "rgba(255,255,255,0.6)",
                  fontFamily:"'Prompt',sans-serif", fontWeight:700,
                  fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase",
                  cursor: !sending ? "pointer" : "default",
                  transition:"all 0.3s", opacity: sending ? 0.6 : 1,
                }}
              >
                {sending ? "Sending…" : progress === 100 ? "Submit Brief →" : `Submit (${progress}% Complete)`}
              </button>
            </div>
          </div>

          {/* ── MAIN SCROLL ──────────────────────────── */}
          <div className="main-content" style={{ flex:1, height:"calc(100vh - 64px)", overflowY:"auto" }}>

            {submitted ? (
              /* SUCCESS */
              <div className="success-view" style={{
                minHeight:"100%", display:"flex", flexDirection:"column",
                alignItems:"center", justifyContent:"center",
                padding:"80px 48px", textAlign:"center",
              }}>
                {/* Gradient orb */}
                <div style={{
                  width:110, height:110, borderRadius:"50%",
                  background:GRAD_DIAG, marginBottom:40,
                  boxShadow:`0 0 80px rgba(201,27,122,0.25)`,
                  animation:"pulse 2.5s ease-in-out infinite",
                }}/>
                <style>{`@keyframes pulse { 0%,100%{transform:scale(1);opacity:.85} 50%{transform:scale(1.06);opacity:1} }`}</style>

                <h1 style={{
                  fontFamily:"'Prompt',sans-serif", fontWeight:900,
                  fontSize:"clamp(54px,8vw,96px)", lineHeight:0.88,
                  textTransform:"uppercase", marginBottom:24,
                  background:GRAD_DIAG, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                }}>
                  Brief<br/>Received.
                </h1>
                <p style={{
                  fontSize:14, color:"rgba(255,255,255,0.4)",
                  lineHeight:1.9, maxWidth:380, fontWeight:300,
                }}>
                  Our team will review your responses and prepare a tailored proposal within 48 hours.<br/>
                  <span style={{ color:"rgba(251,146,3,0.6)", fontSize:12 }}>A copy has been sent to majd@rannastudios.com</span>
                </p>
                <div style={{
                  marginTop:48, display:"flex", alignItems:"center", gap:10,
                  fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase",
                  color:"rgba(255,255,255,0.14)", fontFamily:"'Poppins',sans-serif",
                }}>
                  <Logo h={20}/> <span>marka.rannastudios.com</span>
                </div>
              </div>

            ) : SECTIONS.map((sec, si) => (
              /* SECTION BLOCK */
              <div
                key={sec.id}
                className="scroll-anchor"
                ref={el => secRefs.current[si] = el}
              >
                {/* ── Section header ── */}
                <div className="section-header" style={{
                  padding:"60px 64px 44px",
                  borderBottom:`1px solid ${C.border}`,
                  position:"relative", overflow:"hidden",
                }}>
                  {/* Ghost number */}
                  <div className="ghost-num" style={{
                    position:"absolute", right:44, top:"50%", transform:"translateY(-50%)",
                    fontFamily:"'Prompt',sans-serif", fontWeight:900,
                    fontSize:"clamp(90px,12vw,160px)",
                    lineHeight:1, userSelect:"none", pointerEvents:"none",
                    background: GRAD_DIAG,
                    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                    opacity:0.07,
                  }}>
                    {sec.num}
                  </div>

                  {/* Section eyebrow */}
                  <div style={{
                    display:"inline-flex", alignItems:"center", gap:8,
                    marginBottom:18,
                  }}>
                    {/* Tiny colour dot */}
                    <div style={{
                      width:6, height:6, borderRadius:"50%",
                      background:GRAD_HORIZ,
                    }}/>
                    <span style={{
                      fontSize:10, fontWeight:600, letterSpacing:"0.28em",
                      textTransform:"uppercase",
                      color:C.ember,
                      fontFamily:"'Poppins',sans-serif",
                    }}>
                      section {sec.num} — {sec.sub}
                    </span>
                  </div>

                  {/* Section title */}
                  <h2 style={{
                    fontFamily:"'Prompt',sans-serif", fontWeight:900,
                    fontSize:"clamp(44px,6.5vw,76px)", lineHeight:0.9,
                    whiteSpace:"pre-line", textTransform:"uppercase",
                    background:GRAD_DIAG,
                    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                  }}>
                    {sec.title}
                  </h2>
                </div>

                {/* ── Questions ── */}
                <div className="questions-wrapper" style={{ padding:"4px 64px 56px" }}>
                  {sec.questions.map((q, qi) => {
                    const isAnswered = (() => {
                      const v = answers[q.id];
                      return v && (typeof v === "string" ? v.trim() : v.length > 0);
                    })();

                    return (
                      <div key={q.id} style={{
                        padding:"36px 0",
                        borderBottom:`1px solid ${C.border}`,
                        position:"relative",
                      }}>
                        {/* Answered indicator stripe */}
                        {isAnswered && (
                          <div className="answered-stripe" style={{
                            position:"absolute", left:-64, top:0, bottom:0, width:2,
                            background:GRAD_VERT,
                          }}/>
                        )}

                        {/* Q label row */}
                        <div style={{ display:"flex", gap:18, marginBottom:20, alignItems:"flex-start" }}>
                          {/* Number badge */}
                          <div style={{
                            flexShrink:0,
                            padding:"2px 8px", borderRadius:4,
                            background: isAnswered ? T.ember10 : T.white04,
                            border:`1px solid ${isAnswered ? "rgba(251,146,3,0.25)" : "rgba(255,255,255,0.07)"}`,
                            fontFamily:"'Prompt',sans-serif", fontSize:9,
                            fontWeight:700, letterSpacing:"0.2em",
                            color: isAnswered ? C.ember : "rgba(255,255,255,0.25)",
                            textTransform:"uppercase", marginTop:3,
                            transition:"all 0.2s",
                          }}>
                            {sec.num}.{String(qi + 1).padStart(2, "0")}
                          </div>

                          <label style={{
                            fontSize:15, fontWeight:400,
                            color:"rgba(255,255,255,0.82)",
                            lineHeight:1.6, letterSpacing:"0.01em",
                          }}>
                            {q.q}
                          </label>
                        </div>

                        {/* Input area */}
                        <div style={{ paddingLeft:48 }}>

                          {q.type === "text" && (
                            <input
                              className="q-input"
                              value={answers[q.id] || ""}
                              onChange={e => set(q.id, e.target.value)}
                              placeholder="Your answer"
                              style={INPUT}
                            />
                          )}

                          {q.type === "textarea" && (
                            <textarea
                              className="q-input"
                              value={answers[q.id] || ""}
                              onChange={e => set(q.id, e.target.value)}
                              placeholder="Your answer"
                              rows={4}
                              style={{ ...INPUT, resize:"vertical", minHeight:96 }}
                            />
                          )}

                          {q.type === "radio" && (
                            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                              {q.opts.map(opt => (
                                <button
                                  key={opt}
                                  className="r-opt"
                                  onClick={() => set(q.id, opt)}
                                  style={{
                                    all:"unset", display:"flex", alignItems:"center", gap:12,
                                    cursor:"pointer", padding:"11px 16px", borderRadius:6,
                                    width:"100%", boxSizing:"border-box",
                                    border:`1px solid ${answers[q.id] === opt ? C.crimson : C.border}`,
                                    background: answers[q.id] === opt ? T.crimson10 : T.white04,
                                    color: answers[q.id] === opt ? "#fff" : C.muted,
                                    fontFamily:"'Poppins',sans-serif",
                                    fontSize:13, fontWeight: answers[q.id] === opt ? 500 : 400,
                                    transition:"all 0.15s",
                                  }}
                                >
                                  <div style={{
                                    width:14, height:14, borderRadius:"50%", flexShrink:0,
                                    border:`1.5px solid ${answers[q.id] === opt ? C.crimson : "rgba(255,255,255,0.2)"}`,
                                    display:"flex", alignItems:"center", justifyContent:"center",
                                    transition:"all 0.15s",
                                  }}>
                                    {answers[q.id] === opt && (
                                      <div style={{ width:6, height:6, borderRadius:"50%", background:C.crimson }}/>
                                    )}
                                  </div>
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}

                          {q.type === "checkbox" && (
                            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                              {q.opts.map(opt => {
                                const sel = (answers[q.id] || []).includes(opt);
                                return (
                                  <button
                                    key={opt}
                                    className="c-pill"
                                    onClick={() => toggle(q.id, opt)}
                                    style={{
                                      all:"unset", display:"inline-flex", alignItems:"center",
                                      gap:7, padding:"8px 15px", borderRadius:20, cursor:"pointer",
                                      border:`1px solid ${sel ? C.ember : C.border}`,
                                      background: sel ? T.ember10 : T.white04,
                                      color: sel ? C.ember : C.muted,
                                      fontFamily:"'Poppins',sans-serif",
                                      fontSize:12, fontWeight: sel ? 500 : 400,
                                      letterSpacing:"0.01em", transition:"all 0.15s",
                                    }}
                                  >
                                    {sel && <span style={{ fontSize:9, lineHeight:1 }}>✓</span>}
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                        </div>
                      </div>
                    );
                  })}

                  {/* ── Continue nudge / Submit ── */}
                  <div className="continue-wrapper" style={{ marginTop:36, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    {si < SECTIONS.length - 1 ? (
                      <button
                        className="continue-link"
                        onClick={() => goTo(si + 1)}
                        style={{
                          all:"unset", cursor:"pointer", display:"inline-flex",
                          alignItems:"center", gap:10,
                          fontFamily:"'Poppins',sans-serif", fontSize:11,
                          fontWeight:500, letterSpacing:"0.18em", textTransform:"uppercase",
                          color:"rgba(255,255,255,0.28)", opacity:0.8,
                        }}
                      >
                        <span>Continue to Section {SECTIONS[si + 1].num} — {SECTIONS[si + 1].sub}</span>
                        <span style={{ fontSize:14 }}>→</span>
                      </button>
                    ) : (
                      <div>
                        <div style={{
                          fontSize:11, color:"rgba(255,255,255,0.25)",
                          marginBottom:14, letterSpacing:"0.04em",
                        }}>
                          {progress === 100
                            ? "✓  All sections complete — ready to submit."
                            : `${TOTAL_Q - answered} question${TOTAL_Q - answered !== 1 ? "s" : ""} remaining before submission.`}
                        </div>
                        {sendError && (
                          <div style={{
                            marginBottom:12, padding:"10px 14px", borderRadius:6,
                            background:"rgba(201,27,122,0.12)",
                            border:"1px solid rgba(201,27,122,0.3)",
                            fontSize:11, color:"rgba(255,100,100,0.9)",
                            fontFamily:"'Poppins',sans-serif",
                          }}>
                            ⚠ {sendError}
                          </div>
                        )}
                        <button
                          onClick={handleSubmit}
                          disabled={sending}
                          style={{
                            padding:"13px 36px", borderRadius:6, border:"none",
                            background: progress === 100 ? GRAD_HORIZ : "rgba(255,255,255,0.06)",
                            color: progress === 100 ? "#fff" : "rgba(255,255,255,0.6)",
                            fontFamily:"'Prompt',sans-serif", fontWeight:700,
                            fontSize:12, letterSpacing:"0.18em", textTransform:"uppercase",
                            cursor: !sending ? "pointer" : "default",
                            transition:"all 0.3s", opacity: sending ? 0.7 : 1,
                            boxShadow: progress === 100 ? "0 4px 24px rgba(201,27,122,0.25)" : "none",
                          }}
                        >
                          {sending ? "Sending brief…" : progress === 100 ? "Submit Brief →" : "Submit Incomplete Brief →"}
                        </button>
                      </div>
                    )}

                    {/* Section pct badge */}
                    <div style={{
                      padding:"4px 12px", borderRadius:12,
                      background: secPct(sec) === 100 ? T.ember10 : T.white04,
                      border:`1px solid ${secPct(sec) === 100 ? "rgba(251,146,3,0.22)" : C.border}`,
                      fontSize:10, fontWeight:600, letterSpacing:"0.12em",
                      color: secPct(sec) === 100 ? C.ember : "rgba(255,255,255,0.2)",
                      fontFamily:"'Poppins',sans-serif", textTransform:"uppercase",
                    }}>
                      {secPct(sec)}% done
                    </div>
                  </div>

                </div>{/* /questions pad */}

                {/* Divider between sections */}
                {si < SECTIONS.length - 1 && (
                  <div style={{
                    height:2,
                    background:`linear-gradient(90deg, transparent 0%, rgba(201,27,122,0.15) 30%, rgba(251,146,3,0.15) 70%, transparent 100%)`,
                  }}/>
                )}

              </div>/* /section */
            ))}

          </div>{/* /main scroll */}
        </div>{/* /body */}
      </div>
    </>
  );
}

/* ── Shared input style ────────────────────────── */
const INPUT = {
  width:"100%", borderRadius:6,
  background:"rgba(255,255,255,0.04)",
  border:"1px solid rgba(255,255,255,0.09)",
  color:"#fff", padding:"13px 16px",
  fontSize:14, fontFamily:"'Poppins',sans-serif",
  fontWeight:300, letterSpacing:"0.01em",
  lineHeight:1.6, outline:"none",
  transition:"border-color 0.2s, box-shadow 0.2s",
};
