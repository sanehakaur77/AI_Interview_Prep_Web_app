const express = require("express");
const router = express.Router();

const { sendContactMessage } = require("../controllers/contactController");

// POST /api/contact
router.post("/send-message", sendContactMessage);

module.exports = router;