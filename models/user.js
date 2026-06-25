const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type:String,
        required: true,
        minlength:6
    },
    phone: {
        type:String
    },
    profilePhoto:{
        type: String,
    },
    role: {
        type: String,
        enum: ['candidate','recruiter', 'admin'],
        default:'candidate'
    },
    isVarified: {
        type: Boolean,
        default:false
    },
    resume: {
        type: String
    },
    skills: {    
        type: [String], 
        default: []
    },
    experience: {
        type: String
    },
    education: {
        type: String
    },
    portfolioLink: {
        type: String
    },
    linkedinLink: {
        type: String
    },
    githubLink: {
        type: String      
    },
    jobPreferences: {
        location: String,
        minSalary: Number,
        jobType: {
            type: String,
            enum:['full-time', 'part-time', 'internship', 'remote']
        }
    },
    companyName: {
    type: String
    },
    companyLogo: {
        type: String  
    },
    companyDescription: {
        type: String
    },
    industry: {
        type: String
    },
    companySize: {
        type: String
    },
    website: {
        type: String
    },
    isApproved: {
        type: Boolean,
        default: false     
    },

  
    otp: {
        type: String
    },
    otpExpiry: {
        type: Date
    },
}, {timestamps : true}
)

const User = mongoose.model('User', userSchema)
module.exports = User