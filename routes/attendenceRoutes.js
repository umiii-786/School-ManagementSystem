const express = require('express')
const router = express.Router()

const {
    showAttendencePortal,
    Add_Attendence_of_particular_lecture,
    ShowParticular_lecture_portal
} = require('../controllers/attendence')
const { wrapAsync ,IsLogin} = require('../middlewares')

router.get('/', IsLogin,wrapAsync(showAttendencePortal))
router.post('/', IsLogin,wrapAsync(Add_Attendence_of_particular_lecture))
router.get('/lecture/:lectureId', IsLogin,wrapAsync(ShowParticular_lecture_portal))

module.exports = router