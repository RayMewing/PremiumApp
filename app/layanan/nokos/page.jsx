'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { Icon } from '@/components/Icons'

export default function NokosPage() {
  const router = useRouter()
  const [services, setServices] = useState([])
  const [countries, setCountries] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState('indonesia')
  const [activeNumber, setActiveNumber] = useState(null)
  const [otpResult, setOtpResult] = useState(null)
  const [loadingSvc, setLoadingSvc] = useState(true)
  const [loadingNum, setLoadingNum] = useState(false)
  const [loadingOtp, setLoadingOtp] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [user, setUser] = useState(null)
  const [search, setSearch] = useState('')
  const pollRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    fetch('/api/user/me').then(r => r.json()).then(d => {
      if (!d.success) router.push('/login')
      else setUser(d.user)
    })
    fetchServices()
    return () => { clearInterval(pollRef.current); clearInterval(timerRef.current) }
  }, [])

  const fetchServices = async () => {
    setLoadingSvc(true)
    try {
      const res = await fetch('/api/nokos/services')
      const d = await res.json()
      setServices(d.services || [])
      setCountries(d.countries || [])
    } catch {}
    setLoadingSvc(false)
  }

  const getNumber = async () => {
    if (!selectedService) { setError('Pilih layanan terlebih dahulu'); return }
    setError(''); setLoadingNum(true)
    try {
      const res = await fetch('/api/nokos/get-number', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: selectedService.code || selectedService.id, country: selectedCountry })
      })
      const d = await res.json()
      if (d.success) {
        setActiveNumber(d.data)
        setOtpResult(null)
        setTimeLeft(300) // 5 min
        startTimer()
        startPolling(d.data.id)
      } else setError(d.message || 'Gagal mendapatkan nomor')
    } catch { setError('Terjadi kesalahan') }
    setLoadingNum(false)
  }

  const startTimer = () => {
    clearInterval(timerRef.current)
    let t = 300
    timerRef.current = setInterval(() => {
      t -= 1; setTimeLeft(t)
      if (t <= 0) { clearInterval(timerRef.current); clearInterval(pollRef.current) }
    }, 1000)
  }

  const startPolling = (numberId) => {
    clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/nokos/otp?id=${numberId}`)
        const d = await res.json()
        if (d.success && d.otp) {
          setOtpResult(d.otp)
          clearInterval(pollRef.current)
          clearInterval(timerRef.current)
        }
      } catch {}
    }, 5000)
  }

  const cancelNumber = async () => {
    if (!activeNumber) return
    clearInterval(pollRef.current); clearInterval(timerRef.current)
    try {
      await fetch(`/api/nokos/cancel`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: activeNumber.id })
      })
    } catch {}
    setActiveNumber(null); setOtpResult(null); setTimeLeft(0)
  }

  const copyText = (text) => navigator.clipboard?.writeText(text)

  const filteredSvc = services.filter(s =>
    !search || (s.name || s.service_name || '').toLowerCase().includes(search.toLowerCase())
  )

  const fmt = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`

  return (
    <div style={{ background:'#f0f4ff',minHeight:'100dvh' }} className="page-content">
      {/* Header */}
      <div style={{ background:'linear-gradient(150deg,#2e0d6e,#4c1d95,#5b21b6)',padding:'48px 20px 24px',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',top:-40,right:-40,width:150,height:150,borderRadius:'50%',background:'rgba(255,255,255,0.05)' }}/>
        <div style={{ display:'flex',alignItems:'center',gap:12 }}>
          <button onClick={() => router.back()} style={{ width:38,height:38,borderRadius:12,background:'rgba(255,255,255,0.12)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <Icon name="arrow-left" size={18} color="white"/>
          </button>
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <div style={{ width:38,height:38,borderRadius:12,background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <Icon name="number" size={20} color="white"/>
            </div>
            <div>
              <h1 style={{ margin:0,fontSize:18,fontWeight:800,color:'white' }}>Nomor Virtual</h1>
              <p style={{ margin:0,fontSize:11,color:'rgba(255,255,255,0.65)' }}>Terima OTP tanpa SIM fisik</p>
            </div>
          </div>
          {user && (
            <div style={{ marginLeft:'auto',background:'rgba(255,255,255,0.12)',borderRadius:10,padding:'6px 12px' }}>
              <p style={{ margin:0,fontSize:10,color:'rgba(255,255,255,0.65)' }}>Saldo</p>
              <p style={{ margin:0,fontSize:13,fontWeight:800,color:'white' }}>Rp {(user.saldo||0).toLocaleString('id-ID')}</p>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding:'16px' }}>
        {/* Active number display */}
        {activeNumber && (
          <div style={{ background:'linear-gradient(135deg,#4c1d95,#5b21b6)',borderRadius:20,padding:20,marginBottom:14,color:'white' }}>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14 }}>
              <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                <div style={{ width:10,height:10,borderRadius:'50%',background: otpResult ? '#10b981' : '#f59e0b',boxShadow:`0 0 8px ${otpResult ? '#10b981' : '#f59e0b'}` }}/>
                <span style={{ fontSize:12,fontWeight:700 }}>{otpResult ? 'OTP Diterima!' : 'Menunggu OTP...'}</span>
              </div>
              {!otpResult && (
                <span style={{ fontSize:13,fontWeight:700,fontFamily:'monospace',background:'rgba(255,255,255,0.15)',padding:'4px 10px',borderRadius:8 }}>
                  {fmt(timeLeft)}
                </span>
              )}
            </div>
            <div style={{ background:'rgba(255,255,255,0.1)',borderRadius:14,padding:14,marginBottom:12 }}>
              <p style={{ margin:'0 0 4px',fontSize:11,color:'rgba(255,255,255,0.6)' }}>Nomor Telepon</p>
              <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                <p style={{ margin:0,fontSize:20,fontWeight:900,letterSpacing:1,fontFamily:'monospace' }}>{activeNumber.number || activeNumber.phone}</p>
                <button onClick={() => copyText(activeNumber.number || activeNumber.phone)}
                  style={{ background:'rgba(255,255,255,0.15)',border:'none',borderRadius:9,padding:'7px 10px',cursor:'pointer',display:'flex',alignItems:'center',gap:5,color:'white',fontSize:12,fontWeight:600 }}>
                  <Icon name="copy" size={14} color="white"/>
                  Salin
                </button>
              </div>
            </div>

            {otpResult ? (
              <div style={{ background:'rgba(16,185,129,0.2)',border:'1px solid rgba(16,185,129,0.4)',borderRadius:14,padding:16,marginBottom:12 }}>
                <p style={{ margin:'0 0 6px',fontSize:11,color:'rgba(255,255,255,0.7)' }}>Kode OTP</p>
                <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                  <p style={{ margin:0,fontSize:28,fontWeight:900,letterSpacing:8,fontFamily:'monospace',color:'#6ee7b7' }}>{otpResult}</p>
                  <button onClick={() => copyText(otpResult)}
                    style={{ background:'rgba(255,255,255,0.15)',border:'none',borderRadius:9,padding:'7px 10px',cursor:'pointer',display:'flex',alignItems:'center',gap:5,color:'white',fontSize:12,fontWeight:600 }}>
                    <Icon name="copy" size={14} color="white"/> Salin
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ background:'rgba(255,255,255,0.06)',borderRadius:12,padding:'12px 14px',marginBottom:12,display:'flex',alignItems:'center',gap:10 }}>
                <div style={{ width:20,height:20,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',flexShrink:0,animation:'spin 0.8s linear infinite' }}/>
                <p style={{ margin:0,fontSize:12,color:'rgba(255,255,255,0.75)' }}>Sistem sedang menunggu OTP masuk ke nomor ini...</p>
              </div>
            )}

            <button onClick={cancelNumber}
              style={{ width:'100%',padding:'12px',background:'rgba(239,68,68,0.2)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:12,color:'#fca5a5',fontSize:13,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:7 }}>
              <Icon name="x-circle" size={16} color="#fca5a5"/>
              Batalkan Nomor
            </button>
          </div>
        )}

        {!activeNumber && (
          <>
            {/* Country */}
            <div style={{ background:'white',borderRadius:18,padding:18,marginBottom:12,boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
              <p style={{ margin:'0 0 12px',fontSize:13,fontWeight:700,color:'#374151',display:'flex',alignItems:'center',gap:7 }}>
                <Icon name="layers" size={15} color="#6d28d9"/>
                Negara
              </p>
              <div style={{ display:'flex',gap:8,overflowX:'auto' }}>
                {['indonesia','russia','india','usa','uk'].map(c => (
                  <button key={c} onClick={() => setSelectedCountry(c)}
                    style={{ padding:'8px 14px',borderRadius:10,border:`1.5px solid ${selectedCountry===c?'#6d28d9':'#e2e8f0'}`,background:selectedCountry===c?'#ede9fe':'white',color:selectedCountry===c?'#6d28d9':'#374151',fontSize:12,fontWeight:700,cursor:'pointer',whiteSpace:'nowrap',flexShrink:0 }}>
                    {c.charAt(0).toUpperCase()+c.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Service search + list */}
            <div style={{ background:'white',borderRadius:18,padding:18,marginBottom:12,boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
              <p style={{ margin:'0 0 12px',fontSize:13,fontWeight:700,color:'#374151',display:'flex',alignItems:'center',gap:7 }}>
                <Icon name="grid" size={15} color="#6d28d9"/>
                Pilih Layanan ({filteredSvc.length})
              </p>
              {/* Search */}
              <div style={{ position:'relative',marginBottom:12 }}>
                <div style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)' }}>
                  <Icon name="tag" size={15} color="#94a3b8"/>
                </div>
                <input className="input-field" placeholder="Cari layanan..." style={{ paddingLeft:36,height:40,fontSize:13 }}
                  value={search} onChange={e => setSearch(e.target.value)}/>
              </div>

              {loadingSvc ? (
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8 }}>
                  {[...Array(6)].map((_,i) => <div key={i} className="shimmer" style={{ height:52,borderRadius:12 }}/>)}
                </div>
              ) : filteredSvc.length === 0 ? (
                <p style={{ textAlign:'center',color:'#94a3b8',fontSize:13,padding:'20px 0' }}>Tidak ditemukan</p>
              ) : (
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,maxHeight:280,overflowY:'auto' }}>
                  {filteredSvc.map((svc, i) => {
                    const name = svc.name || svc.service_name
                    const price = svc.price || svc.cost || 0
                    const isSelected = selectedService?.code === svc.code || selectedService?.id === svc.id
                    return (
                      <button key={i} onClick={() => setSelectedService(svc)}
                        style={{ padding:'10px 12px',borderRadius:12,border:`2px solid ${isSelected?'#6d28d9':'#e2e8f0'}`,background:isSelected?'#ede9fe':'white',cursor:'pointer',textAlign:'left' }}>
                        <p style={{ margin:0,fontSize:12,fontWeight:700,color:isSelected?'#6d28d9':'#0f172a',lineHeight:1.3 }}>{name}</p>
                        <p style={{ margin:'3px 0 0',fontSize:11,color:isSelected?'#7c3aed':'#64748b',fontWeight:600 }}>Rp {Number(price).toLocaleString('id-ID')}</p>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {error && (
              <div style={{ background:'#fee2e2',borderRadius:12,padding:'12px 14px',color:'#991b1b',fontSize:13,marginBottom:12,display:'flex',gap:8 }}>
                <Icon name="alert-tri" size={16} color="#ef4444"/>
                {error}
              </div>
            )}

            <button className="btn-primary" onClick={getNumber} disabled={loadingNum || !selectedService}
              style={{ background:'linear-gradient(135deg,#4c1d95,#6d28d9)' }}>
              {loadingNum
                ? <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}><Spinner/>Mendapatkan Nomor...</span>
                : (
                  <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}>
                    <Icon name="phone" size={18} color="white"/>
                    Dapatkan Nomor Virtual
                  </span>
                )}
            </button>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  )
}

function Spinner() {
  return <span style={{ width:18,height:18,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',display:'inline-block',animation:'spin 0.6s linear infinite' }}/>
}
