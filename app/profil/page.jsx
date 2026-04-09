'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { Icon } from '@/components/Icons'

export default function ProfilPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [time, setTime] = useState(new Date())
  const [modal, setModal] = useState(null)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ oldPw:'', newPw:'', confirmPw:'' })
  const [otp, setOtp] = useState(['','','','','',''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [vis, setVis] = useState({ old:false, new:false, confirm:false })
  const refs = useRef([])

  useEffect(() => {
    fetch('/api/user/me').then(r=>r.json()).then(d => {
      if (!d.success) router.push('/login'); else setUser(d.user)
    })
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const logout = async () => {
    await fetch('/api/auth/logout', { method:'POST' })
    router.push('/login')
  }

  const sendOtp = async () => {
    if (!form.oldPw || !form.newPw) { setError('Semua field wajib'); return }
    if (form.newPw.length < 6) { setError('Password baru min 6 karakter'); return }
    if (form.newPw !== form.confirmPw) { setError('Konfirmasi tidak cocok'); return }
    setError(''); setLoading(true)
    const r = await fetch('/api/auth/change-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'send-otp',oldPassword:form.oldPw,newPassword:form.newPw})}).then(res=>res.json())
    if (r.success) setStep(2)
    else setError(r.message)
    setLoading(false)
  }

  const verifyOtp = async () => {
    const code = otp.join('')
    if (code.length < 6) { setError('Masukkan 6 digit OTP'); return }
    setError(''); setLoading(true)
    const r = await fetch('/api/auth/change-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'verify-otp',otp:code,email:user?.email})}).then(res=>res.json())
    if (r.success) {
      setModal(null); setStep(1); setOtp(['','','','','','']); setForm({oldPw:'',newPw:'',confirmPw:''})
      setMsg('Password berhasil diubah!'); setTimeout(()=>setMsg(''), 3000)
    } else setError(r.message)
    setLoading(false)
  }

  const otpInput = (v, i) => {
    if (!/^\d*$/.test(v)) return
    const n = [...otp]; n[i] = v.slice(-1); setOtp(n)
    if (v && i < 5) refs.current[i+1]?.focus()
  }

  const initials = user?.nama?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() || 'U'

  if (!user) return (
    <div style={{ minHeight:'100dvh',background:'#f0f4ff',display:'flex',alignItems:'center',justifyContent:'center' }}>
      <div style={{ width:40,height:40,border:'3px solid #bfdbfe',borderTopColor:'#2563eb',borderRadius:'50%',animation:'spin 0.7s linear infinite' }}/>
    </div>
  )

  return (
    <div style={{ background:'#f0f4ff',minHeight:'100dvh' }} className="page-content">
      {/* Header */}
      <div style={{ background:'linear-gradient(150deg,#0f2d6b,#1e40af,#2563eb)',padding:'48px 20px 36px',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',top:-50,right:-50,width:180,height:180,borderRadius:'50%',background:'rgba(255,255,255,0.05)' }}/>
        <div style={{ display:'flex',alignItems:'center',gap:14 }}>
          <div style={{ width:62,height:62,borderRadius:20,background:'rgba(255,255,255,0.18)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:800,color:'white',border:'2px solid rgba(255,255,255,0.28)',flexShrink:0 }}>
            {initials}
          </div>
          <div>
            <h1 style={{ margin:0,fontSize:20,fontWeight:800,color:'white',letterSpacing:-0.5 }}>{user.nama}</h1>
            <p style={{ margin:'3px 0 6px',fontSize:12,color:'rgba(255,255,255,0.65)' }}>{user.email}</p>
            <div style={{ display:'inline-flex',alignItems:'center',gap:5,background:'rgba(16,185,129,0.18)',borderRadius:99,padding:'4px 10px' }}>
              <span style={{ width:6,height:6,borderRadius:'50%',background:'#6ee7b7',display:'inline-block' }}/>
              <span style={{ fontSize:11,fontWeight:700,color:'#6ee7b7' }}>AKUN AKTIF</span>
            </div>
          </div>
          {user.role === 'admin' && (
            <button onClick={() => router.push('/admin')} style={{ marginLeft:'auto',background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:12,padding:'8px 12px',cursor:'pointer',display:'flex',alignItems:'center',gap:6 }}>
              <Icon name="shield" size={15} color="white"/>
              <span style={{ fontSize:12,fontWeight:700,color:'white' }}>Admin</span>
            </button>
          )}
        </div>
      </div>

      <div style={{ padding:'16px' }}>
        {msg && (
          <div style={{ background:'#d1fae5',borderRadius:12,padding:'11px 14px',color:'#065f46',fontSize:13,fontWeight:600,marginBottom:14,display:'flex',alignItems:'center',gap:8 }}>
            <Icon name="check-circle" size={15} color="#059669"/> {msg}
          </div>
        )}

        {/* Time & saldo */}
        <div style={{ background:'white',borderRadius:20,padding:18,marginBottom:14,boxShadow:'0 2px 10px rgba(0,0,0,0.05)',display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
          <div style={{ background:'#f0f4ff',borderRadius:14,padding:14 }}>
            <div style={{ display:'flex',alignItems:'center',gap:6,marginBottom:6 }}>
              <Icon name="clock" size={13} color="#64748b"/>
              <p style={{ margin:0,fontSize:10,color:'#64748b',fontWeight:600,textTransform:'uppercase',letterSpacing:0.5 }}>Waktu Server</p>
            </div>
            <p style={{ margin:0,fontSize:17,fontWeight:800,color:'#0f172a',fontFamily:'monospace',letterSpacing:1 }}>
              {time.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}
            </p>
            <p style={{ margin:'3px 0 0',fontSize:10,color:'#94a3b8' }}>
              {time.toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'short',year:'numeric'})}
            </p>
          </div>
          <div style={{ background:'#f0f4ff',borderRadius:14,padding:14 }}>
            <div style={{ display:'flex',alignItems:'center',gap:6,marginBottom:6 }}>
              <Icon name="wallet" size={13} color="#64748b"/>
              <p style={{ margin:0,fontSize:10,color:'#64748b',fontWeight:600,textTransform:'uppercase',letterSpacing:0.5 }}>Saldo Aktif</p>
            </div>
            <p style={{ margin:0,fontSize:15,fontWeight:800,color:'#2563eb' }}>Rp {(user.saldo||0).toLocaleString('id-ID')}</p>
            <p style={{ margin:'3px 0 0',fontSize:10,color:'#94a3b8' }}>
              Gabung {new Date(user.joinedAt||user.createdAt).toLocaleDateString('id-ID',{month:'long',year:'numeric'})}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ background:'white',borderRadius:20,padding:18,marginBottom:14,boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
          <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:14 }}>
            <Icon name="bar-chart" size={16} color="#2563eb"/>
            <p style={{ margin:0,fontSize:14,fontWeight:700,color:'#0f172a' }}>Statistik Akun</p>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10 }}>
            {[
              { label:'Deposit', val:user.totalDeposit||0, icon:'dollar', color:'#059669' },
              { label:'Transaksi', val:user.totalTransaksi||0, icon:'check-circle', color:'#2563eb' },
              { label:'Role', val:user.role==='admin'?'Admin':'Member', icon:'shield', color:'#7c3aed' },
            ].map(s => (
              <div key={s.label} style={{ background:'#f8faff',borderRadius:12,padding:'12px 8px',textAlign:'center' }}>
                <div style={{ width:30,height:30,borderRadius:9,background:s.color+'18',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 8px' }}>
                  <Icon name={s.icon} size={15} color={s.color}/>
                </div>
                <p style={{ margin:0,fontSize:15,fontWeight:800,color:'#0f172a' }}>{s.val}</p>
                <p style={{ margin:0,fontSize:10,color:'#94a3b8' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div style={{ background:'white',borderRadius:20,overflow:'hidden',marginBottom:14,boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
          {[
            { icon:'lock', label:'Ubah Kata Sandi', desc:'Ganti password via OTP Email', color:'#f59e0b', onClick:()=>{ setModal('pw'); setStep(1); setError('') } },
            { icon:'history', label:'Riwayat Transaksi', desc:'Semua riwayat pembelian', color:'#2563eb', onClick:()=>router.push('/riwayat') },
            { icon:'wallet', label:'Top Up Saldo', desc:'Isi saldo via QRIS', color:'#059669', onClick:()=>router.push('/deposit') },
          ].map((m, i, arr) => (
            <div key={m.label}>
              <button onClick={m.onClick} style={{ display:'flex',alignItems:'center',gap:14,padding:'16px 18px',background:'none',border:'none',cursor:'pointer',width:'100%',textAlign:'left' }}>
                <div style={{ width:44,height:44,borderRadius:14,background:m.color+'15',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                  <Icon name={m.icon} size={20} color={m.color} strokeWidth={1.9}/>
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ margin:0,fontSize:14,fontWeight:700,color:'#0f172a' }}>{m.label}</p>
                  <p style={{ margin:'2px 0 0',fontSize:11,color:'#94a3b8' }}>{m.desc}</p>
                </div>
                <Icon name="chevron-right" size={18} color="#cbd5e1"/>
              </button>
              {i < arr.length-1 && <div style={{ height:1,background:'#f0f4ff',margin:'0 18px' }}/>}
            </div>
          ))}
        </div>

        {/* Logout */}
        <button onClick={logout} style={{ width:'100%',padding:'15px',background:'#fff1f2',border:'1.5px solid #fecdd3',borderRadius:16,color:'#e11d48',fontSize:14,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,fontFamily:'Inter,sans-serif' }}>
          <Icon name="logout" size={18} color="#e11d48"/> Keluar Akun
        </button>
        <p style={{ textAlign:'center',color:'#94a3b8',fontSize:11,marginTop:16 }}>PremiumKita v2.0 • © 2026</p>
      </div>

      {/* Change PW Modal */}
      {modal === 'pw' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div style={{ width:36,height:4,borderRadius:99,background:'#e2e8f0',margin:'0 auto 22px' }}/>
            <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:6 }}>
              <div style={{ width:40,height:40,borderRadius:13,background:'#fff7ed',display:'flex',alignItems:'center',justifyContent:'center' }}>
                <Icon name="lock" size={20} color="#f59e0b"/>
              </div>
              <div>
                <h2 style={{ margin:0,fontSize:18,fontWeight:800,color:'#0f172a' }}>Ubah Kata Sandi</h2>
                <p style={{ margin:0,fontSize:12,color:'#64748b' }}>{step===1?'Isi form berikut':'OTP dikirim ke '+user.email}</p>
              </div>
            </div>
            {error && (
              <div style={{ background:'#fee2e2',borderRadius:10,padding:'10px 14px',color:'#991b1b',fontSize:13,margin:'14px 0 0',display:'flex',gap:8 }}>
                <Icon name="alert-tri" size={15} color="#ef4444"/> {error}
              </div>
            )}
            {step === 1 ? (
              <div style={{ display:'flex',flexDirection:'column',gap:12,marginTop:18 }}>
                {[{k:'oldPw',l:'Sandi Lama',v:'old'},{k:'newPw',l:'Sandi Baru (Min. 6)',v:'new'},{k:'confirmPw',l:'Ulangi Sandi Baru',v:'confirm'}].map(f => (
                  <div key={f.k}>
                    <label style={{ display:'block',fontSize:12,fontWeight:700,color:'#374151',marginBottom:5 }}>{f.l}</label>
                    <div style={{ position:'relative' }}>
                      <div style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)' }}><Icon name="lock" size={15} color="#94a3b8"/></div>
                      <input className="input-field" type={vis[f.v]?'text':'password'} style={{ paddingLeft:36,paddingRight:42 }}
                        value={form[f.k]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))}/>
                      <button type="button" onClick={() => setVis(p=>({...p,[f.v]:!p[f.v]}))} style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer' }}>
                        <Icon name={vis[f.v]?'eye-off':'eye'} size={16} color="#94a3b8"/>
                      </button>
                    </div>
                  </div>
                ))}
                <button className="btn-primary" onClick={sendOtp} disabled={loading} style={{ marginTop:4 }}>
                  {loading ? <Spin/> : <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}><Icon name="mail" size={17} color="white"/>Kirim OTP Email</span>}
                </button>
                <button className="btn-outline" onClick={() => setModal(null)}>Batal</button>
              </div>
            ) : (
              <div style={{ display:'flex',flexDirection:'column',gap:16,marginTop:18 }}>
                <div style={{ display:'flex',gap:8,justifyContent:'center' }}>
                  {otp.map((d,i) => (
                    <input key={i} ref={el=>refs.current[i]=el} type="tel" maxLength={1} value={d}
                      onChange={e=>otpInput(e.target.value,i)}
                      onKeyDown={e=>e.key==='Backspace'&&!d&&i>0&&refs.current[i-1]?.focus()}
                      style={{ width:46,height:54,textAlign:'center',fontSize:22,fontWeight:700,border:`2px solid ${d?'#2563eb':'#e2e8f0'}`,borderRadius:14,background:d?'#eff6ff':'white',outline:'none',fontFamily:'Inter,sans-serif',transition:'all 0.15s' }}/>
                  ))}
                </div>
                <button className="btn-primary" onClick={verifyOtp} disabled={loading}>
                  {loading ? <Spin/> : <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}><Icon name="check" size={17} color="white"/>Verifikasi & Simpan</span>}
                </button>
                <button onClick={() => setStep(1)} style={{ background:'none',border:'none',color:'#64748b',cursor:'pointer',fontSize:13,textDecoration:'underline' }}>Kembali</button>
              </div>
            )}
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  )
}
function Spin() {
  return <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}><span style={{ width:18,height:18,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',display:'inline-block',animation:'spin 0.6s linear infinite' }}/> Proses...</span>
}
