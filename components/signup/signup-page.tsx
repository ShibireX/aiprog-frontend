'use client'
import { cn } from '@/lib/utils'
import { UserPlus, LogIn } from 'lucide-react'
import { useAuthFormViewModel } from '@/lib/viewmodels/signup-viewmodel'
import { AuthForm } from '../ui/sign-up'

export function AuthView() {
  const vm = useAuthFormViewModel()

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div
        className={cn(
          'group rounded-3xl border-0 bg-white/40 p-8 shadow-lg backdrop-blur-sm',
          'relative z-10 w-full max-w-md',
          'dark:bg-gray-800/40 dark:shadow-gray-900/50'
        )}
      >
        <div className="mb-6 space-y-4 text-center">
          <div className="flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              {vm.mode === 'signup' ? (
                <UserPlus className="h-8 w-8 text-white" />
              ) : (
                <LogIn className="h-8 w-8 text-white" />
              )}
            </div>
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-900 dark:text-gray-100 dark:group-hover:text-blue-400">
            {vm.mode === 'signup' ? 'Create an Account' : 'Welcome Back'}
          </h3>
          <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
            {vm.mode === 'signup'
              ? 'Sign up to get started with Papr!'
              : 'Sign in to continue to Papr!'}
          </p>
        </div>

        <AuthForm
          mode={vm.mode}
          username={vm.username}
          email={vm.email}
          password={vm.password}
          repeatPassword={vm.repeatPassword}
          isSubmitting={vm.isSubmitting}
          errorMessage={vm.errorMessage}
          fieldErrors={vm.fieldErrors}
          setMode={vm.setMode}
          setUsername={vm.setUsername}
          setEmail={vm.setEmail}
          setPassword={vm.setPassword}
          setRepeatPassword={vm.setRepeatPassword}
          onSubmit={vm.onSubmit}
        />
      </div>
    </div>
  )
}

// Backward compatibility
export const SignUpView = AuthView
