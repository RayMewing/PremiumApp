'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) router.push('/dashboard')
      else setError(data.message)
    } catch { setError('Terjadi kesalahan, coba lagi') }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'linear-gradient(160deg,#eff6ff 0%,#ffffff 60%)', display: 'flex', flexDirection: 'column' }}>
      {/* Header decoration */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '60px 32px 48px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(37,99,235,0.06)' }} />
        <div style={{ position: 'absolute', top: 20, left: -40, width: 120, height: 120, borderRadius: '50%', background: 'rgba(6,182,212,0.08)' }} />
        
        {/* Logo */}
        <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', borderRadius: 22, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(37,99,235,0.3)' }}>
          <span style={{ fontSize: 32 }}>💎</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>PremiumKita</h1>
        <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: 14 }}>Masuk ke akun Anda</p>
      </div>

      {/* Form */}
      <div style={{ flex: 1, padding: '0 24px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 12, padding: '12px 16px', color: '#991b1b', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>📧</span>
              <input
                className="input-field"
                type="email" placeholder="email@contoh.com"
                style={{ paddingLeft: 42 }}
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔒</span>
              <input
                className="input-field"
                type={showPw ? 'text' : 'password'} placeholder="••••••••"
                style={{ paddingLeft: 42, paddingRight: 48 }}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
              />
              <button type="button" onClick={() => setShowPw(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Spinner /> Memproses...
              </span>
            ) : 'Masuk ke Akun'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
            Belum punya akun?{' '}
            <Link href="/register" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Daftar Sekarang</Link>
          </p>
        </div>

        {/* Decorative features */}
        <div style={{ marginTop: 'auto', paddingTop: 32, display: 'flex', gap: 12, justifyContent: 'center' }}>
          {['🔐 Aman', '⚡ Cepat', '💯 Terpercaya'].map(f => (
            <span key={f} style={{ fontSize: 12, color: '#64748b', background: 'white', border: '1px solid #e2e8f0', borderRadius: 99, padding: '4px 12px' }}>{f}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function Spinner() {
  return <span style={{ width:18,height:18,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',display:'inline-block',animation:'spin 0.6s linear infinite' }} />
}
