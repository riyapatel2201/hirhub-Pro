const express = require('express')

const router = express.Router()

const {updateProfile, getProfile, uploadLogo} =require('../controllers/recruiterController')
const {authMiddleware, roleMiddleware} = require('../middleware/authMiddleware')

const upload = require('../middleware/uploadMiddleware')

//profile routes
router.get('/profile', authMiddleware, roleMiddleware('recruiter'), getProfile)

router.put('/profile', authMiddleware, roleMiddleware('recruiter'), updateProfile)

//upload company logo
router.put('/upload-logo', authMiddleware, roleMiddleware('recruiter'), upload.single('logo'), uploadLogo)

module.exports = router


