import Resume from "../models/resumeModel.js";
import fs from "fs";
import path from "path";

export const createResume = async (req , res) => {
    try { 
        const {title} = req.body;

         const defaultResumeData = {
            profileInfo: {
                profileImg: null,
                previewUrl: '',
                fullName: '',
                designation: '',
                summary: '',
            },
            contactInfo: {
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
                website: '',
            },
            workExperience: [
                {
                    company: '',
                    role: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                },
            ],
            education: [
                {
                    degree: '',
                    institution: '',
                    startDate: '',
                    endDate: '',
                },
            ],
            skills: [
                {
                    name: '',
                    progress: 0,
                },
            ],
            projects: [
                {
                    title: '',
                    description: '',
                    github: '',
                    liveDemo: '',
                },
            ],
            certifications: [
                {
                    title: '',
                    issuer: '',
                    year: '',
                },
            ],
            languages: [
                {
                    name: '',
                    progress: '',
                },
            ],
            interests: [''],
         };

         const newRsume = await Resume.create({
            userId: req.user._id,
            title,
            ...defaultResumeData,
            ...req.body,
         });
         res.status(201).json(newRsume);

    }
    catch (error) {
        console.error("Error creating resume:", error);
        res.status(500).json({ message: "failed to create resume" , error: error.message });
    }
}

//get all resumes
export const getUserResumes = async (req , res) => {
    try{
        const resumes = await Resume.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(resumes);
    }
    catch(error){
        console.error("Error getting resumes:", error);
        res.status(500).json({ message: "failed to get resumes" , error: error.message });
    }
}

//get resume by id
export const getResumeById = async (req, res) => {
    try {
            const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id }); 
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        res.status(200).json(resume);
    } catch (error) {
        console.error("Error getting resume by ID:", error);
        res.status(500).json({ message: "failed to get resume by ID", error: error.message });
        
    }
}

export const updateResume = async (req , res) => {
    try{
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ message: "Resume not found or not authorized" });
        }
        //merge updated resume
        Object.assign(resume, req.body);
        const savedResume = await resume.save();
        res.status(200).json(savedResume);
    }catch (error) {
        console.error("Error updating resume:", error);
        res.status(500).json({ message: "failed to update resume", error: error.message });
    }
}

export const deleteResume = async (req , res) => {
    try{
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
         if (!resume) {
            return res.status(404).json({ message: "Resume not found or not authorized" });
        }

        //create a upload folder and store the resume there
        const uploadsFolder = path.join(process.cwd(), 'uploads');

        //delete the thumbnail
        if (resume.thumbnaiLink){
            const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
            if (fs.existsSync(oldThumbnail)) {
                fs.unlinkSync(oldThumbnail);
            }
        }

        if (resume.profileInfo?.profilePreviwUrl) {
            const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviwUrl));
            if (fs.existsSync(oldProfile)) {
                fs.unlinkSync(oldProfile);
            }
        }

        //delete the resume from the database
        const deleted = await Resume.findByIdAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!deleted) {
            return res.status(404).json({ message: "Resume not found or not authorized" });
        }
        res.status(200).json({ message: "Resume deleted successfully" });

    }catch(error){
        console.error("Error deleting resume:", error);
        res.status(500).json({ message: "failed to delete resume", error: error.message });
    }
}