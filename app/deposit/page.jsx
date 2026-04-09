'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { Icon } from '@/components/Icons'

const PRESETS = [50000,100000,200000,500000,1000000,2000000]

export default function DepositPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [qris, setQris] = useState(null)
  const [checking, setChecking] = useState(false)
  const [paid, setPaid] = useState(false)
  const [error, setError] = useState('')
  const pollRef = useRef(null)

  useEffect(() => {
    fetch('/api/user/me').then(r=>r.json()).then(d => {
      if (!d.success) router.push('/login'); else setUser(d.user)
    })
    return () => clearInterval(pollRef.current)
  }, [])

  useEffect(() => {
    if (!qris || paid) return
    pollRef.current = setInterval(async () => {
      const r = await fetch(`/api/deposit/status?invoice=${qris.invoice}`).then(res=>res.json())
      if (r.status === 'success') {
        setPaid(true); clearInterval(pollRef.current)
        fetch('/api/user/me').then(r=>r.json()).then(d => d.success && setUser(d.user))
      }
    }, 4000)
    return () => clearInterval(pollRef.current)
  }, [qris, paid])

  const create = async () => {
    const amt = parseInt(amount)
    if (!amt || amt < 10000) { setError('Minimal deposit Rp 10.000'); return }
    setError(''); setLoading(true)
    const r = await fetch('/api/deposit/create',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({amount:amt})}).then(res=>res.json())
    if (r.success) setQris(r.deposit)
    else setError(r.message)
    setLoading(false)
  }

  const manualCheck = async () => {
    setChecking(true)
    const r = await fetch(`/api/deposit/status?invoice=${qris.invoice}`).then(res=>res.json())
    if (r.status === 'success') setPaid(true)
    else setError('Pembayaran belum terdeteksi')
    setChecking(false)
  }

  if (paid) return (
    <div style={{ minHeight:'100dvh',background:'#f0f4ff',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24 }}>
      <div style={{ background:'white',borderRadius:24,padding:32,width:'100%',textAlign:'center',boxShadow:'0 8px 32px rgba(0,0,0,0.08)' }}>
        <div style={{ width:80,height:80,background:'#d1fae5',borderRadius:'50%',margin:'0 auto 20px',display:'flex',alignItems:'center',justifyContent:'center' }}>
          <Icon name="check-circle" size={40} color="#059669" strokeWidth={1.5}/>
        </div>
        <h2 style={{ margin:'0 0 8px',color:'#065f46',fontSize:22,fontWeight:800 }}>Deposit Berhasil!</h2>
        <p style={{ margin:'0 0 6px',color:'#64748b' }}>Rp {parseInt(amount).toLocaleString('id-ID')} berhasil masuk</p>
        <p style={{ margin:'0 0 24px',fontSize:20,fontWeight:800,color:'#2563eb' }}>
          Saldo: Rp {(user?.saldo||0).toLocaleString('id-ID')}
        </p>
        <button className="btn-primary" onClick={() => { setQris(null);setAmount('');setPaid(false) }}>Deposit Lagi</button>
        <button className="btn-outline" style={{ marginTop:10 }} onClick={() => router.push('/dashboard')}>Ke Beranda</button>
      </div>
      <BottomNav/>
    </div>
  )

  return (
    <div style={{ background:'#f0f4ff',minHeight:'100dvh' }} className="page-content">
      <div style={{ background:'linear-gradient(150deg,#0f2d6b,#1e40af,#2563eb)',padding:'48px 20px 24px' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <Icon name="wallet" size={22} color="white" strokeWidth={2}/>
            <h1 style={{ margin:0,fontSize:20,fontWeight:800,color:'white' }}>Top Up Saldo</h1>
          </div>
          {user && (
            <div style={{ background:'rgba(255,255,255,0.12)',borderRadius:12,padding:'8px 14px' }}>
              <p style={{ margin:0,fontSize:10,color:'rgba(255,255,255,0.65)' }}>Saldo</p>
              <p style={{ margin:0,fontSize:14,fontWeight:800,color:'white' }}>Rp {(user.saldo||0).toLocaleString('id-ID')}</p>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding:'16px' }}>
        {!qris ? (
          <>
            <div style={{ background:'white',borderRadius:20,padding:20,marginBottom:14,boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
              <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:14 }}>
                <Icon name="dollar" size={16} color="#2563eb"/>
                <p style={{ margin:0,fontSize:13,fontWeight:700,color:'#374151' }}>Nominal Deposit</p>
              </div>
              <div style={{ position:'relative',marginBottom:14 }}>
                <span style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',fontSize:14,fontWeight:700,color:'#374151' }}>Rp</span>
                <input className="input-field" type="number" placeholder="Ketik nominal lain..." style={{ paddingLeft:40,fontSize:18,fontWeight:700 }} value={amount} onChange={e=>setAmount(e.target.value)}/>
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8 }}>
                {PRESETS.map(p => (
                  <button key={p} onClick={() => setAmount(String(p))}
                    style={{ padding:'12px 8px',borderRadius:12,border:`2px solid ${String(amount)===String(p)?'#2563eb':'#e2e8f0'}`,background:String(amount)===String(p)?'#eff6ff':'white',cursor:'pointer',fontSize:13,fontWeight:700,color:String(amount)===String(p)?'#2563eb':'#374151',transition:'all 0.15s' }}>
                    Rp {p.toLocaleString('id-ID')}
                  </button>
                ))}
              </div>
              <p style={{ margin:'12px 0 0',fontSize:11,color:'#94a3b8',display:'flex',alignItems:'center',gap:5 }}>
                <Icon name="info" size={12} color="#94a3b8"/> Saldo masuk penuh, biaya admin Rp 200
              </p>
            </div>

            <div style={{ background:'white',borderRadius:20,padding:20,marginBottom:14,boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
              <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:14 }}>
                <Icon name="wallet" size={16} color="#2563eb"/>
                <p style={{ margin:0,fontSize:13,fontWeight:700,color:'#374151' }}>Metode Pembayaran</p>
              </div>
              <div style={{ border:'2px solid #2563eb',borderRadius:14,padding:'14px 16px',background:'#eff6ff',display:'flex',alignItems:'center',gap:12 }}>
                <div style={{ width:46,height:46,background:'white',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 8px rgba(0,0,0,0.08)',flexShrink:0 }}>
                  <QrisIcon size={32}/>
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ margin:0,fontSize:14,fontWeight:700,color:'#1e40af' }}>QRIS Otomatis</p>
                  <p style={{ margin:0,fontSize:11,color:'#64748b' }}>GoPay, OVO, Dana, ShopeePay, dll</p>
                </div>
                <Icon name="check-circle" size={20} color="#2563eb" strokeWidth={2}/>
              </div>
            </div>

            {error && (
              <div style={{ background:'#fee2e2',borderRadius:12,padding:'11px 14px',color:'#991b1b',fontSize:13,marginBottom:14,display:'flex',gap:8 }}>
                <Icon name="alert-tri" size={15} color="#ef4444"/> {error}
              </div>
            )}
            <button className="btn-primary" onClick={create} disabled={loading||!amount||parseInt(amount)<10000}>
              {loading ? <Spin/> : <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}><Icon name="zap" size={18} color="white" strokeWidth={0}/> Buat QRIS Sekarang</span>}
            </button>
          </>
        ) : (
          <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
            <div style={{ background:'white',borderRadius:20,padding:24,textAlign:'center',boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
              <div style={{ display:'flex',alignItems:'center',gap:8,justifyContent:'center',marginBottom:20 }}>
                <QrisIcon size={28}/> <span style={{ fontSize:16,fontWeight:800,color:'#0f172a' }}>Scan QRIS untuk Bayar</span>
              </div>
              <div style={{ width:200,height:200,background:'#f8faff',borderRadius:18,margin:'0 auto 18px',display:'flex',alignItems:'center',justifyContent:'center',border:'2px dashed #2563eb',overflow:'hidden' }}>
                {qris.qrUrl
                  ? <img src={qris.qrUrl} alt="QRIS" style={{ width:'100%',height:'100%',objectFit:'contain',borderRadius:16 }}/>
                  : <div style={{ textAlign:'center' }}>
                      <QrisIcon size={64}/>
                      <p style={{ margin:'8px 0 0',fontSize:11,color:'#64748b' }}>Dimuat dari server payment</p>
                    </div>
                }
              </div>
              <div style={{ background:'#f0f4ff',borderRadius:14,padding:'14px 16px',marginBottom:16 }}>
                <p style={{ margin:0,fontSize:12,color:'#64748b' }}>Total Pembayaran</p>
                <p style={{ margin:'4px 0 2px',fontSize:26,fontWeight:900,color:'#2563eb' }}>
                  Rp {(qris.total||qris.amount+qris.fee).toLocaleString('id-ID')}
                </p>
                <p style={{ margin:0,fontSize:11,color:'#94a3b8',fontFamily:'monospace' }}>INV: {qris.invoice}</p>
              </div>
              <div style={{ background:'#fef9c3',borderRadius:12,padding:'11px 14px',marginBottom:18,display:'flex',gap:8,alignItems:'flex-start' }}>
                <Icon name="clock" size={14} color="#92400e" style={{ flexShrink:0,marginTop:1 }}/>
                <p style={{ margin:0,fontSize:12,color:'#92400e',textAlign:'left' }}>Bayar dalam <strong>30 menit</strong>. Jangan tutup halaman ini, status otomatis terupdate.</p>
              </div>
              <div style={{ display:'flex',alignItems:'center',gap:8,justifyContent:'center',marginBottom:14 }}>
                <div style={{ width:8,height:8,borderRadius:'50%',background:'#10b981',animation:'pulse 1.5s ease-in-out infinite' }}/>
                <span style={{ fontSize:12,color:'#10b981',fontWeight:700 }}>Menunggu pembayaran...</span>
              </div>
              {error && <p style={{ color:'#ef4444',fontSize:12,margin:'0 0 12px' }}>{error}</p>}
              <button className="btn-outline" onClick={manualCheck} disabled={checking}>
                {checking ? <Spin color="#2563eb"/> : <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:7 }}><Icon name="refresh" size={16} color="#2563eb"/> Cek Status Pembayaran</span>}
              </button>
              <button onClick={() => setQris(null)} style={{ background:'none',border:'none',color:'#94a3b8',fontSize:12,cursor:'pointer',marginTop:10,textDecoration:'underline' }}>Batalkan & Kembali</button>
            </div>
          </div>
        )}
      </div>
      <BottomNav/>
    </div>
  )
}

function QrisIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#0f172a"/>
      <rect x="6" y="6" width="11" height="11" rx="2" fill="none" stroke="white" strokeWidth="2"/>
      <rect x="9" y="9" width="5" height="5" rx="1" fill="white"/>
      <rect x="23" y="6" width="11" height="11" rx="2" fill="none" stroke="white" strokeWidth="2"/>
      <rect x="26" y="9" width="5" height="5" rx="1" fill="white"/>
      <rect x="6" y="23" width="11" height="11" rx="2" fill="none" stroke="white" strokeWidth="2"/>
      <rect x="9" y="26" width="5" height="5" rx="1" fill="white"/>
      <rect x="23" y="23" width="4" height="4" fill="white"/>
      <rect x="29" y="23" width="5" height="4" fill="white"/>
      <rect x="23" y="29" width="11" height="5" fill="white"/>
    </svg>
  )
}

function Spin({ color = 'white' }) {
  return <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}><span style={{ width:18,height:18,border:`2px solid ${color==='white'?'rgba(255,255,255,0.3)':'#dbeafe'}`,borderTopColor:color,borderRadius:'50%',display:'inline-block',animation:'spin 0.6s linear infinite' }}/> Memproses...</span>
}
