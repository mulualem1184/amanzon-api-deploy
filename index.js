
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
    const total = Number(req.query.total);

    if (total> 0) {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total,
            currency: "usd",
        });

        res.status(201).json({
            clientSecret: paymentIntent.client_secret,
        });
    } else {
        res.status(403).json({message:"payment nmust be greter than 0"});
    }
});

app.listen(5000,(err)=>{
    if(err) throw err;
    console.log("Amazon Srever running on port:5000, http://localhost:5000")
})
//exports.api = onRequest(app);
