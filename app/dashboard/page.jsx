'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { Icon } from '@/components/Icons'

const SERVICES = [
  { key:'games',      label:'Games',             icon:'gamepad',  color:'#7c3aed', bg:'#f3e8ff' },
  { key:'pulsa',      label:'Pulsa',              icon:'phone',    color:'#2563eb', bg:'#eff6ff' },
  { key:'data',       label:'Data Internet',      icon:'wifi',     color:'#0891b2', bg:'#e0f7fa' },
  { key:'emoney',     label:'E-Money',            icon:'wallet',   color:'#059669', bg:'#d1fae5' },
  { key:'pln',        label:'PLN',                icon:'zap',      color:'#d97706', bg:'#fef3c7' },
  { key:'voucher',    label:'Voucher',            icon:'tag',      color:'#db2777', bg:'#fce7f3' },
  { key:'perdana',    label:'Aktiv. Perdana',     icon:'sim',      color:'#0284c7', bg:'#e0f2fe' },
  { key:'sms',        label:'SMS & Telpon',       icon:'msg',      color:'#ea580c', bg:'#fff7ed' },
  { key:'masaaktif',  label:'Masa Aktif',         icon:'calendar', color:'#16a34a', bg:'#dcfce7' },
  { key:'tv',         label:'TV',                 icon:'tv',       color:'#dc2626', bg:'#fee2e2' },
  { key:'nokos',      label:'Nomor Virtual',      icon:'number',   color:'#6d28d9', bg:'#ede9fe' },
  { key:'premium',    label:'Akun Premium',       icon:'crown',    color:'#b45309', bg:'#fef3c7' },
]

const TYPE_COLOR = {
  games:'#7c3aed', pulsa:'#2563eb', data:'#0891b2', emoney:'#059669',
  pln:'#d97706', premium:'#b45309', nokos:'#6d28d9', other:'#64748b',
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [banners, setBanners] = useState([])
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState(true)
  const [bannerIdx, setBannerIdx] = useState(0)
  const [time, setTime] = useState(new Date())
  const timerRef = useRef(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/user/me').then(r => r.json()),
      fetch('/api/banners').then(r => r.json()),
      fetch('/api/admin/trending').then(r => r.json()),
    ]).then(([u, b, t]) => {
      if (!u.success) { router.push('/login'); return }
      setUser(u.user)
      setBanners(b.banners || [])
      setTrending(t.trending || [])
      setLoading(false)
    }).catch(() => router.push('/login'))
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (banners.length < 2) return
    timerRef.current = setInterval(() => setBannerIdx(i => (i + 1) % banners.length), 4000)
    return () => clearInterval(timerRef.current)
  }, [banners.length])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 11) return 'Selamat Pagi'
    if (h < 15) return 'Selamat Siang'
    if (h < 18) return 'Selamat Sore'
    return 'Selamat Malam'
  }

  if (loading) return <LoadingSkeleton />

  const banner = banners[bannerIdx]

  return (
    <div style={{ background:'#f0f4ff', minHeight:'100dvh' }} className="page-content">
      {/* ── HEADER ── */}
      <div style={{ background:'linear-gradient(150deg,#0f2d6b 0%,#1e40af 45%,#2563eb 100%)', padding:'0 0 32px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute',top:-60,right:-60,width:200,height:200,borderRadius:'50%',background:'rgba(255,255,255,0.04)' }}/>
        <div style={{ position:'absolute',bottom:-30,left:-30,width:140,height:140,borderRadius:'50%',background:'rgba(0,0,0,0.06)' }}/>

        {/* Top bar */}
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'52px 20px 20px' }}>
          <div style={{ display:'flex',alignItems:'center',gap:12 }}>
            <div style={{ width:46,height:46,borderRadius:15,background:'rgba(255,255,255,0.18)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:800,color:'white',border:'2px solid rgba(255,255,255,0.28)',letterSpacing:-0.5 }}>
              {user?.nama?.[0]?.toUpperCase()}
            </div>
            <div>
              <p style={{ margin:0,fontSize:11,color:'rgba(255,255,255,0.65)',fontWeight:500 }}>{greeting()}</p>
              <p style={{ margin:0,fontSize:15,fontWeight:700,color:'white',letterSpacing:-0.3 }}>{user?.nama}</p>
            </div>
          </div>
          <button onClick={() => router.push('/info')} style={{ width:40,height:40,borderRadius:13,background:'rgba(255,255,255,0.12)',border:'1px solid rgba(255,255,255,0.18)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <Icon name="bell" size={18} color="white"/>
          </button>
        </div>

        {/* Balance card */}
        <div style={{ margin:'0 16px',background:'rgba(255,255,255,0.1)',backdropFilter:'blur(16px)',borderRadius:22,padding:'20px 20px 18px',border:'1px solid rgba(255,255,255,0.18)' }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16 }}>
            <div>
              <div style={{ display:'flex',alignItems:'center',gap:6,marginBottom:6 }}>
                <Icon name="wallet" size={13} color="rgba(255,255,255,0.65)"/>
                <p style={{ margin:0,fontSize:11,color:'rgba(255,255,255,0.65)',fontWeight:600,textTransform:'uppercase',letterSpacing:0.8 }}>Saldo Aktif</p>
              </div>
              <p style={{ margin:0,fontSize:30,fontWeight:900,color:'white',letterSpacing:'-1.5px' }}>
                Rp {(user?.saldo||0).toLocaleString('id-ID')}
              </p>
              <p style={{ margin:'5px 0 0',fontSize:11,color:'rgba(255,255,255,0.55)' }}>
                {time.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit',second:'2-digit'})} WIB
              </p>
            </div>
            <button onClick={() => router.push('/deposit')}
              style={{ background:'white',color:'#1e40af',border:'none',borderRadius:14,padding:'10px 18px',fontSize:13,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:6,boxShadow:'0 4px 16px rgba(0,0,0,0.2)',flexShrink:0 }}>
              <Icon name="plus" size={15} color="#1e40af"/>
              Top Up
            </button>
          </div>
          <div style={{ display:'flex',gap:0,paddingTop:16,borderTop:'1px solid rgba(255,255,255,0.12)' }}>
            {[
              { label:'Total Deposit', val: user?.totalDeposit || 0 },
              { label:'Transaksi', val: user?.totalTransaksi || 0 },
              { label:'Status', val: 'Aktif' },
            ].map((s, i) => (
              <div key={s.label} style={{ flex:1,textAlign:'center',padding:'0 4px',borderRight: i < 2 ? '1px solid rgba(255,255,255,0.12)' : 'none' }}>
                <p style={{ margin:0,fontSize:16,fontWeight:800,color:'white' }}>{s.val}</p>
                <p style={{ margin:0,fontSize:9,color:'rgba(255,255,255,0.55)',fontWeight:500,textTransform:'uppercase',letterSpacing:0.5 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BANNER ── */}
      {banners.length > 0 && (
        <div style={{ padding:'16px 16px 0' }}>
          <div
            onClick={() => banner?.linkUrl && router.push(banner.linkUrl)}
            style={{ background: banner?.gradient || 'linear-gradient(135deg,#1e40af,#2563eb)', borderRadius:20, padding:'20px', overflow:'hidden', position:'relative', minHeight:96, cursor: banner?.linkUrl ? 'pointer' : 'default', transition:'all 0.4s' }}>
            <div style={{ position:'absolute',top:-24,right:-24,width:110,height:110,borderRadius:'50%',background:'rgba(255,255,255,0.08)' }}/>
            <div style={{ position:'relative',display:'flex',alignItems:'center',gap:14 }}>
              {banner?.imageUrl && (
                <img src={banner.imageUrl} alt="" style={{ width:52,height:52,borderRadius:14,objectFit:'cover',flexShrink:0 }}/>
              )}
              <div>
                <p style={{ margin:0,fontSize:16,fontWeight:800,color:'white',letterSpacing:'-0.3px' }}>{banner?.title}</p>
                {banner?.subtitle && <p style={{ margin:'3px 0 0',fontSize:12,color:'rgba(255,255,255,0.75)' }}>{banner.subtitle}</p>}
              </div>
              {banner?.linkUrl && (
                <div style={{ marginLeft:'auto',flexShrink:0 }}>
                  <Icon name="chevron-right" size={20} color="rgba(255,255,255,0.7)"/>
                </div>
              )}
            </div>
            {/* Dots */}
            {banners.length > 1 && (
              <div style={{ position:'absolute',bottom:12,right:16,display:'flex',gap:5 }}>
                {banners.map((_,i) => (
                  <button key={i} onClick={e => { e.stopPropagation(); setBannerIdx(i) }}
                    style={{ width:i===bannerIdx?20:6,height:6,borderRadius:99,background:i===bannerIdx?'white':'rgba(255,255,255,0.35)',border:'none',cursor:'pointer',padding:0,transition:'all 0.3s' }}/>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── SERVICES GRID ── */}
      <div style={{ padding:'20px 16px 0' }}>
        <SectionHeader icon="layers" label="Daftar Layanan"/>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:9,marginTop:14 }}>
          {SERVICES.map(s => (
            <button key={s.key} onClick={() => router.push(`/layanan/${s.key}`)}
              style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:7,padding:'14px 6px 12px',background:'white',borderRadius:16,border:'1.5px solid #e8edf5',cursor:'pointer',transition:'all 0.18s' }}
              onMouseDown={e => e.currentTarget.style.transform='scale(0.94)'}
              onMouseUp={e => e.currentTarget.style.transform='scale(1)'}
              onTouchStart={e => e.currentTarget.style.transform='scale(0.94)'}
              onTouchEnd={e => e.currentTarget.style.transform='scale(1)'}>
              <div style={{ width:44,height:44,borderRadius:13,background:s.bg,display:'flex',alignItems:'center',justifyContent:'center' }}>
                <Icon name={s.icon} size={20} color={s.color} strokeWidth={1.9}/>
              </div>
              <span style={{ fontSize:10,fontWeight:600,color:'#374151',textAlign:'center',lineHeight:1.3,letterSpacing:'-0.1px' }}>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── TRENDING ── */}
      <div style={{ padding:'20px 16px 0' }}>
        <SectionHeader icon="trending" label="Transaksi Trending Hari Ini" iconColor="#ef4444"/>
        <div style={{ display:'flex',flexDirection:'column',gap:9,marginTop:14 }}>
          {trending.length === 0 ? (
            <div style={{ background:'white',borderRadius:16,padding:'24px',textAlign:'center',border:'1.5px solid #e8edf5' }}>
              <Icon name="bar-chart" size={32} color="#cbd5e1"/>
              <p style={{ margin:'10px 0 0',color:'#94a3b8',fontSize:13 }}>Belum ada transaksi hari ini</p>
            </div>
          ) : trending.map((item, i) => (
            <button key={i} onClick={() => router.push(`/layanan/${item.type || 'pulsa'}`)}
              style={{ display:'flex',alignItems:'center',gap:12,background:'white',borderRadius:14,padding:'13px 15px',border:'1.5px solid #e8edf5',cursor:'pointer',textAlign:'left',width:'100%' }}>
              <div style={{ width:34,height:34,borderRadius:11,background: i===0?'#fef3c7':i===1?'#f1f5f9':'#fff7ed',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                <span style={{ fontSize:13,fontWeight:900,color:i===0?'#b45309':i===1?'#475569':'#c2410c' }}>#{i+1}</span>
              </div>
              <div style={{ flex:1,minWidth:0 }}>
                <p style={{ margin:0,fontSize:13,fontWeight:700,color:'#0f172a',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{item.productName}</p>
                <p style={{ margin:'2px 0 0',fontSize:11,color:'#94a3b8' }}>{item.count}x terjual hari ini</p>
              </div>
              <div style={{ textAlign:'right',flexShrink:0 }}>
                <p style={{ margin:0,fontSize:12,fontWeight:700,color:TYPE_COLOR[item.type]||'#64748b' }}>
                  Rp {Number(item.price||0).toLocaleString('id-ID')}
                </p>
                <Icon name="chevron-right" size={14} color="#cbd5e1"/>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ height:16 }}/>
      <BottomNav />
    </div>
  )
}

function SectionHeader({ icon, label, iconColor = '#2563eb' }) {
  return (
    <div style={{ display:'flex',alignItems:'center',gap:9 }}>
      <div style={{ width:32,height:32,borderRadius:10,background:iconColor+'18',display:'flex',alignItems:'center',justifyContent:'center' }}>
        <Icon name={icon} size={16} color={iconColor} strokeWidth={2}/>
      </div>
      <h2 style={{ margin:0,fontSize:15,fontWeight:700,color:'#0f172a' }}>{label}</h2>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div style={{ background:'#f0f4ff',minHeight:'100dvh' }}>
      <div style={{ background:'linear-gradient(150deg,#0f2d6b,#2563eb)',padding:'52px 20px 40px' }}>
        <div className="shimmer" style={{ height:22,width:160,borderRadius:8,marginBottom:10,opacity:0.4 }}/>
        <div className="shimmer" style={{ height:34,width:220,borderRadius:8,marginBottom:18,opacity:0.4 }}/>
        <div className="shimmer" style={{ height:110,borderRadius:22,opacity:0.3 }}/>
      </div>
      <div style={{ padding:'16px' }}>
        <div className="shimmer" style={{ height:96,borderRadius:20,marginBottom:16 }}/>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:9 }}>
          {[...Array(12)].map((_,i)=><div key={i} className="shimmer" style={{ height:72,borderRadius:16 }}/>)}
        </div>
      </div>
    </div>
  )
}
