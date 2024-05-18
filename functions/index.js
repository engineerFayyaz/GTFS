const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const Stripe = require('stripe');
const stripe = Stripe('sk_test_...'); // Replace with your actual Stripe secret key

admin.initializeApp();

const app = express();
app.use(express.raw({ type: 'application/json' }));

const endpointSecret = "whsec_fe977e6102e32cbc0329b896de0be3bc9336a5e1b1fc6081b3fcfa335f886cc2"; // Replace with your actual endpoint secret

app.post('/webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      handleCheckoutSessionCompleted(session);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).send();
});

const handleCheckoutSessionCompleted = async (session) => {
  const userId = session.client_reference_id;
  const plan = session.display_items[0].plan.nickname;

  try {
    await admin.firestore().collection('users').doc(userId).set({
      paid: true,
      plan: plan,
    }, { merge: true });
  } catch (error) {
    console.error('Error updating Firestore:', error);
  }
};

exports.handleStripeWebhook = functions.https.onRequest(app);
