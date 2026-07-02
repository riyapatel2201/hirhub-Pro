require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB  = require('./config/db')
//import authRoutes routes
const authRoutes= require('./routes/authRoutes')

const candidateRoutes = require('./routes/candidateRoutes')

const recruiterRoutes = require('./routes/recruiterRoutes')

const adminRoutes = require('./routes/adminRoutes')

const jobRoutes = require('./routes/jobRoutes')

const closeExpiredJobs = require('./jobs/closeExpiredJobs')

const applicationRoutes = require('./routes/applicationRoutes')

const app = express()
//middlewares
app.use(express.json())
app.use(cors())
//connect to app
app.use('/api/auth', authRoutes)
app.use('/api/candidate', candidateRoutes)
app.use('/api/recruiter',recruiterRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/applications',applicationRoutes)

connectDB() 
closeExpiredJobs()

app.get('/', (req, res) => {
    res.json({ message: 'HireHub Pro API is running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
