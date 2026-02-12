# Stripe Payment Integration Setup

## Overview

The MBOXING app uses Stripe for subscription payments. This guide explains how to set up the backend API and connect it to your mobile app.

---

## Prerequisites

1. **Stripe Account**: Sign up at https://stripe.com
2. **Stripe API Keys**: Get from https://dashboard.stripe.com/apikeys
3. **Node.js Server**: For handling Stripe checkout sessions

---

## Step 1: Create Stripe Products & Prices

### In Stripe Dashboard (https://dashboard.stripe.com/products):

1. **Create Premium Monthly Product:**
   - Name: "MBOXING Premium"
   - Description: "Access to all premium boxing courses and features"
   - Price: $9.99 USD / month
   - Billing: Recurring
   - Copy the **Price ID** (starts with `price_`)

2. **Create Premium Yearly Product:**
   - Name: "MBOXING Premium Annual"
   - Description: "Annual subscription - Save $20"
   - Price: $99.99 USD / year
   - Billing: Recurring
   - Copy the **Price ID**

---

## Step 2: Set Up Backend API

### Create a simple Node.js server:

```bash
mkdir mboxing-stripe-api
cd mboxing-stripe-api
npm init -y
npm install express stripe cors dotenv
```

### Create `server.js`:

```javascript
const express = require('express')
const Stripe = require('stripe')
const cors = require('cors')
require('dotenv').config()

const app = express()
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

app.use(cors())
app.use(express.json())

// Create checkout session
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { priceId, userId, email } = req.body

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      client_reference_id: userId,
      success_url: 'mboxing://subscription-success',
      cancel_url: 'mboxing://subscription-cancel',
      metadata: {
        userId: userId,
      },
    })

    res.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({ error: error.message })
  }
})

// Create customer portal session
app.post('/create-portal-session', async (req, res) => {
  try {
    const { customerId } = req.body

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: 'mboxing://subscription',
    })

    res.json({ url: session.url })
  } catch (error) {
    console.error('Error creating portal session:', error)
    res.status(500).json({ error: error.message })
  }
})

// Webhook for Stripe events
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      // Update user subscription in Supabase
      const subscription = event.data.object
      console.log('Subscription updated:', subscription.id)
      // TODO: Update Supabase user_subscriptions table
      break

    case 'customer.subscription.deleted':
      // Cancel subscription in Supabase
      console.log('Subscription canceled:', event.data.object.id)
      // TODO: Mark subscription as canceled in Supabase
      break

    case 'invoice.payment_succeeded':
      // Payment successful
      console.log('Payment succeeded')
      break

    case 'invoice.payment_failed':
      // Payment failed
      console.log('Payment failed')
      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.json({ received: true })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Stripe API server running on port ${PORT}`)
})
```

### Create `.env`:

```env
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_YYYYYYYYYYYYYYYYYYYY
PORT=3000
```

---

## Step 3: Deploy Backend API

### Options:

1. **Heroku** (Free tier):
   ```bash
   heroku create mboxing-stripe-api
   git push heroku main
   ```

2. **Railway** (Free tier):
   - Connect GitHub repo
   - Auto-deploys

3. **Vercel** (Serverless):
   - Deploy as serverless functions

4. **DigitalOcean App Platform** ($5/month):
   - Production-ready with monitoring

---

## Step 4: Configure Webhooks

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter your API URL: `https://your-api.com/webhook`
4. Select events to listen for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Webhook Signing Secret** to your `.env`

---

## Step 5: Update Mobile App Config

### In `mobile/.env`:

```env
EXPO_PUBLIC_STRIPE_API_URL=https://your-api.com
EXPO_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_1234567890abcdef
EXPO_PUBLIC_STRIPE_PREMIUM_YEARLY_PRICE_ID=price_0987654321zyxwvu
```

---

## Step 6: Test Payment Flow

### Test Cards (Stripe Test Mode):

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

- Use any future expiry date (e.g., 12/34)
- Use any 3-digit CVC (e.g., 123)
- Use any 5-digit ZIP (e.g., 12345)

---

## Step 7: Supabase Integration

### Create Supabase Function to Update Subscriptions:

```sql
-- Function to update subscription from Stripe webhook
CREATE OR REPLACE FUNCTION update_subscription_from_stripe(
  p_user_id UUID,
  p_stripe_customer_id TEXT,
  p_stripe_subscription_id TEXT,
  p_status TEXT,
  p_current_period_start TIMESTAMP,
  p_current_period_end TIMESTAMP
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_subscriptions (
    user_id,
    tier,
    stripe_customer_id,
    stripe_subscription_id,
    status,
    current_period_start,
    current_period_end,
    updated_at
  ) VALUES (
    p_user_id,
    'premium',
    p_stripe_customer_id,
    p_stripe_subscription_id,
    p_status,
    p_current_period_start,
    p_current_period_end,
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    stripe_customer_id = EXCLUDED.stripe_customer_id,
    stripe_subscription_id = EXCLUDED.stripe_subscription_id,
    status = EXCLUDED.status,
    current_period_start = EXCLUDED.current_period_start,
    current_period_end = EXCLUDED.current_period_end,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
```

---

## Step 8: Go Live

### When ready for production:

1. **Switch to Live Mode** in Stripe Dashboard
2. Get **Live API Keys** (not test keys)
3. Create **Live Products & Prices**
4. Update `.env` with live keys
5. Update webhook endpoint to production URL
6. Test with real card (or use https://stripe.com/docs/testing)

---

## Security Checklist

✅ Never expose Secret Key in client code
✅ Use HTTPS for all API endpoints
✅ Verify webhook signatures
✅ Store keys in environment variables
✅ Use Row Level Security in Supabase
✅ Validate user ownership before creating sessions

---

## Pricing Strategy

### Recommended Pricing:
- **Free Tier**: Limited courses, basic features
- **Premium Monthly**: $9.99/month (all access)
- **Premium Yearly**: $99.99/year (save $20)

### Psychology:
- Monthly for casual users
- Yearly for committed users (better LTV)
- Free tier for lead generation

---

## Revenue Projections

**Target: 470K Instagram followers**

| Conversion | Paid Users | MRR (Monthly) | ARR (Annual) |
|------------|------------|---------------|--------------|
| 0.1%       | 470        | $4,693        | $56,316      |
| 0.5%       | 2,350      | $23,465       | $281,580     |
| 1.0%       | 4,700      | $46,930       | $563,160     |
| 2.0%       | 9,400      | $93,860       | $1,126,320   |

**Goal: 1-2% conversion = $50K-$100K+ MRR**

---

## Support

- Stripe Docs: https://stripe.com/docs
- Stripe Support: support@stripe.com
- Test Mode: Always test thoroughly before going live

**You're ready to accept payments! 💰**
