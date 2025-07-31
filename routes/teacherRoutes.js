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

router.get('/', TeacherForm)
router.post('/', UserValidate, TeacherValidate, wrapAsync(addTeacher))
// console.log('good in teche')
router.get('/manage', wrapAsync(filterTeacher))
router.get('/:id', wrapAsync(getParticularTeacher))
router.put('/:id', wrapAsync(EditParticularTeacher))
router.delete('/:id' ,wrapAsync(deleteParticularTeacher))


router.get("/edit/:id",  wrapAsync(showTeacher_EditPage))

router.post('/:id/course', lectureValidate, wrapAsync(AddCourses))

module.exports = router
