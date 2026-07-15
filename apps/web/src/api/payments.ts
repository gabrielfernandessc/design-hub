import { Elysia, t } from 'elysia'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-06-24.dahlia',
})

const PLANS = {
  starter: { name: 'Starter', price: 9700 },
  pro: { name: 'Pro', price: 19700 },
  enterprise: { name: 'Enterprise', price: 49700 },
}

export const paymentRoutes = new Elysia({ prefix: '/api/payments' })
  .get('/plans', async () => {
    return PLANS
  })
  .post(
    '/checkout',
    async ({ body }) => {
      const { planId, userId, userEmail } = body

      if (!PLANS[planId as keyof typeof PLANS]) {
        return { error: 'Invalid plan' }
      }

      const plan = PLANS[planId as keyof typeof PLANS]

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: userEmail,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Design Hub - ${plan.name}`,
              },
              unit_amount: plan.price,
              recurring: { interval: 'month' },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?canceled=true`,
        metadata: { userId, planId },
      })

      return { sessionId: session.id, url: session.url }
    },
    {
      body: t.Object({
        planId: t.String(),
        userId: t.String(),
        userEmail: t.String(),
      }),
    }
  )
  .post('/webhook', async ({ request }) => {
    const body = await request.text()
    const sig = request.headers.get('stripe-signature')!

    let event: any

    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err) {
      return { error: 'Webhook signature verification failed' }
    }

    return { received: true }
  })
