const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const Stripe = require('stripe');

// Initialize Firebase admin SDK
admin.initializeApp();

const app = express();
app.use(bodyParser.raw({ type: 'application/json' }));

// Retrieve Stripe secret key and endpoint secret from environment variables
const stripeSecretKey = functions.config().stripe.secret_key;
const endpointSecret = functions.config().stripe.endpoint_secret;

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2020-08-27', // Replace with the latest Stripe API version
});

app.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send("Webhook Error: ${err.message}");
  }

  // Handle specific event types
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      default:
        console.log("Unhandled event type ${event.type}");
    }
    res.status(200).send();
  } catch (error) {
    console.error("Error handling webhook event:", error);
    res.status(500).send("Internal Server Error");
  }
});

const handleCheckoutSessionCompleted = async (session) => {
  const userId = session.client_reference_id;
  const plan = session.display_items[0].plan.nickname;

  try {
    // Update user data in Firestore
    await admin.firestore().collection('users').doc(userId).set({
      paid: true,
      plan: plan,
      activated: false, // Assuming users are initially not activated
    }, { merge: true });

    // Activate the user
    await activateUser(userId);
  } catch (error) {
    console.error('Error updating Firestore:', error);
    throw error; // Re-throw the error to be caught by the webhook handler
  }
};

const activateUser = async (userId) => {
  try {
    // Update user activation status in Firestore
    await admin.firestore().collection('users').doc(userId).update({
      activated: true,
    });

    // Send activation email
    await sendActivationEmail(userId);

    console.log("User activated:", userId);
    // You can add additional logic here after user activation
  } catch (error) {
    console.error("Error activating user:", error);
    throw error; // Re-throw the error to be caught by the webhook handler
  }
};

const sendActivationEmail = async (userId) => {
  try {
    // Retrieve user email from Firestore
    const userSnapshot = await admin.firestore().collection("users").doc(userId).get();
    const userEmail = userSnapshot.data().email; // Assuming you store user email in Firestore

    // Create nodemailer transporter with your email configuration
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: functions.config().email.user, // Replace with your email
        pass: functions.config().email.pass, // Replace with your password
      },
    });

    // Send mail with defined transport object
    const mailOptions = {
      from: "mail@busmate.com", // Sender address
      to: userEmail, // List of recipients
      subject: "Activate Your Account", // Subject line
      text: "Please activate your account.", // Plain text body
    };

    await transporter.sendMail(mailOptions);
    console.log("Activation email sent to:", userEmail);
  } catch (error) {
    console.error("Error sending activation email:", error);
    throw error; // Re-throw the error to be caught by the webhook handler
  }
};

exports.handleStripeWebhook = functions.https.onRequest(app);
