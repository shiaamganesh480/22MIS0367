const express = require("express");
const router = express.Router();

const Log = require("../middleware/logger");

router.get("/", async (req, res) => {

  await Log(
    "backend",
    "info",
    "route",
    "Test route executed successfully"
  );

  res.json({
    success: true,
    message: "Logging middleware working"
  });
});

module.exports = router;