import { useEffect } from 'react'
import { useRouter } from 'expo-router'

export default function Index() {
  const router = useRouter()

  useEffect(() => {
    // For now, always redirect to login
    // Later we'll check auth state and redirect accordingly
    router.replace('/auth/login')
  }, [])

  return null
}
