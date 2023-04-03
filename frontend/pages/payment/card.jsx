import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { NEXT_PUBLIC_SERVER_BASE_URL } from "../_app";
import { toast } from "react-toastify";
import { useState } from "react";

const Card = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);

  const resetState = async () => {
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    // return is stripe is not loaded
    if (!stripe || !elements) {
      toast.warning("Stripe.js has not yet loaded.");
      return;
    }

    try {
      // create stripe payment intent
      const { data } = await axios.post(
        `${NEXT_PUBLIC_SERVER_BASE_URL}/api/payment/create-intent`,
        {
          paymentMethodType: "card",
          currency: "inr",
        }
      );

      const { clientSecret } = data;

      // confirm stripe payment
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });

      toast.success(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);
      stripeError?.message && toast.error(stripeError.message);
    } catch (error) {
      error?.response?.data?.message &&
        toast.error(error.response.data.message);
    }

    await resetState();
  };
  return (
    <>
      <h1>Card</h1>
      <form id="payment-form" onSubmit={handleSubmit}>
        <CardElement id="card" />

        <button type="submit">Pay</button>
      </form>

      <p>
        {" "}
        <a href="https://youtu.be/IhvtIbfDZJI" target="_blank">
          Watch a demo walkthrough
        </a>{" "}
      </p>
    </>
  );
};

export default Card;
