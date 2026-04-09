import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
const RO_BASE = process.env.API_RUMAHOTP_BASE || 'https://www.rumahotp.io/api/v2'
const RO_KEY  = process.env.API_RUMAHOTP_KEY  || ''
export async function POST(req) {
  const s = await getSession()
  if (!s) return NextResponse.json({ success:false }, { status:401 })
  const { id } = await req.json()
  try {
    const res = await fetch(`${RO_BASE}/cancel/${id}`, { headers: { Accept:'application/json','x-apikey':RO_KEY } })
    const data = await res.json()
    return NextResponse.json({ success:true, data })
  } catch(e) {
    return NextResponse.json({ success:false, message:e.message })
  }
}
