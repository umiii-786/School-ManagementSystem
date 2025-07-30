
const express=require('express')
const router=express.Router()
const { wrapAsync } = require("../middlewares")
const {profile_upload}=require('../utils/ImageStorage')

const {showStudentPage,CreateStudent,FilterStudent,getParticularStudent,
    EditParticularStudent,deleteParticularStudent,getParticular_student_EditPage,editStudentProfile
}=require('../controllers/user')




const {IsLogin}=require('../middlewares/index')
const {UserValidate,StudentValidate}=require('../middlewares/validationMiddlewares')

router.get('/', IsLogin,wrapAsync(showStudentPage))
router.post('/', IsLogin, UserValidate, StudentValidate,wrapAsync(CreateStudent))
router.get('/manage', IsLogin,wrapAsync(FilterStudent ))
router.get('/:id', IsLogin,wrapAsync( getParticularStudent))
router.put('/:id', IsLogin, StudentValidate,wrapAsync(EditParticularStudent))
router.delete('/:id',wrapAsync(deleteParticularStudent))
router.get("/edit/:id", IsLogin, wrapAsync(getParticular_student_EditPage))
router.patch('/:id/pic', IsLogin, profile_upload.single('profileImg'),wrapAsync(editStudentProfile ))


module.exports=router