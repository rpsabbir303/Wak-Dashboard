import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-gradient-to-br from-[#f9f7f5] via-white to-[#f3ede8]">
      {/* Decorative blurred glows */}
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-[26rem] w-[26rem] rounded-full bg-[#895129] blur-3xl opacity-20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-24 h-[30rem] w-[30rem] rounded-full bg-[#c09a7a] blur-3xl opacity-20"
        aria-hidden
      />

      <div className="relative flex min-h-svh items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
