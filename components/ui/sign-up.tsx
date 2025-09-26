'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { AuthState, AuthMode } from '@/types/signup'
import { cn } from '@/lib/utils'

interface AuthFormProps extends AuthState {
  setMode: (mode: AuthMode) => void
  setUsername: (value: string) => void
  setEmail: (value: string) => void
  setPassword: (value: string) => void
  setRepeatPassword: (value: string) => void
  onSubmit: () => void
}

export function AuthForm({
  mode,
  username,
  email,
  password,
  repeatPassword,
  isSubmitting,
  errorMessage,
  fieldErrors,
  setMode,
  setUsername,
  setEmail,
  setPassword,
  setRepeatPassword,
  onSubmit,
}: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeat, setShowRepeat] = useState(false)

  const isSignUp = mode === 'signup'

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="relative flex rounded-xl border border-gray-200 p-1 bg-gray-50">
        {/* Animated Background */}
        <div
          className={cn(
            "absolute top-1 bottom-1 w-1/2 bg-blue-500 rounded-lg shadow-sm transition-all duration-300 ease-out",
            isSignUp ? "left-1" : "left-1/2"
          )}
        />
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={cn(
            'relative z-10 flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-300',
            isSignUp
              ? 'text-white'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          Sign Up
        </button>
        <button
          type="button"
          onClick={() => setMode('login')}
          className={cn(
            'relative z-10 flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-300',
            !isSignUp
              ? 'text-white'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          Login
        </button>
      </div>

      <form
        onSubmit={e => {
          e.preventDefault()
          onSubmit()
        }}
        className="space-y-4 transition-all duration-300 ease-out"
        key={mode} // Force re-render for smoother transitions
      >
        {/* Username - Only for signup */}
        <div 
          className={cn(
            "transition-all duration-300 ease-out overflow-hidden",
            isSignUp 
              ? "opacity-100 max-h-20 mb-4" 
              : "opacity-0 max-h-0 mb-0"
          )}
        >
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            className={cn(
              "w-full rounded-xl border-2 p-3 text-gray-800 focus:outline-none focus:border-blue-500 transition-all duration-200",
              fieldErrors.username ? "border-red-300 focus:border-red-500" : "border-gray-200"
            )}
          />
          {fieldErrors.username && (
            <p className="mt-1 text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">{fieldErrors.username}</p>
          )}
        </div>

        {/* Email */}
        <div className="transition-all duration-200">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
            className={cn(
              "w-full rounded-xl border-2 p-3 text-gray-800 focus:outline-none focus:border-blue-500 transition-all duration-200",
              fieldErrors.email ? "border-red-300 focus:border-red-500 animate-pulse" : "border-gray-200"
            )}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">{fieldErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative transition-all duration-200">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className={cn(
              "w-full rounded-xl border-2 p-3 text-gray-800 focus:outline-none focus:border-blue-500 transition-all duration-200",
              fieldErrors.password ? "border-red-300 focus:border-red-500 animate-pulse" : "border-gray-200"
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-all duration-200 hover:scale-110"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {fieldErrors.password && (
            <p className="mt-1 text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">{fieldErrors.password}</p>
          )}
        </div>

        {/* Repeat Password - Only for signup */}
        <div 
          className={cn(
            "transition-all duration-300 ease-out overflow-hidden",
            isSignUp 
              ? "opacity-100 max-h-20 mb-4" 
              : "opacity-0 max-h-0 mb-0"
          )}
        >
          <div className="relative">
            <input
              type={showRepeat ? 'text' : 'password'}
              value={repeatPassword}
              onChange={e => setRepeatPassword(e.target.value)}
              placeholder="Repeat password"
              className={cn(
                "w-full rounded-xl border-2 p-3 text-gray-800 focus:outline-none focus:border-blue-500 transition-all duration-200",
                fieldErrors.repeatPassword ? "border-red-300 focus:border-red-500" : "border-gray-200"
              )}
            />
            <button
              type="button"
              onClick={() => setShowRepeat(!showRepeat)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              {showRepeat ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {fieldErrors.repeatPassword && (
            <p className="mt-1 text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">{fieldErrors.repeatPassword}</p>
          )}
        </div>

        {errorMessage && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 animate-in slide-in-from-top-2 duration-300">
            <p className="text-center text-sm text-red-700">{errorMessage}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 py-3 font-semibold text-white shadow-md transition-all duration-300 ease-out hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50',
            'hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transform',
            isSubmitting && 'animate-pulse'
          )}
        >
          <span className="transition-all duration-200">
            {isSubmitting ? (isSignUp ? 'Signing up...' : 'Logging in...') : (isSignUp ? 'Sign Up' : 'Login')}
          </span>
        </button>
      </form>
    </div>
  )
}

// Backward compatibility
export const SignUp = AuthForm
