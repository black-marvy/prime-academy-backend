const express = require("express");
const cors = require("cors");
const router = require("./router/router");
const postreg = require("./controller/DatabaseController");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = Buffer.from(buf);
    },
  }),
);

app.use("/api/payment/", router);
app.post("/api/registrations", postreg);

module.exports = app;
