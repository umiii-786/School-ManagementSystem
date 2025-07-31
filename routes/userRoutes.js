
const express=require('express')
const router=express.Router()
const { wrapAsync } = require("../middlewares")
const {profile_upload}=require('../utils/ImageStorage')

const {showStudentPage,CreateStudent,FilterStudent,getParticularStudent,
    EditParticularStudent,deleteParticularStudent,getParticular_student_EditPage,editStudentProfile
}=require('../controllers/user')




const {IsLogin}=require('../middlewares/index')
const {UserValidate,StudentValidate}=require('../middlewares/validationMiddlewares')

router.get('/',wrapAsync(showStudentPage))
router.post('/', UserValidate, StudentValidate,wrapAsync(CreateStudent))
router.get('/manage',wrapAsync(FilterStudent ))
router.get('/:id',wrapAsync( getParticularStudent))
router.put('/:id', StudentValidate,wrapAsync(EditParticularStudent))
router.delete('/:id',wrapAsync(deleteParticularStudent))
router.get("/edit/:id", wrapAsync(getParticular_student_EditPage))
router.patch('/:id/pic', profile_upload.single('profileImg'),wrapAsync(editStudentProfile ))


module.exports=router