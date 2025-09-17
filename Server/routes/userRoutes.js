const express = require("express");
const router = express.Router();

// Example: GET /api/users
router.get("/", (req, res) => {
  res.json({ message: "User routes working!" });
});

module.exports = router;
