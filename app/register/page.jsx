'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', nama: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        router.push(`/verify?email=${encodeURIComponent(form.email)}&type=register`)
      } else setError(data.message)
    } catch { setError('Terjadi kesalahan, coba lagi') }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'linear-gradient(160deg,#eff6ff 0%,#ffffff 60%)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', overflow: 'hidden', padding: '50px 32px 36px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(37,99,235,0.06)' }} />
        <div style={{ width: 68, height: 68, background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', borderRadius: 20, margin: '0 auto 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(37,99,235,0.3)' }}>
          <span style={{ fontSize: 30 }}>💎</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#0f172a' }}>Buat Akun Baru</h1>
        <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: 13 }}>Daftar gratis & nikmati semua layanan</p>
      </div>

      <div style={{ padding: '0 24px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 12, padding: '12px 16px', color: '#991b1b', fontSize: 14 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Nama Lengkap</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>👤</span>
              <input className="input-field" type="text" placeholder="Nama kamu" style={{ paddingLeft: 42 }}
                value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} required />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>📧</span>
              <input className="input-field" type="email" placeholder="email@contoh.com" style={{ paddingLeft: 42 }}
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔒</span>
              <input className="input-field" type={showPw ? 'text' : 'password'} placeholder="Min. 6 karakter"
                style={{ paddingLeft: 42, paddingRight: 48 }}
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={6} />
              <button type="button" onClick={() => setShowPw(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
            {form.password && (
              <div style={{ marginTop: 6, display: 'flex', gap: 4 }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: form.password.length > i * 2 ? (form.password.length < 6 ? '#f59e0b' : '#10b981') : '#e2e8f0' }} />
                ))}
              </div>
            )}
          </div>

          <div style={{ background: '#eff6ff', borderRadius: 12, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 16 }}>📨</span>
            <p style={{ margin: 0, fontSize: 12, color: '#1e40af', lineHeight: 1.5 }}>
              Kode OTP akan dikirim ke email Anda untuk verifikasi akun. Pastikan email aktif.
            </p>
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Spinner /> Mengirim OTP...</span> : 'Daftar & Kirim OTP'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#64748b', fontSize: 14, margin: 0 }}>
          Sudah punya akun?{' '}
          <Link href="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Masuk Sekarang</Link>
        </p>
      </div>
    </div>
  )
}

function Spinner() {
  return <span style={{ width:18,height:18,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',display:'inline-block',animation:'spin 0.6s linear infinite' }} />
}
