import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntentService = async (amount, currency, customerId) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            customer: customerId,
            automatic_payment_methods: {
                enabled: true,
            },
        });
        return paymentIntent;
    } catch (error) {
        console.error('Error creating payment intent:', error);
        throw new Error('Error creating payment intent');
    }
};

export const getSavedCardsService = async (customerId) => {
    try {
        const paymentMethods = await stripe.paymentMethods.list({
            customer: customerId,
            type: 'card',
        });
        return paymentMethods.data;
    } catch (error) {
        console.error('Error fetching saved cards:', error);
        throw new Error('Error fetching saved cards');
    }
};

export const attachPaymentMethodService = async (paymentMethodId, customerId) => {
    try {
        const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
            customer: customerId,
        });
        return paymentMethod;
    } catch (error) {
        console.error('Error attaching payment method:', error);
        throw new Error('Error attaching payment method');
    }
};

export const createSubscriptionService = async (customerId, paymentMethodId, plan) => {
    try {
        // Attach the payment method to the customer
        await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
        
        // Set the default payment method on the customer
        await stripe.customers.update(customerId, {
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });

        // Determine the product ID based on the plan
        let productId;
        if (plan === 'Premium+') {
            productId = 'price_1R3YkEQXyCFGQiCO1D9YID99';
        } else if (plan === 'Premium') {
            productId = 'price_1R3Yj9QXyCFGQiCOYygBTVdN';
        } else {
            throw new Error('Invalid plan');
        }

        // Create the subscription
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: productId }],
            expand: ['latest_invoice.payment_intent'],
        });

        return subscription;
    } catch (error) {
        console.error('Error creating subscription:', error);
        throw new Error('Error creating subscription');
    }
};