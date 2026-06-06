const Profile = require("../models/Profile");
const cloudinary = require("../configs/cloudinary");
const streamifier = require("streamifier");

exports.createProfile = async (req, res) => {
  try {
    const userId = req.user._id;
   

   

    let resumeUrl = "";

    // Upload Resume to Cloudinary
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "resumes",
            resource_type: "raw",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        streamifier
          .createReadStream(req.file.buffer)
          .pipe(stream);
      });

      resumeUrl = result.secure_url;
    }

    const profileData = {
      user: userId, 

      fullName: req.body.fullName,
      phone: req.body.phone,

      education: {
        college: req.body.college,
        degree: req.body.degree,
        branch: req.body.branch,
        graduationYear: req.body.graduationYear,
        cgpa: req.body.cgpa,
      },

      targetRole: req.body.targetRole,
      experienceLevel: req.body.experienceLevel,

      skills: req.body.skills
        ? JSON.parse(req.body.skills)
        : [],

      bio: req.body.bio,

      github: req.body.github,
      linkedin: req.body.linkedin,
      portfolio: req.body.portfolio,

      resumeUrl,
    };

const profile = await Profile.findOneAndUpdate(
  { user: userId },
  profileData,
  {
    returnDocument: "after",
    upsert: true,
    runValidators: true,
  }
);

    return res.status(200).json({
      success: true,
      message: "Profile created successfully",
      profile,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getProfileByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    const profile = await Profile.findOne({ user: userId }).populate("user");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.editProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    let resumeUrl = null;

    // -----------------------------
    // Upload resume if file exists
    // -----------------------------
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "resumes",
            resource_type: "raw",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      resumeUrl = uploadResult.secure_url;
    }

    // -----------------------------
    // Build update object
    // -----------------------------
    const updateData = {
      fullName: req.body.fullName,
      phone: req.body.phone,

      education: {
        college: req.body.college,
        degree: req.body.degree,
        branch: req.body.branch,
        graduationYear: req.body.graduationYear,
        cgpa: req.body.cgpa,
      },

      targetRole: req.body.targetRole,
      experienceLevel: req.body.experienceLevel,

      skills: req.body.skills ? JSON.parse(req.body.skills) : [],

      bio: req.body.bio,
      github: req.body.github,
      linkedin: req.body.linkedin,
      portfolio: req.body.portfolio,
    };

    // add resume only if uploaded
    if (resumeUrl) {
      updateData.resumeUrl = resumeUrl;
    }

    // -----------------------------
    // Update profile in DB
    // -----------------------------
  const profile = await Profile.findOneAndUpdate(
  { user: userId },
  updateData,
  {
    returnDocument: "after",
    runValidators: true,
  }
);

    // -----------------------------
    // If profile not found
    // -----------------------------
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found. Please create profile first.",
      });
    }

    // -----------------------------
    // Success response
    // -----------------------------
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });

  } catch (error) {
    console.error("Edit Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.isProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await Profile.findOne({ user: id });

    if (!profile) {
      return res.json({
        exists: false,
      });
    }

    return res.json({
      exists: true,
      success:true
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};