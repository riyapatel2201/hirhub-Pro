const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({
    //who applied-stores candidate's MongoDB ID
    //ref: 'user means this ID belongs to User collection
    candidate:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    //which job- stores job's mongoDB ID
    //ref: 'Job' means this Id belongs to Job collection
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job',
        required:true
    },
    //what candidate wrote when applying
    //required because recruiter needs to know why candidate is interested
    coverLetter:{
        type:String,
        required:true
    },

    //current status of application 
    //only these 5 values allowed(enum)
    //default is 'applied' because when first applied-> status is applied
    status:{
        type:String,
        enum:['applied','shortlisted','interview','selected','rejected'],
        default:'applied'
    },
    //Recruiter's feedback on application
    //not required-recruiter may or may not add remarks
    recruiterRemarks:{
        type:String,
        default:''
    }
    // auto adds createAt and updatedAt
    //createdAt=when candidate applied
    //updatedAT = when status was last changed    
},{timestamps:true}
)

module.exports = mongoose.model('Application', applicationSchema)