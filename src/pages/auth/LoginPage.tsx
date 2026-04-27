import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useLoginMutation } from '@/features/api/authApi'
import { setCredentials } from '@/features/auth/authSlice'
import { useAppDispatch } from '@/app/hooks'
import { AuthCard } from '@/components/auth/AuthCard'
import { AuthHeader } from '@/components/auth/AuthHeader'
import { InputField } from '@/components/auth/InputField'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { SubmitButton } from '@/components/auth/SubmitButton'
import { Button } from '@/components/ui/button'
import { isValidEmail, PASSWORD_MIN } from '@/lib/auth-validation'
import { fetchErrorMessage } from '@/lib/fetch-error'
import type { UserRole } from '@/features/auth/authTypes'

function GoogleIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={props.className}>
      <path
        fill="currentColor"
        d="M12 10.2v3.6h5.05c-.2 1.15-1.37 3.37-5.05 3.37A5.8 5.8 0 0 1 6.2 12a5.8 5.8 0 0 1 5.8-5.8c1.5 0 2.5.64 3.07 1.2l2.1-2.02C15.9 4.16 14.2 3.3 12 3.3A8.7 8.7 0 1 0 12 20.7c5.02 0 8.35-3.52 8.35-8.47 0-.57-.06-1-.14-1.43H12z"
      />
    </svg>
  )
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from
  const dispatch = useAppDispatch()
  const [login, { isLoading }] = useLoginMutation()
  const [role, setRole] = useState<UserRole>('vendor')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const e2: typeof errors = {}
    if (!email) {
      e2.email = 'Email is required'
    } else if (!isValidEmail(email)) {
      e2.email = 'Enter a valid email'
    }
    if (!password) {
      e2.password = 'Password is required'
    } else if (password.length < PASSWORD_MIN) {
      e2.password = `Password must be at least ${PASSWORD_MIN} characters`
    }
    setErrors(e2)
    if (Object.keys(e2).length) {
      return
    }
    try {
      const res = await login({ email: email.trim().toLowerCase(), password, role }).unwrap()
      dispatch(setCredentials({ token: res.token, user: res.user }))
      toast.success('Welcome back')
      if (res.user.role === 'vendor') {
        void navigate(from && from.startsWith('/vendor') ? from : '/vendor/dashboard', { replace: true })
        return
      }
      if (res.user.role === 'service') {
        void navigate('/service/dashboard', { replace: true })
        return
      }

      // Unknown / removed roles should not access the app.
      void navigate('/auth/login', { replace: true })
    } catch (err) {
      toast.error(fetchErrorMessage(err) ?? 'Sign in failed')
    }
  }

  return (
    <AuthCard>
      <AuthHeader title="Welcome back" subtitle="Sign in to your dashboard" />

      <div className="grid gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-12 rounded-xl border-gray-200 bg-white/70 transition-all duration-200 hover:scale-[1.02]"
        >
          <GoogleIcon className="mr-2 size-4 text-zinc-700" />
          Continue with Google
        </Button>
      </div>

      <div className="my-6 flex items-center">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="px-4 text-sm font-medium text-gray-400">OR</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <div className="grid gap-2">
          <div className="text-sm font-medium text-zinc-700">I am a</div>
          <div className="grid grid-cols-2 rounded-xl border border-gray-200 bg-white/70 p-1">
            <button
              type="button"
              onClick={() => setRole('vendor')}
              className={[
                'h-10 rounded-lg text-sm font-semibold transition-colors',
                role === 'vendor' ? 'bg-[#895129] text-white' : 'bg-transparent text-zinc-700 hover:bg-white',
              ].join(' ')}
            >
              Vendor
            </button>
            <button
              type="button"
              onClick={() => setRole('service')}
              className={[
                'h-10 rounded-lg text-sm font-semibold transition-colors',
                role === 'service'
                  ? 'bg-[#895129] text-white'
                  : 'bg-transparent text-zinc-700 hover:bg-white',
              ].join(' ')}
            >
              Service Provider
            </button>
          </div>
        </div>
        <InputField
          id="email"
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <PasswordInput
          name="password"
          id="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <div className="-mt-2 text-right">
          <Link
            to="/auth/forgot-password"
            className="text-xs font-semibold text-[#895129] transition-colors hover:text-[#6f3f1f] hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <SubmitButton loading={isLoading}>Sign in</SubmitButton>
        <p className="text-center text-sm text-zinc-600">
          Don&apos;t have an account?{' '}
          <Link to="/auth/register" className="font-semibold text-[#895129] transition-colors hover:text-[#6f3f1f]">
            Sign up
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}
