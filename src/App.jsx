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

// ── Brand ─────────────────────────────────────────────────────────────────────
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

// ── Data ──────────────────────────────────────────────────────────────────────
const UPCOMING = [
  { id:"U001", date:"Mon 16 Mar 2026", type:"General Waste Collection",    bin:"240L Green — Bay 1",    status:"Scheduled" },
  { id:"U002", date:"Mon 16 Mar 2026", type:"Recycling Collection",        bin:"240L Yellow — Bay 1",   status:"Scheduled" },
  { id:"U003", date:"Thu 19 Mar 2026", type:"Bin Clean",                   bin:"1100L Blue — Loading",  status:"Scheduled" },
  { id:"U004", date:"Mon 23 Mar 2026", type:"General Waste Collection",    bin:"240L Green — Bay 1",    status:"Scheduled" },
  { id:"U005", date:"Mon 23 Mar 2026", type:"Recycling Collection",        bin:"240L Yellow — Bay 1",   status:"Scheduled" },
  { id:"U006", date:"Thu 26 Mar 2026", type:"Additional Bin Delivery",     bin:"240L Green — Bay 2",    status:"Pending Confirm" },
];

const HISTORY = [
  { id:"T0041", planned:"Mon 09 Mar", actual:"Mon 09 Mar", type:"General Waste",    bin:"240L Green — Bay 1",   status:"On Time",     reason:"",                             dnote:"DN-20260309-041" },
  { id:"T0040", planned:"Mon 09 Mar", actual:"Mon 09 Mar", type:"Recycling",         bin:"240L Yellow — Bay 1",  status:"On Time",     reason:"",                             dnote:"DN-20260309-040" },
  { id:"T0039", planned:"Thu 05 Mar", actual:"Fri 06 Mar", type:"Bin Clean",          bin:"1100L Blue — Loading", status:"Rescheduled", reason:"Vehicle breakdown",             dnote:"DN-20260306-039" },
  { id:"T0038", planned:"Mon 02 Mar", actual:"Mon 02 Mar", type:"General Waste",    bin:"240L Green — Bay 1",   status:"On Time",     reason:"",                             dnote:"DN-20260302-038" },
  { id:"T0037", planned:"Mon 02 Mar", actual:"Tue 03 Mar", type:"Recycling",         bin:"240L Yellow — Bay 1",  status:"Rescheduled", reason:"Public holiday — capacity",    dnote:"DN-20260303-037" },
  { id:"T0036", planned:"Thu 27 Feb", actual:"Thu 27 Feb", type:"Bin Clean",          bin:"1100L Blue — Loading", status:"On Time",     reason:"",                             dnote:"DN-20260227-036" },
  { id:"T0035", planned:"Mon 23 Feb", actual:"Mon 23 Feb", type:"General Waste",    bin:"240L Green — Bay 1",   status:"On Time",     reason:"",                             dnote:"DN-20260223-035" },
  { id:"T0034", planned:"Mon 23 Feb", actual:"Mon 23 Feb", type:"Recycling",         bin:"240L Yellow — Bay 1",  status:"On Time",     reason:"",                             dnote:"DN-20260223-034" },
];

const INVOICES = [
  { inv:"INV-2026-0312", date:"01 Mar 2026", due:"15 Mar 2026", desc:"March 2026 — Waste Services",     amount:"R 4,850.00",  status:"Unpaid"  },
  { inv:"INV-2026-0289", date:"01 Feb 2026", due:"15 Feb 2026", desc:"February 2026 — Waste Services",  amount:"R 4,850.00",  status:"Paid"    },
  { inv:"INV-2026-0241", date:"01 Jan 2026", due:"15 Jan 2026", desc:"January 2026 — Waste Services",   amount:"R 4,850.00",  status:"Paid"    },
  { inv:"INV-2025-0198", date:"01 Dec 2025", due:"15 Dec 2025", desc:"December 2025 — Waste Services",  amount:"R 4,850.00",  status:"Paid"    },
  { inv:"INV-2025-0177", date:"01 Nov 2025", due:"15 Nov 2025", desc:"November 2025 — Waste Services",  amount:"R 4,720.00",  status:"Paid"    },
];

const CONTACTS = [
  { name:"Nazier Marthinus", role:"Account Manager",     phone:"+27 21 555 0100", email:"nazier@wastemart.co.za"  },
  { name:"Chantele du Plessis", role:"Finance Queries",  phone:"+27 83 442 2086", email:"chantele@wastemart.co.za"},
  { name:"Operations Desk",   role:"Service Issues",     phone:"+27 21 555 0199", email:"ops@wastemart.co.za"     },
];

const TABS = ["Overview", "Transaction History", "Documents", "Invoices", "Support"];
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
  const map = {
    "On Time":        { bg: G.pale,     color: G.mid,    dot: G.bright  },
    "Rescheduled":    { bg: G.amberPale,color: G.amber,  dot: G.amber   },
    "Scheduled":      { bg: G.bluePale, color: G.blue,   dot: G.blue    },
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
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
      <h3 style={{ fontSize:14, fontWeight:700, color:G.charcoal, fontFamily:"Outfit, sans-serif", letterSpacing:0.2 }}>{children}</h3>
      {action}
    </div>
  );
}

function Card({ children, style={} }) {
  return (
    <div className="fadeUp" style={{ background:G.white, borderRadius:14, padding:"20px 22px",
      boxShadow:"0 1px 4px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)",
      overflow:"hidden", minWidth:0, ...style }}>
      {children}
    </div>
  );
}

function DownloadBtn({ label="D-Note" }) {
  return (
    <button className="btn" style={{
      background:G.pale, color:G.mid, border:`1px solid ${G.paleMid}`,
      borderRadius:6, padding:"4px 10px", fontSize:11, fontWeight:700, cursor:"pointer",
      display:"inline-flex", alignItems:"center", gap:4 }}>
      ↓ {label}
    </button>
  );
}

// ── TAB CONTENT ───────────────────────────────────────────────────────────────
function OverviewTab() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>

      {/* Next service highlight */}
      <Card style={{ background:`linear-gradient(135deg, ${G.dark} 0%, ${G.mid} 100%)`, color:G.white, padding:"22px 26px" }}>
        <div style={{ fontSize:11, fontWeight:700, opacity:0.65, letterSpacing:1.5, marginBottom:8, fontFamily:"Outfit" }}>NEXT SCHEDULED SERVICE</div>
        <div style={{ fontSize:22, fontWeight:800, fontFamily:"Outfit", marginBottom:4 }}>Monday, 16 March 2026</div>
        <div style={{ opacity:0.8, fontSize:13, marginBottom:16 }}>General Waste + Recycling · 240L Green &amp; Yellow — Bay 1</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:8, padding:"8px 14px", fontSize:12 }}>
            <div style={{ opacity:0.65, fontSize:10, fontWeight:700, letterSpacing:1 }}>SERVICES THIS MONTH</div>
            <div style={{ fontWeight:800, fontSize:18, fontFamily:"Outfit" }}>6</div>
          </div>
          <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:8, padding:"8px 14px", fontSize:12 }}>
            <div style={{ opacity:0.65, fontSize:10, fontWeight:700, letterSpacing:1 }}>ON-TIME RATE</div>
            <div style={{ fontWeight:800, fontSize:18, fontFamily:"Outfit" }}>88%</div>
          </div>
          <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:8, padding:"8px 14px", fontSize:12 }}>
            <div style={{ opacity:0.65, fontSize:10, fontWeight:700, letterSpacing:1 }}>CURRENT BALANCE</div>
            <div style={{ fontWeight:800, fontSize:18, fontFamily:"Outfit", color:"#FFCDD2" }}>R 4,850</div>
          </div>
        </div>
      </Card>

      {/* Upcoming + recent side by side */}
      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>

        {/* Upcoming */}
        <Card style={{ flex:"2 1 300px" }}>
          <SectionTitle action={<span style={{ fontSize:11, color:G.muted }}>Next 14 days</span>}>Upcoming Services</SectionTitle>
          <div style={{ overflowX:"auto", margin:"0 -22px", padding:"0 22px" }}><table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, minWidth:480 }}>
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

        {/* Account info */}
        <Card style={{ flex:"1 1 200px", minWidth:200 }}>
          <SectionTitle>Account Details</SectionTitle>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {[
              { label:"Account", val:"ENV-00142" },
              { label:"Contract", val:"Commercial — Monthly" },
              { label:"Site", val:"Environ Skincare, Ndabeni" },
              { label:"Account Manager", val:"Nazier Marthinus" },
              { label:"Next Invoice", val:"01 Apr 2026" },
              { label:"Amount Due", val:"R 4,850.00" },
            ].map(r => (
              <div key={r.label} style={{ paddingBottom:10, borderBottom:`1px solid ${G.hairline}` }}>
                <div style={{ fontSize:10, fontWeight:700, color:G.muted, letterSpacing:0.8, textTransform:"uppercase", marginBottom:2 }}>{r.label}</div>
                <div style={{ fontSize:13, fontWeight:600, color:G.charcoal }}>{r.val}</div>
              </div>
            ))}
            <button className="btn" style={{
              background:G.mid, color:G.white, border:"none", borderRadius:8,
              padding:"10px", fontSize:12, fontWeight:700, cursor:"pointer", marginTop:4 }}>
              💬 Contact My Account Manager
            </button>
          </div>
        </Card>

      </div>

      {/* Recent activity */}
      <Card>
        <SectionTitle action={<DownloadBtn label="Export CSV"/>}>Recent Collections</SectionTitle>
        <div style={{ overflowX:"auto", margin:"0 -22px", padding:"0 22px" }}><table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, minWidth:480 }}>
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

        <div style={{ overflowX:"auto", margin:"0 -22px", padding:"0 22px" }}><table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, minWidth:480 }}>
          <thead>
            <tr>
              {["Ref","Service Type","Bin / Location","Scheduled","Actual","Status","Reason","D-Note"].map(h => (
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

function DocumentsTab() {
  const docs = HISTORY.map(r => ({
    ref: r.dnote, date: r.actual, type: r.type, bin: r.bin, status: r.status
  }));
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
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
          {docs.map((d, i) => (
            <div key={d.ref} className="doc-row" style={{
              display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"12px 12px", borderRadius:8, gap:12, flexWrap:"wrap",
              borderBottom: i < docs.length-1 ? `1px solid ${G.hairline}` : "none" }}>
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
        {[
          { name:"Service Agreement — Environ Skincare", date:"Jan 2024", type:"Contract" },
          { name:"Waste Management Schedule (Current)", date:"Mar 2026", type:"Schedule" },
          { name:"WasteMart Company Profile",           date:"2026",     type:"Profile"  },
          { name:"ISO 14001:2015 Certificate",          date:"2025",     type:"Certificate" },
          { name:"ISO 45001:2018 Certificate",          date:"2025",     type:"Certificate" },
        ].map((d, i) => (
          <div key={i} className="doc-row" style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"11px 12px", borderRadius:8, gap:12, flexWrap:"wrap",
            borderBottom: i < 4 ? `1px solid ${G.hairline}` : "none" }}>
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
      </Card>
    </div>
  );
}

function InvoicesTab() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

      {/* Balance banner */}
      <div style={{ background:`linear-gradient(135deg, #B71C1C, #C62828)`, borderRadius:14, padding:"18px 22px", color:"#fff" }}>
        <div style={{ fontSize:10, fontWeight:700, opacity:0.7, letterSpacing:1.5, marginBottom:6 }}>AMOUNT DUE</div>
        <div style={{ fontSize:28, fontWeight:800, fontFamily:"Outfit", marginBottom:4 }}>R 4,850.00</div>
        <div style={{ fontSize:12, opacity:0.8 }}>Invoice INV-2026-0312 · Due 15 March 2026</div>
        <div style={{ marginTop:14, display:"flex", gap:10 }}>
          <button className="btn" style={{
            background:"#fff", color:G.red, border:"none",
            borderRadius:8, padding:"8px 18px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
            View Invoice
          </button>
          <button className="btn" style={{
            background:"rgba(255,255,255,0.2)", color:"#fff", border:"1px solid rgba(255,255,255,0.4)",
            borderRadius:8, padding:"8px 18px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
            ↓ Download PDF
          </button>
        </div>
      </div>

      <Card>
        <SectionTitle action={<DownloadBtn label="Export Statement"/>}>Invoice History</SectionTitle>
        <div style={{ overflowX:"auto", margin:"0 -22px", padding:"0 22px" }}><table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, minWidth:480 }}>
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
    </div>
  );
}

function SupportTab() {
  const [rating, setRating] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div style={{ display:"flex", gap:18, flexWrap:"wrap", alignItems:"flex-start" }}>

      {/* Left col */}
      <div style={{ flex:"2 1 300px", display:"flex", flexDirection:"column", gap:16 }}>

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
              { icon:"🧹", label:"Request a bin clean"           },
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

      {/* Right col — contacts */}
      <div style={{ flex:"1 1 220px", display:"flex", flexDirection:"column", gap:16 }}>
        <Card>
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

        <Card>
          <SectionTitle>Emergency Line</SectionTitle>
          <div style={{ textAlign:"center", padding:"10px 0" }}>
            <div style={{ fontSize:28, marginBottom:6 }}>🚨</div>
            <div style={{ fontSize:20, fontWeight:800, color:G.mid, fontFamily:"Outfit" }}>+27 21 555 0199</div>
            <div style={{ fontSize:11, color:G.muted, marginTop:4 }}>24/7 · Hazardous waste &amp; urgent collections</div>
          </div>
        </Card>
      </div>

    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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

  const tabContent = [<OverviewTab/>, <HistoryTab/>, <DocumentsTab/>, <InvoicesTab/>, <SupportTab/>];

  return (
    <div ref={containerRef} style={{ display:"flex", height:"100vh", fontFamily:"'DM Sans', sans-serif",
      background:G.bg, overflow:"hidden", position:"relative" }}>
      <FontLoader/>

      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:200, backdropFilter:"blur(2px)" }}/>
      )}

      {/* ── SIDEBAR ── */}
      <aside style={{
        width:220, background:`linear-gradient(180deg, ${G.dark} 0%, ${G.charcoal} 100%)`,
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
              <div style={{ color:"#fff", fontSize:12, fontWeight:700 }}>Environ Skincare</div>
            </div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)", letterSpacing:0.5 }}>Account ENV-00142</div>
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
              <span style={{ fontSize:15 }}>{["🏠","📋","📁","💳","💬"][i]}</span>
              {t}
            </div>
          ))}
        </nav>

        <div style={{ padding:"12px 14px", borderTop:"1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", textAlign:"center", marginBottom:8 }}>
            Powered by GEMIS · gemis.co.za
          </div>
          <button className="btn" style={{
            width:"100%", background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.6)",
            border:"1px solid rgba(255,255,255,0.15)", borderRadius:8, padding:"8px",
            fontSize:11, fontWeight:600, cursor:"pointer" }}>
            🔒 Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex:1, overflowY:"auto", minWidth:0, display:"flex", flexDirection:"column" }}>

        {/* Mobile top bar */}
        {isMobile && (
          <div style={{ background:G.dark, padding:"12px 16px", display:"flex",
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
            <div style={{ width:40, height:40, borderRadius:"50%", background:"rgba(255,255,255,0.15)",
              display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:16 }}>E</div>
          </div>
        )}

        {/* Page header */}
        {!isMobile && (
          <div style={{ background:G.white, borderBottom:`1px solid ${G.hairline}`,
            padding:"16px 28px", display:"flex", justifyContent:"space-between",
            alignItems:"center", flexShrink:0, boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
            <div>
              <div style={{ fontSize:10, color:G.muted, letterSpacing:1.2, fontWeight:700, textTransform:"uppercase", marginBottom:2 }}>
                Customer Portal · Environ Skincare (Pty) Ltd
              </div>
              <h2 style={{ fontSize:18, fontWeight:800, color:G.charcoal, fontFamily:"Outfit" }}>{TABS[tab]}</h2>
            </div>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <div style={{ fontSize:12, color:G.muted }}>
                Last updated: <strong style={{ color:G.charcoal }}>Today, 06:30</strong>
              </div>
              <div style={{ width:34, height:34, borderRadius:"50%", background:G.pale,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontWeight:800, color:G.mid, fontSize:14, cursor:"pointer" }}>E</div>
            </div>
          </div>
        )}

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

      </main>
    </div>
  );
}