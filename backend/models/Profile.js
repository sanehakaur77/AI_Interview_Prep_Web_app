const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
     
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
      isUnique:true,
    },

    education: {
      college: {
        type: String,
        trim: true,
      },

      degree: {
        type: String,
        trim: true,
      },

      branch: {
        type: String,
        trim: true,
      },

      graduationYear: {
        type: Number,
      },

      cgpa: {
        type: Number,
      },
    },

    targetRole: {
      type: String,
      
    },

    experienceLevel: {
      type: String,
      default: "Fresher",
      required:true
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    bio: {
      type: String,
      maxlength: 500,
    },

    github: {
      type: String,
      trim: true,
      isUnique:true
    },

    linkedin: {
      type: String,
      trim: true,
      isUnique:true,
    },

    portfolio: {
      type: String,
      trim: true,
      isUnique:true
    },

    resumeUrl: {
      type: String,
      default: "",
    },
    profileCompletion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Profile", profileSchema);