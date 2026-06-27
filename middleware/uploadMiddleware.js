const multer = require('multer')

//store file in memory temporarily
//why memory?because we'll send directly to cloudinary

const storage = multer.memoryStorage()

const upload = multer({
    storage,
    limits: {
        fileSize:5 * 1024 * 1024 //5MB max
    },
    fileFilter: (req, file, cb)=> {
        //allow only images and pdfs
        if(
            file.mimetype === 'image/jpeg' || 
            file.mimetype === 'image/png' ||
            file.mimetype === 'application/pdf'
        ) {
            cb(null, true)
        }else {
            cb(new Error('Only images and PDFs allowed!'), false)//reject
        }
    }
})
module.exports = upload