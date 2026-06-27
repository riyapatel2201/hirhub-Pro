const express = require('express')
const router = express.Router()

const {updateProfile, getProfile, uploadPhoto, uploadResume} = require('../controllers/candidateController')

const {authMiddleware, roleMiddleware} = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')
//prfile routes
router.put('/profile', authMiddleware, roleMiddleware('candidate'), updateProfile)

router.get('/profile', authMiddleware, roleMiddleware('candidate'), getProfile)

//upload routes
router.put('/upload-photo', authMiddleware, roleMiddleware('candidate'), upload.single('photo'), uploadPhoto)

router.put('/upload-resume', authMiddleware, roleMiddleware('candidate'), upload.single('resume'), uploadResume)



module.exports = router