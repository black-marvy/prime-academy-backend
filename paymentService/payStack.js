const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();
const key = process.env.PAYSTACK_KEY;
const url = "https://api.paystack.co";

exports.initializePayment = async (email, price) => {
  const response = await axios.post(
    `${url}/transaction/initialize`,
    {
      email: email,
      amount: Math.round(Number(price) * 100),
      callback_url: "http://localhost:5173/sponsorship",
    },
    {
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-type": "application/json",
      },
    },
  );
  return response.data.data;
};

exports.verifyPaystack = async (reference) => {
  try {
    const res = await axios.get(
      `${url}/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${key}`,
        },
      },
    );
    const payment = res.data.data;
    const verify =
      payment.status === "success" &&
      res.data.status === true &&
      reference === payment.reference;

    if (!verify) {
      console.log("something went wrong");
      return {
      status: "failed",
      message: "Verification failed"
    }
    } else {
      return {
        status: "success",
        data: {
          reference: reference,
          paymentStatus: payment.status,
          amount: payment.amount,
          currency: payment.currency,
        },
      };
    }
  } catch (err) {
    console.log("verification error :", err.response?.data || err.message);
    return {
    status: "failed",
    message: "unable to verify payment"
  }
}

}
