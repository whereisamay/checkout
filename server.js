import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.static("public"));
app.use(express.json());

// Use your test secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-11-26.acacia", // or latest from your account
});

// Create Checkout Session for embedded Checkout
app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded",
      return_url: "http://localhost:4242/return.html?session_id={CHECKOUT_SESSION_ID}",
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: 2500,
            product_data: {
              name: "Test Product",
            },
          },
          quantity: 1,
        },
      ],
      // Let Checkout decide which of your enabled methods to show.
      // Optionally, you can force a set like this:
      // payment_method_types: ["card", "link", "klarna", "ideal"],
      automatic_tax: { enabled: false },
    });

    res.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 4242;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
