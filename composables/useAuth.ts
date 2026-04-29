type LoginPayload = {
  email: string
  password: string
}

type RegisterPayload = {
  email: string
  password: string
  name?: string
  surname?: string
}

type UserResponse = {
  id: string
  email: string
  name?: string | null
  surname?: string | null
  avatar_key?: string | null
  cached_rank: string
  is_email_verified: boolean
  is_active: boolean
  created_at: string
  last_login_at?: string | null
}

export function useAuth() {
  const { accessToken, apiFetch, clearAccessToken } = useApi()
  const currentUser = useState<UserResponse | null>("current-user", () => null)

  const isAuthenticated = computed(() => Boolean(accessToken.value))

  const fetchMe = async () => {
    if (!accessToken.value) {
      currentUser.value = null
      return null
    }

    try {
      const user = await apiFetch<UserResponse>("/users/me")
      currentUser.value = user
      return user
    } catch {
      currentUser.value = null
      clearAccessToken()
      return null
    }
  }

  const login = async (payload: LoginPayload) => {
    const response = await apiFetch<{ access_token: string }>("/auth/login", {
      method: "POST",
      body: payload,
      skipAuthRetry: true,
    })
    accessToken.value = response.access_token
    return await fetchMe()
  }

  const register = async (payload: RegisterPayload) => {
    return await apiFetch<{
      success: boolean
      data: { user_id: string }
      message: string
    }>("/auth/register", {
      method: "POST",
      body: payload,
      skipAuthRetry: true,
    })
  }

  const logout = async () => {
    try {
      await apiFetch("/auth/logout", {
        method: "POST",
        skipAuthRetry: true,
      })
    } finally {
      clearAccessToken()
      currentUser.value = null
    }
  }

  return {
    currentUser,
    fetchMe,
    isAuthenticated,
    login,
    logout,
    register,
  }
}
