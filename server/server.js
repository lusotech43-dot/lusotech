const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://lusotech43-dot.github.io/lusotech';
const ALLOWED_ORIGINS = [
  'https://lusotech43-dot.github.io',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
];
app.use(cors({
  origin: function (origin, cb) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    const u = new URL(origin);
    if (u.hostname.endsWith('.github.io')) return cb(null, true);
    cb(null, false);
  },
}));
app.use(express.json());

/* -----------------------------------------
   Config - exposes publishable key
   ----------------------------------------- */
app.get('/api/config', (_req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

/* -----------------------------------------
   Health check
   ----------------------------------------- */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

/* -----------------------------------------
   Create subscription checkout session
   Handles: Card, PayPal, MB WAY
   ----------------------------------------- */
app.post('/api/create-subscription', async (_req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Basic Maintenance',
              description: 'Maintenance and support for existing websites and applications.',
            },
            unit_amount: 5000,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      success_url: `${FRONTEND_URL}/products.html?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/products.html?payment=cancelled`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('create-subscription error:', err);
    res.status(500).json({ error: err.message });
  }
});

/* -----------------------------------------
   Stripe webhook - handle post-payment events
   ----------------------------------------- */
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      console.log('Checkout completed:', event.data.object.id);
      break;
    case 'customer.subscription.updated':
      console.log('Subscription updated:', event.data.object.id);
      break;
    case 'customer.subscription.deleted':
      console.log('Subscription deleted:', event.data.object.id);
      break;
    default:
      console.log('Unhandled event type:', event.type);
  }

  res.json({ received: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
