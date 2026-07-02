const express = require('express')
const router = express.Router()

const {applyJob,getMyApplications,getJobApplications,updateApplicationStatus}=require('../controllers/applicationController')
const{authMiddleware, roleMiddleware}=require('../middleware/authMiddleware')

//POST/api/applications/:jobId -> only candidate can apply
router.post('/:jobId',authMiddleware, roleMiddleware('candidate'), applyJob)

router.get('/my-applications', authMiddleware, roleMiddleware('candidate'),getMyApplications)

router.get('/job/:jobId',authMiddleware, roleMiddleware('recruiter'),getJobApplications)

router.put('/:applicationId',authMiddleware, roleMiddleware('recruiter'), updateApplicationStatus)

module.exports = router
