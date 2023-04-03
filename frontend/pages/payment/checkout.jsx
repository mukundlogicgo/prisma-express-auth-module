import React, { useState } from "react";
import { NEXT_PUBLIC_SERVER_BASE_URL } from "../_app";
import axios from "axios";

const Checkout = () => {
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    const tokenRes = await axios.post(
      "https://api.stripe.com/v1/tokens",
      {
        "card[number]": cardNumber,
        "card[exp_month]": expMonth,
        "card[exp_year]": expYear,
        "card[cvc]": cvc,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`,
        },
      }
    );
    const paymentRes = await axios.post(
      `${NEXT_PUBLIC_SERVER_BASE_URL}/api/payment`,
      {
        amount_in_rupees: 10,
        email,
        token: tokenRes.data.id,
      }
    );
    setLoading(false);
    console.log({ paymentRes: paymentRes.data });
  };
  return (
    <>
      <form className="flex flex-col">
        <label>
          Email:
          <input
            className="border"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Card number:
          <input
            className="border"
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
        </label>
        <label>
          Expiration month:
          <input
            className="border"
            type="text"
            value={expMonth}
            onChange={(e) => setExpMonth(e.target.value)}
          />
        </label>
        <label>
          Expiration year:
          <input
            className="border"
            type="text"
            value={expYear}
            onChange={(e) => setExpYear(e.target.value)}
          />
        </label>
        <label>
          CVC:
          <input
            className="border"
            type="text"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
          />
        </label>

        <button
          className="border"
          type="submit"
          disabled={loading}
          onClick={handlePay}
        >
          {loading ? "Loading..." : "Pay now"}
        </button>
      </form>
    </>
  );
};

export default Checkout;
