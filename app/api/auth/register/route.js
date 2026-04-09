import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { OTP } from '@/lib/models/OTP'
import { sendOTPEmail } from '@/lib/email'

export async function POST(req) {
  try {
    const { email, nama, password } = await req.json()

    if (!email || !nama || !password)
      return NextResponse.json({ success: false, message: 'Semua field wajib diisi' }, { status: 400 })

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ success: false, message: 'Format email tidak valid' }, { status: 400 })

    if (nama.trim().length < 2 || nama.trim().length > 60)
      return NextResponse.json({ success: false, message: 'Nama harus 2-60 karakter' }, { status: 400 })

    if (password.length < 6)
      return NextResponse.json({ success: false, message: 'Password minimal 6 karakter' }, { status: 400 })

    await connectDB()

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing)
      return NextResponse.json({ success: false, message: 'Email sudah terdaftar' }, { status: 400 })

    const hashedPw = await bcrypt.hash(password, 10)
    const otpCode = String(Math.floor(100000 + Math.random() * 900000))

    await OTP.deleteMany({ email: email.toLowerCase(), type: 'register' })
    await OTP.create({
      email: email.toLowerCase(),
      code: otpCode,
      type: 'register',
      tempData: { email: email.toLowerCase(), nama: nama.trim(), password: hashedPw },
      expiredAt: new Date(Date.now() + 10 * 60 * 1000),
    })

    await sendOTPEmail(email, otpCode, 'register')

    return NextResponse.json({ success: true, message: 'Kode OTP dikirim ke email Anda' })
  } catch (e) {
    console.error('Register error:', e)
    return NextResponse.json({ success: false, message: 'Gagal mengirim OTP: ' + e.message }, { status: 500 })
  }
}
