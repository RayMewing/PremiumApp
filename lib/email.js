import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

export async function sendOTPEmail(email, otp, type = 'register', opts = {}) {
  const appName = opts.appName || process.env.NEXT_PUBLIC_APP_NAME || 'PremiumKita'
  const logoUrl = opts.logoUrl || ''
  const headerColor = opts.headerColor || '#2563eb'
  const isChangePw = type === 'change-password'

  const subject = isChangePw
    ? `Kode OTP Ubah Password — ${appName}`
    : `Verifikasi Email — ${appName}`

  const logoSection = logoUrl
    ? `<img src="${logoUrl}" alt="${appName}" style="height:52px;width:auto;object-fit:contain;margin-bottom:12px;display:block;margin-left:auto;margin-right:auto;" />`
    : `<div style="width:60px;height:60px;border-radius:18px;background:rgba(255,255,255,0.22);margin:0 auto 12px;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;color:white;font-family:Arial,sans-serif;border:2px solid rgba(255,255,255,0.3);">P</div>`

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4ff;font-family:'Segoe UI',Arial,sans-serif;">
<div style="max-width:520px;margin:40px auto;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(37,99,235,0.12);">
  <div style="background:${headerColor};padding:40px 32px 32px;text-align:center;">
    ${logoSection}
    <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800;">${appName}</h1>
    <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:13px;">Layanan Digital Terpercaya</p>
  </div>
  <div style="padding:36px 32px;">
    <h2 style="color:#0f172a;margin:0 0 10px;font-size:20px;font-weight:700;">${isChangePw ? 'Ubah Kata Sandi' : 'Aktivasi Akun'}</h2>
    <p style="color:#64748b;margin:0 0 28px;font-size:14px;line-height:1.7;">${isChangePw ? 'Gunakan kode OTP berikut untuk mengubah kata sandi akun Anda.' : 'Terima kasih sudah mendaftar! Masukkan kode berikut untuk mengaktifkan akun.'}</p>
    <div style="background:#f0f4ff;border:2px dashed ${headerColor};border-radius:18px;padding:28px 24px;text-align:center;margin-bottom:28px;">
      <p style="color:#64748b;margin:0 0 10px;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;">Kode OTP Anda</p>
      <p style="color:${headerColor};font-size:44px;font-weight:900;letter-spacing:14px;margin:0;font-family:'Courier New',monospace;">${otp}</p>
      <p style="color:#94a3b8;margin:10px 0 0;font-size:12px;">Berlaku selama <strong>10 menit</strong></p>
    </div>
    <div style="background:#fef9c3;border-left:4px solid #f59e0b;border-radius:0 10px 10px 0;padding:14px 16px;margin-bottom:24px;">
      <p style="color:#92400e;margin:0;font-size:13px;"><strong>Peringatan:</strong> Jangan bagikan kode ini kepada siapapun, termasuk tim ${appName}.</p>
    </div>
    <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">Jika Anda tidak melakukan permintaan ini, abaikan email ini.</p>
  </div>
  <div style="background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
    <p style="color:#94a3b8;font-size:11px;margin:0;">© ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
  </div>
</div></body></html>`

  await transporter.sendMail({
    from: `${appName} <${process.env.SMTP_USER}>`,
    to: email, subject, html,
  })
}
