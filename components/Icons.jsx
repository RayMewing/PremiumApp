'use client'

const defaults = { size: 20, color: 'currentColor', strokeWidth: 1.8 }

export function Icon({ name, size, color, strokeWidth, style = {} }) {
  const s = size || defaults.size
  const c = color || defaults.color
  const sw = strokeWidth || defaults.strokeWidth
  const p = { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: c, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round', style }

  const icons = {
    home:        <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
    history:     <svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    wallet:      <svg {...p}><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
    bell:        <svg {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    user:        <svg {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    settings:    <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    lock:        <svg {...p}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    mail:        <svg {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    phone:       <svg {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41a2 2 0 0 1 1.95-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    wifi:        <svg {...p}><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill={c}/></svg>,
    zap:         <svg {...p}><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" fill={c} stroke="none"/></svg>,
    tv:          <svg {...p}><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17,2 12,7 7,2"/></svg>,
    gift:        <svg {...p}><polyline points="20,12 20,22 4,22 4,12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
    gamepad:     <svg {...p}><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="17" cy="10" r="1" fill={c}/><circle cx="15" cy="14" r="1" fill={c}/></svg>,
    star:        <svg {...p}><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/></svg>,
    'star-fill': <svg {...p} fill={c}><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/></svg>,
    trending:    <svg {...p}><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/><polyline points="17,6 23,6 23,12"/></svg>,
    layers:      <svg {...p}><polygon points="12,2 2,7 12,12 22,7 12,2"/><polyline points="2,17 12,22 22,17"/><polyline points="2,12 12,17 22,12"/></svg>,
    crown:       <svg {...p}><path d="M2 20h20M5 20L3 8l5 4 4-7 4 7 5-4-2 12"/></svg>,
    'chevron-right': <svg {...p}><polyline points="9,18 15,12 9,6"/></svg>,
    'chevron-left':  <svg {...p}><polyline points="15,18 9,12 15,6"/></svg>,
    'chevron-down':  <svg {...p}><polyline points="6,9 12,15 18,9"/></svg>,
    check:       <svg {...p}><polyline points="20,6 9,17 4,12"/></svg>,
    'check-circle': <svg {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>,
    'x-circle':  <svg {...p}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
    clock:       <svg {...p}><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
    refresh:     <svg {...p}><polyline points="23,4 23,10 17,10"/><polyline points="1,20 1,14 7,14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
    copy:        <svg {...p}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
    eye:         <svg {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    'eye-off':   <svg {...p}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
    plus:        <svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    minus:       <svg {...p}><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    trash:       <svg {...p}><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
    edit:        <svg {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    upload:      <svg {...p}><polyline points="16,16 12,12 8,16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
    image:       <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5" fill={c}/><polyline points="21,15 16,10 5,21"/></svg>,
    link:        <svg {...p}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
    'arrow-left':<svg {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/></svg>,
    'arrow-up':  <svg {...p}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5,12 12,5 19,12"/></svg>,
    logout:      <svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    shield:      <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    database:    <svg {...p}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
    users:       <svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    'bar-chart': <svg {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    package:     <svg {...p}><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    tag:         <svg {...p}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    calendar:    <svg {...p}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    sim:         <svg {...p}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><rect x="8" y="8" width="8" height="8" rx="1"/></svg>,
    msg:         <svg {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    number:      <svg {...p}><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>,
    'dollar':    <svg {...p}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 0 0 7H6"/></svg>,
    menu:        <svg {...p}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    info:        <svg {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
    'alert-tri': <svg {...p}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    grid:        <svg {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    sparkle:     <svg {...p}><path d="M12 3L13.5 8.5H19L14.5 12L16 17.5L12 14L8 17.5L9.5 12L5 8.5H10.5L12 3Z" fill={c} stroke="none"/></svg>,
  }
  return icons[name] || <svg {...p}><circle cx="12" cy="12" r="10"/></svg>
}

// Prebuilt carrier logos
export function TelkomselLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <rect width="36" height="36" rx="10" fill="#CC0000"/>
      <text x="18" y="23" textAnchor="middle" fill="white" fontSize="9" fontWeight="900" fontFamily="Arial,sans-serif">TSEL</text>
    </svg>
  )
}
export function IndosatLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <rect width="36" height="36" rx="10" fill="#FFCC00"/>
      <text x="18" y="23" textAnchor="middle" fill="#000" fontSize="9" fontWeight="900" fontFamily="Arial,sans-serif">IM3</text>
    </svg>
  )
}
export function XLLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <rect width="36" height="36" rx="10" fill="#0066AE"/>
      <text x="18" y="24" textAnchor="middle" fill="white" fontSize="14" fontWeight="900" fontFamily="Arial,sans-serif">XL</text>
    </svg>
  )
}
export function AxisLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <rect width="36" height="36" rx="10" fill="#6200EA"/>
      <text x="18" y="23" textAnchor="middle" fill="white" fontSize="10" fontWeight="900" fontFamily="Arial,sans-serif">AXIS</text>
    </svg>
  )
}
export function SmartfrenLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <rect width="36" height="36" rx="10" fill="#E31E24"/>
      <text x="18" y="22" textAnchor="middle" fill="white" fontSize="7" fontWeight="900" fontFamily="Arial,sans-serif">Smart</text>
      <text x="18" y="30" textAnchor="middle" fill="white" fontSize="7" fontWeight="900" fontFamily="Arial,sans-serif">fren</text>
    </svg>
  )
}
export function ThreeLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <rect width="36" height="36" rx="10" fill="#F58220"/>
      <text x="18" y="25" textAnchor="middle" fill="white" fontSize="18" fontWeight="900" fontFamily="Arial,sans-serif">3</text>
    </svg>
  )
}

export function CarrierLogo({ name, size = 36 }) {
  const map = { Telkomsel: TelkomselLogo, Indosat: IndosatLogo, XL: XLLogo, Axis: AxisLogo, Smartfren: SmartfrenLogo, Three: ThreeLogo }
  const Comp = map[name]
  if (Comp) return <Comp size={size} />
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <rect width="36" height="36" rx="10" fill="#64748b"/>
      <text x="18" y="23" textAnchor="middle" fill="white" fontSize="9" fontWeight="900" fontFamily="Arial,sans-serif">{name?.slice(0,3).toUpperCase()}</text>
    </svg>
  )
}
