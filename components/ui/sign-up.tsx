'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import type { AuthState, AuthMode } from '@/types/signup'
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
      <div className="relative flex rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-gray-600 dark:bg-gray-700">
        {/* Animated Background */}
        <div
          className={cn(
            'absolute bottom-1 top-1 w-1/2 rounded-lg bg-blue-500 shadow-sm transition-all duration-300 ease-out',
            isSignUp ? 'left-1' : 'left-1/2'
          )}
        />
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={cn(
            'relative z-10 flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-300',
            isSignUp
              ? 'text-white'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
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
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
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
            'overflow-hidden transition-all duration-300 ease-out',
            isSignUp ? 'mb-4 max-h-20 opacity-100' : 'mb-0 max-h-0 opacity-0'
          )}
        >
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            className={cn(
              'w-full rounded-xl border-2 p-3 text-gray-800 transition-all duration-200 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400',
              fieldErrors.username
                ? 'border-red-300 focus:border-red-500 dark:border-red-700'
                : 'border-gray-200 dark:border-gray-600'
            )}
          />
          {fieldErrors.username && (
            <p className="animate-in slide-in-from-top-1 mt-1 text-sm text-red-600 duration-200 dark:text-red-400">
              {fieldErrors.username}
            </p>
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
              'w-full rounded-xl border-2 p-3 text-gray-800 transition-all duration-200 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400',
              fieldErrors.email
                ? 'animate-pulse border-red-300 focus:border-red-500 dark:border-red-700'
                : 'border-gray-200 dark:border-gray-600'
            )}
          />
          {fieldErrors.email && (
            <p className="animate-in slide-in-from-top-1 mt-1 text-sm text-red-600 duration-200 dark:text-red-400">
              {fieldErrors.email}
            </p>
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
              'w-full rounded-xl border-2 p-3 text-gray-800 transition-all duration-200 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400',
              fieldErrors.password
                ? 'animate-pulse border-red-300 focus:border-red-500 dark:border-red-700'
                : 'border-gray-200 dark:border-gray-600'
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 hover:scale-110 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {fieldErrors.password && (
            <p className="animate-in slide-in-from-top-1 mt-1 text-sm text-red-600 duration-200 dark:text-red-400">
              {fieldErrors.password}
            </p>
          )}
        </div>

        {/* Repeat Password - Only for signup */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300 ease-out',
            isSignUp ? 'mb-4 max-h-20 opacity-100' : 'mb-0 max-h-0 opacity-0'
          )}
        >
          <div className="relative">
            <input
              type={showRepeat ? 'text' : 'password'}
              value={repeatPassword}
              onChange={e => setRepeatPassword(e.target.value)}
              placeholder="Repeat password"
              className={cn(
                'w-full rounded-xl border-2 p-3 text-gray-800 transition-all duration-200 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400',
                fieldErrors.repeatPassword
                  ? 'border-red-300 focus:border-red-500 dark:border-red-700'
                  : 'border-gray-200 dark:border-gray-600'
              )}
            />
            <button
              type="button"
              onClick={() => setShowRepeat(!showRepeat)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors duration-200 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showRepeat ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {fieldErrors.repeatPassword && (
            <p className="animate-in slide-in-from-top-1 mt-1 text-sm text-red-600 duration-200 dark:text-red-400">
              {fieldErrors.repeatPassword}
            </p>
          )}
        </div>

        {errorMessage && (
          <div className="animate-in slide-in-from-top-2 rounded-lg border border-red-200 bg-red-50 p-3 duration-300 dark:border-red-800 dark:bg-red-900/30">
            <p className="text-center text-sm text-red-700 dark:text-red-400">
              {errorMessage}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 py-3 font-semibold text-white shadow-md transition-all duration-300 ease-out hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50',
            'transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl',
            isSubmitting && 'animate-pulse'
          )}
        >
          <span className="transition-all duration-200">
            {isSubmitting
              ? isSignUp
                ? 'Signing up...'
                : 'Logging in...'
              : isSignUp
                ? 'Sign Up'
                : 'Login'}
          </span>
        </button>
      </form>
    </div>
  )
}

// Backward compatibility
export const SignUp = AuthForm
