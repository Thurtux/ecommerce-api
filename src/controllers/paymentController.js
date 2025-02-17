const { stripe } = require("../config/stripeConfig");

const processPayment = async (req, res) => {
  try {
    const { amount, currency, paymentMethodId } = req.body;

    if (!amount || !currency || !paymentMethodId) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency,
        payment_method: paymentMethodId,
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never", // Isso impede redirecionamentos
        },
      });
      
      

    return res.status(201).json({ message: "Pagamento realizado!", paymentIntent });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { processPayment };
