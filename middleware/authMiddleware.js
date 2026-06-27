const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authMiddleware = async (req, res, next) => {
    try{
        //stap 1 get token from header
        const authHeader = req.headers.authorization

        //step 2 check if token exist
        if(!authHeader || !authHeader.startsWith('Bearer')){
            return res.status(401).json({message: 'No token provided'})
        }
        //step 3 extract token
        //bearer kjiiv..=> split by space and take the second part
        const token = authHeader.split(' ')[1]

        //step 4 Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        //step 5 Find user from BD
        const user = await User.findById(decoded.id)
        if(!user){
            return res.status(401).json({message:' User not found'})
        }
        //step 6 attach user to request
        req.user = user

        //step 7 allow request to continue
        next()
    } catch (error){
        res.status(401).json({message: 'Invalid token'})
    }
}
//take roles as input
const roleMiddleware = (...roles) => {
    //return actual middleware function
    return (req, res, next) => {
        //check if user's role is in allowed roles
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                message:'Access denied. Not authorized.'
            })
        }
        //role is allowed- continue!
        next()
    }
}
module.exports = {authMiddleware, roleMiddleware}
