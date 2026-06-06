const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 🔐 Generate Token (ONLY used in login)
const generateToken = (id) => {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

//
// ================= SIGNUP (NO TOKEN HERE) =================
//
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      success: true,
      message: "Signup successful. Please login to get token.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//
// ================= LOGIN (TOKEN GENERATED HERE ONLY) =================
//
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token, // ✅ only here
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//
// ================= PROFILE =================
//
exports.getProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ❌ FIX: was decoded.id
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   res.status(200).json({
  success: true,
  username: user.name,
  email: user.email,
  userId: user._id,
});
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};


exports.googleLogin = async (req, res) => {
  try {
    const { name, email, googleId, avatar } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({
        success: false,
        message: "Missing Google data",
      });
    }

    // 🔍 check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // 🆕 create new user
      user = await User.create({
        name,
        email,
        googleId,
        avatar,
        password: null,
      });
    } else {
      // 🔄 update googleId if not present
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = avatar;
        await user.save();
      }
    }

    // 🔐 JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
