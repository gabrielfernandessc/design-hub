import { Elysia, t } from 'elysia'
import {
  createCheckoutSession,
  createPortalSession,
  handleWebhookEvent,
  PLANS,
} from '@design-hub/config/services/stripe'
import { stripe } from '@design-hub/config/services/stripe'

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

      const session = await createCheckoutSession(planId as keyof typeof PLANS, userId, userEmail)

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
  .post(
    '/portal',
    async ({ body }) => {
      const { customerId } = body

      const session = await createPortalSession(customerId)

      return { url: session.url }
    },
    {
      body: t.Object({
        customerId: t.String(),
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

    await handleWebhookEvent(event)

    return { received: true }
  })
