// -----------------------------------------------------------------------
// EXAMPLE BACKEND SERVER — handles real money movement.
//
// This is the missing piece that makes payments actually work. It must run
// on a server (NOT in the browser) because it uses your SECRET key, which
// should never be visible to users.
//
// Setup:
//   1. npm install express razorpay cors dotenv
//   2. Create a .env file with:
//        RAZORPAY_KEY_ID=your_key_id
//        RAZORPAY_KEY_SECRET=your_key_secret
//   3. node server.js
//
// Where to run this: Render.com or Railway.app both offer free/cheap
// hosting for small Node servers and are simple to deploy to.
// -----------------------------------------------------------------------

const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create an order before opening the Razorpay checkout popup.
app.post("/api/create-order", async (req, res) => {
  try {
    const { amount } = req.body; // amount in rupees, e.g. 10
    if (!amount || amount < 10) {
      return res.status(400).json({ error: "Minimum donation is ₹10" });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay needs amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create order" });
  }
});

// Verify the payment signature after the user completes checkout.
// This step is essential — without it, anyone could fake a "success"
// response from the frontend.
app.post("/api/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // TODO: save this donation to your database here
    // (donor name, email, amount, payment_id, timestamp)
    res.json({ status: "verified" });
  } else {
    res.status(400).json({ status: "verification_failed" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
