import { stripe } from "./payment.config.js";

export const createPaymentIntent = async (req, res) => {
  const { paymentMethodType, currency, paymentMethodOptions } = req.body;

  const params = {
    payment_method_types: [paymentMethodType],
    amount: 5999, //59.99
    currency: currency,
  };

  if (paymentMethodOptions) {
    params.payment_method_options = paymentMethodOptions;
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create(params);

    // Send publishable key and PaymentIntent details to client
    res.status(200).json({
      message: "Payment intent created successfully.",
      clientSecret: paymentIntent.client_secret,
      nextAction: paymentIntent.next_action,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: `${error.message}`,
    });
  }
};
