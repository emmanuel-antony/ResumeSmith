import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createResume, getResumeById, getUserResumes, updateResume , deleteResume } from "../controllers/resumeController.js";
import { uploadResumeImages } from "../controllers/uploadImages.js";

const resumeRouter = express.Router();

resumeRouter.post('/',protect , createResume);//creata resume

resumeRouter.get('/', protect, getUserResumes);//get all resumes of the user
resumeRouter.get('/:id', protect, getResumeById);//get resume by id

resumeRouter.put('/:id' , protect , updateResume);//update resume by id
resumeRouter.put('/:id/upload-images' , protect , uploadResumeImages);//upload images for resume

resumeRouter.delete('/:id', protect, deleteResume);//delete resume by id

export default resumeRouter;