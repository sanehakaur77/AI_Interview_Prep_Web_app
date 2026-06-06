const express = require("express");
const router = express.Router();

const upload = require("../configs/upload");
const { createProfile ,getProfileByUserId,editProfile,isProfile} = require("../controllers/ProfileController");
const { authMiddleware } = require("../middlewares/auth.middleware");
router.put(
  "/edit/:id",
  authMiddleware,
  upload.single("resume"),
  editProfile
);
router.post(
  "/create",
  authMiddleware,
  upload.single("resume"),
  createProfile
);
router.get(
  "/get/:userId",
  authMiddleware,
  getProfileByUserId
);
router.get('/profile-exist/:id',authMiddleware,isProfile);

module.exports = router;