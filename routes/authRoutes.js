const express = require('express')
const router = express.Router()
//import register function from controller
const {register, login, verifyEmail,forgotPassword, resetPassword} = require('../controllers/authController')

//POST/api/auth/register
router.post('/register', register)
router.post('/login', login )
router.post('/verify-Email', verifyEmail)
router.post('/forgot', forgotPassword)
router.post('/reset',resetPassword)

module.exports = router;

