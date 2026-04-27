export type UserRole = 'vendor' | 'service'

export type AuthUser = {
  id: string
  email: string
  name?: string
  phone?: string
  role: UserRole
}

export type AuthResponse = {
  token: string
  user: AuthUser
}
