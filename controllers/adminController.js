const User = require('../models/User')

//approve recuiters
const approveRecruiters = async (req, res) => {
    try{
        //step 1 get recuiterId from req.params
        const {recruiterId} = req.params

        //step 2check recruiter exist by iD in BD
        const recruiter = await User.findById( recruiterId)
        if(!recruiter){
            return res.status(404).json({message: 'Recruiter not found'})
        }
        //step 3 check wheather it's recruiter only
        if(recruiter.role !== 'recruiter'){
            return res.status(400).json({message: 'User is not recruiter'})    
        }
        //step 4 approve recruiter
        await User.findByIdAndUpdate(
            recruiterId,
            {isApproved: true}
        )
        res.status(200).json({ message: 'Recruiter approved successfully' })

    }catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
    }
}
//get all recuiters
const getAllRecruiters = async (req, res) => {

    try {

        // Find all users with role recruiter
        const recruiters = await User.find({ role: 'recruiter' })
        .select('-password -otp -otpExpiry')

        res.status(200).json({ recruiters })

    } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
    }
}
module.exports = { approveRecruiters, getAllRecruiters }