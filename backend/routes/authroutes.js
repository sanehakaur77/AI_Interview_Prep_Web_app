const express = require("express");
const router = express.Router();

const { signup, login, getProfile,googleLogin } = require("../controllers/authcontroller");

const {
  signupValidation,
  loginValidation,
} = require("../validators/auth.user.validation");

const validate = require("../middlewares/validate");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.post("/signup", validate(signupValidation), signup);
router.post("/login", validate(loginValidation), login);


router.post("/google", googleLogin);

router.get("/profile", getProfile);

module.exports = router;
