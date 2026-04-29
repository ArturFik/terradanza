export function useMedia() {
  const config = useRuntimeConfig()

  const mediaUrl = (objectKey?: string | null) => {
    if (!objectKey) {
      return ""
    }
    return `${config.public.mediaBase}/${objectKey}`
  }

  return {
    mediaUrl,
  }
}
