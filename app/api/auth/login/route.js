import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { signToken, setSessionCookie } from '@/lib/auth'

export async function POST(req) {
  try {
    const { email, password } = await req.json()
    if (!email || !password)
      return NextResponse.json({ success: false, message: 'Email dan password wajib diisi' }, { status: 400 })

    await connectDB()
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user)
      return NextResponse.json({ success: false, message: 'Email atau password salah' }, { status: 401 })

    if (!user.isActive)
      return NextResponse.json({ success: false, message: 'Akun Anda telah dinonaktifkan' }, { status: 403 })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid)
      return NextResponse.json({ success: false, message: 'Email atau password salah' }, { status: 401 })

    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() })

    const token = await signToken({ userId: user._id.toString(), email: user.email, role: user.role })
    const res = NextResponse.json({ success: true, message: 'Login berhasil' })
    setSessionCookie(res, token)
    return res
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 })
  }
}
