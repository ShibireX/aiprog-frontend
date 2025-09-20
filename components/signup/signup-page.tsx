'use client'
import { cn } from '@/lib/utils'
import { UserPlus } from 'lucide-react'
import { useSignUpViewModel } from '@/lib/viewmodels/signup-viewmodel'
import { SignUp } from '../ui/sign-up'

export function SignUpView() {
  const vm = useSignUpViewModel()

  return (
    <div
      className={cn(
        'group rounded-3xl border-0 bg-white/40 p-8 shadow-lg backdrop-blur-sm',
        'mx-auto max-w-md',
        'mt-48'
      )}
    >
      <div className="mb-6 space-y-4 text-center">
        <div className="flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg ">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-900">
          Create an Account
        </h3>
        <p className="text-base leading-relaxed text-gray-600">
          Sign up to get started with Papr!
        </p>
      </div>

      <SignUp
        username={vm.username}
        email={vm.email}
        password={vm.password}
        repeatPassword={vm.repeatPassword}
        isSubmitting={vm.isSubmitting}
        errorMessage={vm.errorMessage}
        setUsername={vm.setUsername}
        setEmail={vm.setEmail}
        setPassword={vm.setPassword}
        setRepeatPassword={vm.setRepeatPassword}
        onSubmit={vm.onSubmit}
      />

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a
          href="/login"
          className={cn(
            'font-medium text-blue-600 hover:underline',
          
          )}
        >
          Login here
        </a>
      </p>
    </div>
  )
}
