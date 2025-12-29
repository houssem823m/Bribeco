const { validationResult } = require('express-validator');
const Payment = require('../models/Payment');
const Reservation = require('../models/Reservation');
const paymentService = require('../services/paymentService');

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Client only
const createPaymentIntent = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    // Only clients can create payment intents
    if (req.user.role !== 'client') {
      return res.status(403).json({
        success: false,
        message: 'Only clients can create payment intents',
      });
    }

    const { reservationId, amount } = req.body;

    // Find reservation
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    // Verify user owns the reservation
    if (reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to create payment for this reservation',
      });
    }

    // Check if payment already exists for this reservation
    let payment = await Payment.findOne({ reservation: reservationId });
    if (payment && payment.status !== 'échoué') {
      return res.status(400).json({
        success: false,
        message: 'Payment already exists for this reservation',
        data: payment,
      });
    }

    // Convert amount to cents (for Stripe-like behavior)
    const amountInCents = Math.round(amount * 100);

    // Create payment intent using service
    const paymentIntent = await paymentService.createPaymentIntent(amountInCents, 'eur');

    // Create or update payment record
    if (payment) {
      // Update existing failed payment
      payment.amount = amount;
      payment.payment_intent_id = paymentIntent.id;
      payment.status = 'en attente';
      await payment.save();
    } else {
      // Create new payment
      payment = await Payment.create({
        reservation: reservationId,
        amount: amount,
        payment_intent_id: paymentIntent.id,
        status: 'en attente',
      });

      // Link payment to reservation
      reservation.payment = payment._id;
      await reservation.save();
    }

    res.status(200).json({
      success: true,
      message: 'Payment intent created successfully',
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        payment: payment,
      },
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating payment intent',
    });
  }
};

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Client only
const confirmPayment = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    // Only clients can confirm payments
    if (req.user.role !== 'client') {
      return res.status(403).json({
        success: false,
        message: 'Only clients can confirm payments',
      });
    }

    const { paymentIntentId, simulate_success } = req.body;

    // Find payment by payment intent ID
    const payment = await Payment.findOne({ payment_intent_id: paymentIntentId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    // Populate reservation to check ownership
    await payment.populate('reservation');
    const reservation = payment.reservation;

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    // Verify user owns the reservation
    if (reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to confirm this payment',
      });
    }

    // Confirm payment intent using service
    const paymentIntent = await paymentService.confirmPaymentIntent(
      paymentIntentId,
      simulate_success !== false
    );

    // Update payment status based on result
    let paymentStatus;
    if (paymentIntent.status === 'succeeded') {
      paymentStatus = 'payé';
    } else if (paymentIntent.status === 'payment_failed') {
      paymentStatus = 'échoué';
    } else {
      paymentStatus = 'en attente';
    }

    payment.status = paymentStatus;
    await payment.save();

    // Update reservation status if payment succeeded
    if (paymentStatus === 'payé') {
      // Reservation can be confirmed once payment is successful
      if (reservation.status === 'nouvelle') {
        reservation.status = 'confirmée';
        await reservation.save();
      }
    }

    // Populate reservation before returning
    await payment.populate({
      path: 'reservation',
      populate: {
        path: 'service',
        populate: { path: 'category', select: 'name slug' },
      },
    });

    res.status(200).json({
      success: true,
      message: `Payment ${paymentStatus === 'payé' ? 'confirmed' : 'failed'} successfully`,
      data: {
        payment,
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
        },
      },
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while confirming payment',
    });
  }
};

// @desc    Handle payment webhook
// @route   POST /api/payments/webhook
// @access  Public (should be protected with Stripe signature verification in production)
const handleWebhook = async (req, res) => {
  try {
    const { type, data } = req.body;

    // Extract payment intent ID from event data
    let paymentIntentId;
    if (data.object && data.object.id) {
      paymentIntentId = data.object.id;
    } else if (data.object && data.object.payment_intent) {
      paymentIntentId = data.object.payment_intent;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook event data',
      });
    }

    // Get payment status from webhook event
    const paymentStatus = paymentService.getPaymentStatusFromWebhook(type, paymentIntentId);

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: `Unhandled event type: ${type}`,
      });
    }

    // Find payment by payment intent ID
    const payment = await Payment.findOne({ payment_intent_id: paymentIntentId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found for this payment intent',
      });
    }

    // Update payment status
    payment.status = paymentStatus;
    await payment.save();

    // Update reservation status based on payment status
    const reservation = await Reservation.findById(payment.reservation);
    if (reservation) {
      if (paymentStatus === 'payé' && reservation.status === 'nouvelle') {
        reservation.status = 'confirmée';
        await reservation.save();
      }
    }

    // Return success immediately (Stripe expects quick response)
    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
      received: true,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing webhook',
    });
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  handleWebhook,
};

