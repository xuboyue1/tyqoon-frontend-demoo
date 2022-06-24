const express = require("express");
const app = express();
// This is your test secret API key.
app.use(express.static("public"));
app.use(express.json());

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount: calculateOrderAmount(items),
  //   currency: "eur",
  //   automatic_payment_methods: {
  //     enabled: true,
  //   },
  // });

  res.send({
    clientSecret: "pi_3LE92rKLC9Y6YxW21S1Czyzf_secret_JcjkM4wAuau53vfT1dYzBadkU",
  });
});

app.listen(4242, () => console.log("Node server listening on  http://localhost:4242/ "));