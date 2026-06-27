const express = require('express')
const router = express.Router()

const { approveRecruiters, getAllRecruiters } = require('../controllers/adminController')
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware')

// Get all recruiters
router.get('/recruiters', authMiddleware, roleMiddleware('admin'), getAllRecruiters)

// Approve recruiter by ID
router.put('/approve/:recruiterId', authMiddleware, roleMiddleware('admin'), approveRecruiters)

module.exports = router