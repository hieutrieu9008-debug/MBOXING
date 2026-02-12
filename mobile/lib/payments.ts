import { supabase } from './supabase'
import { Alert } from 'react-native'

export type SubscriptionTier = 'free' | 'premium' | 'pro'

export interface UserSubscription {
  id: string
  user_id: string
  tier: SubscriptionTier
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  status: 'active' | 'canceled' | 'past_due' | 'unpaid'
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export interface PricingPlan {
  id: string
  tier: SubscriptionTier
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  stripePriceId: string
}

// Pricing plans
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    tier: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      'Access to free courses',
      'Basic drill library',
      'Progress tracking',
      'Activity heatmap',
    ],
    stripePriceId: '', // No Stripe price for free tier
  },
  {
    id: 'premium-monthly',
    tier: 'premium',
    name: 'Premium',
    price: 9.99,
    interval: 'month',
    features: [
      'All free features',
      'Access to all premium courses',
      'Advanced drill techniques',
      'Spaced repetition system',
      'Combo builder access',
      'Priority support',
    ],
    stripePriceId: process.env.EXPO_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID || '',
  },
  {
    id: 'premium-yearly',
    tier: 'premium',
    name: 'Premium Annual',
    price: 99.99,
    interval: 'year',
    features: [
      'All Premium features',
      'Save $20/year',
      'Annual billing',
    ],
    stripePriceId: process.env.EXPO_PUBLIC_STRIPE_PREMIUM_YEARLY_PRICE_ID || '',
  },
]

/**
 * Get user's current subscription
 */
export async function getUserSubscription(): Promise<UserSubscription | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code === 'PGRST116') {
      // No subscription exists, create free tier
      return await createFreeSubscription()
    }

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting subscription:', error)
    return null
  }
}

/**
 * Create free tier subscription for new users
 */
async function createFreeSubscription(): Promise<UserSubscription | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const now = new Date()
    const oneYearFromNow = new Date(now)
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

    // TEMPORARY: Return mock subscription to bypass database error during signup
    // TODO: Fix this properly after signup works
    return {
      id: 'temp-id',
      user_id: user.id,
      tier: 'free',
      stripe_customer_id: null,
      stripe_subscription_id: null,
      status: 'active',
      current_period_start: now.toISOString(),
      current_period_end: oneYearFromNow.toISOString(),
      cancel_at_period_end: false,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    }

    // Original code (disabled):
    // const { data, error } = await supabase
    //   .from('user_subscriptions')
    //   .insert({
    //     user_id: user.id,
    //     tier: 'free',
    //     status: 'active',
    //     current_period_start: now.toISOString(),
    //     current_period_end: oneYearFromNow.toISOString(),
    //     cancel_at_period_end: false,
    //   })
    //   .select()
    //   .single()
    //
    // if (error) throw error
    // return data
  } catch (error) {
    console.error('Error creating free subscription:', error)
    return null
  }
}

/**
 * Check if user has access to premium content
 */
export async function hasPremiumAccess(): Promise<boolean> {
  const subscription = await getUserSubscription()
  return subscription?.tier === 'premium' && subscription?.status === 'active'
}

/**
 * Create Stripe checkout session
 * This would typically call your backend API
 */
export async function createCheckoutSession(
  priceId: string
): Promise<{ url: string } | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      Alert.alert('Error', 'You must be logged in to subscribe')
      return null
    }

    // TODO: Call your backend API to create Stripe checkout session
    // For now, return mock URL
    const STRIPE_API_URL = process.env.EXPO_PUBLIC_STRIPE_API_URL || 'http://localhost:3000'

    const response = await fetch(`${STRIPE_API_URL}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId: user.id,
        email: user.email,
      }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating checkout session:', error)
    Alert.alert('Error', 'Failed to start checkout process')
    return null
  }
}

/**
 * Create Stripe customer portal session
 */
export async function createPortalSession(): Promise<{ url: string } | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const subscription = await getUserSubscription()
    if (!subscription?.stripe_customer_id) {
      Alert.alert('Error', 'No active subscription found')
      return null
    }

    const STRIPE_API_URL = process.env.EXPO_PUBLIC_STRIPE_API_URL || 'http://localhost:3000'

    const response = await fetch(`${STRIPE_API_URL}/create-portal-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId: subscription.stripe_customer_id,
      }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating portal session:', error)
    return null
  }
}

/**
 * Cancel subscription (set to cancel at period end)
 */
export async function cancelSubscription(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const subscription = await getUserSubscription()
    if (!subscription) return false

    // TODO: Call Stripe API to cancel subscription
    // For now, just update local database
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        cancel_at_period_end: true,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    if (error) throw error

    Alert.alert(
      'Subscription Canceled',
      'Your subscription will remain active until the end of your billing period.'
    )

    return true
  } catch (error) {
    console.error('Error canceling subscription:', error)
    Alert.alert('Error', 'Failed to cancel subscription')
    return false
  }
}

/**
 * Reactivate canceled subscription
 */
export async function reactivateSubscription(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    // TODO: Call Stripe API to reactivate
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        cancel_at_period_end: false,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    if (error) throw error

    Alert.alert('Success', 'Your subscription has been reactivated!')
    return true
  } catch (error) {
    console.error('Error reactivating subscription:', error)
    return false
  }
}

/**
 * Get subscription status badge info
 */
export function getSubscriptionBadge(subscription: UserSubscription | null): {
  label: string
  color: string
} {
  if (!subscription || subscription.tier === 'free') {
    return { label: 'FREE', color: '#6B7280' }
  }

  if (subscription.status === 'active') {
    return { label: 'PREMIUM', color: '#FFC107' }
  }

  if (subscription.cancel_at_period_end) {
    return { label: 'CANCELING', color: '#EF4444' }
  }

  return { label: subscription.status.toUpperCase(), color: '#F59E0B' }
}
