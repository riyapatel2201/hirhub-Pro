const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    //who posted this job- stores recruiter's MongoDB ID
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    //basic job info
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: [String],
        default:[]
    },
    responsibilities: {
        type:String
    },
    //company info-stored directly in job
    companyName: {
        type:String,
        required: true
    },
    companyLogo: {
        type:String
    },
    //job details
    jobType: {
        type: String,
        enum: ['full-time', 'part-time', 'internship', 'remote'],
        required: true
    },
    location :{
        type: String,
        required: true
    },
    experienceLevel: {
        type: String,
        enum:['fresher', 'mid','senior'],
        default: 'fresher'
    },
    //salary range
    salary: {
        min: {type:Number},
        max: {type: Number}
    },
    //application info
    deadline: {
        type: Date,
        required: true
    },
    totalPositions: {
        type: Number,
        default:1
    },
    isClosed: {
        type: Boolean,
        default: false//open by default
    },
    //stats
    applicationsCount: {
        type: Number,
        default:0
    }
}, { timestamps: true}
)

module.exports = mongoose.model('Job', jobSchema)
