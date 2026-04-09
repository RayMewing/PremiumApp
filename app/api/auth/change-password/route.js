import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { OTP } from '@/lib/models/OTP'
import { sendOTPEmail } from '@/lib/email'
import { getSession } from '@/lib/auth'

export async function POST(req) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const { action, oldPassword, newPassword, otp } = await req.json()
    await connectDB()
    const user = await User.findById(session.userId)
    if (!user) return NextResponse.json({ success: false, message: 'User tidak ditemukan' }, { status: 404 })

    if (action === 'send-otp') {
      if (!oldPassword || !newPassword)
        return NextResponse.json({ success: false, message: 'Password lama dan baru wajib diisi' }, { status: 400 })
      if (newPassword.length < 6)
        return NextResponse.json({ success: false, message: 'Password baru minimal 6 karakter' }, { status: 400 })

      const valid = await bcrypt.compare(oldPassword, user.password)
      if (!valid)
        return NextResponse.json({ success: false, message: 'Password lama salah' }, { status: 400 })

      const otpCode = String(Math.floor(100000 + Math.random() * 900000))
      const hashedNew = await bcrypt.hash(newPassword, 10)

      await OTP.deleteMany({ email: user.email, type: 'change-password' })
      await OTP.create({
        email: user.email,
        code: otpCode,
        type: 'change-password',
        tempData: { newPassword: hashedNew },
        expiredAt: new Date(Date.now() + 10 * 60 * 1000),
      })
      await sendOTPEmail(user.email, otpCode, 'change-password')
      return NextResponse.json({ success: true, message: 'OTP dikirim ke email Anda' })
    }

    if (action === 'verify-otp') {
      if (!otp) return NextResponse.json({ success: false, message: 'OTP wajib diisi' }, { status: 400 })
      const otpDoc = await OTP.findOne({ email: user.email, type: 'change-password', used: false, expiredAt: { $gt: new Date() } })
      if (!otpDoc) return NextResponse.json({ success: false, message: 'OTP kadaluarsa, minta OTP baru' }, { status: 400 })
      if (otpDoc.code !== String(otp)) {
        otpDoc.attempts += 1; await otpDoc.save()
        return NextResponse.json({ success: false, message: 'Kode OTP salah' }, { status: 400 })
      }
      otpDoc.used = true; await otpDoc.save()
      await User.findByIdAndUpdate(user._id, { password: otpDoc.tempData.newPassword })
      return NextResponse.json({ success: true, message: 'Password berhasil diubah' })
    }

    return NextResponse.json({ success: false, message: 'Action tidak valid' }, { status: 400 })
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 })
  }
}
