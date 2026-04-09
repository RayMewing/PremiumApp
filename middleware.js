import { NextResponse } from 'next/server'
import { verifyToken } from './lib/auth'

const PUBLIC = ['/login', '/register', '/verify']

export async function middleware(req) {
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/_next') || pathname === '/favicon.ico') return NextResponse.next()
  if (PUBLIC.some(p => pathname === p)) return NextResponse.next()

  const token = req.cookies.get('pk_session')?.value
  if (!token) return NextResponse.redirect(new URL('/login', req.url))

  const payload = await verifyToken(token)
  if (!payload) {
    const res = NextResponse.redirect(new URL('/login', req.url))
    res.cookies.set('pk_session', '', { maxAge: 0 })
    return res
  }

  // Admin route guard
  if (pathname.startsWith('/admin') && payload.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
