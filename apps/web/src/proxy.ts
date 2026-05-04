import { NextRequest, NextResponse } from 'next/server';
import {jwtVerify} from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function proxy(req: NextRequest) {
  const token = req.cookies.get('auth-token')?.value;

  if (!token) return NextResponse.redirect(new URL('/login', req.url));

  try{
    const {payload} = await jwtVerify(token, secret);
    if (req.nextUrl.pathname.startsWith('/admin') && payload.role !== 'ADMIN'){
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.next();
  }catch{
    const res = NextResponse.redirect(new URL('/login', req.url));
    res.cookies.delete('auth-token');
    return res;
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
};