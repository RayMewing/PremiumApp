// Custom SVG logos — no external API needed

export function DanaLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="12" fill="#108EE9"/>
      <text x="20" y="26" textAnchor="middle" fill="white" fontSize="12" fontWeight="800" fontFamily="Arial">DANA</text>
    </svg>
  )
}

export function OvoLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="12" fill="#4B2D83"/>
      <text x="20" y="26" textAnchor="middle" fill="white" fontSize="13" fontWeight="900" fontFamily="Arial">OVO</text>
    </svg>
  )
}

export function GopayLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="12" fill="#00AA5B"/>
      <text x="20" y="25" textAnchor="middle" fill="white" fontSize="9" fontWeight="800" fontFamily="Arial">GoPay</text>
    </svg>
  )
}

export function ShopeePayLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="12" fill="#EE4D2D"/>
      <text x="20" y="22" textAnchor="middle" fill="white" fontSize="7" fontWeight="800" fontFamily="Arial">Shopee</text>
      <text x="20" y="31" textAnchor="middle" fill="white" fontSize="7" fontWeight="800" fontFamily="Arial">Pay</text>
    </svg>
  )
}

export function LinkAjaLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="12" fill="#E82529"/>
      <text x="20" y="22" textAnchor="middle" fill="white" fontSize="7" fontWeight="800" fontFamily="Arial">Link</text>
      <text x="20" y="31" textAnchor="middle" fill="white" fontSize="7" fontWeight="800" fontFamily="Arial">Aja</text>
    </svg>
  )
}

export function IsakuLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="12" fill="#F7941D"/>
      <text x="20" y="26" textAnchor="middle" fill="white" fontSize="10" fontWeight="800" fontFamily="Arial">iSaku</text>
    </svg>
  )
}

export function JenisEwallet({ kode = '', size = 40 }) {
  const map = {
    DANA:     <DanaLogo size={size} />,
    OVO:      <OvoLogo size={size} />,
    GOPAY:    <GopayLogo size={size} />,
    SHOPEEPAY:<ShopeePayLogo size={size} />,
    LINKAJA:  <LinkAjaLogo size={size} />,
    ISAKU:    <IsakuLogo size={size} />,
  }
  const key = kode.toUpperCase().replace(/[^A-Z]/g, '')
  return map[key] || (
    <div style={{ width:size,height:size,borderRadius:size*0.3,background:'#e2e8f0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:size*0.28,fontWeight:800,color:'#64748b' }}>
      {kode.slice(0,2).toUpperCase()}
    </div>
  )
}

// Carrier logos
export function CarrierBadge({ name, size = 36 }) {
  const carriers = {
    'Telkomsel': { bg: '#FF0000', color: '#fff', short: 'TSL' },
    'Indosat':   { bg: '#FFCC00', color: '#000', short: 'IM3' },
    'XL':        { bg: '#0066AE', color: '#fff', short: 'XL' },
    'Axis':      { bg: '#6200EA', color: '#fff', short: 'AXS' },
    'Smartfren': { bg: '#E31E24', color: '#fff', short: 'SF' },
    'Three':     { bg: '#F58220', color: '#fff', short: '3' },
  }
  const c = carriers[name] || { bg: '#64748b', color: '#fff', short: name?.slice(0,2) || '?' }
  return (
    <div style={{ width:size,height:size,borderRadius:size*0.28,background:c.bg,display:'flex',alignItems:'center',justifyContent:'center',color:c.color,fontSize:size*0.3,fontWeight:800,fontFamily:'Inter,sans-serif',flexShrink:0 }}>
      {c.short}
    </div>
  )
}
