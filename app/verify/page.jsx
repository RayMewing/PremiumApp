'use client'
import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function VerifyContent() {
  const router = useRouter()
  const params = useSearchParams()
  const email = params.get('email') || ''
  const type = params.get('type') || 'register'
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const refs = useRef([])

  const handleInput = (val, idx) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]
    next[idx] = val.slice(-1)
    setOtp(next)
    if (val && idx < 5) refs.current[idx + 1]?.focus()
  }

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) refs.current[idx - 1]?.focus()
  }

  const submit = async () => {
    const code = otp.join('')
    if (code.length < 6) { setError('Masukkan 6 digit OTP'); return }
    setError(''); setLoading(true)
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, type })
      })
      const data = await res.json()
      if (data.success) {
        setSuccess(true)
        setTimeout(() => router.push(type === 'register' ? '/login' : '/profil'), 2000)
      } else setError(data.message)
    } catch { setError('Terjadi kesalahan') }
    setLoading(false)
  }

  if (success) return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
      <div style={{ width: 80, height: 80, background: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, marginBottom: 20 }}>✅</div>
      <h2 style={{ margin: '0 0 8px', color: '#065f46', fontSize: 22, fontWeight: 700 }}>Berhasil!</h2>
      <p style={{ color: '#64748b', margin: 0 }}>{type === 'register' ? 'Akun aktif, mengarahkan ke login...' : 'Password berhasil diubah!'}</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100dvh', background: 'linear-gradient(160deg,#eff6ff 0%,#fff 60%)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '60px 32px 36px', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', borderRadius: 22, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(37,99,235,0.3)' }}>
          <span style={{ fontSize: 32 }}>📨</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#0f172a' }}>Verifikasi OTP</h1>
        <p style={{ margin: '10px 0 0', color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
          Kode 6 digit telah dikirim ke<br />
          <strong style={{ color: '#2563eb' }}>{email}</strong>
        </p>
      </div>

      <div style={{ padding: '0 24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {error && (
          <div style={{ background: '#fee2e2', borderRadius: 12, padding: '12px 16px', color: '#991b1b', fontSize: 14 }}>
            ⚠️ {error}
          </div>
        )}

        {/* OTP boxes */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => refs.current[i] = el}
              type="tel" maxLength={1} value={digit}
              onChange={e => handleInput(e.target.value, i)}
              onKeyDown={e => handleKeyDown(e, i)}
              style={{
                width: 48, height: 56,
                textAlign: 'center',
                fontSize: 22, fontWeight: 700,
                border: `2px solid ${digit ? '#2563eb' : '#e2e8f0'}`,
                borderRadius: 14,
                background: digit ? '#eff6ff' : 'white',
                color: '#0f172a',
                outline: 'none',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.15s',
              }}
            />
          ))}
        </div>

        <div style={{ background: '#eff6ff', borderRadius: 12, padding: '12px 14px', fontSize: 13, color: '#1e40af', display: 'flex', gap: 8 }}>
          <span>⏰</span>
          <span>Kode berlaku 10 menit. Cek folder spam jika tidak ada di inbox.</span>
        </div>

        <button className="btn-primary" onClick={submit} disabled={loading || otp.join('').length < 6}>
          {loading ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Spinner /> Verifikasi...</span> : 'Verifikasi Sekarang'}
        </button>

        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}>
          ← Kembali
        </button>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return <Suspense><VerifyContent /></Suspense>
}

function Spinner() {
  return <span style={{ width:18,height:18,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',display:'inline-block',animation:'spin 0.6s linear infinite' }} />
}
