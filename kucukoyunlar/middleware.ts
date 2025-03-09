import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Oturum durumunu yenile
  await supabase.auth.getSession();
  
  // Korumalı rotalar için kontrol
  const path = req.nextUrl.pathname;
  const session = await supabase.auth.getSession();
  
  // Korumalı rotalar
  const protectedRoutes = ['/dashboard', '/profile'];
  
  // Auth rotaları
  const authRoutes = ['/auth/login', '/auth/register', '/auth/reset-password'];
  
  // Kullanıcı oturum açmışsa ve auth sayfalarına erişmeye çalışıyorsa ana sayfaya yönlendir
  if (session.data.session && authRoutes.some(route => path.startsWith(route))) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  // Kullanıcı oturum açmamışsa ve korumalı sayfalara erişmeye çalışıyorsa login sayfasına yönlendir
  if (!session.data.session && protectedRoutes.some(route => path.startsWith(route))) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  
  return res;
}

// Middleware'in çalışacağı rotaları belirt
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/auth/:path*',
  ],
}; 