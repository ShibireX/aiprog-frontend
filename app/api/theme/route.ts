import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { theme } = await request.json()

    // Validate theme value
    if (theme !== 'dark' && theme !== 'light') {
      return NextResponse.json(
        { error: 'Invalid theme value' },
        { status: 400 }
      )
    }

    // Create response
    const response = NextResponse.json({ success: true, theme })

    // Set cookie with proper attributes
    response.cookies.set('theme', theme, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year in seconds
      secure: process.env.NODE_ENV === 'production', // Secure in production
      sameSite: 'strict', // Strict since it's same-site now
      httpOnly: false, // Allow client-side reading if needed
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: 'Failed to set theme' }, { status: 500 })
  }
}
