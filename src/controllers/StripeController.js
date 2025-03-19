import { createPaymentIntentService, getSavedCardsService, attachPaymentMethodService, createSubscriptionService } from '../service/stripeServices/stripeService.js';
import Stripe from 'stripe';
import User from '../models/user.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { paymentMethodId, plan, billingDetails } = req.body;
    const amount = plan === 'Premium' ? 9900 : 19900; // Amount in cents
    const currency = 'usd';

    // console.log('Received paymentMethodId:', paymentMethodId);
    // console.log('Received plan:', plan);
    // console.log('Calculated amount:', amount);

    const user = await User.findById(req.user.id);
    // console.log(user);
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
      // console.log('Created customer:', customer);
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const paymentIntent = await createPaymentIntentService(amount, currency, paymentMethodId, customerId);
    res.status(200).json(paymentIntent);
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getSavedCards = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    // console.log(user);
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
    // console.log(user);
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
      // console.log('Created customer:', customer);
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