import express from 'express';
import { createPaymentIntent, getSavedCards, attachPaymentMethod, createSubscription, handleWebhook } from '../controllers/StripeController.js';
import { verifyTokens } from '../middlewares/verifyTokens.js';

const router = express.Router();

router.post('/create-payment-intent', verifyTokens, createPaymentIntent);
router.get('/saved-cards', verifyTokens, getSavedCards);
router.post('/attach-payment-method', verifyTokens, attachPaymentMethod);
router.post('/create-subscription', verifyTokens, createSubscription);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;