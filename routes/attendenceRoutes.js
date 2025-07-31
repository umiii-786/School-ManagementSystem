const express = require('express')
const router = express.Router()

const {
    showAttendencePortal,
    Add_Attendence_of_particular_lecture,
    ShowParticular_lecture_portal
} = require('../controllers/attendence')
const { wrapAsync ,IsLogin} = require('../middlewares')

router.get('/',wrapAsync(showAttendencePortal))
router.post('/',wrapAsync(Add_Attendence_of_particular_lecture))
router.get('/lecture/:lectureId',wrapAsync(ShowParticular_lecture_portal))

module.exports = router