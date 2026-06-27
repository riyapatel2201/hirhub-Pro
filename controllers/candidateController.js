const User = require('../models/User') 
const cloudinary = require('../config/cloudinary')

const updateProfile = async (req, res) => {
    try {
        //step 1 get fields from request body
        const {
            phone,
            skills,
            experience,
            education,
            portfolioLink,
            linkedinLink,
            githubLink,
            jobPreferences
        } = req.body

        //step 2 update user in DB
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                phone,
                skills,
                experience,
                education,
                portfolioLink,
                linkedinLink,
                githubLink,
                jobPreferences
            },
            { new: true}//return updated document            
        ).select('-password -otp -otpExpiry')//hide sensitive fields
        //step 3: send response
        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser

        })
    }catch (error){
        res.status(500).json({ message: 'Server error', error:error.message})
    }
}
const getProfile = async (req, res) => {
    try{
        const user = await User.findById(req.user._id)
        .select('-password -otp -otpExpiry')
        res.status(200).json({user})
    }catch (error) {
        res.status(500).json({message: 'Server error', error: error.message})
    }
}
//upload profile photo
const uploadPhoto = async (req, res) => {
    try {
        //step 1: check if file exists in multer memory
        if(!req.file) {
            return res.status(400).json({message: 'No file uploaded'})
        }
        //step 2 upload to Cloudinary
        //convert buffer to base64 string for cloudinary
        const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`

        const result = await cloudinary.uploader.upload(fileStr, {
            folder: 'hirehub/profiles',
            resource_type: 'image'
        })
        //step 3 save URL to DB
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {profilePhoto: result.secure_url},
            {new : true}
        ).select('-password -otp -otpExpiry')

        res.status(200).json({
            message:'profile photo uploaded successfully',
            profilePhoto: result.secure_url,
            user
        })
    }catch (error) {
        res.status(500).json({message: 'Server error', error: error.message})
    }
}

//upload Resume
const uploadResume = async (req, res) => {
    try {
        //step 1 check if file exists
        if(!req.file){
            return res.status(400).json({message: 'No file uploaded'})
        }
        //step2 upload to cloudinary
        const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`

        const result = await cloudinary.uploader.upload(fileStr, {
            folder:'hirehub/resumes',
            resource_type:'raw' //raw=for pdfs

        })
        //step3 save URL to DB
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {resume: result.secure_url},
            {new: true}
        ).select('-password -otp -otpExpiry')

        res.status(200).json({
            message:'Resume uploaded successfully',
            resume: result.secure_url,
        })
    }catch (error) {
        res.status(500).json({message: 'Server error', error:error.message})
    }
}


module.exports = {updateProfile, getProfile, uploadPhoto, uploadResume}