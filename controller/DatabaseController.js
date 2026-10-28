
const registration = require("../model/registration");

const postregistration = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      age,
      address,
      city,
    } = req.body;

    if (
      typeof firstName !== "string" ||
      !firstName.trim() ||
      typeof lastName !== "string" ||
      !lastName.trim() ||
      typeof address !== "string" ||
      !address.trim() ||
      typeof city !== "string" ||
      !city.trim() ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      age === undefined ||
      age === null ||
      age === "" ||
      !Number.isFinite(Number(age)) ||
      !Number.isInteger(Number(age)) ||
      Number(age) < 1 ||
      Number(age) > 20
    ) 
    
    {
      return res.status(400).json({
        status: "failed",
        message: "Please provide valid registration details.",
      });
    }

    const postReg = await registration.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      age: Number(age),
      address: address.trim(),
      city: city.trim(),
    });

    return res.status(201).json({
      status: "successful",
      message: "Registration saved successfully.",
      registrationId: "postReg_id",
    });
  } 
  catch (err) {
    console.error("Registration error:", err.message);
     return res.status(500).json({
      status: "failed",
      message: "Unable to save registration. Please try again.",
    });
  }
};

module.exports = postregistration;
