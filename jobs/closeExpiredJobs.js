const cron = require('node-cron')

const Job = require('../models/Job')

const closeExpiredJobs = () => {
    //run every day at midnight
    cron.schedule('0 0 * * *', async () => {
        try {
            //find all jobs where deadline has passed and not already closed
            const result = await Job.updateMany(
                {
                    deadline: {$lt: new Date()},
                    isClosed: false
                },
                {isClosed: true}
            )

            console.log(`Auto-closed ${result.modfifiedCount} expired jobs`)
        } catch (error) {
            console.log('Error Closing expired jobs:', error.message)
        }
    })
}
module.exports = closeExpiredJobs