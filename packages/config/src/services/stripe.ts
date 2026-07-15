import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-06-24.dahlia',
})

// Plan definitions
export const PLANS = {
  starter: {
    name: 'Starter',
    price: 9700, // $97.00
    features: ['1 user', '50 cards/month', '1 project', 'Basic SLA'],
  },
  pro: {
    name: 'Pro',
    price: 19700, // $197.00
    features: ['5 users', '200 cards/month', '10 projects', 'Advanced SLA', 'Email notifications'],
  },
  enterprise: {
    name: 'Enterprise',
    price: 49700, // $497.00
    features: [
      'Unlimited users',
      'Unlimited cards',
      'Unlimited projects',
      'Custom SLA',
      'Priority support',
      'API access',
    ],
  },
}

// Create checkout session
export async function createCheckoutSession(
  planId: keyof typeof PLANS,
  userId: string,
  userEmail: string
) {
  const plan = PLANS[planId]

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: userEmail,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Design Hub - ${plan.name}`,
            description: plan.features.join(', '),
          },
          unit_amount: plan.price,
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?canceled=true`,
    metadata: {
      userId,
      planId,
    },
  })

  return session
}

// Create customer portal session
export async function createPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
  })

  return session
}

// Handle webhook event
export async function handleWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session
      await handleCheckoutComplete(session)
      break

    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription
      await handleSubscriptionUpdated(subscription)
      break

    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription
      await handleSubscriptionDeleted(deletedSubscription)
      break
  }
}

// Handle successful checkout
async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const { userId, planId } = session.metadata || {}

  if (!userId || !planId) return

  // Update user's subscription in database
  // TODO: Add subscription field to users table
  console.log(`User ${userId} subscribed to ${planId}`)
}

// Handle subscription update
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // Update subscription status
  console.log(`Subscription ${subscription.id} updated`)
}

// Handle subscription deletion
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Downgrade user to free tier
  console.log(`Subscription ${subscription.id} deleted`)
}

// Get subscription status
export async function getSubscriptionStatus(customerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
  })

  return subscriptions.data[0] || null
}

export { stripe }
