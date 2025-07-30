
const { userSchemaValidate } = require('../ServerSideValidation/userValidation')
const { studentschemaValidate } = require('../ServerSideValidation/studentValidation')
const { AttendenceSchemaValidation } = require('../ServerSideValidation/attendenceValidation')
const { teacherSchemaValidation } = require('../ServerSideValidation/TeacherValidation')
const { DeptSchemaValidation } = require('../ServerSideValidation/DeptarmentValidation')
const { LectureschemaValidate } = require('../ServerSideValidation/LectureValidation')
const { v4: uuidv4 } = require('uuid');
const {Department}=require('../models/DeptModel')



function UserValidate(req, res, next) {
    let role = req.originalUrl.substr(1, 7)
    role = role.charAt(0).toUpperCase() + role.substr(1)

    const userModel_data = {
        cnic: req.body.cnic ? req.body.cnic.trim() : "",
        password: req.body.password ? req.body.password.trim() : "",
        Role: role,
    }
    const check = userSchemaValidate.validate(userModel_data)
    console.log(check)
    if (check.error) { throw new MyError(400, check.error.details[0].message); }
    req.userModel_data = userModel_data
    next()
}

function StudentValidate(req, res, next) {
    let data = { ...req.body };
    data.cnic ? delete data.cnic : "",
        data.password ? delete data.password : "";
    const check = studentschemaValidate.validate(data)
    console.log('in student validation ', check)
    if (check.error) { throw new MyError(400, check.error.details[0].message); }
    next()
}

function TeacherValidate(req, res, next) {
    console.log(req.body)
    let data = { ...req.body };
    data.cnic ? delete data.cnic : "", data.password ? delete data.password : "";
    const check = teacherSchemaValidation.validate(data)
    if (check.error) { throw new MyError(400, check.error.details[0].message); }
    console.log(req.body)
    next()
}

function lectureValidate(req, res, next) {
    const data = req.body
    console.log('in the lect val', data)
    const check = LectureschemaValidate.validate(data)
    if (check.error) { throw new MyError(400, check.error.details[0].message); }
    next()
}


async function department_validate(req, res, next) {
    console.log(req.body)
    console.log(req.file)

    deptname = req.body.Department_name
    deptname = deptname.trim().toLowerCase()
    curriculum_url = '/uploads/' + uuidv4() + req.file.originalname
    console.log(deptname)
    let data = { 'department_name': deptname, 'curriculum_image': curriculum_url }
    const check = DeptSchemaValidation.validate(data)
    if (check.error) { throw new MyError(400, check.error.details[0].message); }

    const check_in_db = await Department.find({ department_name: deptname })
    if (check_in_db.length > 0) {
        req.flash('error', 'This Department is already exist in Database')
        return res.redirect('/department')
    }
    req.data = data
    next()

}

module.exports={
    UserValidate,
    StudentValidate,
    TeacherValidate,
    lectureValidate,
    department_validate
}