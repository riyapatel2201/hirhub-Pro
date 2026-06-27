const User = require('../models/User')
const cloudinary = require('../config/cloudinary')
//update Recruiter Profile
const updateProfile = async(req, res) => {
    try{
        //step 1 get recruiter fields from request body
        const {
            phone,
            companyName,
            companyDescription,
            industry,
            companySize,
            website
        } = req.body
        //step 2 update user in DB using their ID
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,//who to update (from middleware)
            {
                phone,
                companyName,
                companyDescription,
                industry,
                companySize,
                website
            },
            {new : true}//return updated document
        ).select('-password -otp -otpExpiry')
        //step 3 Send response
        res.status(200).json({
            message:'Profile updated successfully',
            user: updatedUser
        })
    }catch (error) {
        res.status(500).json({message: 'Server error', error:error.message})
    }
}
//Get recruiter Profile
const getProfile = async (req, res) => {
    try {
        //find user by ID from middleware
        const user = await User.findById(req.user._id)
        .select('-password -otpExpiry') //hide sensitive fields

        //send profile data
        res.status(500).json({user})
    }catch (error){
        res.status(500).json({message: 'Server error', error:error.message})
    }
}
//upload company logo
const uploadLogo = async (req, res) => {
    try {
        //step 1 check if file exist
        if(!req.file){
            return res.status(400).json({messge: 'No file uploaded'})
        }
        //step 2 convert file to base64 string for cloudinary
        const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`

        //step 3 upload to cloudinary
        const result = await cloudinary.uploader.upload(fileStr, {
            folder: 'hirehub/logos',//store in logos folder
            resource_type: 'image' //it's an image file
        })
        //step 4 save cloudinary URL to DB
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {companyLogo: result.secure_url},
            {new: true}    
        ).select('-password -otp -otpExpiry')

        //stap 5 send response
        res.status(200).json({
            message: 'Company logo uploaded successfully',
            companyLogo:result.secure_url,
            user
        })
    }catch (error) {
        res.status(500).json({message: 'Server error', error:error.message})
    }
}
module.exports = {updateProfile, getProfile, uploadLogo}