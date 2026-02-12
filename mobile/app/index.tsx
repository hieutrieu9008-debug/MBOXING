import { Redirect } from 'expo-router'

export default function Index() {
  // For now, always redirect to login
  // Later we'll check auth state and redirect accordingly
  return <Redirect href="/auth/login" />
}
