const crypto = require("crypto");

const {
  initializePayment,
  verifyPaystack,
} = require("../paymentService/payStack");

exports.getPayment = async (req, res) => {
  try {
    res.status(200).json({
      status: "successful",
      message: "Welome to paystack",
    });
  } catch (err) {
    throw new Error(err.message || "something went wrong");
  }
};

exports.postPayment = async (req, res) => {
  try {
    const { email, amount } = req.body;
    const price = Number(amount);
    if (
      price <= 0 ||
      !Number.isFinite(price) ||
      !Number.isInteger(price * 100) ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    )
      return res.status(400).json({
        status: "failed",
        message: "invalid email or  amount",
      });

    const payment = await initializePayment(email, price);

    res.status(200).json({
      status: "successful",
      data: payment,
    });
  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({
      status: "failed",
      message: err.message || "payment initialization failed ",
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;
    if (!/^[a-zA-Z0-9._=-]+$/.test(reference)) {
      return res.status(400).json({
        status: "failed",
        message: " invalid transaction reference",
      });
    }
    const response =  await verifyPaystack(reference);
    if(response.status !== "success"){
        return res.status(400).json(response)
    }
    return res.status(200).json(response)
  } catch (err) {
    console.log(
      "Payment verification error:",
      err.response?.data || err.message,
    );
    return res.status(500).json({
      status: "failed",
      message: "Payment verification failed",
    });
  }
};
exports.postwebhook = async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_KEY;
    const signature = req.headers["x-paystack-signature"];

    if (!secret || !signature || !req.rawBody) {
      return res.sendStatus(401);
    }
    const expectedSignature = crypto
      .createHmac("sha512", secret)
      .update(req.rawBody)
      .digest("hex");

    const signatureBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      return res.sendStatus(401);
    }
    const event = req.body;
    console.log("paystack event received");

    if (event.event === "charge.success") {
      console.log("Reference", event.data.reference);
      console.log("Amount", event.data.amount);
      console.log("currency", event.data.currency);
      console.log("status", event.data.status);
    }
    return res.sendStatus(200);
  } catch (err) {
    console.log("webhook error", err.message);
    return res.sendStatus(500);
  }
};
