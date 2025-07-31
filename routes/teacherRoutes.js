const express = require('express')
const router = express.Router()
const { IsLogin, wrapAsync } = require('../middlewares')
const { UserValidate, TeacherValidate, lectureValidate } = require('../middlewares/validationMiddlewares')
console.log(IsLogin,wrapAsync)
const {
    TeacherForm,
    addTeacher,
    filterTeacher,
    getParticularTeacher,
    EditParticularTeacher,
    deleteParticularTeacher,
    showTeacher_EditPage,
    AddCourses
} = require('../controllers/teacher')

router.get('/', IsLogin,TeacherForm)
router.post('/',IsLogin, UserValidate, TeacherValidate, wrapAsync(addTeacher))
// console.log('good in teche')
router.get('/manage',IsLogin, wrapAsync(filterTeacher))
router.get('/:id',IsLogin, wrapAsync(getParticularTeacher))
router.put('/:id',IsLogin, wrapAsync(EditParticularTeacher))
router.delete('/:id',IsLogin ,wrapAsync(deleteParticularTeacher))


router.get("/edit/:id",IsLogin,  wrapAsync(showTeacher_EditPage))

router.post('/:id/course',IsLogin, lectureValidate, wrapAsync(AddCourses))

module.exports = router
