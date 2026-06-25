const express = require('express')
const router = express.Router()
//import register function from controller
const {register} = require('../controllers/authController')
//POST/api/auth/register
router.post('/register', register)

module.exports = router;

