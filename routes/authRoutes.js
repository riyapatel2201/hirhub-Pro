const express = require('express')
const router = express.Router()
//import register function from controller
const {register, login, verifyEmail,forgotPassword, resetPassword} = require('../controllers/authController')
//import authMiddleware
const {authMiddleware, roleMiddleware}= require('../middleware/authMiddleware')

//

//POST/api/auth/register
router.post('/register', register)
router.post('/login', login )
router.post('/verify-Email', verifyEmail)
router.post('/forgot', forgotPassword)
router.post('/reset',resetPassword)

//test protected route
router.get('/me', authMiddleware, (req, res) => {
    res.json({
        message: 'You are logged in!',
        user: req.user

    })

})



module.exports = router;

