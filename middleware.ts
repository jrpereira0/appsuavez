import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Rotas do owner/admin
    if (pathname.startsWith('/owner')) {
      if (token?.role !== 'OWNER' && token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    // Rotas do barbeiro
    if (pathname.startsWith('/dashboard')) {
      if (token?.role === 'OWNER' || token?.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/owner', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/owner/:path*', '/dashboard/:path*'],
}


