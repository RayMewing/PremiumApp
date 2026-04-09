import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Info } from '@/lib/models/Info'
import { getSession } from '@/lib/auth'

export async function GET(req) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    await connectDB()
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') || ''
    const filter = { isPublished: true }
    if (category && category !== 'all') filter.category = category
    const infos = await Info.find(filter).sort({ createdAt: -1 }).limit(50)
    return NextResponse.json({ success: true, data: infos })
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 })
  }
}
