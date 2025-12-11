import express from "express";
import Stripe from "stripe";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Create checkout session
router.post("/create-checkout-session", async (req, res) => {
    try {
        const { packageName, price, limit, hrEmail, hrName } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `${packageName} Package`,
                            description: `Subscription for up to ${limit} employees`,
                        },
                        unit_amount: price * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.CLIENT_URL || 'https://asseetverse.netlify.app'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL || 'https://asseetverse.netlify.app'}/subscription`,
            customer_email: hrEmail,
            metadata: {
                hrEmail,
                packageName,
                employeeLimit: limit,
                price
            }
        });

        res.json({ url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Verify Payment and Save to DB
router.post("/payment-success", async (req, res) => {
    try {
        const { sessionId } = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const { hrEmail, packageName, employeeLimit, price } = session.metadata;


            const existingPayment = await Payment.findOne({ transactionId: session.payment_intent });
            if (existingPayment) {
                return res.json({ status: "already_processed" });
            }

            const paymentRecord = await Payment.create({
                hrEmail,
                packageName,
                employeeLimit: parseInt(employeeLimit),
                amount: parseFloat(price),
                transactionId: session.payment_intent,
                status: 'completed'
            });

            // Update user package limit
            const filter = { email: hrEmail };
            const updateDoc = {
                $set: {
                    packageLimit: parseInt(employeeLimit),
                    subscription: packageName.toLowerCase()
                }
            }
            await User.updateOne(filter, updateDoc);

            res.json({ status: "success", payment: paymentRecord });
        } else {
            res.status(400).json({ status: "failed" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get payment history for HR
router.get("/:email", async (req, res) => {
    const email = req.params.email;
    const query = { hrEmail: email };
    const result = await Payment.find(query);
    res.send(result);
})

export default router;
