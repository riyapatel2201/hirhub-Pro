const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/sendEmail')
//generate random 6 digit otp
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}
//generate jwt token
const generateToken = (userId) => {
    return jwt.sign(
        {id: userId},
        process.env.JWT_SECRET,
        {expiresIn: '7d'}

    )
}
//register
const register = async (req, res) => {

    try {
        //step 1: get data from request body
        const {name , email, password, role} = req.body

        //step2: validate- check all feilds present
        if(!name || !email || !password || !role){
            return res.status(400).json({message: 'All fields are required'})
        }
        //step3: check if email already exist
        const existingUser=await User.findOne({ email })
        if(existingUser) {
            return res.status(400).json({message: 'Email already registered'})
        }
//step4 hash password
    // Why 10? It's the salt rounds — higher = more secure but slower  
        const hashedPassword = await bcrypt.hash(password, 10)
    //step 5 generate OTP
        const otp = generateOTP()
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
        // expires in 10 minutes

        //step 6 save user to MongoDB
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            otp,
            otpExpiry
        })

        //step 7: send OTP to email
        await sendEmail (
            email,
            'Verify Your Email - HireHub Pro',
            `Your OTP is: ${otp}. Valid for 10 minutes.`

        )
        //step 8 generate jwt token
        const token = generateToken(user._id)

        //step 9 send response
        res.status(201).json({
            message: 'Registration successful. Please verify your email.',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role:user.role,
                isVerified: user.isVerified
            }
        })

    }catch (error) {
        res.status(500).json({message: 'Server error', error:error.message})
    }   

}
module.exports = {register}