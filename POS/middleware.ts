import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import type { JWT } from 'next-auth/jwt';

interface Token extends JWT {
    role?: string;
}
export async function middleware(req: NextRequest) {
    console.log('middleware');

    const token: Token | null = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const adminRoutes = ['/users', '/dashboard/product'];
    const isAdminRoute = adminRoutes.some((route) =>
        req.nextUrl.pathname.startsWith(route)
    );

    if (req.nextUrl.pathname === '/') {
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (isAdminRoute && token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/403', req.url)); // Redirect to a forbidden page
    }

    if (req.nextUrl.pathname === '/') return NextResponse.redirect(new URL('/dashboard', req.url));
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/dashobard',
        '/item-categories',
        '/items',
        '/supplier-invoices',
        '/supplier-invoices-upload',
        '/supplier-payments',
        '/suppliers',
        '/units',
        '/wastes',
        '/floor',
        '/orders',
        '/outlets',
        '/product',
        '/staffs',
        '/users',
    ],
};

