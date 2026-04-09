import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

const RO_BASE = process.env.API_RUMAHOTP_BASE || 'https://www.rumahotp.io/api/v2'
const RO_KEY  = process.env.API_RUMAHOTP_KEY  || ''

export async function GET(req) {
  const s = await getSession()
  if (!s) return NextResponse.json({ success:false }, { status:401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ success:false, message:'ID wajib' }, { status:400 })

  try {
    const res = await fetch(`${RO_BASE}/otp/${id}`, { headers: { Accept:'application/json','x-apikey':RO_KEY } })
    const data = await res.json()
    const otp = data?.otp || data?.code || data?.sms || null
    return NextResponse.json({ success:true, otp, raw: data })
  } catch(e) {
    return NextResponse.json({ success:false, message:e.message })
  }
}
