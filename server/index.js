import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app  = express();
const PORT = 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

/* ── Nodemailer transporter ──────────────────────── */
const transporter = nodemailer.createTransport({
  host:   "smtp.gmail.com",
  port:   465,
  secure: true,           // SSL
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/* ── Format answers into a readable email ────────── */
const SECTIONS = [
  { num:"01", title:"Brand & Identity",        sub:"who you are",           ids:["b1","b2","b3","b4","b5","b6"] },
  { num:"02", title:"Target Audience",         sub:"who you serve",         ids:["a1","a2","a3","a4"] },
  { num:"03", title:"Website Goals",           sub:"what it must do",       ids:["g1","g2","g3","g4","g5"] },
  { num:"04", title:"Design Direction",        sub:"how you want to be seen",ids:["d1","d2","d3","d4","d5","d6"] },
  { num:"05", title:"Content & Structure",     sub:"what it says",          ids:["c1","c2","c3","c4","c5"] },
  { num:"06", title:"Features & Functionality",sub:"what it does",          ids:["f1","f2","f3","f4"] },
  { num:"07", title:"Timeline & Delivery",     sub:"when & how",            ids:["tl1","tl2","tl3"] },
];

const QUESTIONS = {
  b1: "Full official company name / tagline?",
  b2: "Describe your company to a high-end client (2–3 sentences)?",
  b3: "Services currently offered?",
  b4: "How long operating in KSA?",
  b5: "What is your unfair advantage over other luxury event companies?",
  b6: "Do you have an existing brand identity?",
  a1: "Who are your primary clients?",
  a2: "What language(s) should the website support?",
  a3: "Where are most of your clients based?",
  a4: "Describe your ideal client profile?",
  g1: "Primary purpose of this website?",
  g2: "What should a first-time visitor feel within 10 seconds?",
  g3: "Single most important action you want a visitor to take?",
  g4: "Do you currently have a website?",
  g5: "Existing website problems — what must change?",
  d1: "Words that describe your desired visual feeling?",
  d2: "Preferred color scheme?",
  d3: "Reference websites you admire and why?",
  d4: "How important is photography/video?",
  d5: "Do you have high-quality event photos/videos?",
  d6: "Anything you absolutely do NOT want visually?",
  c1: "Pages you want on the website?",
  c2: "Who will write the website copy?",
  c3: "Do you want a portfolio/case study section?",
  c4: "Specific projects or achievements to feature?",
  c5: "Will you update content yourself after launch?",
  f1: "Which features do you need?",
  f2: "Do you need SEO?",
  f3: "Third-party system integrations?",
  f4: "How important is the mobile experience?",
  tl1: "When do you need the website live?",
  tl2: "Specific dates or events influencing launch timing?",
  tl3: "Anything else we should know?",
};

function formatAnswers(answers) {
  return SECTIONS.map(sec => {
    const lines = sec.ids.map((id, qi) => {
      const v   = answers[id];
      const val = Array.isArray(v)
        ? (v.length ? v.join(", ") : "—")
        : (typeof v === "string" && v.trim() ? v.trim() : "—");
      const q   = QUESTIONS[id] || id;
      return `  ${sec.num}.${String(qi + 1).padStart(2, "0")}  ${q}\n       → ${val}`;
    });
    return `━━━ ${sec.num}. ${sec.title} (${sec.sub}) ━━━\n\n${lines.join("\n\n")}`;
  }).join("\n\n\n");
}

/* ── POST /api/submit ────────────────────────────── */
app.post("/api/submit", async (req, res) => {
  const { answers } = req.body;

  if (!answers || typeof answers !== "object") {
    return res.status(400).json({ error: "No answers provided." });
  }

  const now  = new Date().toLocaleString("en-GB", { timeZone: "Asia/Riyadh" });
  const body = formatAnswers(answers);

  const mailOptions = {
    from:    `"Marka Brief" <${process.env.GMAIL_USER}>`,
    to:      "majd@rannastudios.com",
    subject: `New Marka Client Brief — ${now}`,
    text: `New Marka Client Brief received on ${now}
${"═".repeat(56)}

${body}

${"═".repeat(56)}
Sent via marka.rannastudios.com`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✓ Brief sent at ${now}`);
    res.json({ success: true });
  } catch (err) {
    console.error("Mail error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✓ Marka mail server running on http://localhost:${PORT}`);
});
