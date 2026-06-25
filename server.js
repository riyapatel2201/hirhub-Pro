require('dotenv').config()


const express = require('express')
const cors = require('cors')
const connectDB  = require('./config/db')
//import authRoutes routes
const authRoutes= require('./routes/authRoutes')

const app = express()
//middlewares
app.use(express.json())
app.use(cors())
//connect to app
app.use('/api/auth', authRoutes)

connectDB() 

app.get('/', (req, res) => {
    res.json({ message: 'HireHub Pro API is running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
