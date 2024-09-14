import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode('your-secret-key'); // Convert the secret to a Uint8Array

export async function middleware(req) {
    console.log('Middleware:', req.url);

    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    console.log('token:', token);

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        console.log('decoded:', payload);

        // Create a new response object with custom headers
        const response = NextResponse.next();
        response.headers.set('x-user-address', payload['addressWallet']); // Add custom header
        return response;
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
}

export const config = {
    matcher: ['/api/admin/:path*', '/api/hospital/:path*', '/api/doctor/:path*', '/api/patient/:path*'],
};
