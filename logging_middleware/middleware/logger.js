const axios = require("axios");
require("dotenv").config();

const Log = async (stack, level, packageName, message) => {
  try {
    const response = await axios.post(
      process.env.LOG_API,
      {
        stack: stack,
        level: level,
        package: packageName,
        message: message,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Log Created:", response.data);
  } catch (error) {
    console.log(
      "Logging Error:",
      error.response?.data || error.message
    );
  }
};

module.exports = Log;