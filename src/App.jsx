import React, { useState, useEffect, useRef } from "react";

// ── Google Fonts ──────────────────────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; }
    h1,h2,h3,h4,h5 { font-family: 'Outfit', sans-serif; }
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: #f1f1f1; }
    ::-webkit-scrollbar-thumb { background: #c8dfc9; border-radius: 3px; }
    table td, table th { white-space: nowrap; }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.5; } }
    .fadeUp { animation: fadeUp 0.35s ease both; }
    .hover-row:hover { background: #f0f7f0 !important; cursor: default; }
    .btn:hover { filter: brightness(1.08); }
    .nav-tab:hover { background: rgba(46,125,50,0.07); }
    .side-nav:hover { background: rgba(255,255,255,0.12) !important; color: #fff !important; }
    .doc-row:hover { background: #f8fdf8; }
  `}</style>
);

// ── Brand — Green (default) ───────────────────────────────────────────────────
const G = {
  dark:    "#1B5E20",
  mid:     "#2E7D32",
  bright:  "#43A047",
  light:   "#81C784",
  pale:    "#E8F5E9",
  paleMid: "#C8E6C9",
  lime:    "#8BC34A",
  slate:   "#37474F",
  charcoal:"#263238",
  muted:   "#78909C",
  hairline:"#ECEFF1",
  white:   "#FFFFFF",
  bg:      "#F5F7F5",
  amber:   "#F57F17",
  amberPale:"#FFF8E1",
  red:     "#C62828",
  redPale: "#FFEBEE",
  blue:    "#1565C0",
  bluePale:"#E3F2FD",
};

// ── Brand — Teal (WasteMart #14A697) ─────────────────────────────────────────
const TEAL = {
  dark:    "#0A7066",
  mid:     "#14A697",
  bright:  "#1BBFB0",
  light:   "#5FD4CA",
  pale:    "#E0F5F3",
  paleMid: "#B2E8E4",
  lime:    "#F0A500",      // warm amber accent replacing lime
  slate:   "#2C3E50",
  charcoal:"#1A2530",
  muted:   "#6B8B9E",
  hairline:"#E8F0EF",
  white:   "#FFFFFF",
  bg:      "#F2FAF9",
  amber:   "#E07B00",
  amberPale:"#FFF4E0",
  red:     "#C62828",
  redPale: "#FFEBEE",
  blue:    "#1565C0",
  bluePale:"#E3F2FD",
};

// ── Data ──────────────────────────────────────────────────────────────────────
const UPCOMING = [
  { id:"U001", date:"Mon 16 Mar 2026", type:"General Waste Collection",    bin:"240L MGB — #B2104",    status:"Scheduled" },
  { id:"U002", date:"Mon 16 Mar 2026", type:"Recycling Collection",        bin:"240L MGB — #B2105",        status:"Scheduled" },
  { id:"U004", date:"Mon 23 Mar 2026", type:"General Waste Collection",    bin:"240L MGB — #B2104",    status:"Scheduled" },
  { id:"U005", date:"Mon 23 Mar 2026", type:"Recycling Collection",        bin:"240L MGB — #B2105",        status:"Scheduled" },
  { id:"U006", date:"Thu 26 Mar 2026", type:"Additional Bin Delivery",     bin:"240L MGB — #B2106",    status:"Pending Confirm" },
];

const ACTIVE_SERVICES = [
  { name:"General Waste Collection", freq:"Weekly · Mondays",  bin:"240L MGB — #B2104", status:"Active" },
  { name:"Recycling Collection",     freq:"Weekly · Mondays",  bin:"240L MGB — #B2105", status:"Active" },
  { name:"Additional Bin Delivery",  freq:"On request",        bin:"240L MGB — #B2106", status:"Pending Confirm" },
];

const HISTORY = [
  { id:"T0041", planned:"Mon 09 Mar", actual:"Mon 09 Mar", type:"General Waste",    bin:"240L MGB — #B2104",   status:"On Time",     reason:"",                             dnote:"DN-20260309-041", track:"PO-44821" },
  { id:"T0040", planned:"Mon 09 Mar", actual:"Mon 09 Mar", type:"Recycling",         bin:"240L MGB — #B2105",  status:"On Time",     reason:"",                             dnote:"DN-20260309-040", track:"PO-44821" },
  { id:"T0038", planned:"Mon 02 Mar", actual:"Mon 02 Mar", type:"General Waste",    bin:"240L MGB — #B2104",   status:"On Time",     reason:"",                             dnote:"DN-20260302-038", track:"PO-44712" },
  { id:"T0037", planned:"Mon 02 Mar", actual:"Tue 03 Mar", type:"Recycling",         bin:"240L MGB — #B2105",  status:"Rescheduled", reason:"Public holiday — capacity",    dnote:"DN-20260303-037", track:"PO-44712" },
  { id:"T0035", planned:"Mon 23 Feb", actual:"Mon 23 Feb", type:"General Waste",    bin:"240L MGB — #B2104",   status:"On Time",     reason:"",                             dnote:"DN-20260223-035", track:"PO-44603" },
  { id:"T0034", planned:"Mon 23 Feb", actual:"Mon 23 Feb", type:"Recycling",         bin:"240L MGB — #B2105",  status:"On Time",     reason:"",                             dnote:"DN-20260223-034", track:"PO-44603" },
];

const INVOICES = [
  { inv:"INV-2026-0312", date:"01 Mar 2026", due:"15 Mar 2026", desc:"March 2026 — Waste Services",     amount:"R 4,850.00",  status:"Unpaid"  },
  { inv:"INV-2026-0289", date:"01 Feb 2026", due:"15 Feb 2026", desc:"February 2026 — Waste Services",  amount:"R 4,850.00",  status:"Paid"    },
  { inv:"INV-2026-0241", date:"01 Jan 2026", due:"15 Jan 2026", desc:"January 2026 — Waste Services",   amount:"R 4,850.00",  status:"Paid"    },
  { inv:"INV-2025-0198", date:"01 Dec 2025", due:"15 Dec 2025", desc:"December 2025 — Waste Services",  amount:"R 4,850.00",  status:"Paid"    },
  { inv:"INV-2025-0177", date:"01 Nov 2025", due:"15 Nov 2025", desc:"November 2025 — Waste Services",  amount:"R 4,720.00",  status:"Paid"    },
];

const STATEMENTS = [
  { ref:"STMT-2026-03", period:"March 2026",    opening:"R 4,850.00", closing:"R 4,850.00", date:"01 Mar 2026" },
  { ref:"STMT-2026-02", period:"February 2026", opening:"R 4,850.00", closing:"R 4,850.00", date:"01 Feb 2026" },
  { ref:"STMT-2026-01", period:"January 2026",  opening:"R 4,720.00", closing:"R 4,850.00", date:"01 Jan 2026" },
  { ref:"STMT-2025-12", period:"December 2025", opening:"R 4,720.00", closing:"R 4,720.00", date:"01 Dec 2025" },
];

const CONTACTS = [
  { name:"Nazier Marthinus", role:"Account Manager",     phone:"+27 21 555 0100", email:"nazier@wastemart.co.za"  },
  { name:"Chantele du Plessis", role:"Finance Queries",  phone:"+27 83 442 2086", email:"chantele@wastemart.co.za"},
  { name:"Operations Desk",   role:"Service Issues",     phone:"+27 21 555 0199", email:"ops@wastemart.co.za"     },
];

// ── Data freshness ────────────────────────────────────────────────────────────
const DATA_STATUS = {
  lastTransaction:  "Fri 13 Mar 2026 at 17:45",
  lastTransactionShort: "Fri 13 Mar, 17:45",
  invoicedTo:       "15 Mar 2026",
  nextSync:         "Mon 16 Mar 2026 at 06:00",
  portalTime:       "Mon 16 Mar 2026 at 12:30",
};

const TABS = ["Overview", "Request a Quote", "Transaction History", "Documents", "Invoices", "Reports & Stats", "Support"];
const NAV  = [
  { icon:"◉", label:"My Account" },
  { icon:"📅", label:"Schedule"  },
  { icon:"📋", label:"History"   },
  { icon:"📄", label:"Documents" },
  { icon:"💳", label:"Invoices"  },
  { icon:"💬", label:"Support"   },
];

// ── Sub-components ────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const G = useTheme();
  const map = {
    "On Time":        { bg: G.pale,     color: G.mid,    dot: G.bright  },
    "Rescheduled":    { bg: G.amberPale,color: G.amber,  dot: G.amber   },
    "Scheduled":      { bg: G.bluePale, color: G.blue,   dot: G.blue    },
    "Active":         { bg: G.pale,     color: G.mid,    dot: G.bright  },
    "Pending Confirm":{ bg: "#FFF3E0",  color: "#E65100",dot: "#FF6D00" },
    "Paid":           { bg: G.pale,     color: G.mid,    dot: G.bright  },
    "Unpaid":         { bg: G.redPale,  color: G.red,    dot: G.red     },
  };
  const s = map[status] || { bg:"#eee", color:"#555", dot:"#888" };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5,
      background:s.bg, color:s.color, borderRadius:20,
      padding:"3px 10px", fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:s.dot, flexShrink:0 }}/>
      {status}
    </span>
  );
}

function SectionTitle({ children, action }) {
  const G = useTheme();
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
      <h3 style={{ fontSize:14, fontWeight:700, color:G.charcoal, fontFamily:"Outfit, sans-serif", letterSpacing:0.2 }}>{children}</h3>
      {action}
    </div>
  );
}

function Card({ children, style={} }) {
  const G = useTheme();
  return (
    <div className="fadeUp" style={{ background:G.white, borderRadius:14, padding:"16px 14px",
      boxShadow:"0 1px 4px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)",
      overflow:"hidden", minWidth:0, ...style }}>
      {children}
    </div>
  );
}

function DownloadBtn({ label="D-Note" }) {
  const G = useTheme();
  return (
    <button className="btn" style={{
      background:G.pale, color:G.mid, border:`1px solid ${G.paleMid}`,
      borderRadius:6, padding:"4px 10px", fontSize:11, fontWeight:700, cursor:"pointer",
      display:"inline-flex", alignItems:"center", gap:4 }}>
      ↓ {label}
    </button>
  );
}

// Sub-tab strip — used inside a section to show sub-options (top-bar style)
function SubTabs({ tabs, active, onChange }) {
  const G = useTheme();
  return (
    <div style={{ display:"flex", gap:6, marginBottom:2, flexWrap:"wrap" }}>
      {tabs.map((t, i) => (
        <button key={t} onClick={() => onChange(i)} className="btn" style={{
          border:"none", borderRadius:8, padding:"7px 16px", fontSize:12, fontWeight:700,
          cursor:"pointer",
          background: active===i ? G.mid : G.pale,
          color: active===i ? G.white : G.mid }}>
          {t}
        </button>
      ))}
    </div>
  );
}

// ── TAB CONTENT ───────────────────────────────────────────────────────────────
function OverviewTab({ onBook }) {
  const G = useTheme();
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>

      {/* Next service highlight */}
      <Card style={{ background:`linear-gradient(135deg, ${G.dark} 0%, ${G.mid} 100%)`, color:G.white, padding:"22px 26px" }}>
        <div style={{ fontSize:11, fontWeight:700, opacity:0.65, letterSpacing:1.5, marginBottom:8, fontFamily:"Outfit" }}>NEXT SCHEDULED SERVICE</div>
        <div style={{ fontSize:22, fontWeight:800, fontFamily:"Outfit", marginBottom:4 }}>Monday, 16 March 2026</div>
        <div style={{ opacity:0.8, fontSize:13, marginBottom:16 }}>General Waste + Recycling · 2 × 240L bins</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:16 }}>
          <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:8, padding:"8px 14px", fontSize:12 }}>
            <div style={{ opacity:0.65, fontSize:10, fontWeight:700, letterSpacing:1 }}>SERVICES THIS MONTH</div>
            <div style={{ fontWeight:800, fontSize:18, fontFamily:"Outfit" }}>6</div>
          </div>
          <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:8, padding:"8px 14px", fontSize:12 }}>
            <div style={{ opacity:0.65, fontSize:10, fontWeight:700, letterSpacing:1 }}>ON-TIME RATE</div>
            <div style={{ fontWeight:800, fontSize:18, fontFamily:"Outfit" }}>88%</div>
          </div>
        </div>
        <button onClick={onBook} className="btn" style={{
          background:G.lime, color:G.dark, border:"none", borderRadius:8,
          padding:"10px 20px", fontSize:13, fontWeight:800, cursor:"pointer",
          display:"inline-flex", alignItems:"center", gap:6 }}>
          📅 Book an Additional Service
        </button>
      </Card>

      {/* Active services */}
      <Card>
        <SectionTitle action={<span style={{ fontSize:11, color:G.muted }}>{ACTIVE_SERVICES.length} active</span>}>Your Active Services</SectionTitle>
        <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
          {ACTIVE_SERVICES.map((s, i) => (
            <div key={s.name} className="doc-row" style={{
              display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"11px 10px", gap:12, flexWrap:"wrap",
              borderBottom: i < ACTIVE_SERVICES.length-1 ? `1px solid ${G.hairline}` : "none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, flex:1, minWidth:200 }}>
                <div style={{ width:34, height:34, borderRadius:8, background:G.pale,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>♻️</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:G.charcoal }}>{s.name}</div>
                  <div style={{ fontSize:11, color:G.muted, marginTop:1 }}>{s.freq} · {s.bin}</div>
                </div>
              </div>
              <StatusBadge status={s.status}/>
            </div>
          ))}
        </div>
      </Card>

      {/* Account + upcoming side by side */}
      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>

        {/* Account info */}
        <Card style={{ flex:"1 1 200px", minWidth:200 }}>
          <SectionTitle>Account Details</SectionTitle>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {[
              { label:"Account", val:"WCP-00001" },
              { label:"Contract", val:"Commercial — Monthly" },
              { label:"Site", val:"Wastemart CP Prototype, Ndabeni" },
              { label:"Next Invoice", val:"01 Apr 2026" },
            ].map(r => (
              <div key={r.label} style={{ paddingBottom:10, borderBottom:`1px solid ${G.hairline}` }}>
                <div style={{ fontSize:10, fontWeight:700, color:G.muted, letterSpacing:0.8, textTransform:"uppercase", marginBottom:2 }}>{r.label}</div>
                <div style={{ fontSize:13, fontWeight:600, color:G.charcoal }}>{r.val}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming */}
        <Card style={{ flex:"2 1 300px" }}>
          <SectionTitle action={<span style={{ fontSize:11, color:G.muted }}>Next 14 days</span>}>Upcoming Services</SectionTitle>
          <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}><table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, minWidth:560 }}>
            <thead>
              <tr>
                {["Date","Service","Bin / Location","Status"].map(h => (
                  <th key={h} style={{ textAlign:"left", padding:"5px 8px", color:G.muted,
                    fontWeight:700, fontSize:10, textTransform:"uppercase", letterSpacing:0.8,
                    borderBottom:`2px solid ${G.hairline}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {UPCOMING.map((r,i) => (
                <tr key={r.id} className="hover-row" style={{ background: i%2===0 ? G.white : G.bg }}>
                  <td style={{ padding:"9px 8px", color:G.slate, fontWeight:500, whiteSpace:"nowrap" }}>{r.date}</td>
                  <td style={{ padding:"9px 8px", color:G.charcoal, fontWeight:600 }}>{r.type}</td>
                  <td style={{ padding:"9px 8px", color:G.muted, fontSize:11 }}>{r.bin}</td>
                  <td style={{ padding:"9px 8px" }}><StatusBadge status={r.status}/></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </Card>

      </div>

      {/* Recent activity */}
      <Card>
        <SectionTitle action={<DownloadBtn label="Export CSV"/>}>Recent Collections</SectionTitle>
        <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}><table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, minWidth:560 }}>
          <thead>
            <tr>
              {["Ref","Service Type","Bin","Scheduled","Actual","Status","D-Note"].map(h => (
                <th key={h} style={{ textAlign:"left", padding:"5px 8px", color:G.muted,
                  fontWeight:700, fontSize:10, textTransform:"uppercase", letterSpacing:0.8,
                  borderBottom:`2px solid ${G.hairline}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HISTORY.slice(0,4).map((r,i) => (
              <tr key={r.id} className="hover-row" style={{ background: i%2===0 ? G.white : G.bg }}>
                <td style={{ padding:"9px 8px", color:G.muted, fontFamily:"monospace", fontSize:11 }}>{r.id}</td>
                <td style={{ padding:"9px 8px", color:G.charcoal, fontWeight:600 }}>{r.type}</td>
                <td style={{ padding:"9px 8px", color:G.muted, fontSize:11 }}>{r.bin}</td>
                <td style={{ padding:"9px 8px", color:G.slate }}>{r.planned}</td>
                <td style={{ padding:"9px 8px", color: r.status==="Rescheduled" ? G.amber : G.slate }}>{r.actual}</td>
                <td style={{ padding:"9px 8px" }}><StatusBadge status={r.status}/></td>
                <td style={{ padding:"9px 8px" }}><DownloadBtn/></td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </Card>

    </div>
  );
}

function HistoryTab() {
  const G = useTheme();
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? HISTORY : HISTORY.filter(r => r.status === filter);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <Card>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:10 }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:G.charcoal, fontFamily:"Outfit" }}>Full Transaction History</h3>
          <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
            {["All","On Time","Rescheduled"].map(f => (
              <button key={f} onClick={() => setFilter(f)} className="btn" style={{
                padding:"5px 14px", border:"none", borderRadius:20, fontSize:11, fontWeight:700,
                cursor:"pointer",
                background: filter===f ? G.mid : G.pale,
                color: filter===f ? G.white : G.mid }}>
                {f}
              </button>
            ))}
            <DownloadBtn label="Export CSV"/>
          </div>
        </div>

        <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}><table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, minWidth:560 }}>
          <thead>
            <tr>
              {["Ref","Tracking / PO #","Service Type","Bin / Location","Scheduled","Actual","Status","Reason","D-Note"].map(h => (
                <th key={h} style={{ textAlign:"left", padding:"6px 8px", color:G.muted,
                  fontWeight:700, fontSize:10, textTransform:"uppercase", letterSpacing:0.8,
                  borderBottom:`2px solid ${G.hairline}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id} className="hover-row" style={{ background: i%2===0 ? G.white : G.bg }}>
                <td style={{ padding:"10px 8px", color:G.muted, fontFamily:"monospace", fontSize:11 }}>{r.id}</td>
                <td style={{ padding:"10px 8px", color:G.slate, fontFamily:"monospace", fontSize:11, fontWeight:600 }}>{r.track}</td>
                <td style={{ padding:"10px 8px", color:G.charcoal, fontWeight:600 }}>{r.type}</td>
                <td style={{ padding:"10px 8px", color:G.muted, fontSize:11 }}>{r.bin}</td>
                <td style={{ padding:"10px 8px", color:G.slate }}>{r.planned}</td>
                <td style={{ padding:"10px 8px", color: r.status==="Rescheduled" ? G.amber : G.slate, fontWeight: r.status==="Rescheduled" ? 600 : 400 }}>{r.actual}</td>
                <td style={{ padding:"10px 8px" }}><StatusBadge status={r.status}/></td>
                <td style={{ padding:"10px 8px", color:G.muted, fontSize:11, fontStyle: r.reason ? "normal" : "italic" }}>
                  {r.reason || "—"}
                </td>
                <td style={{ padding:"10px 8px" }}><DownloadBtn/></td>
              </tr>
            ))}
          </tbody>
        </table></div>

        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"40px", color:G.muted, fontSize:13 }}>
            No transactions matching this filter.
          </div>
        )}

        <div style={{ marginTop:14, padding:"12px 14px", background:G.bg, borderRadius:8, fontSize:12, color:G.muted, display:"flex", gap:24, flexWrap:"wrap" }}>
          <span><strong style={{ color:G.charcoal }}>Total shown:</strong> {filtered.length} transactions</span>
          <span><strong style={{ color:G.charcoal }}>On time:</strong> {filtered.filter(r=>r.status==="On Time").length}</span>
          <span><strong style={{ color:G.amber }}>Rescheduled:</strong> {filtered.filter(r=>r.status==="Rescheduled").length}</span>
          <span style={{ marginLeft:"auto" }}>Data retained for 3 years · <span style={{ color:G.mid, cursor:"pointer" }}>Request older records →</span></span>
        </div>
      </Card>
    </div>
  );
}

// Simple file list (name + meta + PDF download)
function DocList({ items }) {
  const G = useTheme();
  return (
    <>
      {items.map((d, i) => (
        <div key={i} className="doc-row" style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"11px 12px", borderRadius:8, gap:12, flexWrap:"wrap",
          borderBottom: i < items.length-1 ? `1px solid ${G.hairline}` : "none" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, flex:1 }}>
            <span style={{ fontSize:20 }}>📋</span>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:G.charcoal }}>{d.name}</div>
              <div style={{ fontSize:11, color:G.muted }}>{d.type} · {d.date}</div>
            </div>
          </div>
          <DownloadBtn label="PDF"/>
        </div>
      ))}
    </>
  );
}

function DocumentsTab() {
  const G = useTheme();
  const [sub, setSub] = useState(0);
  const dnotes = HISTORY.map(r => ({
    ref: r.dnote, date: r.actual, type: r.type, bin: r.bin, status: r.status
  }));

  const customerDocs = [
    { name:"Service Agreement — Wastemart CP Prototype", date:"Jan 2024", type:"Contract" },
    { name:"Waste Management Schedule (Current)",        date:"Mar 2026", type:"Schedule" },
    { name:"POPI Consent & Data Processing Agreement",   date:"2024",     type:"POPI"     },
    { name:"Customer Terms & Conditions",                date:"2024",     type:"T&Cs"     },
  ];
  const genericDocs = [
    { name:"WasteMart Company Profile",            date:"2026", type:"Profile"     },
    { name:"B-BBEE Certificate",                   date:"2025", type:"B-BBEE"      },
    { name:"ISO 14001:2015 Certificate",           date:"2025", type:"Certificate" },
    { name:"ISO 45001:2018 Certificate",           date:"2025", type:"Certificate" },
    { name:"Environmental & Safe Disposal Policy", date:"2025", type:"Policy"      },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <SubTabs tabs={["Customer-Specific","Generic"]} active={sub} onChange={setSub}/>

      {sub===0 && <>
        <Card>
          <SectionTitle action={
            <div style={{ display:"flex", gap:8 }}>
              <input placeholder="Search documents..." style={{
                border:`1px solid ${G.hairline}`, borderRadius:8, padding:"6px 12px",
                fontSize:12, color:G.charcoal, outline:"none", width:180 }}/>
            </div>
          }>
            Delivery Notes (D-Notes)
          </SectionTitle>
          <p style={{ fontSize:12, color:G.muted, marginBottom:16 }}>
            Every completed service generates a signed delivery note. Download individual D-Notes or request a bulk export.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
            {dnotes.map((d, i) => (
              <div key={d.ref} className="doc-row" style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"12px 12px", borderRadius:8, gap:12, flexWrap:"wrap",
                borderBottom: i < dnotes.length-1 ? `1px solid ${G.hairline}` : "none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, flex:1, minWidth:200 }}>
                  <div style={{ width:36, height:36, borderRadius:8, background:G.pale,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                    📄
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:G.charcoal, fontFamily:"monospace" }}>{d.ref}</div>
                    <div style={{ fontSize:11, color:G.muted, marginTop:1 }}>{d.type} · {d.bin}</div>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                  <span style={{ fontSize:11, color:G.muted }}>{d.date}</span>
                  <StatusBadge status={d.status}/>
                  <DownloadBtn label="PDF"/>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:16, textAlign:"center" }}>
            <button className="btn" style={{
              background:G.pale, color:G.mid, border:`1px solid ${G.paleMid}`,
              borderRadius:8, padding:"9px 20px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              ↓ Download All D-Notes (ZIP)
            </button>
          </div>
        </Card>

        <Card>
          <SectionTitle>Contract &amp; Account Documents</SectionTitle>
          <p style={{ fontSize:12, color:G.muted, marginBottom:14 }}>
            Documents specific to your account — contracts, POPI consent and your terms of service.
          </p>
          <DocList items={customerDocs}/>
        </Card>
      </>}

      {sub===1 && (
        <Card>
          <SectionTitle>Company &amp; Compliance Documents</SectionTitle>
          <p style={{ fontSize:12, color:G.muted, marginBottom:14 }}>
            General WasteMart documents shared across all customers — company profile, B-BBEE and compliance certificates.
          </p>
          <DocList items={genericDocs}/>
        </Card>
      )}
    </div>
  );
}

function InvoicesTab() {
  const G = useTheme();
  const [sub, setSub] = useState(0);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

      <SubTabs tabs={["Invoices","Statements"]} active={sub} onChange={setSub}/>

      {sub===0 && (
      <Card>
        <SectionTitle action={<DownloadBtn label="Export CSV"/>}>Invoice History</SectionTitle>
        <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}><table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, minWidth:560 }}>
          <thead>
            <tr>
              {["Invoice #","Date","Due Date","Description","Amount","Status",""].map(h => (
                <th key={h} style={{ textAlign:"left", padding:"5px 8px", color:G.muted,
                  fontWeight:700, fontSize:10, textTransform:"uppercase", letterSpacing:0.8,
                  borderBottom:`2px solid ${G.hairline}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INVOICES.map((inv, i) => (
              <tr key={inv.inv} className="hover-row" style={{ background: i%2===0 ? G.white : G.bg }}>
                <td style={{ padding:"10px 8px", color:G.mid, fontWeight:700, fontFamily:"monospace", fontSize:11 }}>{inv.inv}</td>
                <td style={{ padding:"10px 8px", color:G.slate }}>{inv.date}</td>
                <td style={{ padding:"10px 8px", color: inv.status==="Unpaid" ? G.red : G.slate, fontWeight: inv.status==="Unpaid" ? 600 : 400 }}>{inv.due}</td>
                <td style={{ padding:"10px 8px", color:G.charcoal }}>{inv.desc}</td>
                <td style={{ padding:"10px 8px", color:G.charcoal, fontWeight:700 }}>{inv.amount}</td>
                <td style={{ padding:"10px 8px" }}><StatusBadge status={inv.status}/></td>
                <td style={{ padding:"10px 8px" }}><DownloadBtn label="PDF"/></td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </Card>
      )}

      {sub===1 && (
      <Card>
        <SectionTitle action={<DownloadBtn label="Export Statement"/>}>Account Statements</SectionTitle>
        <p style={{ fontSize:12, color:G.muted, marginBottom:16 }}>
          Monthly account statements showing opening and closing balances. Download a statement for any period.
        </p>
        <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}><table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, minWidth:520 }}>
          <thead>
            <tr>
              {["Statement #","Period","Issued","Opening Balance","Closing Balance",""].map(h => (
                <th key={h} style={{ textAlign:"left", padding:"5px 8px", color:G.muted,
                  fontWeight:700, fontSize:10, textTransform:"uppercase", letterSpacing:0.8,
                  borderBottom:`2px solid ${G.hairline}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STATEMENTS.map((s, i) => (
              <tr key={s.ref} className="hover-row" style={{ background: i%2===0 ? G.white : G.bg }}>
                <td style={{ padding:"10px 8px", color:G.mid, fontWeight:700, fontFamily:"monospace", fontSize:11 }}>{s.ref}</td>
                <td style={{ padding:"10px 8px", color:G.charcoal, fontWeight:600 }}>{s.period}</td>
                <td style={{ padding:"10px 8px", color:G.slate }}>{s.date}</td>
                <td style={{ padding:"10px 8px", color:G.slate }}>{s.opening}</td>
                <td style={{ padding:"10px 8px", color:G.charcoal, fontWeight:700 }}>{s.closing}</td>
                <td style={{ padding:"10px 8px" }}><DownloadBtn label="PDF"/></td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </Card>
      )}
    </div>
  );
}

function SupportTab() {
  const G = useTheme();
  const [sub, setSub] = useState(0);
  const [rating, setRating] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

      <SubTabs tabs={["Log a query","Contact us"]} active={sub} onChange={setSub}/>

      {/* Log a query */}
      {sub===0 && (
      <div style={{ display:"flex", flexDirection:"column", gap:16, maxWidth:640 }}>

        {/* Rate service */}
        <Card>
          <SectionTitle>Rate Our Service</SectionTitle>
          <p style={{ fontSize:12, color:G.muted, marginBottom:18 }}>How did we do this month? Your feedback helps us improve.</p>
          {!submitted ? (
            <>
              <div style={{ display:"flex", gap:14, justifyContent:"center", marginBottom:20 }}>
                {[
                  { label:"Excellent", emoji:"😄", color:G.mid,   bg:G.pale     },
                  { label:"Good",      emoji:"😊", color:G.bright, bg:G.pale     },
                  { label:"Average",   emoji:"😐", color:"#E65100",bg:"#FFF3E0"  },
                  { label:"Poor",      emoji:"😞", color:G.red,    bg:G.redPale  },
                ].map(r => (
                  <div key={r.label} onClick={() => setRating(r.label)} style={{
                    display:"flex", flexDirection:"column", alignItems:"center", gap:6, cursor:"pointer",
                    opacity: rating && rating !== r.label ? 0.35 : 1,
                    transform: rating===r.label ? "scale(1.15)" : "scale(1)",
                    transition:"all 0.2s" }}>
                    <div style={{
                      width:54, height:54, borderRadius:"50%", fontSize:26,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      background: rating===r.label ? r.bg : G.bg,
                      border: `2.5px solid ${rating===r.label ? r.color : "transparent"}`,
                      boxShadow: rating===r.label ? `0 4px 14px ${r.color}35` : "none" }}>
                      {r.emoji}
                    </div>
                    <span style={{ fontSize:11, fontWeight:600, color: rating===r.label ? r.color : G.muted }}>{r.label}</span>
                  </div>
                ))}
              </div>
              <textarea value={message} onChange={e => setMessage(e.target.value)}
                placeholder="Add a comment (optional)..."
                style={{ width:"100%", border:`1px solid ${G.hairline}`, borderRadius:8,
                  padding:"10px 12px", fontSize:12, color:G.charcoal, resize:"vertical",
                  minHeight:72, outline:"none", fontFamily:"DM Sans, sans-serif" }}/>
              <button onClick={() => { if(rating) setSubmitted(true); }} className="btn" style={{
                marginTop:10, width:"100%", background: rating ? G.mid : G.paleMid,
                color: rating ? G.white : G.muted, border:"none", borderRadius:8,
                padding:"10px", fontSize:13, fontWeight:700, cursor: rating ? "pointer" : "default" }}>
                Submit Rating
              </button>
            </>
          ) : (
            <div style={{ textAlign:"center", padding:"20px 0" }}>
              <div style={{ fontSize:36, marginBottom:10 }}>✅</div>
              <div style={{ fontWeight:700, color:G.mid, fontSize:15, fontFamily:"Outfit" }}>Thank you for your feedback!</div>
              <div style={{ color:G.muted, fontSize:12, marginTop:4 }}>Rated: <strong>{rating}</strong></div>
            </div>
          )}
        </Card>

        {/* Log a request */}
        <Card>
          <SectionTitle>Log a Service Request</SectionTitle>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[
              { icon:"🗑️", label:"Request additional collection" },
              { icon:"🚛", label:"Report a missed collection"    },
              { icon:"➕", label:"Request a new bin"             },
              { icon:"📦", label:"Request bin removal"           },
              { icon:"❓", label:"Other query"                   },
            ].map(item => (
              <div key={item.label} style={{
                display:"flex", alignItems:"center", gap:12,
                padding:"10px 12px", borderRadius:8, cursor:"pointer",
                border:`1px solid ${G.hairline}`, background:G.white,
                transition:"all 0.15s" }}
                className="doc-row">
                <span style={{ fontSize:18 }}>{item.icon}</span>
                <span style={{ fontSize:13, fontWeight:500, color:G.charcoal }}>{item.label}</span>
                <span style={{ marginLeft:"auto", color:G.light, fontSize:16 }}>→</span>
              </div>
            ))}
          </div>
        </Card>

      </div>
      )}

      {/* Contact us */}
      {sub===1 && (
      <div style={{ display:"flex", gap:18, flexWrap:"wrap", alignItems:"flex-start" }}>
        <Card style={{ flex:"2 1 300px" }}>
          <SectionTitle>Your Contacts</SectionTitle>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {CONTACTS.map((c, i) => (
              <div key={i} style={{ paddingBottom:14, borderBottom: i<CONTACTS.length-1 ? `1px solid ${G.hairline}` : "none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                  <div style={{ width:34, height:34, borderRadius:"50%", background:G.pale,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>👤</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:13, color:G.charcoal }}>{c.name}</div>
                    <div style={{ fontSize:11, color:G.muted }}>{c.role}</div>
                  </div>
                </div>
                <div style={{ fontSize:11, color:G.mid, paddingLeft:44 }}>📞 {c.phone}</div>
                <div style={{ fontSize:11, color:G.mid, paddingLeft:44, marginTop:2 }}>✉️ {c.email}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ flex:"1 1 220px" }}>
          <SectionTitle>Emergency Line</SectionTitle>
          <div style={{ textAlign:"center", padding:"10px 0" }}>
            <div style={{ fontSize:28, marginBottom:6 }}>🚨</div>
            <div style={{ fontSize:20, fontWeight:800, color:G.mid, fontFamily:"Outfit" }}>+27 21 555 0199</div>
            <div style={{ fontSize:11, color:G.muted, marginTop:4 }}>24/7 · Hazardous waste &amp; urgent collections</div>
          </div>
        </Card>
      </div>
      )}

    </div>
  );
}

// ── Data Freshness Bar ────────────────────────────────────────────────────────
function DataFreshnessBar() {
  const G = useTheme();
  return (
    <div style={{ background:"#F0F4F0", borderBottom:`1px solid ${G.hairline}`,
      padding:"6px 16px", display:"flex", gap:6, alignItems:"center", flexWrap:"wrap",
      fontSize:11, color:G.muted, flexShrink:0 }}>
      <span style={{ display:"inline-flex", alignItems:"center", gap:4 }}>
        <span style={{ width:7, height:7, borderRadius:"50%", background:G.bright, display:"inline-block" }}/>
        <strong style={{ color:G.slate }}>Data current as of:</strong>&nbsp;{DATA_STATUS.lastTransactionShort}
      </span>
      <span style={{ color:G.hairline, padding:"0 4px" }}>|</span>
      <span><strong style={{ color:G.slate }}>Invoiced to:</strong>&nbsp;{DATA_STATUS.invoicedTo}</span>
      <span style={{ color:G.hairline, padding:"0 4px" }}>|</span>
      <span>Next refresh: {DATA_STATUS.nextSync}</span>
    </div>
  );
}

// ── Booking Modal ─────────────────────────────────────────────────────────────
function BookingModal({ onClose }) {
  const G = useTheme();
  const [step, setStep] = useState(1);
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const serviceTypes = [
    { icon:"🗑️", label:"General Waste Collection" },
    { icon:"♻️", label:"Recycling Collection"      },
    { icon:"➕", label:"Additional Bin Request"    },
    { icon:"📦", label:"Bin Removal"               },
    { icon:"⚠️", label:"Hazardous Waste Pickup"    },
  ];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:1000,
      display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}
      onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:G.white, borderRadius:16, width:"100%", maxWidth:440,
        boxShadow:"0 24px 60px rgba(0,0,0,0.25)", overflow:"hidden" }}>

        {/* Header */}
        <div style={{ background:`linear-gradient(135deg, ${G.dark}, ${G.mid})`, padding:"18px 20px",
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ color:"rgba(255,255,255,0.6)", fontSize:10, fontWeight:700, letterSpacing:1.5, marginBottom:3 }}>
              BOOK A SERVICE
            </div>
            <div style={{ color:G.white, fontSize:16, fontWeight:800, fontFamily:"Outfit" }}>
              {step===1 ? "Select Service Type" : step===2 ? "Choose a Date" : "Confirm Booking"}
            </div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.15)", border:"none",
            borderRadius:8, color:"#fff", fontSize:18, width:34, height:34, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>

        {/* Progress */}
        <div style={{ display:"flex", background:"#f5f5f5" }}>
          {["Service","Date","Confirm"].map((s,i) => (
            <div key={s} style={{ flex:1, padding:"8px", textAlign:"center", fontSize:10, fontWeight:700,
              color: step>i ? G.mid : step===i+1 ? G.charcoal : G.muted,
              borderBottom: step===i+1 ? `2.5px solid ${G.mid}` : "2.5px solid transparent" }}>
              {i+1}. {s}
            </div>
          ))}
        </div>

        <div style={{ padding:"20px" }}>
          {step===1 && (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {serviceTypes.map(s => (
                <div key={s.label} onClick={() => setType(s.label)} style={{
                  display:"flex", alignItems:"center", gap:12, padding:"11px 14px",
                  borderRadius:8, cursor:"pointer", transition:"all 0.15s",
                  border:`2px solid ${type===s.label ? G.mid : G.hairline}`,
                  background: type===s.label ? G.pale : G.white }}>
                  <span style={{ fontSize:18 }}>{s.icon}</span>
                  <span style={{ fontSize:13, fontWeight: type===s.label ? 700 : 500,
                    color: type===s.label ? G.mid : G.charcoal }}>{s.label}</span>
                  {type===s.label && <span style={{ marginLeft:"auto", color:G.mid, fontWeight:700 }}>✓</span>}
                </div>
              ))}
              <button onClick={() => { if(type) setStep(2); }} className="btn" style={{
                marginTop:8, background: type ? G.mid : G.paleMid, color: type ? G.white : G.muted,
                border:"none", borderRadius:8, padding:"11px", fontSize:13, fontWeight:700,
                cursor: type ? "pointer" : "default", width:"100%" }}>
                Next →
              </button>
            </div>
          )}

          {step===2 && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ fontSize:12, color:G.muted, marginBottom:4 }}>
                <strong style={{ color:G.charcoal }}>Service:</strong> {type}
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:G.muted, letterSpacing:0.8,
                  textTransform:"uppercase", display:"block", marginBottom:6 }}>Preferred Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  style={{ width:"100%", border:`1px solid ${G.hairline}`, borderRadius:8,
                    padding:"10px 12px", fontSize:13, color:G.charcoal, outline:"none",
                    fontFamily:"DM Sans, sans-serif" }}/>
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:G.muted, letterSpacing:0.8,
                  textTransform:"uppercase", display:"block", marginBottom:6 }}>Notes (optional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Access instructions, bin location, special requirements..."
                  style={{ width:"100%", border:`1px solid ${G.hairline}`, borderRadius:8,
                    padding:"10px 12px", fontSize:12, color:G.charcoal, resize:"vertical",
                    minHeight:72, outline:"none", fontFamily:"DM Sans, sans-serif" }}/>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={() => setStep(1)} className="btn" style={{
                  flex:1, background:G.pale, color:G.mid, border:`1px solid ${G.paleMid}`,
                  borderRadius:8, padding:"10px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                  ← Back
                </button>
                <button onClick={() => { if(date) setStep(3); }} className="btn" style={{
                  flex:2, background: date ? G.mid : G.paleMid, color: date ? G.white : G.muted,
                  border:"none", borderRadius:8, padding:"10px", fontSize:13, fontWeight:700,
                  cursor: date ? "pointer" : "default" }}>
                  Review →
                </button>
              </div>
            </div>
          )}

          {step===3 && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ background:G.pale, borderRadius:10, padding:"14px 16px",
                border:`1px solid ${G.paleMid}` }}>
                <div style={{ fontSize:11, fontWeight:700, color:G.muted, textTransform:"uppercase",
                  letterSpacing:0.8, marginBottom:10 }}>Booking Summary</div>
                {[
                  { label:"Service",  val: type },
                  { label:"Date",     val: date },
                  { label:"Account",  val: "WCP-00001 · Wastemart CP Prototype" },
                  { label:"Notes",    val: notes || "None" },
                ].map(r => (
                  <div key={r.label} style={{ display:"flex", gap:12, marginBottom:7, fontSize:12 }}>
                    <span style={{ color:G.muted, width:60, flexShrink:0 }}>{r.label}</span>
                    <span style={{ color:G.charcoal, fontWeight:600 }}>{r.val}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:11, color:G.muted, textAlign:"center" }}>
                WasteMart will confirm this booking within 1 business day.
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={() => setStep(2)} className="btn" style={{
                  flex:1, background:G.pale, color:G.mid, border:`1px solid ${G.paleMid}`,
                  borderRadius:8, padding:"10px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                  ← Back
                </button>
                <button onClick={onClose} className="btn" style={{
                  flex:2, background:G.mid, color:G.white, border:"none",
                  borderRadius:8, padding:"10px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                  ✓ Submit Booking
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Reports & Stats Tab ───────────────────────────────────────────────────────
function ReportsTab() {
  const G = useTheme();
  const [sub, setSub] = useState(0);
  const [fromDate, setFromDate] = useState("2025-10-01");
  const [toDate,   setToDate]   = useState("2026-03-13");
  const [generated, setGenerated] = useState(true);
  const [reqFormat, setReqFormat] = useState("PDF");
  const [reqEmail,  setReqEmail]  = useState("");
  const [reqSent,   setReqSent]   = useState(false);

  const wasteData = [
    { month:"Oct 25", general:2800, recycling:1200, hazardous:280, organic:520, glass:340 },
    { month:"Nov 25", general:2650, recycling:1350, hazardous:210, organic:490, glass:310 },
    { month:"Dec 25", general:1800, recycling:980,  hazardous:150, organic:320, glass:220 },
    { month:"Jan 26", general:2400, recycling:1100, hazardous:240, organic:435, glass:290 },
    { month:"Feb 26", general:2750, recycling:1420, hazardous:290, organic:510, glass:360 },
    { month:"Mar 26", general:1200, recycling:680,  hazardous:120, organic:240, glass:160 },
  ];

  const totals = wasteData.reduce((acc, m) => ({
    general:   acc.general   + m.general,
    recycling: acc.recycling + m.recycling,
    hazardous: acc.hazardous + m.hazardous,
    organic:   acc.organic   + m.organic,
    glass:     acc.glass     + m.glass,
  }), { general:0, recycling:0, hazardous:0, organic:0, glass:0 });

  const totalAll = totals.general + totals.recycling + totals.hazardous + totals.organic + totals.glass;

  const streams = [
    { label:"General Waste",  key:"general",   color:G.slate,   icon:"🗑️" },
    { label:"Recycling",      key:"recycling",  color:G.bright,  icon:"♻️" },
    { label:"Hazardous",      key:"hazardous",  color:"#E65100", icon:"⚠️" },
    { label:"Food / Organic", key:"organic",    color:G.amber,   icon:"🌿" },
    { label:"Glass",          key:"glass",      color:"#5C6BC0", icon:"🫙" },
  ];

  // Simple bar chart using divs
  const maxMonth = Math.max(...wasteData.map(m => m.general + m.recycling + m.hazardous + m.organic));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

      <SubTabs tabs={["View on screen","Request report"]} active={sub} onChange={setSub}/>

      {sub===0 && <>

      {/* Date range filter */}
      <Card>
        <SectionTitle>Select Report Period</SectionTitle>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap", alignItems:"flex-end" }}>
          <div style={{ flex:"1 1 140px" }}>
            <label style={{ fontSize:10, fontWeight:700, color:G.muted, letterSpacing:0.8,
              textTransform:"uppercase", display:"block", marginBottom:5 }}>From</label>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
              style={{ width:"100%", border:`1px solid ${G.hairline}`, borderRadius:8,
                padding:"9px 12px", fontSize:13, color:G.charcoal, outline:"none", fontFamily:"DM Sans, sans-serif" }}/>
          </div>
          <div style={{ flex:"1 1 140px" }}>
            <label style={{ fontSize:10, fontWeight:700, color:G.muted, letterSpacing:0.8,
              textTransform:"uppercase", display:"block", marginBottom:5 }}>To</label>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
              style={{ width:"100%", border:`1px solid ${G.hairline}`, borderRadius:8,
                padding:"9px 12px", fontSize:13, color:G.charcoal, outline:"none", fontFamily:"DM Sans, sans-serif" }}/>
          </div>
          <button onClick={() => setGenerated(true)} className="btn" style={{
            background:G.mid, color:G.white, border:"none", borderRadius:8,
            padding:"10px 20px", fontSize:13, fontWeight:700, cursor:"pointer", flexShrink:0 }}>
            Generate Report
          </button>
          <button className="btn" style={{
            background:G.pale, color:G.mid, border:`1px solid ${G.paleMid}`, borderRadius:8,
            padding:"10px 16px", fontSize:12, fontWeight:700, cursor:"pointer", flexShrink:0 }}>
            ↓ Export PDF
          </button>
        </div>
        <div style={{ marginTop:10, fontSize:11, color:G.muted }}>
          Data current as of <strong style={{ color:G.slate }}>{DATA_STATUS.lastTransactionShort}</strong>
          {" · "}Invoiced to <strong style={{ color:G.slate }}>{DATA_STATUS.invoicedTo}</strong>
        </div>
      </Card>

      {generated && <>

        {/* Summary KPIs */}
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          {streams.map(s => (
            <div key={s.key} style={{ flex:"1 1 120px", background:G.white, borderRadius:12,
              padding:"14px 16px", boxShadow:"0 1px 4px rgba(0,0,0,0.07)",
              borderLeft:`4px solid ${s.color}` }}>
              <div style={{ fontSize:10, fontWeight:700, color:G.muted, textTransform:"uppercase",
                letterSpacing:0.8, marginBottom:5 }}>{s.icon} {s.label}</div>
              <div style={{ fontSize:22, fontWeight:800, color:G.charcoal, fontFamily:"Outfit" }}>
                {totals[s.key].toLocaleString()}
              </div>
              <div style={{ fontSize:11, color:G.muted }}>kg total</div>
              <div style={{ marginTop:6, fontSize:11, fontWeight:700,
                color:s.color }}>{Math.round(totals[s.key]/totalAll*100)}% of waste</div>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <Card>
          <SectionTitle>Monthly Waste Volume by Type</SectionTitle>
          <div style={{ display:"flex", gap:10, marginBottom:12, flexWrap:"wrap" }}>
            {streams.map(s => (
              <div key={s.key} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11 }}>
                <div style={{ width:10, height:10, borderRadius:2, background:s.color }}/>
                <span style={{ color:G.muted }}>{s.label}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:6, alignItems:"flex-end", height:180 }}>
            {wasteData.map(m => {
              return (
                <div key={m.month} style={{ flex:1, display:"flex", flexDirection:"column",
                  alignItems:"center", gap:4 }}>
                  <div style={{ width:"100%", display:"flex", flexDirection:"column",
                    justifyContent:"flex-end", height:152, gap:1 }}>
                    {streams.map(s => (
                      <div key={s.key} style={{
                        width:"100%", background:s.color, opacity:0.85,
                        height: `${(m[s.key]/maxMonth)*148}px`,
                        borderRadius: s.key==="general" ? "3px 3px 0 0" : 0,
                        minHeight: m[s.key] > 0 ? 2 : 0,
                        transition:"height 0.5s ease"
                      }}/>
                    )).reverse()}
                  </div>
                  <div style={{ fontSize:10, color:G.muted, textAlign:"center" }}>{m.month}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recycling rate */}
        <Card>
          <SectionTitle>Recycling Rate by Month</SectionTitle>
          <div style={{ display:"flex", gap:6, alignItems:"flex-end", height:120 }}>
            {wasteData.map(m => {
              const total = m.general + m.recycling + m.hazardous + m.organic;
              const rate = Math.round(m.recycling / total * 100);
              return (
                <div key={m.month} style={{ flex:1, display:"flex", flexDirection:"column",
                  alignItems:"center", gap:4 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:G.mid }}>{rate}%</div>
                  <div style={{ width:"100%", background:G.hairline, borderRadius:4, height:80,
                    display:"flex", flexDirection:"column", justifyContent:"flex-end", overflow:"hidden" }}>
                    <div style={{ width:"100%", background:G.bright, borderRadius:"3px 3px 0 0",
                      height:`${rate}%`, transition:"height 0.5s ease" }}/>
                  </div>
                  <div style={{ fontSize:10, color:G.muted }}>{m.month}</div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop:12, padding:"10px 12px", background:G.pale, borderRadius:8,
            fontSize:12, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
            <span style={{ color:G.charcoal }}>
              Period average: <strong style={{ color:G.mid }}>
                {Math.round(totals.recycling / totalAll * 100)}% recycled
              </strong>
            </span>
            <span style={{ color:G.muted }}>
              Target: <strong>30%</strong>
            </span>
          </div>
        </Card>

        {/* Detailed table */}
        <Card>
          <SectionTitle action={<DownloadBtn label="Export CSV"/>}>
            Monthly Breakdown Detail
          </SectionTitle>
          <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, minWidth:560 }}>
              <thead>
                <tr>
                  {["Month","General (kg)","Recycling (kg)","Hazardous (kg)","Organic (kg)","Glass (kg)","Total (kg)","Recycling %"].map(h => (
                    <th key={h} style={{ textAlign:"left", padding:"6px 8px", color:G.muted,
                      fontWeight:700, fontSize:10, textTransform:"uppercase", letterSpacing:0.8,
                      borderBottom:`2px solid ${G.hairline}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {wasteData.map((m, i) => {
                  const total = m.general + m.recycling + m.hazardous + m.organic;
                  const rate  = Math.round(m.recycling / total * 100);
                  return (
                    <tr key={m.month} className="hover-row" style={{ background: i%2===0 ? G.white : G.bg }}>
                      <td style={{ padding:"9px 8px", fontWeight:600, color:G.charcoal }}>{m.month}</td>
                      <td style={{ padding:"9px 8px", color:G.slate }}>{m.general.toLocaleString()}</td>
                      <td style={{ padding:"9px 8px", color:G.mid, fontWeight:600 }}>{m.recycling.toLocaleString()}</td>
                      <td style={{ padding:"9px 8px", color:"#E65100" }}>{m.hazardous.toLocaleString()}</td>
                      <td style={{ padding:"9px 8px", color:G.amber }}>{m.organic.toLocaleString()}</td>
                      <td style={{ padding:"9px 8px", color:"#5C6BC0" }}>{m.glass.toLocaleString()}</td>
                      <td style={{ padding:"9px 8px", fontWeight:700, color:G.charcoal }}>{total.toLocaleString()}</td>
                      <td style={{ padding:"9px 8px" }}>
                        <span style={{ color: rate>=30 ? G.mid : G.amber, fontWeight:700 }}>{rate}%</span>
                      </td>
                    </tr>
                  );
                })}
                <tr style={{ borderTop:`2px solid ${G.hairline}`, background:G.pale }}>
                  <td style={{ padding:"10px 8px", fontWeight:800, color:G.charcoal }}>TOTAL</td>
                  <td style={{ padding:"10px 8px", fontWeight:700 }}>{totals.general.toLocaleString()}</td>
                  <td style={{ padding:"10px 8px", fontWeight:700, color:G.mid }}>{totals.recycling.toLocaleString()}</td>
                  <td style={{ padding:"10px 8px", fontWeight:700, color:"#E65100" }}>{totals.hazardous.toLocaleString()}</td>
                  <td style={{ padding:"10px 8px", fontWeight:700, color:G.amber }}>{totals.organic.toLocaleString()}</td>
                  <td style={{ padding:"10px 8px", fontWeight:700, color:"#5C6BC0" }}>{totals.glass.toLocaleString()}</td>
                  <td style={{ padding:"10px 8px", fontWeight:800, color:G.charcoal }}>{totalAll.toLocaleString()}</td>
                  <td style={{ padding:"10px 8px", fontWeight:800, color:G.mid }}>
                    {Math.round(totals.recycling/totalAll*100)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

      </>}

      </>}

      {sub===1 && (
      <Card>
        <SectionTitle>Request a Report</SectionTitle>
        <p style={{ fontSize:12, color:G.muted, marginBottom:18 }}>
          Generate a report for a chosen period and have it exported or emailed to you. WasteMart will prepare it and send it through.
        </p>
        {!reqSent ? (
          <div style={{ display:"flex", flexDirection:"column", gap:14, maxWidth:460 }}>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <div style={{ flex:"1 1 140px" }}>
                <label style={{ fontSize:10, fontWeight:700, color:G.muted, letterSpacing:0.8,
                  textTransform:"uppercase", display:"block", marginBottom:5 }}>From</label>
                <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                  style={{ width:"100%", border:`1px solid ${G.hairline}`, borderRadius:8,
                    padding:"9px 12px", fontSize:13, color:G.charcoal, outline:"none", fontFamily:"DM Sans, sans-serif" }}/>
              </div>
              <div style={{ flex:"1 1 140px" }}>
                <label style={{ fontSize:10, fontWeight:700, color:G.muted, letterSpacing:0.8,
                  textTransform:"uppercase", display:"block", marginBottom:5 }}>To</label>
                <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                  style={{ width:"100%", border:`1px solid ${G.hairline}`, borderRadius:8,
                    padding:"9px 12px", fontSize:13, color:G.charcoal, outline:"none", fontFamily:"DM Sans, sans-serif" }}/>
              </div>
            </div>
            <div>
              <label style={{ fontSize:10, fontWeight:700, color:G.muted, letterSpacing:0.8,
                textTransform:"uppercase", display:"block", marginBottom:6 }}>Format</label>
              <div style={{ display:"flex", gap:8 }}>
                {["PDF","Excel (CSV)"].map(f => (
                  <button key={f} onClick={() => setReqFormat(f)} className="btn" style={{
                    border:"none", borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer",
                    background: reqFormat===f ? G.mid : G.pale, color: reqFormat===f ? G.white : G.mid }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize:10, fontWeight:700, color:G.muted, letterSpacing:0.8,
                textTransform:"uppercase", display:"block", marginBottom:6 }}>Email report to</label>
              <input type="email" value={reqEmail} onChange={e => setReqEmail(e.target.value)}
                placeholder="you@company.co.za"
                style={{ width:"100%", border:`1px solid ${G.hairline}`, borderRadius:8,
                  padding:"10px 12px", fontSize:13, color:G.charcoal, outline:"none", fontFamily:"DM Sans, sans-serif" }}/>
            </div>
            <button onClick={() => setReqSent(true)} className="btn" style={{
              background:G.mid, color:G.white, border:"none", borderRadius:8,
              padding:"11px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
              Request Report
            </button>
          </div>
        ) : (
          <div style={{ textAlign:"center", padding:"24px 0" }}>
            <div style={{ fontSize:36, marginBottom:10 }}>✅</div>
            <div style={{ fontWeight:700, color:G.mid, fontSize:15, fontFamily:"Outfit" }}>Report requested</div>
            <div style={{ color:G.muted, fontSize:12, marginTop:4 }}>
              We'll prepare your {reqFormat} report and {reqEmail ? `email it to ${reqEmail}` : "make it available shortly"}.
            </div>
          </div>
        )}
      </Card>
      )}
    </div>
  );
}

// ── Request a Quote Tab ───────────────────────────────────────────────────────
function QuoteTab() {
  const G = useTheme();
  const [services, setServices] = useState([]);
  const [freq, setFreq] = useState("");
  const [site, setSite] = useState("");
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);

  const serviceOptions = [
    { icon:"🗑️", label:"General Waste Collection" },
    { icon:"♻️", label:"Recycling Collection"      },
    { icon:"➕", label:"Additional Bin"             },
    { icon:"⚠️", label:"Hazardous Waste"            },
    { icon:"🌿", label:"Food / Organic Waste"       },
    { icon:"🫙", label:"Glass Collection"           },
  ];
  const toggle = (label) =>
    setServices(s => s.includes(label) ? s.filter(x => x !== label) : [...s, label]);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <Card>
        <SectionTitle>Request a New Quote</SectionTitle>
        <p style={{ fontSize:12, color:G.muted, marginBottom:18 }}>
          Tell us what you need and our team will prepare a tailored quote. This does not book a service — it starts a quote request.
        </p>

        {!sent ? (
          <div style={{ display:"flex", flexDirection:"column", gap:18, maxWidth:560 }}>
            <div>
              <label style={{ fontSize:10, fontWeight:700, color:G.muted, letterSpacing:0.8,
                textTransform:"uppercase", display:"block", marginBottom:8 }}>Services required</label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {serviceOptions.map(s => {
                  const on = services.includes(s.label);
                  return (
                    <div key={s.label} onClick={() => toggle(s.label)} style={{
                      display:"flex", alignItems:"center", gap:8, padding:"9px 14px",
                      borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600,
                      border:`2px solid ${on ? G.mid : G.hairline}`,
                      background: on ? G.pale : G.white, color: on ? G.mid : G.charcoal }}>
                      <span style={{ fontSize:15 }}>{s.icon}</span>{s.label}
                      {on && <span style={{ color:G.mid, fontWeight:700 }}>✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{ fontSize:10, fontWeight:700, color:G.muted, letterSpacing:0.8,
                textTransform:"uppercase", display:"block", marginBottom:6 }}>Expected frequency</label>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {["Once-off","Weekly","Fortnightly","Monthly"].map(f => (
                  <button key={f} onClick={() => setFreq(f)} className="btn" style={{
                    border:"none", borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer",
                    background: freq===f ? G.mid : G.pale, color: freq===f ? G.white : G.mid }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize:10, fontWeight:700, color:G.muted, letterSpacing:0.8,
                textTransform:"uppercase", display:"block", marginBottom:6 }}>Site / collection address</label>
              <input value={site} onChange={e => setSite(e.target.value)}
                placeholder="e.g. Wastemart CP Prototype, Ndabeni"
                style={{ width:"100%", border:`1px solid ${G.hairline}`, borderRadius:8,
                  padding:"10px 12px", fontSize:13, color:G.charcoal, outline:"none", fontFamily:"DM Sans, sans-serif" }}/>
            </div>

            <div>
              <label style={{ fontSize:10, fontWeight:700, color:G.muted, letterSpacing:0.8,
                textTransform:"uppercase", display:"block", marginBottom:6 }}>Notes (optional)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Volumes, bin sizes, access requirements, anything else we should know..."
                style={{ width:"100%", border:`1px solid ${G.hairline}`, borderRadius:8,
                  padding:"10px 12px", fontSize:12, color:G.charcoal, resize:"vertical",
                  minHeight:80, outline:"none", fontFamily:"DM Sans, sans-serif" }}/>
            </div>

            <button onClick={() => { if(services.length) setSent(true); }} className="btn" style={{
              background: services.length ? G.mid : G.paleMid, color: services.length ? G.white : G.muted,
              border:"none", borderRadius:8, padding:"12px", fontSize:13, fontWeight:700,
              cursor: services.length ? "pointer" : "default", maxWidth:240 }}>
              Submit Quote Request
            </button>
          </div>
        ) : (
          <div style={{ textAlign:"center", padding:"30px 0" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>✅</div>
            <div style={{ fontWeight:700, color:G.mid, fontSize:16, fontFamily:"Outfit" }}>Quote request submitted</div>
            <div style={{ color:G.muted, fontSize:12, marginTop:6 }}>
              Our team will prepare a quote for {services.length} service{services.length>1?"s":""} and be in touch within 1–2 business days.
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

// ── Theme context ─────────────────────────────────────────────────────────────
const ThemeCtx = React.createContext(G);
const useTheme = () => React.useContext(ThemeCtx);

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function WastePortal() {
  const [tab, setTab] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [theme, setTheme] = useState("green"); // "green" | "teal"
  const T = theme === "teal" ? TEAL : G;
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(entries => {
      for (const e of entries) {
        const w = e.contentRect.width;
        setIsMobile(w < 768);
        if (w >= 768) setSidebarOpen(false);
      }
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const tabContent = [
    <OverviewTab onBook={() => setShowBooking(true)}/>,
    <QuoteTab/>,
    <HistoryTab/>,
    <DocumentsTab/>,
    <InvoicesTab/>,
    <ReportsTab/>,
    <SupportTab/>,
  ];

  return (
    <ThemeCtx.Provider value={T}>
    <div ref={containerRef} style={{ display:"flex", height:"100vh", fontFamily:"'DM Sans', sans-serif",
      background:T.bg, overflow:"hidden", position:"relative" }}>
      <FontLoader/>
      {showBooking && <BookingModal onClose={() => setShowBooking(false)}/>}

      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:200, backdropFilter:"blur(2px)" }}/>
      )}

      {/* ── SIDEBAR ── */}
      <aside style={{
        width:220, background:`linear-gradient(180deg, ${T.dark} 0%, ${T.charcoal} 100%)`,
        display:"flex", flexDirection:"column", flexShrink:0,
        boxShadow:"3px 0 16px rgba(0,0,0,0.2)",
        ...(isMobile ? {
          position:"fixed", top:0, left:0, bottom:0, zIndex:300,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition:"transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        } : {}),
      }}>
        {/* Brand */}
        <div style={{ padding:"22px 18px 18px", borderBottom:"1px solid rgba(255,255,255,0.1)", position:"relative" }}>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} style={{
              position:"absolute", top:12, right:12, background:"rgba(255,255,255,0.1)",
              border:"none", borderRadius:6, color:"#fff", fontSize:16, width:30, height:30,
              cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          )}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <div style={{ width:36, height:36, borderRadius:8, background:G.lime,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>♻️</div>
            <div>
              <div style={{ color:"#fff", fontWeight:800, fontSize:15, fontFamily:"Outfit" }}>WasteMart</div>
              <div style={{ color:"rgba(255,255,255,0.45)", fontSize:9, letterSpacing:1.5, fontFamily:"Outfit" }}>CUSTOMER PORTAL</div>
            </div>
          </div>
          {/* Customer badge */}
          <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:8, padding:"10px 12px",
            border:"1px solid rgba(255,255,255,0.12)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <div style={{ width:26, height:26, borderRadius:"50%", background:G.lime,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>E</div>
              <div style={{ color:"#fff", fontSize:12, fontWeight:700 }}>Wastemart CP Prototype</div>
            </div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)", letterSpacing:0.5 }}>Account WCP-00001</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"10px 0", overflowY:"auto" }}>
          {TABS.map((t, i) => (
            <div key={t} className="side-nav" onClick={() => { setTab(i); if(isMobile) setSidebarOpen(false); }}
              style={{
                display:"flex", alignItems:"center", gap:12, padding:"11px 18px",
                cursor:"pointer", fontSize:13, fontWeight: tab===i ? 700 : 500,
                color: tab===i ? "#fff" : "rgba(255,255,255,0.55)",
                background: tab===i ? "rgba(255,255,255,0.12)" : "transparent",
                borderLeft: tab===i ? `3px solid ${G.lime}` : "3px solid transparent",
                transition:"all 0.15s",
              }}>
              <span style={{ fontSize:15 }}>{["🏠","🧾","📋","📁","💳","📊","💬"][i]}</span>
              {t}
            </div>
          ))}
          {/* Book a Service CTA in sidebar */}
          <div style={{ margin:"10px 14px 0" }}>
            <button onClick={() => { setShowBooking(true); if(isMobile) setSidebarOpen(false); }}
              className="btn" style={{
                width:"100%", background:T.lime, color:T.dark, border:"none", borderRadius:8,
                padding:"10px 14px", fontSize:12, fontWeight:800, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              📅 Book a Service
            </button>
          </div>
        </nav>

        <div style={{ padding:"12px 14px", borderTop:"1px solid rgba(255,255,255,0.1)" }}>
          {/* Theme switcher */}
          <div style={{ marginBottom:10 }}>
            <div style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.4)",
              letterSpacing:1.2, textTransform:"uppercase", marginBottom:6, textAlign:"center" }}>
              Colour Theme
            </div>
            <div style={{ display:"flex", gap:6, background:"rgba(0,0,0,0.2)", borderRadius:8, padding:4 }}>
              <button onClick={() => setTheme("green")} style={{
                flex:1, border:"none", borderRadius:6, padding:"6px 4px", cursor:"pointer",
                fontSize:10, fontWeight:700, transition:"all 0.2s",
                background: theme==="green" ? "#2E7D32" : "transparent",
                color: theme==="green" ? "#fff" : "rgba(255,255,255,0.45)" }}>
                🌿 Green
              </button>
              <button onClick={() => setTheme("teal")} style={{
                flex:1, border:"none", borderRadius:6, padding:"6px 4px", cursor:"pointer",
                fontSize:10, fontWeight:700, transition:"all 0.2s",
                background: theme==="teal" ? "#14A697" : "transparent",
                color: theme==="teal" ? "#fff" : "rgba(255,255,255,0.45)" }}>
                🩵 Teal
              </button>
            </div>
          </div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", textAlign:"center" }}>
            Powered by GEMIS · gemis.co.za
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex:1, overflowY:"auto", minWidth:0, display:"flex", flexDirection:"column" }}>

        {/* Mobile top bar */}
        {isMobile && (
          <div style={{ background:T.dark, padding:"12px 16px", display:"flex",
            justifyContent:"space-between", alignItems:"center", flexShrink:0,
            boxShadow:"0 2px 8px rgba(0,0,0,0.2)", position:"sticky", top:0, zIndex:100 }}>
            <button onClick={() => setSidebarOpen(true)} style={{
              background:"rgba(255,255,255,0.15)", border:"none", borderRadius:8,
              color:"#fff", fontSize:20, width:40, height:40, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center" }}>&#9776;</button>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:16 }}>♻️</span>
              <span style={{ color:"#fff", fontWeight:800, fontFamily:"Outfit" }}>WasteMart</span>
            </div>
            <button style={{
              background:"rgba(255,255,255,0.15)", border:"none", borderRadius:8, color:"#fff",
              fontSize:11, fontWeight:700, padding:"7px 12px", cursor:"pointer",
              display:"flex", alignItems:"center", gap:5 }}>
              🔒 Sign Out
            </button>
          </div>
        )}

        {/* Desktop page header */}
        {!isMobile && (
          <div style={{ background:T.white, borderBottom:`1px solid ${T.hairline}`,
            padding:"14px 28px", display:"flex", justifyContent:"space-between",
            alignItems:"center", flexShrink:0, boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
            <div>
              <div style={{ fontSize:10, color:T.muted, letterSpacing:1.2, fontWeight:700, textTransform:"uppercase", marginBottom:2 }}>
                Customer Portal · Wastemart CP Prototype
              </div>
              <h2 style={{ fontSize:18, fontWeight:800, color:T.charcoal, fontFamily:"Outfit" }}>{TABS[tab]}</h2>
            </div>
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              <div style={{ width:34, height:34, borderRadius:"50%", background:T.pale,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontWeight:800, color:T.mid, fontSize:14, cursor:"pointer" }}>W</div>
              <button className="btn" style={{
                background:T.white, color:T.muted, border:`1px solid ${T.hairline}`, borderRadius:8,
                padding:"8px 14px", fontSize:12, fontWeight:700, cursor:"pointer",
                display:"flex", alignItems:"center", gap:6 }}>
                🔒 Sign Out
              </button>
            </div>
          </div>
        )}
        <DataFreshnessBar/>

        {/* Tab pills (mobile) */}
        {isMobile && (
          <div style={{ display:"flex", gap:0, overflowX:"auto", background:G.white,
            borderBottom:`1px solid ${G.hairline}`, flexShrink:0, padding:"0 4px" }}>
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setTab(i)} className="nav-tab" style={{
                border:"none", background:"transparent", padding:"10px 12px",
                fontSize:11, fontWeight: tab===i ? 700 : 500, cursor:"pointer", whiteSpace:"nowrap",
                color: tab===i ? G.mid : G.muted,
                borderBottom: tab===i ? `2.5px solid ${G.mid}` : "2.5px solid transparent" }}>
                {t}
              </button>
            ))}
          </div>
        )}

        {/* Desktop tab bar */}
        {!isMobile && (
          <div style={{ display:"flex", gap:0, background:G.white, padding:"0 28px",
            borderBottom:`1px solid ${G.hairline}`, flexShrink:0 }}>
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setTab(i)} className="nav-tab" style={{
                border:"none", background:"transparent", padding:"12px 18px",
                fontSize:13, fontWeight: tab===i ? 700 : 500, cursor:"pointer",
                color: tab===i ? G.mid : G.muted,
                borderBottom: tab===i ? `3px solid ${G.mid}` : "3px solid transparent",
                transition:"all 0.15s", borderRadius:"4px 4px 0 0" }}>
                {t}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", padding: isMobile ? "16px" : "24px 28px" }}
          key={tab}>
          {tabContent[tab]}
        </div>

        {/* Disclaimer / terms */}
        <div style={{ background:T.bg, borderTop:`1px solid ${T.hairline}`, padding:"9px 18px",
          fontSize:10, color:T.muted, textAlign:"center", lineHeight:1.5, flexShrink:0 }}>
          Use of this portal is at the customer's own risk. Information shown is for convenience and may not reflect real-time account status.
          Responsibility for the confidentiality of login credentials and any data accessed rests with the customer's business.
          {" "}© WasteMart · <span style={{ color:T.mid, cursor:"pointer" }}>Terms of Use</span> apply.
        </div>

      </main>
    </div>
    </ThemeCtx.Provider>
  );
}
