'use client'
import { useEffect, useMemo, useState } from 'react'
import { getAuthState } from '@/lib/auth'

export function ThemeSwitch() {
  const [isDark, setIsDark] = useState(false)
  const { token } = useMemo(() => getAuthState(), [])
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = async () => {
    const next = isDark ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', next === 'dark')
    setIsDark(next === 'dark')

    if (!token) return // only persist for signed-in users
    await fetch(`${apiBaseUrl}/api/theme`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ theme: next }),
    })
  }

  return <button onClick={toggle}>{isDark ? '🌙 Dark' : '☀️ Light'}</button>
}
