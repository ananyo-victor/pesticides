import { createPaymentIntentService, getSavedCardsService, attachPaymentMethodService, createSubscriptionService } from '../service/stripeServices/stripeService.js';
import Stripe from 'stripe';
import User from '../models/user.js';
import nodemailer from 'nodemailer';
// import express from 'express';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

export const createPaymentIntent = async (req, res) => {
  try {
    const { paymentMethodId, plan, billingDetails } = req.body;
    const amount = plan === 'Premium' ? 9900 : 19900; // Amount in cents
    const currency = 'usd';

    const user = await User.findById(req.user.id);
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      // Create a Stripe customer for the guest user
      const customer = await stripe.customers.create({
        email: billingDetails.email,
        name: billingDetails.name,
        address: {
          line1: billingDetails.address.line1,
          city: billingDetails.address.city,
          state: billingDetails.address.state,
          postal_code: billingDetails.address.postal_code,
        },
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const paymentIntent = await createPaymentIntentService(amount, currency, customerId);
    res.status(200).json(paymentIntent);
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getSavedCards = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    let customerId = user.stripeCustomerId; // Use the stored customer ID
    if (!customerId) {
      throw new Error('Customer ID is required');
    }
    const savedCards = await getSavedCardsService(customerId);
    res.status(200).json(savedCards);
  } catch (error) {
    console.error('Error fetching saved cards:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const attachPaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    const customerId = req.user.stripeCustomerId; // Use the stored customer ID

    if (!customerId) {
      throw new Error('Customer ID is required');
    }

    const attachedPaymentMethod = await attachPaymentMethodService(paymentMethodId, customerId);
    res.status(200).json(attachedPaymentMethod);
  } catch (error) {
    console.error('Error attaching payment method:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const createSubscription = async (req, res) => {
  try {
    const { billingDetails, paymentMethodId, plan } = req.body;

    const user = await User.findById(req.user.userId);
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      // Create a Stripe customer for the guest user
      const customer = await stripe.customers.create({
        email: billingDetails.email,
        name: billingDetails.name,
        address: {
          line1: billingDetails.address.line1,
          city: billingDetails.address.city,
          state: billingDetails.address.state,
          postal_code: billingDetails.address.postal_code,
        },
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const subscription = await createSubscriptionService(customerId, paymentMethodId, plan);
    res.status(200).json(subscription);
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    // Payment-related events
    case 'payment_intent.succeeded':
    case 'payment_intent.payment_failed':
    case 'payment_intent.canceled':
    case 'payment_intent.processing':  // New unhandled event
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent event: ${event.type}`, paymentIntent);
      sendEmail(paymentIntent.receipt_email, `Payment ${event.type.replace('payment_intent.', '').replace('_', ' ')}`, `Your payment status: ${event.type}`);
      break;
    
    case 'charge.succeeded':
    case 'charge.failed':
    case 'charge.refunded':
      const charge = event.data.object;
      console.log(`Charge event: ${event.type}`, charge);
      sendEmail(charge.receipt_email, `Charge ${event.type.replace('charge.', '').replace('_', ' ')}`, `Your charge status: ${event.type}`);
      break;

    // Invoice-related events
    case 'invoice.payment_succeeded':
    case 'invoice.payment_failed':
    case 'invoice.finalized':
    case 'invoice.voided':
    case 'invoice.created':
    case 'invoice.paid': // New unhandled event
      const invoice = event.data.object;
      console.log(`Invoice event: ${event.type}`, invoice);
      sendEmail(invoice.customer_email, `Invoice ${event.type.replace('invoice.', '').replace('_', ' ')}`, `Your invoice status: ${event.type}`);
      break;

    // Subscription-related events
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
    case 'customer.subscription.trial_will_end':
      const subscription = event.data.object;
      console.log(`Subscription event: ${event.type}`, subscription);
      sendEmail(subscription.customer_email, `Subscription ${event.type.replace('customer.subscription.', '').replace('_', ' ')}`, `Your subscription status: ${event.type}`);
      break;

    // Customer-related events
    case 'customer.created':
    case 'customer.updated':
    case 'customer.deleted':
      const customer = event.data.object;
      console.log(`Customer event: ${event.type}`, customer);
      sendEmail(customer.email, `Customer ${event.type.replace('customer.', '').replace('_', ' ')}`, `Your customer details status: ${event.type}`);
      break;

    // Checkout-related events (New unhandled event)
    case 'checkout.session.completed':
      const checkoutSession = event.data.object;
      console.log('Checkout session completed:', checkoutSession);
      sendEmail(checkoutSession.customer_email, 'Checkout Completed', `Your checkout session has been completed successfully.`);
      break;

    // Discount-related events (New unhandled events)
    case 'customer.discount.created':
    case 'customer.discount.deleted':
      const discount = event.data.object;
      console.log(`Discount event: ${event.type}`, discount);
      sendEmail(discount.customer_email, `Discount ${event.type.replace('customer.discount.', '').replace('_', ' ')}`, `Your discount status: ${event.type}`);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
};

