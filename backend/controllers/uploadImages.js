import fs from "fs";
import path from "path";

import Resume from "../models/resumeModel.js";
import upload from "../middleware/uploadMiddleware.js";

export const uploadResumeImages = async (req, res) => {
  try {
    //to configure multer to handle file uploads
    upload.fields([{ name: "thumbnail" }, { name: "profileImage" }]);
    req,
      res,
      async (err) => {
        if (err) {
          return res
            .status(400)
            .json({ message: "fileupload failed", error: err.message });
        }
        const resumeId = req.params.id;
        const resume = await Resume.findById({
          __id: resumeId,
          userId: req.user.__id,
        });
        if (!resume) {
          return res
            .status(404)
            .json({ message: "Resume not found or unauthorized" });
        }
        //use process cwd to get the uploads folder
        const uploadsFolder = path.join(process.cwd(), "uploads");
        const baseUrl = `${req.protocol}://${req.get("host")}`;

        const newThumbnail = req.files.newThumbnail?.[0];
        const newProfileImage = req.files.newProfileImage?.[0];

        if (newThumbnail) {
          if (resume.thumbnailLink) {
            const oldThumbnail = path.join(
              uploadsFolder,
              path.basename(resume.thumbnailLink)
            );
            if (fs.existsSync(oldThumbnail)) {
              fs.unlinkSync(oldThumbnail); // delete old thumbnail
            }
          }
          resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
        }
        if (newProfileImage) {
          if (resume.profileInfo?.profilePreviewUrl) {
            const oldProfile = path.join(
              uploadsFolder,
              path.basename(resume.profileInfo.profilePreviewUrl)
            );
            if (fs.existsSync(oldProfile)) {
              fs.unlinkSync(oldProfile); // delete old profile image
            }
          }
          resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
        }

        await resume.save();
        res.status(200).json({
          message: "Images uploaded successfully",
          thumbnailLink: resume.thumbnailLink,
          profilePreviewUrl: resume.profileInfo.profilePreviewUrl,
        });
      };
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ message: "failed to upload", error: error.message });
  }
};
