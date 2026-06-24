require('dotenv').config()
console.log(process.env)


const express = require('express')
const cors = require('cors')
const connectDB  = require('./config/db')

const app = express()
//middlewares
app.use(express.json())
app.use(cors())

connectDB()

app.get('/', (req, res) => {
    res.json({ message: 'HireHub Pro API is running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
