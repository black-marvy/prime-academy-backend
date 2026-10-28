const app = require("./app")
const dotenv = require("dotenv");
const mongoose = require("mongoose");


dotenv.config();
const db = process.env.MONGODB_URI.replace(
  "<db_password>",
  process.env.MONGODB_PASSWORD,
);

mongoose
  .connect(db)
  .then(() => console.log("mongoDb connected successfully"))
  .catch((err) => console.log(err.message));



const port = process.env.PORT || 8000;

  app.listen(port,"0.0.0.0", () => {
    console.log(`the server is listening`);
  });
