const Job = require('../models/Job')



const postJob = async (req, res) => {
    try {
        //step 1 get job data from req.body
        const {title, description, requirements,responsibilities,companyName,companyLogo,jobType,location,experienceLevel,salary,deadline,totalPositions,isClosed,
        } = req.body

        //step 2 validate- are required fields present?
        if(!title || !description || !jobType || !location || !deadline ){
            return res.status(400).json({message: 'Please fill all required fields'})
        }
        //step 3 check if recruiter is approved
        if(!req.user.isApproved) {
            return res.status(403).json({message: 'Your account is not approved yet. Please wait for for admin approval.'})
        }
        //step 4 : Auto attach company info frrom recruiter profile
        const newJob = await Job.create({
            recruiter: req.user._id,
            companyName: req.user.companyName,
            companyLogo:req.user.companyLogo,
            title,
            description,
            requirements,
            responsibilities,
            jobType,
            location,
            experienceLevel,
            salary,
            deadline,
            totalPositions
        })
        //step 5: send response
        res.status(201).json({
            message: 'Job posted successfully',
            newJob
        })
    }catch (error) {
        res.status(500).json({message: 'Server error', error: error.message})

    }
}
//get all jobs 
const getAllJobs = async (req, res) => {
    try {
        //step 1 find all open jobs 
        //populate brings recruiter's name and company info
        //from all job document in db find isclosed false and return onoy company nam name , logo
        const jobs = await Job.find({isClosed: false})
        .populate('recruiter', 'name companyName companyLogo')
        .sort({createdAt: -1}) //newest first 

        res.status(200).json({
            message:'Jobs fetched successfully',
            count: jobs.length,
            jobs
        })
    } catch (error) {
        res.status(500).json({message: 'Server error', error:error.message})
    }
}
//get single job
const getSingleJob = async (req, res) => {
    try{
        //step 1: get job ID from URL params
        const {id} = req.params

        //step 2: find job by ID
        const job = await Job.findById(id)
        .populate('recruiter', 'name companyName companyLogo')

        //step 3 check if job exists
        if(!job) {
            return res.status(404)({message: 'Jon not found'})
        }
        //step 4 send response
        res.status(200).json({
            message:'Job fetched successfully',
            job
        })
    }catch (error){
        res.status(500).json({message: 'Server error', error: error.message})
    }
}
//update or edit the job
const updateJob = async (req, res) => {
    try{
        //step 1 get job Id from URL
        const {id} = req.params

        //step 2 check if job exist
        const job=await Job.findById(id)
        if(!job){
            return res.status(404).json({message: 'Job not found'})
        }
        //step 4 check if recuiter the same who posted this job
        if(job.recruiter.toString() !== req.user._id.toString()){
            return res.status(403).json({message:'Not authorized to edit this job'})
        }
        //step 5 get updated fields from body
        const { title, description, requirements, responsibilities,jobType,location,experienceLevel,salary,deadline,totalPositions,isClosed
        } = req.body

        //step 6 : Update job
        const updatedJob = await Job.findByIdAndUpdate(id,
            {
                title,
                description,requirements,responsibilities,jobType,location,experienceLevel,salary,deadline,totalPositions,
                isClosed
            },
            {new: true} //return updated document
        )
        res.status(200).json({message:'Job updated successfully',
            job:updatedJob
        })
    }catch(error) {
        res.status(500).json({message: 'Server error', error: error.message})
    }
}

//delete Job
const deleteJob = async (req, res) => {
    try{
        //step 1 : get job id from URl
        const {id} = req.params

        //step 2 find job by ID
        const job = await Job.findById(id)

        //step 3 check if job exists
        if(!job) {
            return res.status(404).json({message:'Job not found'})
        }
        //step 4 check ownership 
        if(job.recruiter.toString() !== req.user._id.toString()){
            return res.status(403).json({message: 'Not authorized to delete this job'})
        }
        //step 5 delete job
        await Job.findByIdAndDelete(id)

        res.status(200).json({message: 'Job deleted successfully'})
    } catch (error) {
        res.status(500).json({message:'Server error', error:error.message})
    }
}

module.exports = {postJob,getAllJobs, getSingleJob,updateJob, deleteJob}