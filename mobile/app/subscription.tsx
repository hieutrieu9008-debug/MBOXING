import { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Linking,
} from 'react-native'
import { useRouter } from 'expo-router'
import { colors, typography, spacing, layout, radius, shadows } from '../constants/theme'
import {
  getUserSubscription,
  createCheckoutSession,
  createPortalSession,
  cancelSubscription,
  reactivateSubscription,
  getSubscriptionBadge,
  PRICING_PLANS,
  UserSubscription,
} from '../lib/payments'
import Button from '../components/Button'

export default function SubscriptionScreen() {
  const router = useRouter()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadSubscription()
  }, [])

  async function loadSubscription() {
    const data = await getUserSubscription()
    setSubscription(data)
    setLoading(false)
  }

  async function handleSubscribe(priceId: string) {
    setProcessing(true)
    try {
      const session = await createCheckoutSession(priceId)
      if (session?.url) {
        // Open Stripe checkout in browser
        await Linking.openURL(session.url)
      }
    } catch (error) {
      console.error('Error subscribing:', error)
    } finally {
      setProcessing(false)
    }
  }

  async function handleManageSubscription() {
    setProcessing(true)
    try {
      const portal = await createPortalSession()
      if (portal?.url) {
        await Linking.openURL(portal.url)
      }
    } catch (error) {
      console.error('Error opening portal:', error)
    } finally {
      setProcessing(false)
    }
  }

  async function handleCancelSubscription() {
    setProcessing(true)
    const success = await cancelSubscription()
    if (success) {
      loadSubscription()
    }
    setProcessing(false)
  }

  async function handleReactivate() {
    setProcessing(true)
    const success = await reactivateSubscription()
    if (success) {
      loadSubscription()
    }
    setProcessing(false)
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    )
  }

  const badge = getSubscriptionBadge(subscription)
  const isPremium = subscription?.tier === 'premium' && subscription?.status === 'active'

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Subscription</Text>
          <View style={[styles.badge, { backgroundColor: badge.color }]}>
            <Text style={styles.badgeText}>{badge.label}</Text>
          </View>
        </View>

        {/* Current Subscription Info */}
        {subscription && subscription.tier !== 'free' && (
          <View style={styles.currentSubCard}>
            <Text style={styles.currentSubTitle}>Current Plan</Text>
            <Text style={styles.currentSubTier}>{subscription.tier.toUpperCase()}</Text>
            <Text style={styles.currentSubStatus}>
              Status: {subscription.status}
            </Text>
            {subscription.current_period_end && (
              <Text style={styles.currentSubPeriod}>
                {subscription.cancel_at_period_end
                  ? `Ends on ${new Date(subscription.current_period_end).toLocaleDateString()}`
                  : `Renews on ${new Date(subscription.current_period_end).toLocaleDateString()}`}
              </Text>
            )}

            {subscription.cancel_at_period_end ? (
              <Button
                title="Reactivate Subscription"
                onPress={handleReactivate}
                fullWidth
                variant="primary"
                disabled={processing}
              />
            ) : (
              <View style={styles.manageButtons}>
                <Button
                  title="Manage Subscription"
                  onPress={handleManageSubscription}
                  fullWidth
                  variant="outline"
                  disabled={processing}
                />
                <Button
                  title="Cancel Subscription"
                  onPress={handleCancelSubscription}
                  fullWidth
                  variant="secondary"
                  disabled={processing}
                />
              </View>
            )}
          </View>
        )}

        {/* Pricing Plans */}
        <Text style={styles.sectionTitle}>
          {isPremium ? 'Other Plans' : 'Choose Your Plan'}
        </Text>

        {PRICING_PLANS.map((plan) => {
          const isCurrentPlan = plan.tier === subscription?.tier
          const isFree = plan.tier === 'free'

          return (
            <View
              key={plan.id}
              style={[
                styles.planCard,
                isCurrentPlan && styles.planCardActive,
              ]}
            >
              <View style={styles.planHeader}>
                <View>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <View style={styles.planPriceContainer}>
                    <Text style={styles.planPrice}>
                      ${plan.price}
                    </Text>
                    <Text style={styles.planInterval}>
                      /{plan.interval}
                    </Text>
                  </View>
                </View>
                {plan.interval === 'year' && (
                  <View style={styles.saveBadge}>
                    <Text style={styles.saveText}>SAVE $20</Text>
                  </View>
                )}
              </View>

              <View style={styles.planFeatures}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Text style={styles.featureCheck}>✓</Text>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              {!isCurrentPlan && !isFree && (
                <Button
                  title={
                    processing
                      ? 'Processing...'
                      : `Subscribe to ${plan.name}`
                  }
                  onPress={() => handleSubscribe(plan.stripePriceId)}
                  fullWidth
                  variant={plan.interval === 'year' ? 'primary' : 'outline'}
                  disabled={processing}
                />
              )}

              {isCurrentPlan && (
                <View style={styles.currentPlanBadge}>
                  <Text style={styles.currentPlanText}>Current Plan</Text>
                </View>
              )}
            </View>
          )
        })}

        {/* Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            • Cancel anytime, no questions asked
          </Text>
          <Text style={styles.infoText}>
            • Access to all premium content immediately
          </Text>
          <Text style={styles.infoText}>
            • New content added regularly
          </Text>
          <Text style={styles.infoText}>
            • Secure payment via Stripe
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: spacing[8],
  },

  backButton: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },

  backButtonText: {
    fontSize: typography.sizes.base,
    color: colors.primary[400],
    fontWeight: '600',
  },

  header: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing[6],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitle: {
    fontSize: typography.sizes['4xl'],
    fontWeight: '700',
    color: colors.text.primary,
  },

  badge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.full,
  },

  badgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: '700',
    color: colors.neutral[900],
  },

  currentSubCard: {
    marginHorizontal: layout.screenPadding,
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing[6],
    marginBottom: spacing[6],
    ...shadows.base,
  },

  currentSubTitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
    marginBottom: spacing[2],
  },

  currentSubTier: {
    fontSize: typography.sizes['3xl'],
    fontWeight: '700',
    color: colors.primary[500],
    marginBottom: spacing[2],
  },

  currentSubStatus: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    marginBottom: spacing[1],
  },

  currentSubPeriod: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
    marginBottom: spacing[4],
  },

  manageButtons: {
    gap: spacing[2],
  },

  sectionTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[4],
    paddingHorizontal: layout.screenPadding,
  },

  planCard: {
    marginHorizontal: layout.screenPadding,
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing[6],
    marginBottom: spacing[4],
    ...shadows.base,
  },

  planCardActive: {
    borderWidth: 2,
    borderColor: colors.primary[500],
  },

  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[4],
  },

  planName: {
    fontSize: typography.sizes['2xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[2],
  },

  planPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  planPrice: {
    fontSize: typography.sizes['4xl'],
    fontWeight: '700',
    color: colors.primary[500],
  },

  planInterval: {
    fontSize: typography.sizes.lg,
    color: colors.text.tertiary,
    marginLeft: spacing[1],
  },

  saveBadge: {
    backgroundColor: colors.accent[500],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
  },

  saveText: {
    fontSize: typography.sizes.xs,
    fontWeight: '700',
    color: colors.neutral[900],
  },

  planFeatures: {
    marginBottom: spacing[6],
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
  },

  featureCheck: {
    fontSize: typography.sizes.lg,
    color: colors.primary[500],
    marginRight: spacing[2],
    width: 20,
  },

  featureText: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    flex: 1,
  },

  currentPlanBadge: {
    backgroundColor: colors.background.tertiary,
    padding: spacing[3],
    borderRadius: radius.md,
    alignItems: 'center',
  },

  currentPlanText: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.text.secondary,
  },

  infoSection: {
    paddingHorizontal: layout.screenPadding,
    marginTop: spacing[4],
  },

  infoText: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
    marginBottom: spacing[2],
  },
})
