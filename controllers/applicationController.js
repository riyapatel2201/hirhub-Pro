const Application = require('../models/Application')
const Job = require('../models/Job')

//apply for a job
const applyJob = async(req, res) => {
    try{
        //step 1 get job id from url params
        const{jobId} = req.params

        //step 2 check if job exists
        const job = await Job.findById(jobId)
        if(!job){
            return res.status(404).json({message:'Job not found'})
        }
        //step3 check if job is still open
        if(job.isClosed){
            return res.status(400).json({message:'This job is no longer accepting applications'})
        }
        //step 4 check if candidate alredy applied
        const existingApplication = await Application.findOne({
            candidate: req.user._id,
            job:jobId
        })
        if(existingApplication){
            return res.status(400).json({message: 'You have already applied for this job'})
        }
        //step5 get cover letter from request body
        const{coverLetter}=req.body
        if(!coverLetter){
            return res.status(400).json({message:'Cover letter is required'})
        }
        //step 6 create application
        const application = await Application.create({
            candidate: req.user._id,
            job:jobId,
            coverLetter
        })
        //step 7 increment applicationsCount in Job
        await Job.findByIdAndUpdate(jobId, {
            $inc: {applicationsCount: 1} //increment by 1
        })
        //step 8 send response
        res.status(201).json({
        message: 'Application submitted successfully',
        application
        })

    }catch(error){
        res.status(500).json({message: 'Server error', error:error,message})
    }
}
//get my applications
const getMyApplications = async (req, res) => {
    try{
        const applications = await Application.find({candidate: req.user._id})
        //populate job details so candidate sees job info
        .populate('job', 'title companyName location jobType isClosed')
        .sort({updatedAt: -1})

        res.status(200).json({
            message:'Applications fetched successfully',
            count:applications.length,
            applications
        })
    }catch(error){
        res.status(500).json({message: 'Server error', error:error.message})
    }
}
//get job applications by recruiter to see who applied to their job
const getJobApplications = async (req,res) => {
    try{
        //step 1: get jobId from URL params
        const {jobId}=req.params


        const job = await Job.findById(jobId)
        if(!job){
            return res.status(404).json({message: 'Job not found'})
        }
        //step 3 check if reruiter owns this job
        if(job.recruiter.toString() !== req.user._id.toString()){
            return res.status(403).json({message: 'Not authorized to view these applications'})
        }
        //step 4 get all applications for this job
        const applications = await Application.find({job:jobId})
        //populate candidate details so recruiter sees who applied
        .populate('candidate', 'name email skills experience resume githubLink linkedinLink')
        .sort({createdAt: -1})

        //step 5 send response
        res.status(200).json({
            message:'Applications fetched successfully',
            count: applications.length,
            applications
        })
    }catch(error){
        res.status(500).json({message:'Server error', error:error.message})
    }
}
//to update application by recruiter
const updateApplicationStatus = async (req, res) => {
    try{
        //step 1 get applicationId from URL params
        const {applicationId}=req.params

        //step 2 get status and remarks from body
        const {status, recruiterRemarks}=req.body

        //step 3 find application By ID
        const application = await Application.findById(applicationId)
        if(!application){
            return res.status(404).json({message:'Application not found'})
        }
        //step 4 find the job to check ownership
        const job = await Job.findById(application.job)
        //step 5 check if recruiter owns this job
        if(job.recruiter.toString() !== req.user._id.toString()){
            return res.status(403).json({message: 'Not authorized to update this application'})
        }
        //step 6 update status and remarks
        const updatedApplication = await Application.findByIdAndUpdate(
            applicationId,
            {
                status,
                recruiterRemarks
            },
            {new: true}
        )
        //step 7 send response
        res.status(200).json({
            message:'Application status updated successfully',
            application:updatedApplication
        })
    }catch(error){
        res.status(500).json({message:'Server error', error:error.message})
    }
}
module.exports = {applyJob,getMyApplications,getJobApplications,updateApplicationStatus}