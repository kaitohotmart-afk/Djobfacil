import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Atualizar sessão se expirada
    // IMPORTANTE: este comando deve vir antes de qualquer lógica early return
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Rotas de autenticação (redirecionar se já estiver logado)
    const authRoutes = ['/login', '/signup', '/recuperar-senha']
    const isAuthRoute = authRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    )

    // Rotas admin
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

    // Não logado tentando acessar rota protegida (tudo que não é público e não é home)
    // Se não é rota publica (authRoutes + home + public assets ignorados pelo matcher)
    // Na verdade, queremos proteger /dashboard e /admin e /pedidos etc.
    // Estratégia: Proteger tudo, exceto publicRoutes.

    // Lista explícita de rotas públicas
    const publicPaths = ['/', '/login', '/signup', '/recuperar-senha']
    const isPublicPath = publicPaths.some(path => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + '/'))

    if (!user && !isPublicPath) {
        // Se não logado e tentando acessar rota protegida
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // Logado tentando acessar páginas de login/signup
    if (user && isAuthRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    // Admin: O middleware apenas deixa passar. A proteção real de role está no layout/page admin.


    return supabaseResponse
}
