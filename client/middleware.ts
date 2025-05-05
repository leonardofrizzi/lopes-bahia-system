// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Definir quais rotas são protegidas (requerem autenticação)
  const isProtectedRoute = path.startsWith('/dashboard') || 
                          path.startsWith('/empreendimentos') || 
                          path.startsWith('/oferta-ativa');
                          
  // Definir quais rotas são públicas para usuários não autenticados
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/cadastro');
  
  // Verificar se o usuário está logado
  const isLoggedIn = request.cookies.has('usuarioLogado');

  // Se for rota protegida e o usuário não estiver logado, redirecionar para login
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Se for rota de autenticação e o usuário já estiver logado, redirecionar para dashboard
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// Configurar quais caminhos devem ser processados pelo middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/empreendimentos/:path*',
    '/oferta-ativa/:path*',
    '/login',
    '/cadastro'
  ],
};
