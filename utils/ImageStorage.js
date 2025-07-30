const multer = require('multer')


const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        const image_path = path.join(__dirname, 'public/profile_pics')
        console.log(image_path)
        cb(null, image_path)
    },
    filename: (req, file, cb) => {
        const filename = uuidv4() + file.originalname
        console.log(filename)
        cb(null, filename)
    }
})

const storage1 = multer.memoryStorage();
const upload = multer({ storage: storage1 });
const profile_upload = multer({ storage: storage2 });

module.exports={
    upload,profile_upload
}