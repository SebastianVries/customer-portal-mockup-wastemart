import React, { useState, useEffect, useRef } from "react";

// Logo lives in /public and is resolved against Vite's base URL so it works
// both locally and on the gh-pages sub-path deploy.
const LOGO_URL = `${import.meta.env.BASE_URL}wastemart-logo.png`;

// ── Google Fonts ──────────────────────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Open+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Open Sans', sans-serif; -webkit-font-smoothing: antialiased; }
    h1,h2,h3,h4,h5 { font-family: 'Montserrat', sans-serif; }
    ::-webkit-scrollbar { width: 7px; height: 7px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--wm-scroll, #C2D6D2); border-radius: 4px; }
    table td, table th { white-space: nowrap; }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.5; } }
    .fadeUp { animation: fadeUp 0.35s ease both; }
    .hover-row:hover { background: var(--wm-row-hover, #EEF5F4) !important; cursor: default; }
    .btn:hover { filter: brightness(0.97); }
    .nav-tab:hover { background: var(--wm-sidenav-hover, rgba(19,168,158,0.07)); }
    .side-nav { position: relative; }
    .side-nav:hover { background: var(--wm-sidenav-hover, #EFF6F5) !important; }
    .doc-row:hover { background: var(--wm-doc-hover, #F4FAF9); }
    *:focus-visible { outline: 2px solid var(--wm-focus, #13A89E); outline-offset: 2px; border-radius: 4px; }
    a, button { -webkit-tap-highlight-color: transparent; }
    .wm-tipwrap { position: relative; }
    .wm-tip { position: absolute; left: calc(100% + 12px); top: 50%; transform: translateY(-50%) translateX(-4px); background: var(--wm-tip-bg, #1F2937); color: var(--wm-tip-text, #fff); padding: 7px 11px; border-radius: 7px; font-size: 12px; font-weight: 600; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity .14s ease, transform .14s ease; z-index: 500; box-shadow: 0 8px 24px rgba(0,0,0,0.28); font-family: 'Open Sans', sans-serif; }
    .wm-tip::before { content: ""; position: absolute; right: 100%; top: 50%; transform: translateY(-50%); border: 5px solid transparent; border-right-color: var(--wm-tip-bg, #1F2937); }
    .wm-tipwrap:hover .wm-tip, .wm-tipwrap:focus-visible .wm-tip { opacity: 1; transform: translateY(-50%) translateX(0); }
    .wm-tip-rich { line-height: 1.5; } .wm-tip-rich b { font-weight: 700; }
    @media (prefers-reduced-motion: reduce) { .fadeUp { animation: none; } }
  `}</style>
);

// ── Brand — Teal (WasteMart #14A697) ─────────────────────────────────────────
const G = {
  dark:    "#0C6F68",
  mid:     "#13A89E",
  bright:  "#15A99F",
  light:   "#7FC9C2",
  pale:    "#E8F3F1",
  paleMid: "#CBE4E0",
  lime:    "#C79A3C",      // muted gold accent (reserved for CTA)
  slate:   "#46555B",
  charcoal:"#22323A",
  muted:   "#5F7077",
  hairline:"#E4EBEA",
  white:   "#FFFFFF",
  bg:      "#F3F7F6",
  amber:   "#B5760A",
  amberPale:"#FBF1DD",
  red:     "#B23A36",
  redPale: "#F7E7E6",
  blue:    "#2C5D8A",
  bluePale:"#E5EDF4",
  orange:  "#C2541E",
  orangePale:"#FBF0E2",
};

// ── Theme system ─────────────────────────────────────────────────
// Every theme defines the full token set so all components stay identical —
// only the visual values change. Sidebar (sb*) tokens are styled per-theme.
const professionalTheme = {
  id:"professional", label:"Professional",
  dark:"#095E52", mid:"#0B7A6B", bright:"#0EA08C", light:"#7FC9C2",
  pale:"#ECF5F3", paleMid:"#CBE4E0", lime:"#C79A3C",
  slate:"#46555B", charcoal:"#1F2937", muted:"#6B7280", hairline:"#E5E7EB",
  white:"#FFFFFF", bg:"#F8FAFA",
  amber:"#B5760A", amberPale:"#FBF1DD", red:"#B23A36", redPale:"#F7E7E6",
  blue:"#2C5D8A", bluePale:"#E5EDF4", orange:"#C2541E", orangePale:"#FBF0E2",
  sbBg:"#FFFFFF", sbBorder:"#E5E7EB", sbText:"#46555B", sbMuted:"#6B7280",
  sbActiveText:"#0B7A6B", sbActiveBg:"#ECF5F3", sbActiveBar:"#0B7A6B",
  sbBadgeBg:"#F4F7F6", sbBadgeBorder:"#E5E7EB", sbBadgeText:"#1F2937", sbHover:"#F1F5F4",
  sbShadow:"2px 0 12px rgba(20,40,40,0.07)", mobileBar:"#0B7A6B", ctaBg:"#0B7A6B", ctaText:"#FFFFFF",
  tipBg:"#1F2937", tipText:"#FFFFFF",
  rowHover:"#F1F6F5", docHover:"#F4FAF9", scroll:"#C2D6D2", focus:"#0B7A6B",
  isDark:false,
};
const wasteMartGreenTheme = {
  id:"green", label:"WasteMart Green",
  dark:"#075E52", mid:"#0B7A6B", bright:"#0EA08C", light:"#7FC9C2",
  pale:"#E6F1EE", paleMid:"#C8E2DB", lime:"#E6A72E",
  slate:"#46555B", charcoal:"#1F2937", muted:"#5F7077", hairline:"#E4EBEA",
  white:"#FFFFFF", bg:"#F4FAF8",
  amber:"#B5760A", amberPale:"#FBF1DD", red:"#B23A36", redPale:"#F7E7E6",
  blue:"#2C5D8A", bluePale:"#E5EDF4", orange:"#C2541E", orangePale:"#FBF0E2",
  sbBg:"#0B7A6B", sbBorder:"rgba(255,255,255,0.14)", sbText:"rgba(255,255,255,0.82)", sbMuted:"rgba(255,255,255,0.6)",
  sbActiveText:"#FFFFFF", sbActiveBg:"rgba(255,255,255,0.15)", sbActiveBar:"#E6A72E",
  sbBadgeBg:"rgba(255,255,255,0.10)", sbBadgeBorder:"rgba(255,255,255,0.2)", sbBadgeText:"#FFFFFF", sbHover:"rgba(255,255,255,0.09)",
  sbShadow:"3px 0 18px rgba(7,62,55,0.32)", mobileBar:"#0B7A6B", ctaBg:"#FFFFFF", ctaText:"#0B7A6B",
  tipBg:"#063F37", tipText:"#FFFFFF",
  rowHover:"#EDF6F2", docHover:"#F1F8F5", scroll:"#BFD9D2", focus:"#0B7A6B",
  isDark:false,
};
const darkTheme = {
  id:"dark", label:"Dark Mode",
  dark:"#0E9A6E", mid:"#10B981", bright:"#34D399", light:"#1E293B",
  pale:"#1E293B", paleMid:"#334155", lime:"#E6A72E",
  slate:"#CBD5E1", charcoal:"#F9FAFB", muted:"#A8B3C1", hairline:"#334155",
  white:"#1F2937", bg:"#111827",
  amber:"#FBBF24", amberPale:"rgba(251,191,36,0.16)", red:"#F87171", redPale:"rgba(248,113,113,0.16)",
  blue:"#60A5FA", bluePale:"rgba(96,165,250,0.16)", orange:"#FB923C", orangePale:"rgba(251,146,60,0.16)",
  sbBg:"#0F172A", sbBorder:"#334155", sbText:"#CBD5E1", sbMuted:"#94A3B8",
  sbActiveText:"#FFFFFF", sbActiveBg:"rgba(16,185,129,0.18)", sbActiveBar:"#10B981",
  sbBadgeBg:"#1E293B", sbBadgeBorder:"#334155", sbBadgeText:"#F9FAFB", sbHover:"rgba(255,255,255,0.06)",
  sbShadow:"2px 0 16px rgba(0,0,0,0.5)", mobileBar:"#0F172A", ctaBg:"#10B981", ctaText:"#FFFFFF",
  tipBg:"#0B1220", tipText:"#F9FAFB",
  rowHover:"#243042", docHover:"#243042", scroll:"#475569", focus:"#34D399",
  isDark:true,
};
const THEMES = { professional: professionalTheme, green: wasteMartGreenTheme, dark: darkTheme };
const THEME_META = [
  { id:"professional", label:"Professional",   desc:"Default WasteMart portal experience" },
  { id:"green",        label:"WasteMart Green", desc:"Enhanced brand styling" },
  { id:"dark",         label:"Dark Mode",       desc:"Comfortable low-light viewing" },
];

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

// Transaction Report — column layout mirrors the WasteMart SAP "Transaction
// Report" export: identifiers, grouped Service detail, charge breakdown (R),
// and grouped Disposal weight.
const TRANSACTIONS = [
  { date:"09 Mar 2026", serviceNo:"SRV-0041", manifest:"MAN-20260309-041", weighbridge:"WB-104821", po:"PO-44821",
    service:"General Waste Collection", uom:"Load", qnty:1, waste:"General Waste",
    transport:"R 650.00", disposal:"R 1,180.00", other:"R 0.00", total:"R 1,830.00", dispUom:"kg", dispWeight:"1,180" },
  { date:"09 Mar 2026", serviceNo:"SRV-0040", manifest:"MAN-20260309-040", weighbridge:"WB-104822", po:"PO-44821",
    service:"Recycling Collection", uom:"Load", qnty:1, waste:"Mixed Recycling",
    transport:"R 480.00", disposal:"R 420.00", other:"R 0.00", total:"R 900.00", dispUom:"kg", dispWeight:"640" },
  { date:"02 Mar 2026", serviceNo:"SRV-0038", manifest:"MAN-20260302-038", weighbridge:"WB-104655", po:"PO-44712",
    service:"General Waste Collection", uom:"Load", qnty:1, waste:"General Waste",
    transport:"R 650.00", disposal:"R 1,205.00", other:"R 0.00", total:"R 1,855.00", dispUom:"kg", dispWeight:"1,205" },
  { date:"03 Mar 2026", serviceNo:"SRV-0037", manifest:"MAN-20260303-037", weighbridge:"WB-104661", po:"PO-44712",
    service:"Recycling Collection", uom:"Load", qnty:1, waste:"Mixed Recycling",
    transport:"R 480.00", disposal:"R 395.00", other:"R 120.00", total:"R 995.00", dispUom:"kg", dispWeight:"605" },
  { date:"23 Feb 2026", serviceNo:"SRV-0035", manifest:"MAN-20260223-035", weighbridge:"WB-104498", po:"PO-44603",
    service:"General Waste Collection", uom:"Load", qnty:1, waste:"General Waste",
    transport:"R 650.00", disposal:"R 1,150.00", other:"R 0.00", total:"R 1,800.00", dispUom:"kg", dispWeight:"1,150" },
  { date:"23 Feb 2026", serviceNo:"SRV-0034", manifest:"MAN-20260223-034", weighbridge:"WB-104499", po:"PO-44603",
    service:"Recycling Collection", uom:"Load", qnty:1, waste:"Mixed Recycling",
    transport:"R 480.00", disposal:"R 410.00", other:"R 0.00", total:"R 890.00", dispUom:"kg", dispWeight:"620" },
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
  { name:"Support",         role:"General support line",   phone:"+27 86 045 6786", email:""                          },
  { name:"Sales Team",      role:"Quotes & new services",  phone:"",                email:"sales@wastemart.co.za"      },
  { name:"Admin Team",      role:"Accounts & billing",     phone:"",                email:"admin@wastemart.co.za"      },
  { name:"Operations Team", role:"Collections & service",  phone:"",                email:"operations@wastemart.co.za" },
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
  { icon:"home", label:"My Account" },
  { icon:"calendar", label:"Schedule"  },
  { icon:"history", label:"History"   },
  { icon:"file", label:"Documents" },
  { icon:"card", label:"Invoices"  },
  { icon:"chat", label:"Support"   },
];

// ── Sub-components ────────────────────────────────────────────────────────────
// ── Enterprise icon set (replaces emoji) ──────────────────────────────────────
function Icon({ name, size = 18, color = "currentColor", strokeWidth = 2, style = {} }) {
  const base = { width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round",
    style: { display: "block", flexShrink: 0, ...style } };
  const eyes = (<React.Fragment><circle cx="9" cy="10" r="0.95" fill={color} stroke="none"/><circle cx="15" cy="10" r="0.95" fill={color} stroke="none"/></React.Fragment>);
  switch (name) {
    case "home": return <svg {...base}><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/></svg>;
    case "quote": return <svg {...base}><rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M9 8.5h6M9 12h6M9 15.5h4"/></svg>;
    case "history": return <svg {...base}><path d="M3.5 12a8.5 8.5 0 1 1 2.6 6.1"/><path d="M3.5 19v-4h4"/><path d="M12 7.5V12l3 1.8"/></svg>;
    case "folder": return <svg {...base}><path d="M3.5 7.5a2 2 0 0 1 2-2h3l2 2.2h6a2 2 0 0 1 2 2v7.3a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/></svg>;
    case "card": return <svg {...base}><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3 9.5h18M6.5 14.5h4"/></svg>;
    case "chart": return <svg {...base}><line x1="5" y1="20" x2="5" y2="11"/><line x1="12" y1="20" x2="12" y2="5"/><line x1="19" y1="20" x2="19" y2="14"/><line x1="3.5" y1="20" x2="20.5" y2="20"/></svg>;
    case "chat": return <svg {...base}><path d="M20 11.5a7.5 7.5 0 0 1-10.8 6.7L4 19.5l1.4-4.2A7.5 7.5 0 1 1 20 11.5z"/></svg>;
    case "recycle": return <svg {...base}><path d="M4.5 9.5a7.5 7.5 0 0 1 12.8-3.3L20 9"/><path d="M20 4v5h-5"/><path d="M19.5 14.5a7.5 7.5 0 0 1-12.8 3.3L4 15"/><path d="M4 20v-5h5"/></svg>;
    case "calendar": return <svg {...base}><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3.5v3M16 3.5v3"/></svg>;
    case "lock": return <svg {...base}><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>;
    case "menu": return <svg {...base}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
    case "file": return <svg {...base}><path d="M13 3.5H6.5a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9z"/><path d="M13 3.5V9h5.5"/></svg>;
    case "user": return <svg {...base}><circle cx="12" cy="8.5" r="3.5"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/></svg>;
    case "phone": return <svg {...base}><path d="M6 3.5h3l1.5 4.5-2 1.4a11 11 0 0 0 4.6 4.6l1.4-2 4.5 1.5V20a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 4.5 5.1 1.5 1.5 0 0 1 6 3.5z"/></svg>;
    case "mail": return <svg {...base}><rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/></svg>;
    case "alert": return <svg {...base}><path d="M12 4 2.5 20h19z"/><path d="M12 10v4.5M12 17.4h.01"/></svg>;
    case "trash": return <svg {...base}><path d="M4 7h16M9 7V4.5h6V7M6 7l1 13h10l1-13"/><path d="M10 11v6M14 11v6"/></svg>;
    case "box": return <svg {...base}><path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="m3.5 7.5 8.5 4.5 8.5-4.5M12 12v9"/></svg>;
    case "plus": return <svg {...base}><path d="M12 5v14M5 12h14"/></svg>;
    case "glass": return <svg {...base}><path d="M6 4h12l-1.2 14.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8z"/><path d="M6.4 9h11.2"/></svg>;
    case "leaf": return <svg {...base}><path d="M5 19c0-7 6-13 14-13 0 8-6 13-14 13z"/><path d="M5.5 18.5c3-5 6.5-7.5 10.5-9"/></svg>;
    case "download": return <svg {...base}><path d="M12 4v11M7.5 11l4.5 4 4.5-4"/><path d="M5 19.5h14"/></svg>;
    case "close": return <svg {...base}><path d="M6 6l12 12M18 6 6 18"/></svg>;
    case "chevron-down": return <svg {...base}><path d="m6 9 6 6 6-6"/></svg>;
    case "check": return <svg {...base}><path d="M5 12.5 10 17.5 19 6.5"/></svg>;
    case "search": return <svg {...base}><circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.8-3.8"/></svg>;
    case "panel-left": return <svg {...base}><rect x="3.5" y="4.5" width="17" height="15" rx="2"/><line x1="9.5" y1="4.5" x2="9.5" y2="19.5"/><path d="m16 9.5-2.5 2.5 2.5 2.5"/></svg>;
    case "panel-right": return <svg {...base}><rect x="3.5" y="4.5" width="17" height="15" rx="2"/><line x1="9.5" y1="4.5" x2="9.5" y2="19.5"/><path d="m13.5 9.5 2.5 2.5-2.5 2.5"/></svg>;
    case "appearance": return <svg {...base}><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill={color} stroke="none"/></svg>;
    case "logout": return <svg {...base}><path d="M14 4.5H6.5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1H14"/><path d="m16.5 8 4 4-4 4"/><path d="M20.5 12H9.5"/></svg>;
    case "chevron-right": return <svg {...base}><path d="m9 6 6 6-6 6"/></svg>;
    case "check-circle": return <svg width={size} height={size} viewBox="0 0 24 24" style={{ display:"block", ...style }}><circle cx="12" cy="12" r="10" fill={color}/><path d="M7.4 12.4 10.6 15.6 16.6 8.8" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case "face-excellent": return <svg {...base}><circle cx="12" cy="12" r="8.5"/><path d="M8 14a4.2 4.2 0 0 0 8 0"/>{eyes}</svg>;
    case "face-good": return <svg {...base}><circle cx="12" cy="12" r="8.5"/><path d="M9 14.2a3.2 3.2 0 0 0 6 0"/>{eyes}</svg>;
    case "face-average": return <svg {...base}><circle cx="12" cy="12" r="8.5"/><path d="M9 14.7h6"/>{eyes}</svg>;
    case "face-poor": return <svg {...base}><circle cx="12" cy="12" r="8.5"/><path d="M9 15.4a3.2 3.2 0 0 1 6 0"/>{eyes}</svg>;
    default: return null;
  }
}

function StatusBadge({ status }) {
  const G = useTheme();
  const map = {
    "On Time":        { bg: G.pale,     color: G.mid,    dot: G.bright  },
    "Rescheduled":    { bg: G.amberPale,color: G.amber,  dot: G.amber   },
    "Scheduled":      { bg: G.bluePale, color: G.blue,   dot: G.blue    },
    "Active":         { bg: G.pale,     color: G.mid,    dot: G.bright  },
    "Pending Confirm":{ bg: G.orangePale,  color: G.orange,dot: G.orange },
    "Paid":           { bg: G.pale,     color: G.mid,    dot: G.bright  },
    "Unpaid":         { bg: G.redPale,  color: G.red,    dot: G.red     },
  };
  const s = map[status] || { bg:"#eee", color:"#555", dot:"#888" };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:6,
      background:s.bg, color:s.color, borderRadius:6, border:`1px solid ${s.color}22`,
      padding:"3px 9px", fontSize:11, fontWeight:600, letterSpacing:0.2, whiteSpace:"nowrap" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:s.dot, flexShrink:0 }}/>
      {status}
    </span>
  );
}

function SectionTitle({ children, action }) {
  const G = useTheme();
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
      <h3 style={{ fontSize:14, fontWeight:700, color:G.charcoal, fontFamily:"Montserrat, sans-serif", letterSpacing:0.2 }}>{children}</h3>
      {action}
    </div>
  );
}

function Card({ children, style={} }) {
  const G = useTheme();
  return (
    <div className="fadeUp" style={{ background:G.white, borderRadius:10, padding:"18px 18px",
      border:`1px solid ${G.hairline}`, boxShadow:"0 1px 2px rgba(20,40,40,0.05), 0 6px 16px rgba(20,40,40,0.03)",
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
      borderRadius:6, padding:"5px 10px", fontSize:11, fontWeight:600, cursor:"pointer",
      display:"inline-flex", alignItems:"center", gap:4 }}>
      <Icon name="download" size={13}/> {label}
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
      <Card style={{ background:`linear-gradient(135deg, ${G.dark} 0%, ${G.mid} 100%)`, color:"#FFFFFF", padding:"22px 26px" }}>
        <div style={{ fontSize:11, fontWeight:700, opacity:0.65, letterSpacing:1.5, marginBottom:8, fontFamily:"Montserrat" }}>NEXT SCHEDULED SERVICE</div>
        <div style={{ fontSize:22, fontWeight:800, fontFamily:"Montserrat", marginBottom:4 }}>Monday, 16 March 2026</div>
        <div style={{ opacity:0.8, fontSize:13, marginBottom:16 }}>General Waste + Recycling · 2 × 240L bins</div>
        <button onClick={onBook} className="btn" style={{
          background:G.lime, color:"#fff", border:"none", borderRadius:8,
          padding:"10px 20px", fontSize:13, fontWeight:800, cursor:"pointer",
          display:"inline-flex", alignItems:"center", gap:6 }}>
          <Icon name="calendar" size={16}/> Book an Additional Service
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
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}><Icon name="recycle" size={18} color={G.mid}/></div>
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

      {/* Upcoming services */}
      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>

        {/* Upcoming */}
        <Card style={{ flex:"1 1 300px" }}>
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
              {["Ref","Service Type","Bin","Date","D-Note"].map(h => (
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
                <td style={{ padding:"9px 8px", color:G.slate }}>{r.actual}</td>
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
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <Card>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:10 }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:G.charcoal, fontFamily:"Montserrat" }}>Full Transaction History</h3>
          <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
            <DownloadBtn label="Export CSV"/>
          </div>
        </div>

        {(() => {
          const cols = [
            { key:"date",        label:"Date" },
            { key:"serviceNo",   label:"Service Number",  mono:true },
            { key:"manifest",    label:"Manifest",        mono:true },
            { key:"weighbridge", label:"Weighbridge",     mono:true },
            { key:"po",          label:"PO Number",       mono:true },
            { key:"service",     label:"Service",         strong:true },
            { key:"uom",         label:"UOM" },
            { key:"qnty",        label:"Qnty",            num:true },
            { key:"waste",       label:"Waste" },
            { key:"transport",   label:"Transport",       num:true },
            { key:"disposal",    label:"Disposal",        num:true },
            { key:"other",       label:"Other",           num:true },
            { key:"total",       label:"Total",           num:true, strong:true },
            { key:"dispUom",     label:"UOM" },
            { key:"dispWeight",  label:"Disposal Weight", num:true },
          ];
          const grpCell = { textAlign:"center", padding:"6px 8px", color:G.mid, fontWeight:800,
            fontSize:10, textTransform:"uppercase", letterSpacing:0.8, background:G.pale,
            borderBottom:`1px solid ${G.hairline}`, whiteSpace:"nowrap" };
          return (
            <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}><table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, minWidth:1180 }}>
              <thead>
                {/* Group headers — mirror the SAP report's "Service" and "Disposal" groupings */}
                <tr>
                  <th colSpan={5}/>
                  <th colSpan={4} style={grpCell}>Service</th>
                  <th colSpan={4}/>
                  <th colSpan={2} style={grpCell}>Disposal</th>
                </tr>
                <tr>
                  {cols.map(c => (
                    <th key={c.key} style={{ textAlign: c.num ? "right" : "left", padding:"5px 8px",
                      color:G.muted, fontWeight:700, fontSize:10, textTransform:"uppercase", letterSpacing:0.8,
                      borderBottom:`2px solid ${G.hairline}`, whiteSpace:"nowrap" }}>{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TRANSACTIONS.map((r, i) => (
                  <tr key={r.serviceNo} className="hover-row" style={{ background: i%2===0 ? G.white : G.bg }}>
                    {cols.map(c => (
                      <td key={c.key} style={{ padding:"9px 8px", whiteSpace:"nowrap",
                        textAlign: c.num ? "right" : "left",
                        fontFamily: c.mono ? "monospace" : "inherit",
                        fontSize: c.mono ? 11 : 12,
                        fontWeight: c.strong ? 700 : (c.mono ? 600 : 400),
                        color: c.strong ? G.charcoal : G.slate }}>
                        {r[c.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table></div>
          );
        })()}

        <div style={{ marginTop:14, padding:"12px 14px", background:G.bg, borderRadius:8, fontSize:12, color:G.muted, display:"flex", gap:24, flexWrap:"wrap" }}>
          <span><strong style={{ color:G.charcoal }}>Total shown:</strong> {TRANSACTIONS.length} transactions</span>
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
            <span style={{ display:"flex", color:G.mid }}><Icon name="file" size={20}/></span>
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
                    <Icon name="file" size={18} color={G.mid}/>
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:G.charcoal, fontFamily:"monospace" }}>{d.ref}</div>
                    <div style={{ fontSize:11, color:G.muted, marginTop:1 }}>{d.type} · {d.bin}</div>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                  <span style={{ fontSize:11, color:G.muted }}>{d.date}</span>
                  <DownloadBtn label="PDF"/>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:16, textAlign:"center" }}>
            <button className="btn" style={{
              background:G.pale, color:G.mid, border:`1px solid ${G.paleMid}`,
              borderRadius:8, padding:"9px 20px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              <Icon name="download" size={13} style={{ display:"inline-block", verticalAlign:"-2px", marginRight:3 }}/> Download All D-Notes (ZIP)
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
  const [query, setQuery] = useState("");
  const [querySubmitted, setQuerySubmitted] = useState(false);

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
                  { label:"Excellent", face:"excellent", color:G.mid,   bg:G.pale     },
                  { label:"Good",      face:"good", color:G.bright, bg:G.pale     },
                  { label:"Average",   face:"average", color:G.orange,bg:G.orangePale  },
                  { label:"Poor",      face:"poor", color:G.red,    bg:G.redPale  },
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
                      <Icon name={"face-"+r.face} size={28} color={rating===r.label ? r.color : G.muted}/>
                    </div>
                    <span style={{ fontSize:11, fontWeight:600, color: rating===r.label ? r.color : G.muted }}>{r.label}</span>
                  </div>
                ))}
              </div>
              <textarea value={message} onChange={e => setMessage(e.target.value)}
                placeholder="Add a comment (optional)..."
                style={{ width:"100%", border:`1px solid ${G.hairline}`, borderRadius:8,
                  padding:"10px 12px", fontSize:12, color:G.charcoal, resize:"vertical",
                  minHeight:72, outline:"none", fontFamily:"Open Sans, sans-serif" }}/>
              <button onClick={() => { if(rating) setSubmitted(true); }} className="btn" style={{
                marginTop:10, width:"100%", background: rating ? G.mid : G.paleMid,
                color: rating ? G.white : G.muted, border:"none", borderRadius:8,
                padding:"10px", fontSize:13, fontWeight:700, cursor: rating ? "pointer" : "default" }}>
                Submit Rating
              </button>
            </>
          ) : (
            <div style={{ textAlign:"center", padding:"20px 0" }}>
              <div style={{ fontSize:36, marginBottom:10 }}><Icon name="check-circle" size={42} color={G.mid}/></div>
              <div style={{ fontWeight:700, color:G.mid, fontSize:15, fontFamily:"Montserrat" }}>Thank you for your feedback!</div>
              <div style={{ color:G.muted, fontSize:12, marginTop:4 }}>Rated: <strong>{rating}</strong></div>
            </div>
          )}
        </Card>

        {/* Log a query */}
        <Card>
          <SectionTitle>Log a Query</SectionTitle>
          {!querySubmitted ? (
            <>
              <p style={{ fontSize:12, color:G.muted, marginBottom:14 }}>
                Have a question or something you'd like us to look into? Let us know and our team will get back to you.
              </p>
              <textarea value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Type your query here..."
                style={{ width:"100%", border:`1px solid ${G.hairline}`, borderRadius:8,
                  padding:"10px 12px", fontSize:12, color:G.charcoal, resize:"vertical",
                  minHeight:120, outline:"none", fontFamily:"Open Sans, sans-serif" }}/>
              <button onClick={() => { if(query.trim()) setQuerySubmitted(true); }} className="btn" style={{
                marginTop:10, width:"100%", background: query.trim() ? G.mid : G.paleMid,
                color: query.trim() ? G.white : G.muted, border:"none", borderRadius:8,
                padding:"10px", fontSize:13, fontWeight:700, cursor: query.trim() ? "pointer" : "default" }}>
                Submit Query
              </button>
            </>
          ) : (
            <div style={{ textAlign:"center", padding:"20px 0" }}>
              <div style={{ fontSize:36, marginBottom:10 }}><Icon name="check-circle" size={42} color={G.mid}/></div>
              <div style={{ fontWeight:700, color:G.mid, fontSize:15, fontFamily:"Montserrat" }}>Query submitted!</div>
              <div style={{ color:G.muted, fontSize:12, marginTop:4 }}>Our team will be in touch shortly.</div>
            </div>
          )}
        </Card>

      </div>
      )}

      {/* Contact us */}
      {sub===1 && (
      <div style={{ display:"flex", gap:18, flexWrap:"wrap", alignItems:"flex-start" }}>
        <Card style={{ flex:"1 1 100%" }}>
          <SectionTitle>Your Contacts</SectionTitle>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {CONTACTS.map((c, i) => (
              <div key={i} style={{ paddingBottom:14, borderBottom: i<CONTACTS.length-1 ? `1px solid ${G.hairline}` : "none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                  <div style={{ width:34, height:34, borderRadius:"50%", background:G.pale,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}><Icon name="user" size={16} color={G.mid}/></div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:13, color:G.charcoal }}>{c.name}</div>
                    <div style={{ fontSize:11, color:G.muted }}>{c.role}</div>
                  </div>
                </div>
                {c.phone && (
                  <div style={{ fontSize:11, color:G.mid, paddingLeft:44 }}>
                    <Icon name="phone" size={12} style={{ display:"inline-block", verticalAlign:"-1px", marginRight:5 }}/>
                    <a href={`tel:${c.phone.replace(/\s/g,"")}`} style={{ color:G.mid, textDecoration:"none" }}>{c.phone}</a>
                  </div>
                )}
                {c.email && (
                  <div style={{ fontSize:11, color:G.mid, paddingLeft:44, marginTop:2 }}>
                    <Icon name="mail" size={12} style={{ display:"inline-block", verticalAlign:"-1px", marginRight:5 }}/>
                    <a href={`mailto:${c.email}`} style={{ color:G.mid, textDecoration:"none" }}>{c.email}</a>
                  </div>
                )}
              </div>
            ))}
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
    <div style={{ background:G.pale, borderBottom:`1px solid ${G.hairline}`,
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
  const [submitted, setSubmitted] = useState(false);

  const serviceTypes = [
    { icon:"trash", label:"General Waste Collection" },
    { icon:"recycle", label:"Recycling Collection"      },
    { icon:"box", label:"Bin Removal"               },
    { icon:"alert", label:"Hazardous Waste Pickup"    },
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
            <div style={{ color:G.white, fontSize:16, fontWeight:800, fontFamily:"Montserrat" }}>
              {submitted ? "Request Received" : step===1 ? "Select Service Type" : step===2 ? "Choose a Date" : "Confirm Booking"}
            </div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.15)", border:"none",
            borderRadius:8, color:"#fff", fontSize:18, width:34, height:34, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center" }}><Icon name="close" size={16}/></button>
        </div>

        {/* Progress */}
        {!submitted && (
        <div style={{ display:"flex", background:G.pale }}>
          {["Service","Date","Confirm"].map((s,i) => (
            <div key={s} style={{ flex:1, padding:"8px", textAlign:"center", fontSize:10, fontWeight:700,
              color: step>i ? G.mid : step===i+1 ? G.charcoal : G.muted,
              borderBottom: step===i+1 ? `2.5px solid ${G.mid}` : "2.5px solid transparent" }}>
              {i+1}. {s}
            </div>
          ))}
        </div>
        )}

        <div style={{ padding:"20px" }}>
          {submitted && (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:14, padding:"6px 0 4px" }}>
              <Icon name="check-circle" size={48} color={G.mid}/>
              <div style={{ fontSize:16, fontWeight:800, color:G.charcoal, fontFamily:"Montserrat" }}>Thank you for your request</div>
              <div style={{ background:G.pale, border:`1px solid ${G.paleMid}`, borderRadius:10,
                padding:"14px 16px", fontSize:12.5, color:G.slate, lineHeight:1.55 }}>
                Thank you for your request for service. Your service will be scheduled subject to available
                capacity and the conditions of your quote.
              </div>
              <button onClick={onClose} className="btn" style={{ width:"100%", background:G.mid, color:G.white,
                border:"none", borderRadius:8, padding:"11px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                Done
              </button>
            </div>
          )}
          {!submitted && step===1 && (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {serviceTypes.map(s => (
                <div key={s.label} onClick={() => setType(s.label)} style={{
                  display:"flex", alignItems:"center", gap:12, padding:"11px 14px",
                  borderRadius:8, cursor:"pointer", transition:"all 0.15s",
                  border:`2px solid ${type===s.label ? G.mid : G.hairline}`,
                  background: type===s.label ? G.pale : G.white }}>
                  <span style={{ display:"flex", color:G.mid }}><Icon name={s.icon} size={18}/></span>
                  <span style={{ fontSize:13, fontWeight: type===s.label ? 700 : 500,
                    color: type===s.label ? G.mid : G.charcoal }}>{s.label}</span>
                  {type===s.label && <span style={{ marginLeft:"auto", color:G.mid, fontWeight:700 }}><Icon name="check" size={15}/></span>}
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

          {!submitted && step===2 && (
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
                    fontFamily:"Open Sans, sans-serif" }}/>
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:G.muted, letterSpacing:0.8,
                  textTransform:"uppercase", display:"block", marginBottom:6 }}>Notes (optional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Access instructions, bin location, special requirements..."
                  style={{ width:"100%", border:`1px solid ${G.hairline}`, borderRadius:8,
                    padding:"10px 12px", fontSize:12, color:G.charcoal, resize:"vertical",
                    minHeight:72, outline:"none", fontFamily:"Open Sans, sans-serif" }}/>
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

          {!submitted && step===3 && (
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
                <button onClick={() => setSubmitted(true)} className="btn" style={{
                  flex:2, background:G.mid, color:G.white, border:"none",
                  borderRadius:8, padding:"10px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                  <Icon name="check" size={15}/> Submit Booking
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Donut / Pie chart (SVG) ───────────────────────────────────────────────────
function PieChart({ data, size = 180, centerTop, centerBottom, G }) {
  const slices = data.filter(d => d.value > 0);
  const total = slices.reduce((s, d) => s + d.value, 0) || 1;
  const r = size / 2;
  const hole = r * 0.58;
  let cursor = -Math.PI / 2; // start at 12 o'clock

  const arcs = slices.map(d => {
    const frac = d.value / total;
    const start = cursor;
    const end = cursor + frac * Math.PI * 2;
    cursor = end;
    const large = end - start > Math.PI ? 1 : 0;
    const x1 = r + r * Math.cos(start), y1 = r + r * Math.sin(start);
    const x2 = r + r * Math.cos(end),   y2 = r + r * Math.sin(end);
    const path = `M ${r} ${r} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    return { ...d, frac, path };
  });
  const onlySlice = slices.length === 1 ? slices[0] : null;

  return (
    <div style={{ display:"flex", gap:18, alignItems:"center", flexWrap:"wrap" }}>
      <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display:"block" }}>
          {onlySlice
            ? <circle cx={r} cy={r} r={r} fill={onlySlice.color} opacity={0.9}/>
            : arcs.map(a => <path key={a.label} d={a.path} fill={a.color} opacity={0.9}/>)}
          {/* donut hole */}
          <circle cx={r} cy={r} r={hole} fill={G.white}/>
        </svg>
        {(centerTop || centerBottom) && (
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
            {centerTop && <div style={{ fontSize:22, fontWeight:800, color:G.charcoal,
              fontFamily:"Montserrat", lineHeight:1.1 }}>{centerTop}</div>}
            {centerBottom && <div style={{ fontSize:10, fontWeight:700, color:G.muted,
              textTransform:"uppercase", letterSpacing:0.6 }}>{centerBottom}</div>}
          </div>
        )}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:7, flex:"1 1 160px", minWidth:160 }}>
        {data.map(d => (
          <div key={d.label} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12 }}>
            <div style={{ width:11, height:11, borderRadius:3, background:d.color, flexShrink:0 }}/>
            <span style={{ color:G.charcoal, flex:1 }}>{d.label}</span>
            <span style={{ color:G.muted }}>{d.value.toLocaleString()}</span>
            <span style={{ color:G.slate, fontWeight:700, width:42, textAlign:"right" }}>
              {Math.round(d.value / total * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Reports & Stats Tab ───────────────────────────────────────────────────────
function ReportsTab() {
  const G = useTheme();
  const [fromDate, setFromDate] = useState("2025-10-01");
  const [toDate,   setToDate]   = useState("2026-03-13");
  const [generated, setGenerated] = useState(true);

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
    { label:"General Waste",  key:"general",   color:G.slate,   icon:"trash" },
    { label:"Recycling",      key:"recycling",  color:G.bright,  icon:"recycle" },
    { label:"Hazardous",      key:"hazardous",  color:"#C2541E", icon:"alert" },
    { label:"Food / Organic", key:"organic",    color:G.amber,   icon:"leaf" },
    { label:"Glass",          key:"glass",      color:"#5B6B86", icon:"glass" },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

      {/* Date range filter */}
      <Card>
        <SectionTitle>Select Report Period</SectionTitle>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap", alignItems:"flex-end" }}>
          <div style={{ flex:"1 1 140px" }}>
            <label style={{ fontSize:10, fontWeight:700, color:G.muted, letterSpacing:0.8,
              textTransform:"uppercase", display:"block", marginBottom:5 }}>From</label>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
              style={{ width:"100%", border:`1px solid ${G.hairline}`, borderRadius:8,
                padding:"9px 12px", fontSize:13, color:G.charcoal, outline:"none", fontFamily:"Open Sans, sans-serif" }}/>
          </div>
          <div style={{ flex:"1 1 140px" }}>
            <label style={{ fontSize:10, fontWeight:700, color:G.muted, letterSpacing:0.8,
              textTransform:"uppercase", display:"block", marginBottom:5 }}>To</label>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
              style={{ width:"100%", border:`1px solid ${G.hairline}`, borderRadius:8,
                padding:"9px 12px", fontSize:13, color:G.charcoal, outline:"none", fontFamily:"Open Sans, sans-serif" }}/>
          </div>
          <button onClick={() => setGenerated(true)} className="btn" style={{
            background:G.mid, color:G.white, border:"none", borderRadius:8,
            padding:"10px 20px", fontSize:13, fontWeight:700, cursor:"pointer", flexShrink:0 }}>
            Generate Report
          </button>
          <button className="btn" style={{
            background:G.pale, color:G.mid, border:`1px solid ${G.paleMid}`, borderRadius:8,
            padding:"10px 16px", fontSize:12, fontWeight:700, cursor:"pointer", flexShrink:0 }}>
            <Icon name="download" size={13} style={{ display:"inline-block", verticalAlign:"-2px", marginRight:3 }}/> Export PDF
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
                letterSpacing:0.8, marginBottom:5 }}><Icon name={s.icon} size={13} color={s.color} style={{ display:"inline-block", verticalAlign:"-2px", marginRight:5 }}/>{s.label}</div>
              <div style={{ fontSize:22, fontWeight:800, color:G.charcoal, fontFamily:"Montserrat" }}>
                {totals[s.key].toLocaleString()}
              </div>
              <div style={{ fontSize:11, color:G.muted }}>kg total</div>
              <div style={{ marginTop:6, fontSize:11, fontWeight:700,
                color:s.color }}>{Math.round(totals[s.key]/totalAll*100)}% of waste</div>
            </div>
          ))}
        </div>

        {/* Waste composition pie */}
        <Card>
          <SectionTitle>Waste Composition by Type</SectionTitle>
          <PieChart
            G={G}
            centerTop={`${(totalAll/1000).toFixed(1)}t`}
            centerBottom="total"
            data={streams.map(s => ({ label:s.label, value:totals[s.key], color:s.color }))}
          />
        </Card>

        {/* Recycling rate */}
        <Card>
          <SectionTitle>Recycling Rate</SectionTitle>
          <PieChart
            G={G}
            centerTop={`${Math.round(totals.recycling / totalAll * 100)}%`}
            centerBottom="recycled"
            data={[
              { label:"Recycled",    value:totals.recycling,            color:G.bright },
              { label:"Other waste", value:totalAll - totals.recycling, color:G.hairline },
            ]}
          />
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
                      <td style={{ padding:"9px 8px", color:"#C2541E" }}>{m.hazardous.toLocaleString()}</td>
                      <td style={{ padding:"9px 8px", color:G.amber }}>{m.organic.toLocaleString()}</td>
                      <td style={{ padding:"9px 8px", color:"#5B6B86" }}>{m.glass.toLocaleString()}</td>
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
                  <td style={{ padding:"10px 8px", fontWeight:700, color:"#C2541E" }}>{totals.hazardous.toLocaleString()}</td>
                  <td style={{ padding:"10px 8px", fontWeight:700, color:G.amber }}>{totals.organic.toLocaleString()}</td>
                  <td style={{ padding:"10px 8px", fontWeight:700, color:"#5B6B86" }}>{totals.glass.toLocaleString()}</td>
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
    { icon:"trash", label:"General Waste Collection" },
    { icon:"recycle", label:"Recycling Collection"      },
    { icon:"plus", label:"Additional Bin"             },
    { icon:"alert", label:"Hazardous Waste"            },
    { icon:"leaf", label:"Food / Organic Waste"       },
    { icon:"glass", label:"Glass Collection"           },
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
                      <span style={{ display:"flex" }}><Icon name={s.icon} size={16}/></span>{s.label}
                      {on && <span style={{ color:G.mid, fontWeight:700 }}><Icon name="check" size={15}/></span>}
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
                  padding:"10px 12px", fontSize:13, color:G.charcoal, outline:"none", fontFamily:"Open Sans, sans-serif" }}/>
            </div>

            <div>
              <label style={{ fontSize:10, fontWeight:700, color:G.muted, letterSpacing:0.8,
                textTransform:"uppercase", display:"block", marginBottom:6 }}>Detailed Description of Services</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Volumes, bin sizes, access requirements, anything else we should know..."
                style={{ width:"100%", border:`1px solid ${G.hairline}`, borderRadius:8,
                  padding:"10px 12px", fontSize:12, color:G.charcoal, resize:"vertical",
                  minHeight:80, outline:"none", fontFamily:"Open Sans, sans-serif" }}/>
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
            <div style={{ fontSize:40, marginBottom:12 }}><Icon name="check-circle" size={42} color={G.mid}/></div>
            <div style={{ fontWeight:700, color:G.mid, fontSize:16, fontFamily:"Montserrat" }}>Quote request submitted</div>
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
const ThemeCtx = React.createContext(THEMES.professional);
const useTheme = () => React.useContext(ThemeCtx);

// ── Appearance Settings ───────────────────────────────────────────────────────
function ThemePreview({ tk }) {
  return (
    <div style={{ display:"flex", height:84, borderRadius:8, overflow:"hidden",
      border:`1px solid ${tk.hairline}`, background:tk.bg }}>
      <div style={{ width:28, background:tk.sbBg, borderRight:`1px solid ${tk.sbBorder}`,
        display:"flex", flexDirection:"column", alignItems:"center", paddingTop:8, gap:6, flexShrink:0 }}>
        <div style={{ width:14, height:14, borderRadius:4, background:tk.sbActiveBar }}/>
        <div style={{ width:16, height:4, borderRadius:2, background:tk.sbActiveBg }}/>
        <div style={{ width:16, height:4, borderRadius:2, background:tk.sbMuted, opacity:0.55 }}/>
        <div style={{ width:16, height:4, borderRadius:2, background:tk.sbMuted, opacity:0.55 }}/>
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        <div style={{ height:16, background:tk.white, borderBottom:`1px solid ${tk.hairline}`,
          display:"flex", alignItems:"center", paddingLeft:8, flexShrink:0 }}>
          <div style={{ width:26, height:4, borderRadius:2, background:tk.charcoal, opacity:0.7 }}/>
        </div>
        <div style={{ flex:1, padding:8, display:"flex", flexDirection:"column", gap:6 }}>
          <div style={{ background:tk.white, border:`1px solid ${tk.hairline}`, borderRadius:5,
            padding:6, display:"flex", flexDirection:"column", gap:4 }}>
            <div style={{ width:"62%", height:4, borderRadius:2, background:tk.charcoal, opacity:0.65 }}/>
            <div style={{ width:"40%", height:3, borderRadius:2, background:tk.muted, opacity:0.7 }}/>
          </div>
          <div style={{ width:44, height:11, borderRadius:4, background:tk.mid }}/>
        </div>
      </div>
    </div>
  );
}

function AppearanceModal({ current, onSelect, onClose }) {
  const G = useTheme();
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)",
      zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16,
      backdropFilter:"blur(2px)" }}>
      <div onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Appearance Settings"
        className="fadeUp" style={{ background:G.white, borderRadius:14, width:"100%", maxWidth:560,
        boxShadow:"0 24px 60px rgba(0,0,0,0.32)", border:`1px solid ${G.hairline}`, overflow:"hidden" }}>
        <div style={{ padding:"18px 22px", borderBottom:`1px solid ${G.hairline}`,
          display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
          <div>
            <h3 style={{ fontSize:17, fontWeight:800, color:G.charcoal, fontFamily:"Montserrat, sans-serif",
              display:"flex", alignItems:"center", gap:8, whiteSpace:"nowrap" }}>
              <Icon name="appearance" size={18} color={G.mid}/> Appearance Settings
            </h3>
            <p style={{ fontSize:12.5, color:G.muted, marginTop:5 }}>Choose the visual style that works best for you.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="btn" style={{ background:G.pale,
            border:`1px solid ${G.hairline}`, borderRadius:8, width:32, height:32, cursor:"pointer", color:G.muted,
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Icon name="close" size={16}/>
          </button>
        </div>
        <div role="radiogroup" aria-label="Theme" style={{ padding:"18px 22px", display:"flex", flexDirection:"column", gap:12 }}>
          {THEME_META.map(m => {
            const tk = THEMES[m.id];
            const selected = current === m.id;
            return (
              <button key={m.id} onClick={() => onSelect(m.id)} role="radio" aria-checked={selected}
                style={{ display:"grid", gridTemplateColumns:"122px 1fr 26px", gap:14, alignItems:"center",
                  textAlign:"left", cursor:"pointer", background: selected ? G.pale : G.white,
                  border:`1.5px solid ${selected ? G.mid : G.hairline}`, borderRadius:11, padding:11,
                  transition:"border-color .15s, background .15s" }}>
                <ThemePreview tk={tk}/>
                <div>
                  <div style={{ fontSize:13.5, fontWeight:700, color:G.charcoal, fontFamily:"Montserrat, sans-serif" }}>{m.label}</div>
                  <div style={{ fontSize:12, color:G.muted, marginTop:3 }}>{m.desc}</div>
                </div>
                <div style={{ width:23, height:23, borderRadius:"50%", flexShrink:0,
                  border:`2px solid ${selected ? G.mid : G.paleMid}`, background: selected ? G.mid : "transparent",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {selected && <Icon name="check" size={13} color="#fff"/>}
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ padding:"0 22px 18px", display:"flex", justifyContent:"flex-end" }}>
          <button onClick={onClose} className="btn" style={{ background:G.mid, color:"#fff", border:"none",
            borderRadius:8, padding:"10px 24px", fontSize:13, fontWeight:700, cursor:"pointer" }}>Done</button>
        </div>
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function WastePortal() {
  const [tab, setTab] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);   // mobile drawer
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {       // desktop / tablet
    try { return localStorage.getItem("wm-sidebar-collapsed") === "1"; } catch { return false; }
  });
  const [showBooking, setShowBooking] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showAppearance, setShowAppearance] = useState(false);
  const [themeId, setThemeId] = useState(() => {
    try { const st = localStorage.getItem("wm-theme"); return st && THEMES[st] ? st : "professional"; }
    catch { return "professional"; }
  });
  const containerRef = useRef(null);
  const bucketRef = useRef("desktop");

  const T = THEMES[themeId] || THEMES.professional;
  const themeLabel = T.label;
  const navIcons = ["home","quote","history","folder","card","chart","chat"];

  // Persist preferences (initial values are read lazily in useState above).
  useEffect(() => { try { localStorage.setItem("wm-theme", themeId); } catch { /* ignore */ } }, [themeId]);
  useEffect(() => { try { localStorage.setItem("wm-sidebar-collapsed", collapsed ? "1" : "0"); } catch { /* ignore */ } }, [collapsed]);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(entries => {
      for (const e of entries) {
        const w = e.contentRect.width;
        const bucket = w < 768 ? "mobile" : (w < 1200 ? "tablet" : "desktop");
        setIsMobile(w < 768);
        if (w >= 768) setSidebarOpen(false);
        if (bucket !== bucketRef.current) {
          if (bucket === "tablet") setCollapsed(true);
          else if (bucket === "desktop") {
            let pref = false;
            try { pref = localStorage.getItem("wm-sidebar-collapsed") === "1"; } catch { /* ignore */ }
            setCollapsed(pref);
          }
          bucketRef.current = bucket;
        }
      }
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const col = !isMobile && collapsed;   // effective collapsed state
  const onNavKey = (e, i) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setTab(i); if (isMobile) setSidebarOpen(false); }
  };

  const tabContent = [
    <OverviewTab onBook={() => setShowBooking(true)}/>,
    <QuoteTab/>,
    <HistoryTab/>,
    <DocumentsTab/>,
    <InvoicesTab/>,
    <ReportsTab/>,
    <SupportTab/>,
  ];

  const accountRows = [
    { label:"Contract", val:"Commercial — Monthly" },
    { label:"Site", val:"Wastemart CP Prototype, Ndabeni" },
    { label:"Next Invoice", val:"01 Apr 2026" },
  ];

  return (
    <ThemeCtx.Provider value={T}>
    <div ref={containerRef} style={{ display:"flex", height:"100vh", fontFamily:"'Open Sans', sans-serif",
      background:T.bg, color:T.charcoal, overflow:"hidden", position:"relative",
      "--wm-row-hover":T.rowHover, "--wm-doc-hover":T.docHover, "--wm-sidenav-hover":T.sbHover,
      "--wm-scroll":T.scroll, "--wm-tip-bg":T.tipBg, "--wm-tip-text":T.tipText, "--wm-focus":T.focus }}>
      <FontLoader/>
      {showBooking && <BookingModal onClose={() => setShowBooking(false)}/>}
      {showAppearance && <AppearanceModal current={themeId} onSelect={setThemeId} onClose={() => setShowAppearance(false)}/>}

      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:200, backdropFilter:"blur(2px)" }}/>
      )}

      {/* ── SIDEBAR ── */}
      <aside aria-label="Primary navigation" style={{
        width: isMobile ? 280 : (col ? 72 : 280),
        background:T.sbBg, borderRight:`1px solid ${T.sbBorder}`,
        display:"flex", flexDirection:"column", flexShrink:0, position:"relative", zIndex:10,
        transition:"width 0.25s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: T.sbShadow,
        ...(isMobile ? {
          position:"fixed", top:0, left:0, bottom:0, zIndex:300, width:280,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition:"transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        } : {}),
      }}>
        {/* Brand */}
        <div style={{ padding: col ? "18px 0 14px" : "18px 16px 14px", borderBottom:`1px solid ${T.sbBorder}`, position:"relative" }}>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} aria-label="Close menu" style={{
              position:"absolute", top:12, right:12, background:T.sbBadgeBg,
              border:`1px solid ${T.sbBadgeBorder}`, borderRadius:6, color:T.sbText, width:30, height:30,
              cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Icon name="close" size={16}/></button>
          )}
          <div style={{ display:"flex", alignItems:"center", justifyContent: col ? "center" : "flex-start", gap:10 }}>
            <div style={{ background:"#FFFFFF", borderRadius:8, padding: col ? "5px 6px" : "6px 10px",
              display:"flex", alignItems:"center", boxShadow:"0 1px 3px rgba(20,40,40,0.14)",
              border:"1px solid rgba(20,40,40,0.07)", transition:"all 0.25s" }}>
              <img src={LOGO_URL} alt="WasteMart" style={{ height: col ? 24 : 32, width:"auto", display:"block", transition:"all 0.25s" }}/>
            </div>
          </div>
          {!col && (
            <div style={{ color:T.sbMuted, fontSize:8.5, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginTop:8 }}>Customer Portal</div>
          )}
        </div>

        {/* Customer / profile */}
        <div style={{ padding: col ? "12px 0" : "14px 16px", borderBottom:`1px solid ${T.sbBorder}`,
          display:"flex", justifyContent: col ? "center" : "stretch" }}>
          {col ? (
            <div className="wm-tipwrap" tabIndex={0} aria-label={"Account: Wastemart CP Prototype. Theme: " + themeLabel}
              style={{ position:"relative" }}>
              <div style={{ width:34, height:34, borderRadius:"50%", background:T.mid, color:"#fff", fontWeight:700,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>E</div>
              <span className="wm-tip wm-tip-rich"><b>Wastemart CP Prototype</b><br/>Account WCP-00001<br/>Theme: {themeLabel}</span>
            </div>
          ) : (
            <div style={{ width:"100%", background:T.sbBadgeBg, borderRadius:8, padding:"10px 12px", border:`1px solid ${T.sbBadgeBorder}` }}>
              <div onClick={() => setAcctOpen(o => !o)} style={{ cursor:"pointer" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                  <div style={{ width:26, height:26, borderRadius:"50%", background:T.mid, color:"#fff", fontWeight:700,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0 }}>E</div>
                  <div style={{ color:T.sbBadgeText, fontSize:12, fontWeight:700, flex:1, minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>Wastemart CP Prototype</div>
                  <span style={{ color:T.sbMuted, display:"flex", transform: acctOpen ? "rotate(180deg)" : "rotate(0deg)", transition:"transform 0.2s" }}><Icon name="chevron-down" size={14}/></span>
                </div>
                <div style={{ fontSize:10, color:T.sbMuted, letterSpacing:0.4 }}>Account WCP-00001 · {themeLabel}</div>
              </div>
              {acctOpen && (
                <div style={{ marginTop:10, paddingTop:10, borderTop:`1px solid ${T.sbBadgeBorder}`, display:"flex", flexDirection:"column", gap:8 }}>
                  {accountRows.map(r => (
                    <div key={r.label}>
                      <div style={{ fontSize:8, fontWeight:700, color:T.sbMuted, letterSpacing:0.8, textTransform:"uppercase", marginBottom:1 }}>{r.label}</div>
                      <div style={{ fontSize:11, fontWeight:600, color:T.sbBadgeText }}>{r.val}</div>
                    </div>
                  ))}
                  <button onClick={() => { setShowAppearance(true); setAcctOpen(false); }} className="btn" style={{
                    display:"flex", alignItems:"center", gap:8, background:"transparent",
                    border:`1px solid ${T.sbBadgeBorder}`, color:T.sbBadgeText, borderRadius:7,
                    padding:"8px 10px", fontSize:11.5, fontWeight:700, cursor:"pointer", marginTop:2 }}>
                    <Icon name="appearance" size={14}/> Appearance Settings
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"10px 0", overflowY:"auto", overflowX:"hidden" }}>
          {TABS.map((t, i) => (
            <div key={t} className="side-nav wm-tipwrap" role="button" tabIndex={0} aria-label={t}
              aria-current={tab === i ? "page" : undefined}
              onClick={() => { setTab(i); if (isMobile) setSidebarOpen(false); }}
              onKeyDown={(e) => onNavKey(e, i)}
              style={{
                display:"flex", alignItems:"center", justifyContent: col ? "center" : "flex-start",
                gap:12, padding: col ? "12px 0" : "11px 18px", margin: col ? "3px 12px" : "0",
                borderRadius: col ? 10 : 0, cursor:"pointer", fontSize:13, fontWeight: tab === i ? 700 : 500,
                color: tab === i ? T.sbActiveText : T.sbText,
                background: tab === i ? T.sbActiveBg : "transparent",
                borderLeft: col ? "none" : (tab === i ? `3px solid ${T.sbActiveBar}` : "3px solid transparent"),
                transition:"background 0.15s, color 0.15s",
              }}>
              <span style={{ display:"flex", color: tab === i ? T.sbActiveText : T.sbMuted }}>
                <Icon name={navIcons[i]} size={19} strokeWidth={tab === i ? 2.1 : 1.9}/>
              </span>
              {!col && <span style={{ whiteSpace:"nowrap" }}>{t}</span>}
              {col && <span className="wm-tip">{t}</span>}
            </div>
          ))}
          {/* Book a Service CTA */}
          <div style={{ margin: col ? "12px 12px 0" : "10px 14px 0" }}>
            {col ? (
              <button onClick={() => { setShowBooking(true); if (isMobile) setSidebarOpen(false); }} aria-label="Book a Service"
                className="btn wm-tipwrap" style={{ width:"100%", background:T.ctaBg, color:T.ctaText, border:"none",
                  borderRadius:10, padding:"11px 0", cursor:"pointer", display:"flex", alignItems:"center",
                  justifyContent:"center", position:"relative" }}>
                <Icon name="calendar" size={18}/>
                <span className="wm-tip">Book a Service</span>
              </button>
            ) : (
              <button onClick={() => { setShowBooking(true); if (isMobile) setSidebarOpen(false); }}
                className="btn" style={{ width:"100%", background:T.ctaBg, color:T.ctaText, border:"none", borderRadius:8,
                  padding:"10px 14px", fontSize:12, fontWeight:800, cursor:"pointer", display:"flex",
                  alignItems:"center", justifyContent:"center", gap:6 }}>
                <Icon name="calendar" size={16}/> Book a Service
              </button>
            )}
          </div>
        </nav>

        {/* Collapse / expand toggle — icon only, bottom of sidebar (desktop / tablet) */}
        {!isMobile && (
          <button onClick={() => setCollapsed(c => !c)} aria-label={col ? "Expand sidebar" : "Collapse sidebar"}
            className="btn wm-tipwrap" style={{ display:"flex", alignItems:"center", justifyContent:"center",
              background:"transparent", border:"none", borderTop:`1px solid ${T.sbBorder}`, color:T.sbMuted,
              cursor:"pointer", padding:"12px 0", position:"relative" }}>
            <Icon name={col ? "panel-right" : "panel-left"} size={19}/>
            <span className="wm-tip">{col ? "Expand sidebar" : "Collapse sidebar"}</span>
          </button>
        )}

        {!col && (
          <div style={{ padding:"12px 14px", borderTop:`1px solid ${T.sbBorder}` }}>
            <div style={{ fontSize:11, color:T.sbMuted, textAlign:"center" }}>
              Powered by GEMIS · gemis.co.za
            </div>
          </div>
        )}
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex:1, overflowY:"auto", minWidth:0, display:"flex", flexDirection:"column" }}>

        {/* Mobile top bar */}
        {isMobile && (
          <div style={{ background:T.mobileBar, padding:"12px 16px", display:"flex",
            justifyContent:"space-between", alignItems:"center", flexShrink:0,
            boxShadow:"0 2px 8px rgba(0,0,0,0.2)", position:"sticky", top:0, zIndex:100 }}>
            <button onClick={() => setSidebarOpen(true)} aria-label="Open menu" style={{
              background:"rgba(255,255,255,0.15)", border:"none", borderRadius:8,
              color:"#fff", width:40, height:40, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center" }}><Icon name="menu" size={20}/></button>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ display:"flex" }}><Icon name="recycle" size={18} color="#fff"/></span>
              <span style={{ color:"#fff", fontWeight:800, fontFamily:"Montserrat, sans-serif" }}>WasteMart</span>
            </div>
            <button aria-label="Sign Out" style={{
              background:"rgba(255,255,255,0.15)", border:"none", borderRadius:8, color:"#fff",
              fontSize:11, fontWeight:700, padding:"7px 12px", cursor:"pointer",
              display:"flex", alignItems:"center", gap:5 }}>
              <Icon name="lock" size={14}/> Sign Out
            </button>
          </div>
        )}

        {/* Desktop page header */}
        {!isMobile && (
          <div style={{ background:T.white, borderBottom:`1px solid ${T.hairline}`,
            padding:"14px 28px", display:"flex", justifyContent:"space-between",
            alignItems:"center", flexShrink:0, boxShadow: T.isDark ? "0 1px 3px rgba(0,0,0,0.4)" : "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div>
              <div style={{ fontSize:10, color:T.muted, letterSpacing:1, fontWeight:700, textTransform:"uppercase", marginBottom:4, whiteSpace:"nowrap" }}>
                Customer Portal · Wastemart CP Prototype
              </div>
              <h2 style={{ fontSize:18, fontWeight:800, color:T.charcoal, fontFamily:"Montserrat, sans-serif" }}>{TABS[tab]}</h2>
            </div>
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              {/* Profile menu */}
              <div style={{ position:"relative" }}>
                <button onClick={() => setProfileOpen(o => !o)} aria-haspopup="menu" aria-expanded={profileOpen} aria-label="Profile menu"
                  style={{ width:34, height:34, borderRadius:"50%", background:T.pale, display:"flex", alignItems:"center",
                    justifyContent:"center", fontWeight:800, color:T.mid, fontSize:14, cursor:"pointer", border:`1px solid ${T.hairline}` }}>W</button>
                {profileOpen && (
                  <React.Fragment>
                    <div onClick={() => setProfileOpen(false)} style={{ position:"fixed", inset:0, zIndex:40 }}/>
                    <div role="menu" style={{ position:"absolute", right:0, top:"calc(100% + 8px)", width:240,
                      background:T.white, border:`1px solid ${T.hairline}`, borderRadius:10, zIndex:50, overflow:"hidden",
                      boxShadow:"0 16px 40px rgba(0,0,0,0.2)" }}>
                      <div style={{ padding:"12px 14px", borderBottom:`1px solid ${T.hairline}` }}>
                        <div style={{ fontSize:13, fontWeight:700, color:T.charcoal }}>Wastemart CP Prototype</div>
                        <div style={{ fontSize:11, color:T.muted, marginTop:1 }}>portal@wastemart.co.za</div>
                      </div>
                      <button onClick={() => { setShowAppearance(true); setProfileOpen(false); }} role="menuitem" className="btn"
                        style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"11px 14px",
                          background:"transparent", border:"none", cursor:"pointer", textAlign:"left" }}>
                        <Icon name="appearance" size={16} color={T.mid}/>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:12.5, fontWeight:600, color:T.charcoal }}>Appearance Settings</div>
                          <div style={{ fontSize:10.5, color:T.muted, marginTop:1 }}>Theme: {themeLabel}</div>
                        </div>
                        <Icon name="chevron-right" size={14} color={T.muted}/>
                      </button>
                      <button role="menuitem" className="btn"
                        style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"11px 14px",
                          background:"transparent", border:"none", borderTop:`1px solid ${T.hairline}`, cursor:"pointer",
                          textAlign:"left", color:T.muted, fontSize:12.5, fontWeight:600 }}>
                        <Icon name="logout" size={16}/> Sign Out
                      </button>
                    </div>
                  </React.Fragment>
                )}
              </div>
              <button className="btn" style={{
                background:T.white, color:T.muted, border:`1px solid ${T.hairline}`, borderRadius:8,
                padding:"8px 14px", fontSize:12, fontWeight:700, cursor:"pointer",
                display:"flex", alignItems:"center", gap:6 }}>
                <Icon name="lock" size={14}/> Sign Out
              </button>
            </div>
          </div>
        )}
        <DataFreshnessBar/>

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", padding: isMobile ? "16px" : "24px 28px" }} key={tab}>
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

