const express = require("express");
const {
  getPayment,
  postPayment,
  postwebhook,
  verifyPayment,
} = require("../controller/paymentController");

const router = express.Router();

router.route("/").get(getPayment);
router.route("/initialize").post(postPayment);
router.route("/verify/:reference").get(verifyPayment)
router.route("/webhook").post(postwebhook)


module.exports = router;
