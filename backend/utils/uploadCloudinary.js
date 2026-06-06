
const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (fileBuffer, folder, resourceType = "auto") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: folder,
          resource_type: resourceType, 
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(fileBuffer);
  });
};

module.exports = uploadToCloudinary;