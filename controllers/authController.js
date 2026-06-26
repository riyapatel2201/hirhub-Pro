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
const login = async (req, res) => {

    try {
        // Step 1: Get data from request body
        const { email, password } = req.body

    // Step 2: Validate fields
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

    // Step 3: Find user by email
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

    // Step 4: Compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

    // Step 5: Check if email verified
        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email first' })
        }

    // Step 6: Generate token
        const token = generateToken(user._id)

    // Step 7: Send response
        res.status(200).json({

            message: 'Login successful',
            token,
            user: {

            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }

}
const verifyEmail = async (req, res) => {
    try {

        //step 1 : get email and otp from request
        const {email, otp} = req.body

        //step 2 find user by email
        const user = await User.findOne({email})
        console.log('User:', user)
        console.log('DB OTP:', user.otp)
        console.log('Request OTP:', otp)
        if(!user){
            return res.status(400).json({message: 'User not found'})
        }
        //step 3 check otp matches
        if(user.otp !== otp){
            return res.status(400).json({message: 'Invalid OTP'})
        }
        //step 4 check if otp expired
        if(user.otpExpiry < new Date()){
            return res.status(400).json({message: 'OTP expired'})
        }
        //step 5 mark user as verified
        await User.findOneAndUpdate(
            { email },
        { 
            isVerified: true,
            $unset: { otp: 1, otpExpiry: 1 }
        }
    )

        res.status(200).json({message: 'Email verifies successfully'})
    }catch (error) {
        res.status(500).json({message: 'Server error', error: error.message})
    }

}
const forgotPassword = async (req, res) => {
    try {
        //step1: get mail from request
        const{email}=req.body

        //step 2 check if user exists
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: 'Email not registered'})
        }
        //step 3generate new otp
        const otp=generateOTP()
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

        //step 4 save otp to DB
        await User.findOneAndUpdate(
            {email},
            {otp, otpExpiry}
        )
        //step 5 send OTP to email
        await sendEmail(
            email,
            'Reset Password-HireHub Pro',
            `Your OTP is: ${otp}. Valid for 10 minutes.`
        )
        //step6 send response
        res.status(200).json({message: 'OTP sent to you email'})    
    }catch (error) {
        res.status(500).json({message: 'Server error', error:error.message})
    }
}
const resetPassword = async (req, res) => {
    try {
        //step1 get email, otp, newpassword
        const {email, otp, newPassword} = req.body

        //step 2 find user by email
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: 'email not registered'})       
        }
        //step 3: check OTP matches
        if(user.otp!==otp){
            return res.status(400).json({message: 'Invalid OTP'})
        }
        //step 4: check OTP not expired
        if(user.otpExpiry < new Date()) {
            return res.status(400).json({message: 'OTP expired'})
        }
        //step 5 : hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10) 
        await User.findOneAndUpdate(
            {email},
            {
                password: hashedPassword,
                $unset: {otp:1 , otpExpiry:1}
            }
        )
        res.status(200).json({message: 'Password reset successful'})
    }catch (error){
        res.status(500).json({message:'Server error', error:error.message})
    }
}

module.exports = {register, login, verifyEmail, forgotPassword, resetPassword}