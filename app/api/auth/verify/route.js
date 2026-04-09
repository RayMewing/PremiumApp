import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { OTP } from '@/lib/models/OTP'

export async function POST(req) {
  try {
    const { email, code, type = 'register' } = await req.json()
    if (!email || !code)
      return NextResponse.json({ success: false, message: 'Data tidak lengkap' }, { status: 400 })

    await connectDB()

    const otpDoc = await OTP.findOne({
      email: email.toLowerCase(),
      type,
      used: false,
      expiredAt: { $gt: new Date() },
    }).sort({ createdAt: -1 })

    if (!otpDoc)
      return NextResponse.json({ success: false, message: 'OTP tidak ditemukan atau sudah kadaluarsa' }, { status: 400 })

    if (otpDoc.attempts >= 5) {
      await OTP.deleteOne({ _id: otpDoc._id })
      return NextResponse.json({ success: false, message: 'Terlalu banyak percobaan. Minta OTP baru.' }, { status: 400 })
    }

    if (otpDoc.code !== String(code)) {
      otpDoc.attempts += 1
      await otpDoc.save()
      return NextResponse.json({ success: false, message: `Kode OTP salah (${5 - otpDoc.attempts} percobaan tersisa)` }, { status: 400 })
    }

    otpDoc.used = true
    await otpDoc.save()

    if (type === 'register') {
      const { email: userEmail, nama, password } = otpDoc.tempData
      const userCount = await User.countDocuments()
      await User.create({
        email: userEmail,
        nama,
        password,
        role: userCount === 0 ? 'admin' : 'member',
      })
    }

    return NextResponse.json({ success: true, message: 'Verifikasi berhasil!' })
  } catch (e) {
    console.error('Verify error:', e)
    return NextResponse.json({ success: false, message: e.message }, { status: 500 })
  }
}
