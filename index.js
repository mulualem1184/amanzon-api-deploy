const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();
app.use(cors({origin: true}));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "success!",
    });
});

// Payment route
app.post("/payment/create", async (req, res) => {
    // Get the total amount from the request body, not query parameters
    const  total  = parseInt(req.query.total);
    console.log(total)
    if (total> 0) {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total,
            currency: "usd",
        });  
    res.status(201).json({
        clientSecret: paymentIntent.client_secret,
    })
    
    } else{
        res.status(403).json( {
            message: "total must be greater than 0",
        })
    }
     
});


// Export API
exports.api = onRequest(app);
