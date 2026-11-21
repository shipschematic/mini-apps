import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { requireAuth } from '@/lib/auth'
import { createPaymentIntentSchema } from '@/lib/validations'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key')

export async function POST(request: Request) {
  try {
    // Require authentication
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) {
      return auth
    }
    
    const body = await request.json()
    
    // Validate input
    const validation = createPaymentIntentSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      )
    }
    
    const { amount, description, currency } = validation.data
    
    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency || 'usd',
      description: description || 'Payment',
      metadata: {
        userId: auth.userId,
        userEmail: auth.email
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    })
    
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency
    })
  } catch (error: any) {
    console.error('Payment intent error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
