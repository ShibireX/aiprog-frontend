'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { SignUpState } from '@/types/signup'
import { cn } from '@/lib/utils'

interface SignUpProps extends SignUpState {
  setUsername: (value: string) => void
  setEmail: (value: string) => void
  setPassword: (value: string) => void
  setRepeatPassword: (value: string) => void
  onSubmit: () => void
}

export function SignUp({
  username,
  email,
  password,
  repeatPassword,
  isSubmitting,
  errorMessage,
  setUsername,
  setEmail,
  setPassword,
  setRepeatPassword,
  onSubmit,
}: SignUpProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeat, setShowRepeat] = useState(false)

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        onSubmit()
      }}
      className="space-y-4"
    >
      {/* Username */}
      <div>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full rounded-xl border border-gray-200 p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Email */}
      <div>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email address"
          className="w-full rounded-xl border border-gray-200 p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Password */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-xl border border-gray-200 p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Repeat Password */}
      <div className="relative">
        <input
          type={showRepeat ? 'text' : 'password'}
          value={repeatPassword}
          onChange={e => setRepeatPassword(e.target.value)}
          placeholder="Repeat password"
          className="w-full rounded-xl border border-gray-200 p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="button"
          onClick={() => setShowRepeat(!showRepeat)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showRepeat ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {errorMessage && (
        <p className="text-center text-sm text-red-600">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 py-3 font-semibold text-white shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50',
          'transition-all duration-500 ease-out hover:bg-white/60 hover:shadow-xl',
          'hover:-translate-y-1 hover:transform'
        )}
      >
        {isSubmitting ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  )
}
