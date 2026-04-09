'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { Icon, CarrierLogo } from '@/components/Icons'
import { JenisEwallet } from '@/components/EwalletLogos'

// ─── Carrier detection (same logic as PHP) ───────────────────────
const CARRIERS = [
  { name:'Telkomsel', prefixes:['0811','0812','0813','0821','0822','0823','0851','0852','0853','0858'], color:'#CC0000', bg:'#FFF0F0' },
  { name:'Indosat',   prefixes:['0814','0815','0816','0855','0856','0857'],                            color:'#FFCC00', bg:'#FFFDE0', textColor:'#333' },
  { name:'XL',        prefixes:['0817','0818','0819','0859','0877','0878','0876'],                     color:'#0066AE', bg:'#E8F4FF' },
  { name:'Axis',      prefixes:['0831','0832','0833','0838'],                                          color:'#6200EA', bg:'#F3E8FF' },
  { name:'Smartfren', prefixes:['0881','0882','0883','0884','0885','0886','0887','0888','0889'],        color:'#E31E24', bg:'#FFF0F0' },
  { name:'Three',     prefixes:['0895','0896','0897','0898','0899'],                                   color:'#F58220', bg:'#FFF6EE' },
]
function detectCarrier(phone) {
  const norm = phone.startsWith('62') ? '0'+phone.slice(2) : phone
  return CARRIERS.find(c => c.prefixes.some(p => norm.startsWith(p))) || null
}
function normalizePhone(phone) {
  const clean = phone.replace(/\D/g,'')
  return clean.startsWith('62') ? '0'+clean.slice(2) : clean
}

// ─── Category matcher (same as PHP catKW) ────────────────────────
const CATEGORY_FILTERS = {
  pulsa:    p => /pulsa/i.test(p.name+' '+(p.category||'')) && !/transfer/i.test(p.name),
  data:     p => /paket|data|internet|kuota/i.test(p.name+' '+(p.category||'')),
  pln:      p => /pln|listrik|token/i.test(p.name+' '+(p.category||'')),
  emoney:   p => /dana|gopay|ovo|shopeepay|linkaja|spay|e.?wallet|sakuku/i.test(p.name+' '+(p.category||'')),
  games:    p => /game|diamond|ml|mobile.legend|free.fire|pubg|ff|honor|genshin|cod|valorant/i.test(p.name+' '+(p.category||'')),
  voucher:  p => /voucher/i.test(p.name+' '+(p.category||'')) && !/game/i.test(p.name),
  tagihan:  p => /tagihan|bpjs|pdam|tv|kartu.kredit/i.test(p.name+' '+(p.category||'')),
  sms:      p => /sms|telepon|nelpon|telpon/i.test(p.name+' '+(p.category||'')),
  masaaktif:p => /masa.aktif|extend|perpanjang/i.test(p.name+' '+(p.category||'')),
  perdana:  p => /perdana|aktivasi/i.test(p.name+' '+(p.category||'')),
  tv:       p => /tv|televisi|streaming/i.test(p.name+' '+(p.category||'')),
  all:      () => true,
}

const TYPE_CFG = {
  pulsa:     { label:'Pulsa Reguler',     icon:'phone',    color:'#2563eb',  bg:'#1e40af', needsPhone:true,  api:'pulsa'    },
  data:      { label:'Paket Data',        icon:'wifi',     color:'#0891b2',  bg:'#0c4a6e', needsPhone:true,  api:'data'     },
  emoney:    { label:'E-Money',           icon:'wallet',   color:'#059669',  bg:'#064e3b', needsPhone:false, api:'emoney'   },
  pln:       { label:'Token PLN',         icon:'zap',      color:'#d97706',  bg:'#78350f', needsPhone:false, api:'pln'      },
  games:     { label:'Top Up Games',      icon:'gamepad',  color:'#7c3aed',  bg:'#4c1d95', needsPhone:false, api:'games'    },
  voucher:   { label:'Voucher',           icon:'tag',      color:'#db2777',  bg:'#831843', needsPhone:false, api:'voucher'  },
  premium:   { label:'Akun Premium',      icon:'crown',    color:'#b45309',  bg:'#78350f', needsPhone:false, api:'premium'  },
  perdana:   { label:'Aktivasi Perdana',  icon:'sim',      color:'#0284c7',  bg:'#0c4a6e', needsPhone:true,  api:'perdana'  },
  aktvoucher:{ label:'Aktiv. Voucher',    icon:'tag',      color:'#7c3aed',  bg:'#4c1d95', needsPhone:false, api:'voucher'  },
  masaaktif: { label:'Masa Aktif',        icon:'calendar', color:'#16a34a',  bg:'#14532d', needsPhone:true,  api:'masaaktif'},
  sms:       { label:'SMS & Telpon',      icon:'msg',      color:'#ea580c',  bg:'#7c2d12', needsPhone:true,  api:'sms'      },
  tv:        { label:'TV / Streaming',    icon:'tv',       color:'#dc2626',  bg:'#7f1d1d', needsPhone:false, api:'tv'       },
  tagihan:   { label:'Tagihan',           icon:'dollar',   color:'#0891b2',  bg:'#0c4a6e', needsPhone:false, api:'tagihan'  },
  nokos:     { label:'Nomor Virtual',     icon:'number',   color:'#6d28d9',  bg:'#2e1065', needsPhone:false, api:'nokos', redirect:'/layanan/nokos' },
}

const EWALLET_LIST = [
  { code:'DANA', name:'DANA' }, { code:'OVO', name:'OVO' }, { code:'GOPAY', name:'GoPay' },
  { code:'SHOPEEPAY', name:'ShopeePay' }, { code:'LINKAJA', name:'LinkAja' }, { code:'ISAKU', name:'iSaku' },
]

export default function LayananPage({ params }) {
  // ✅ FIX: Next.js 14 — params is a plain object, NOT a Promise
  const type = params.type
  const router = useRouter()
  const cfg = TYPE_CFG[type] || { label:type, icon:'package', color:'#2563eb', bg:'#1e40af', needsPhone:false, api:type }

  const [phone, setPhone]           = useState('')
  const [target, setTarget]         = useState('')
  const [carrier, setCarrier]       = useState(null)
  const [detecting, setDetecting]   = useState(false)
  const [allProds, setAllProds]     = useState([])
  const [products, setProducts]     = useState([])
  const [loadingProd, setLoadingProd] = useState(false)
  const [selected, setSelected]     = useState(null)
  const [selEw, setSelEw]           = useState(null)
  const [activeTab, setActiveTab]   = useState('')
  const [search, setSearch]         = useState('')
  const [viewMode, setViewMode]     = useState('list')
  const [ordering, setOrdering]     = useState(false)
  const [done, setDone]             = useState(null)
  const [error, setError]           = useState('')
  const [user, setUser]             = useState(null)

  // Redirect nokos to dedicated page
  useEffect(() => {
    if (cfg.redirect) { router.replace(cfg.redirect); return }
  }, [cfg.redirect])

  useEffect(() => {
    fetch('/api/user/me').then(r=>r.json()).then(d => {
      if (!d.success) router.push('/login'); else setUser(d.user)
    })
  }, [])

  // For non-phone services, load products immediately
  useEffect(() => {
    if (!cfg.needsPhone && !cfg.redirect && type !== 'premium') fetchProds()
    if (type === 'premium') fetchPremium()
  }, [type])

  const fetchProds = async (carrierName='') => {
    setLoadingProd(true)
    try {
      const res = await fetch(`/api/layanan/products?type=${cfg.api}&carrier=${carrierName}`)
      const data = await res.json()
      const prods = data.products || []
      setAllProds(prods)
      filterProds(prods, search, activeTab)
    } catch {}
    setLoadingProd(false)
  }

  const fetchPremium = async () => {
    setLoadingProd(true)
    try {
      const res = await fetch('/api/layanan/products?type=premium')
      const data = await res.json()
      setAllProds(data.products || [])
      setProducts(data.products || [])
    } catch {}
    setLoadingProd(false)
  }

  const filterProds = (prods, q, tab) => {
    const catFn = CATEGORY_FILTERS[type] || CATEGORY_FILTERS.all
    let filtered = prods.filter(catFn)
    if (tab) filtered = filtered.filter(p => (p.provider||p.category||'') === tab)
    if (q.length >= 2) filtered = filtered.filter(p => (p.name||'').toLowerCase().includes(q.toLowerCase()))
    setProducts(filtered.slice(0, 80))
  }

  const handleSearch = (q) => {
    setSearch(q)
    filterProds(allProds, q, activeTab)
  }

  const handleTab = (tab) => {
    setActiveTab(tab)
    filterProds(allProds, search, tab)
  }

  const detectPhone = useCallback(async (num) => {
    if (num.length < 4) { setCarrier(null); setProducts([]); return }
    setDetecting(true)
    const c = detectCarrier(num)
    setCarrier(c)
    if (c) await fetchProds(c.name)
    else setProducts([])
    setDetecting(false)
  }, [type])

  const onPhone = (v) => {
    const clean = v.replace(/[^\d]/g,'')
    setPhone(clean); setSelected(null)
    if (clean.length >= 4) detectPhone(clean)
    else { setCarrier(null); setProducts([]) }
  }

  const handleOrder = async () => {
    if (!selected) { setError('Pilih produk terlebih dahulu'); return }
    const tgt = cfg.needsPhone ? normalizePhone(phone) : target
    if (!tgt && type !== 'premium') { setError('Masukkan nomor/ID tujuan'); return }
    const price = parseInt(selected.price || selected.sell_price || 0)
    if ((user?.saldo||0) < price) { setError('Saldo tidak mencukupi. Lakukan Top Up terlebih dahulu.'); return }
    setError(''); setOrdering(true)
    try {
      const res = await fetch('/api/layanan/order', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          type: cfg.api,
          productCode: selected.code || selected.product_code || '',
          productName: selected.name || selected.product_name || '',
          target: tgt,
          carrier: carrier?.name || '',
          price,
        })
      })
      const data = await res.json()
      if (data.success) setDone(data)
      else setError(data.message)
    } catch { setError('Terjadi kesalahan, coba lagi') }
    setOrdering(false)
  }

  if (cfg.redirect) return null
  if (done) return <OrderSuccess data={done} onBack={() => { setDone(null); setSelected(null); setPhone(''); setTarget('') }} router={router} />

  const providers = [...new Set(allProds.map(p => p.provider||p.category||'').filter(Boolean))]
  const showTabs = providers.length > 1

  return (
    <div style={{ background:'#f0f4ff', minHeight:'100dvh' }} className="page-content">
      {/* ─── Header ─── */}
      <div style={{ background:`linear-gradient(150deg,${cfg.bg},${cfg.color})`, padding:'48px 20px 20px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute',top:-50,right:-50,width:180,height:180,borderRadius:'50%',background:'rgba(255,255,255,0.05)' }}/>
        <div style={{ display:'flex',alignItems:'center',gap:12 }}>
          <button onClick={() => router.back()} style={{ width:38,height:38,borderRadius:12,background:'rgba(255,255,255,0.12)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <Icon name="arrow-left" size={18} color="white"/>
          </button>
          <div style={{ width:38,height:38,borderRadius:12,background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <Icon name={cfg.icon} size={20} color="white" strokeWidth={1.9}/>
          </div>
          <h1 style={{ margin:0,fontSize:18,fontWeight:800,color:'white' }}>{cfg.label}</h1>
          {user && (
            <div style={{ marginLeft:'auto',background:'rgba(255,255,255,0.12)',borderRadius:10,padding:'6px 12px',flexShrink:0 }}>
              <p style={{ margin:0,fontSize:9,color:'rgba(255,255,255,0.65)' }}>Saldo Utama</p>
              <p style={{ margin:0,fontSize:12,fontWeight:800,color:'white' }}>Rp {(user.saldo||0).toLocaleString('id-ID')}</p>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding:'14px' }}>
        {/* ─── Phone input ─── */}
        {cfg.needsPhone && (
          <div style={{ background:'white',borderRadius:20,padding:18,marginBottom:12,boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ display:'flex',alignItems:'center',gap:7,marginBottom:12 }}>
              <Icon name="phone" size={15} color={cfg.color}/>
              <p style={{ margin:0,fontSize:13,fontWeight:700,color:'#374151' }}>Nomor Tujuan</p>
            </div>
            <div style={{ position:'relative' }}>
              <input className="input-field" type="tel" placeholder="08xx xxxx xxxx"
                value={phone} onChange={e => onPhone(e.target.value)}
                style={{ fontSize:18,fontWeight:700,letterSpacing:0.5,paddingRight:carrier ? 130 : 16 }}/>
              {carrier && (
                <div style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',display:'flex',alignItems:'center',gap:6 }}>
                  <CarrierLogo name={carrier.name} size={28}/>
                  <span style={{ fontSize:11,fontWeight:700,color:'#374151' }}>{carrier.name}</span>
                </div>
              )}
              {detecting && (
                <div style={{ position:'absolute',right:14,top:'50%',transform:'translateY(-50%)' }}>
                  <span style={{ width:18,height:18,border:'2px solid #bfdbfe',borderTopColor:'#2563eb',borderRadius:'50%',display:'inline-block',animation:'spin 0.6s linear infinite' }}/>
                </div>
              )}
            </div>
            {phone.length >= 4 && !carrier && !detecting && (
              <p style={{ margin:'7px 0 0',fontSize:12,color:'#ef4444',display:'flex',alignItems:'center',gap:5 }}>
                <Icon name="alert-tri" size={13} color="#ef4444"/> Nomor tidak dikenal
              </p>
            )}
            {carrier && (
              <div style={{ marginTop:10,background:carrier.bg||'#eff6ff',borderRadius:12,padding:'10px 14px',display:'flex',alignItems:'center',gap:10 }}>
                <CarrierLogo name={carrier.name} size={34}/>
                <div>
                  <p style={{ margin:0,fontSize:12,fontWeight:700,color:carrier.color||'#1e40af' }}>Terdeteksi: {carrier.name}</p>
                  <p style={{ margin:0,fontSize:11,color:'#64748b' }}>Produk khusus operator ini ditampilkan</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── PLN / non-phone target ─── */}
        {!cfg.needsPhone && type !== 'premium' && type !== 'games' && type !== 'voucher' && type !== 'emoney' && (
          <div style={{ background:'white',borderRadius:20,padding:18,marginBottom:12,boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ display:'flex',alignItems:'center',gap:7,marginBottom:10 }}>
              <Icon name={type==='pln'?'zap':'number'} size={15} color={cfg.color}/>
              <p style={{ margin:0,fontSize:13,fontWeight:700,color:'#374151' }}>
                {type==='pln' ? 'ID Pelanggan PLN' : type==='tv' ? 'ID Pelanggan' : 'ID / Nomor Tujuan'}
              </p>
            </div>
            <input className="input-field" type="tel"
              placeholder={type==='pln' ? 'Contoh: 12345678910' : type==='tv' ? 'ID Pelanggan TV' : 'Masukkan nomor/ID'}
              value={target} onChange={e => setTarget(e.target.value)}/>
          </div>
        )}

        {/* ─── E-wallet picker ─── */}
        {type === 'emoney' && (
          <div style={{ background:'white',borderRadius:20,padding:18,marginBottom:12,boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ display:'flex',alignItems:'center',gap:7,marginBottom:12 }}>
              <Icon name="wallet" size={15} color={cfg.color}/>
              <p style={{ margin:0,fontSize:13,fontWeight:700,color:'#374151' }}>Pilih E-Wallet</p>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:12 }}>
              {EWALLET_LIST.map(ew => (
                <button key={ew.code} onClick={() => { setSelEw(ew); setSearch(''); filterProds(allProds, ew.name, '') }}
                  style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:6,padding:'12px 8px',borderRadius:14,border:`2px solid ${selEw?.code===ew.code?'#059669':'#e2e8f0'}`,background:selEw?.code===ew.code?'#d1fae5':'white',cursor:'pointer',transition:'all 0.15s' }}>
                  <JenisEwallet kode={ew.code} size={38}/>
                  <span style={{ fontSize:10,fontWeight:700,color:'#374151' }}>{ew.name}</span>
                </button>
              ))}
            </div>
            {selEw && (
              <>
                <p style={{ margin:'0 0 6px',fontSize:12,fontWeight:600,color:'#64748b' }}>Nomor {selEw.name}</p>
                <input className="input-field" type="tel" placeholder="08xx xxxx xxxx" value={target} onChange={e => setTarget(e.target.value)}/>
              </>
            )}
          </div>
        )}

        {/* ─── Search bar ─── */}
        {(allProds.length > 5 || loadingProd) && (
          <div style={{ background:'white',borderRadius:14,padding:'10px 14px',marginBottom:10,boxShadow:'0 1px 6px rgba(0,0,0,0.05)',display:'flex',alignItems:'center',gap:10 }}>
            <Icon name="tag" size={15} color="#94a3b8"/>
            <input placeholder="Cari produk..." value={search} onChange={e => handleSearch(e.target.value)}
              style={{ flex:1,border:'none',outline:'none',fontSize:13,fontFamily:'Inter,sans-serif',color:'#374151',background:'transparent' }}/>
          </div>
        )}

        {/* ─── Provider tabs ─── */}
        {showTabs && !cfg.needsPhone && (
          <div style={{ display:'flex',gap:8,overflowX:'auto',marginBottom:12,paddingBottom:2 }}>
            {['', ...providers.slice(0,7)].map(pv => (
              <button key={pv} onClick={() => handleTab(pv)}
                style={{ padding:'7px 14px',borderRadius:99,border:`1.5px solid ${activeTab===pv?cfg.color:'#e2e8f0'}`,background:activeTab===pv?cfg.color:'white',color:activeTab===pv?'white':'#374151',fontSize:12,fontWeight:700,cursor:'pointer',whiteSpace:'nowrap',flexShrink:0,transition:'all 0.15s' }}>
                {pv||'Semua'}
              </button>
            ))}
          </div>
        )}

        {/* ─── Product list ─── */}
        {(products.length > 0 || loadingProd) && (
          <div style={{ background:'white',borderRadius:20,padding:18,marginBottom:12,boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12 }}>
              <div style={{ display:'flex',alignItems:'center',gap:7 }}>
                <Icon name="package" size={15} color={cfg.color}/>
                <p style={{ margin:0,fontSize:13,fontWeight:700,color:'#374151' }}>
                  {type==='premium' ? 'Pilih Paket' : type==='data' ? 'Pilih Paket Data' : type==='games' ? 'Pilih Produk' : 'Pilih Nominal'}
                </p>
              </div>
              {/* View toggle for games */}
              {type === 'games' && (
                <div style={{ display:'flex',gap:4 }}>
                  {['list','grid'].map(v => (
                    <button key={v} onClick={() => setViewMode(v)}
                      style={{ padding:'5px 10px',borderRadius:8,border:'none',background:viewMode===v?cfg.color:'#f0f4ff',color:viewMode===v?'white':'#64748b',cursor:'pointer',fontSize:11,fontWeight:700 }}>
                      <Icon name={v==='list'?'menu':'grid'} size={12} color={viewMode===v?'white':'#64748b'}/>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {loadingProd ? (
              [...Array(4)].map((_,i) => <div key={i} className="shimmer" style={{ height:60,borderRadius:12,marginBottom:8 }}/>)
            ) : viewMode === 'grid' && type === 'games' ? (
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
                {products.map((p, i) => {
                  const name  = p.name||p.product_name||'-'
                  const price = p.price||p.sell_price||0
                  const img   = p.img_url && p.img_url !== 'https://urlimage.png' ? p.img_url : null
                  const sel   = selected?.code === (p.code||p.product_code)
                  return (
                    <button key={i} onClick={() => setSelected(p)}
                      style={{ display:'flex',flexDirection:'column',alignItems:'center',padding:'16px 10px',borderRadius:16,border:`2px solid ${sel?cfg.color:'#e8edf5'}`,background:sel?cfg.color+'12':'white',cursor:'pointer',gap:8,transition:'all 0.15s' }}>
                      {img
                        ? <img src={img} alt={name} style={{ width:56,height:56,borderRadius:14,objectFit:'contain' }}/>
                        : <div style={{ width:56,height:56,borderRadius:14,background:cfg.color+'18',display:'flex',alignItems:'center',justifyContent:'center' }}><Icon name="gamepad" size={24} color={cfg.color}/></div>
                      }
                      <p style={{ margin:0,fontSize:12,fontWeight:700,color:'#0f172a',textAlign:'center',lineHeight:1.3 }}>{name}</p>
                      <p style={{ margin:0,fontSize:13,fontWeight:900,color:cfg.color }}>Rp {Number(price).toLocaleString('id-ID')}</p>
                    </button>
                  )
                })}
              </div>
            ) : (
              products.map((p, i) => {
                const name  = p.name||p.product_name||'-'
                const price = p.price||p.sell_price||0
                const desc  = p.note||p.description||p.desc||''
                const img   = p.img_url && p.img_url !== 'https://urlimage.png' ? p.img_url : null
                const sel   = selected?.code === (p.code||p.product_code)
                return (
                  <div key={i} onClick={() => setSelected(p)}
                    style={{ display:'flex',alignItems:'center',padding:'13px 14px',borderRadius:14,border:`1.5px solid ${sel?cfg.color:'#e8edf5'}`,background:sel?cfg.color+'0d':'white',cursor:'pointer',marginBottom:8,gap:14,transition:'all 0.15s' }}>
                    {img
                      ? <img src={img} alt={name} style={{ width:46,height:46,borderRadius:12,objectFit:'cover',flexShrink:0,border:'1px solid #EAF0FB' }}/>
                      : <div style={{ width:46,height:46,borderRadius:12,background:cfg.color+'18',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}><Icon name={cfg.icon} size={20} color={cfg.color}/></div>
                    }
                    <div style={{ flex:1,minWidth:0 }}>
                      <p style={{ margin:0,fontSize:13,fontWeight:700,color:'#0f172a' }}>{name}</p>
                      {desc && <p style={{ margin:'2px 0 0',fontSize:11,color:'#94a3b8' }}>{desc}</p>}
                      <p style={{ margin:'4px 0 0',fontSize:14,fontWeight:900,color:cfg.color }}>Rp {Number(price).toLocaleString('id-ID')}</p>
                    </div>
                    <Icon name={sel?'check':'chevron-right'} size={16} color={sel?cfg.color:'#cbd5e1'}/>
                  </div>
                )
              })
            )}

            {!loadingProd && products.length === 0 && (
              <div style={{ textAlign:'center',padding:'24px 0',color:'#94a3b8' }}>
                <Icon name="package" size={32} color="#e2e8f0"/>
                <p style={{ margin:'10px 0 0',fontSize:13,fontWeight:600 }}>Produk tidak ditemukan</p>
              </div>
            )}
          </div>
        )}

        {/* ─── Empty state ─── */}
        {cfg.needsPhone && phone.length < 4 && (
          <div style={{ background:'white',borderRadius:20,padding:32,textAlign:'center',border:'1.5px solid #e8edf5',marginBottom:12 }}>
            <div style={{ width:56,height:56,background:cfg.color+'18',borderRadius:18,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px' }}>
              <Icon name={cfg.icon} size={26} color={cfg.color+'80'}/>
            </div>
            <p style={{ margin:0,color:'#94a3b8',fontSize:14 }}>Masukkan nomor HP untuk melihat produk tersedia</p>
          </div>
        )}

        {error && (
          <div style={{ background:'#fee2e2',borderRadius:12,padding:'11px 14px',color:'#991b1b',fontSize:13,marginBottom:12,display:'flex',gap:8,alignItems:'center' }}>
            <Icon name="alert-tri" size={15} color="#ef4444"/> {error}
          </div>
        )}

        {/* ─── Order summary ─── */}
        {selected && (
          <div style={{ background:'white',borderRadius:20,padding:18,boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ display:'flex',alignItems:'center',gap:7,marginBottom:14,paddingBottom:12,borderBottom:'1px dashed #e2e8f0' }}>
              <Icon name="package" size={15} color="#64748b"/>
              <p style={{ margin:0,fontSize:13,fontWeight:700,color:'#374151' }}>Ringkasan Order</p>
            </div>
            {[
              ['Produk', selected.name||selected.product_name],
              (phone||target) ? ['Tujuan', phone ? normalizePhone(phone) : target] : null,
              carrier ? ['Operator', carrier.name] : null,
            ].filter(Boolean).map(([l,v]) => (
              <div key={l} style={{ display:'flex',justifyContent:'space-between',marginBottom:10 }}>
                <span style={{ fontSize:12,color:'#64748b' }}>{l}</span>
                <span style={{ fontSize:12,fontWeight:700,color:'#0f172a',textAlign:'right',maxWidth:'60%' }}>{v}</span>
              </div>
            ))}
            <div style={{ display:'flex',justifyContent:'space-between',marginBottom:16,paddingTop:10,borderTop:'1px dashed #e2e8f0' }}>
              <span style={{ fontSize:14,fontWeight:700,color:'#374151' }}>Total Bayar</span>
              <span style={{ fontSize:22,fontWeight:900,color:cfg.color }}>
                Rp {Number(selected.price||selected.sell_price||0).toLocaleString('id-ID')}
              </span>
            </div>
            <button className="btn-primary" onClick={handleOrder} disabled={ordering}
              style={{ background:`linear-gradient(135deg,${cfg.bg},${cfg.color})`,boxShadow:`0 4px 14px ${cfg.color}55` }}>
              {ordering
                ? <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}><Spin/> Memproses...</span>
                : <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}><Icon name="zap" size={17} color="white" strokeWidth={0}/> Bayar Sekarang</span>
              }
            </button>
          </div>
        )}
      </div>
      <BottomNav/>
    </div>
  )
}

function OrderSuccess({ data, onBack, router }) {
  return (
    <div style={{ minHeight:'100dvh',background:'#f0f4ff',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24 }}>
      <div style={{ background:'white',borderRadius:24,padding:32,width:'100%',maxWidth:420,textAlign:'center',boxShadow:'0 8px 32px rgba(0,0,0,0.08)' }}>
        <div style={{ width:80,height:80,background:'linear-gradient(135deg,#22C55E,#16A34A)',borderRadius:'50%',margin:'0 auto 20px',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 8px 28px rgba(34,197,94,0.4)' }}>
          <Icon name="check" size={38} color="white" strokeWidth={2.5}/>
        </div>
        <h2 style={{ margin:'0 0 8px',fontSize:20,fontWeight:800,color:'#065f46' }}>Order Berhasil!</h2>
        <p style={{ margin:'0 0 20px',color:'#64748b',fontSize:14 }}>Pesanan sedang diproses sistem</p>
        <div style={{ background:'#f0f9ff',borderRadius:14,padding:16,marginBottom:20,textAlign:'left' }}>
          {[['Invoice', data.invoice], ['Status', 'Sedang Diproses']].map(([l,v]) => (
            <div key={l} style={{ display:'flex',justifyContent:'space-between',marginBottom:8 }}>
              <span style={{ fontSize:12,color:'#64748b' }}>{l}</span>
              <span style={{ fontSize:12,fontWeight:700,color:'#0f172a',fontFamily:l==='Invoice'?'monospace':'inherit' }}>{v}</span>
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={() => router.push('/riwayat')} style={{ marginBottom:10 }}>
          <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}><Icon name="history" size={16} color="white"/> Lihat Riwayat</span>
        </button>
        <button className="btn-outline" onClick={onBack}>Beli Lagi</button>
      </div>
    </div>
  )
}

function Spin() {
  return <span style={{ width:18,height:18,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',display:'inline-block',animation:'spin 0.6s linear infinite' }}/>
}
