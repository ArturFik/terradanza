type ApiFetchOptions<T> = Parameters<typeof $fetch<T>>[1]

export function useApi() {
  const config = useRuntimeConfig()
  const accessToken = useCookie<string | null>("access_token", {
    default: () => null,
    sameSite: "lax",
  })

  const clearAccessToken = () => {
    accessToken.value = null
  }

  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const response = await $fetch<{ access_token: string }>("/auth/refresh", {
        baseURL: config.public.apiBase,
        method: "POST",
        credentials: "include",
      })
      accessToken.value = response.access_token
      return response.access_token
    } catch {
      clearAccessToken()
      return null
    }
  }

  const apiFetch = async <T>(
    path: string,
    options: ApiFetchOptions<T> & { skipAuthRetry?: boolean } = {},
  ): Promise<T> => {
    const { skipAuthRetry = false, ...fetchOptions } = options
    const headers = new Headers(options.headers as HeadersInit | undefined)

    if (accessToken.value && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${accessToken.value}`)
    }

    try {
      return await $fetch<T>(path, {
        ...fetchOptions,
        baseURL: config.public.apiBase,
        credentials: "include",
        headers,
      })
    } catch (error: any) {
      if (error?.status === 401 && !skipAuthRetry && accessToken.value) {
        const refreshedToken = await refreshAccessToken()
        if (refreshedToken) {
          headers.set("Authorization", `Bearer ${refreshedToken}`)
          return await $fetch<T>(path, {
            ...fetchOptions,
            baseURL: config.public.apiBase,
            credentials: "include",
            headers,
          })
        }
      }
      throw error
    }
  }

  return {
    accessToken,
    apiFetch,
    clearAccessToken,
    refreshAccessToken,
  }
}
