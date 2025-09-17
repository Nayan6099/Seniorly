// Server/routes/courseRoutes.js
const express = require("express");
const router = express.Router();

// Example test route
router.get("/", (req, res) => {
  res.send("Course routes working!");
});

module.exports = router;
