const express = require('express')

const router = express.Router()
const {postJob, getAllJobs, getSingleJob, updateJob, deleteJob}=require('../controllers/jobController')
const {authMiddleware, roleMiddleware} = require('../middleware/authMiddleware')

//POST /api/jobs -> only recruiter can post
router.post('/',authMiddleware, roleMiddleware('recruiter'), postJob)
router.get('/', getAllJobs)//no auth needed
router.get('/:id', getSingleJob)//not auth needes
router.put('/:id', authMiddleware, roleMiddleware('recruiter'), updateJob)

router.delete('/:id', authMiddleware, roleMiddleware('recruiter'), deleteJob)


module.exports = router

