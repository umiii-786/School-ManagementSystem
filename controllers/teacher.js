const {Department}=require('../models/DeptModel')
const {Teacher}=require('../models/Teacher')
const {Lecture}=require('../models/LectureModel')
const {User}=require('../models/users')

function TeacherForm(req, res){
    res.render('teacher/addTeacher')
}
async function addTeacher(req, res, next) {
    const { password } = req.userModel_data

    let user = new User(req.userModel_data)
    user = await user.setPassword(password)
    delete req.body.cnic, delete req.body.password
    const teacher = new Teacher(req.body)
    teacher.identity = user._id
    user.information = teacher._id
    await teacher.save()
    await user.save()
    req.flash("success", "Teacher Added Successfully")
    req.session.enteredData = {}
    res.redirect('/teacher')
}


async function filterTeacher(req, res,next) {
    let querries = req.query
    const departmentNames = await Department.find({}, 'department_name');
    console.log(querries)
    let check = false
    let filter = {}
    let data = []
    let department = ''

    if (Object.keys(querries).length > 0) {

        for (const key in querries) {
            if (querries[key]) {
                if (querries[key] == 'All') {
                    check = true
                    continue;
                }
                if (key == 'department') {
                    department = querries[key]
                    continue
                }
                filter[key] = querries[key]
            }
        }
        console.log(filter)
        data = await Teacher.find(filter).populate('identity')
        console.log(data)
    }
    res.render('Teacher/manageTeacher.ejs', { departmentNames, data })
}

async function getParticularTeacher(req, res, next)  {
    const { id } = req.params
    const data = await Teacher.findById(id).populate('identity').populate('belong_to').populate('lectures')
    console.log(data)
    res.render('Teacher/teacherProfile.ejs', { data })
}

async function EditParticularTeacher (req, res,next){
    const { id } = req.params;
    const data = { ...req.body }
    delete data.cnic, delete data.lectures
    const check = teacherSchemaValidation.validate(data)
    if (check.error) { throw new MyError(400, check.error.details[0].message); }
    const previousTeacher = await Teacher.findById(id).populate('identity');
    if (req.body.cnic != previousTeacher.identity.cnic) {
        const check = await User.find({ cnic: req.body.cnic })
        if (check && check.length > 0) {
            req.flash("error", 'This Cnic is already Of Another User Enter valid Cnic')
            res.redirect(`/teacher/edit/${id}`)
            return;
        }
    }
    const newdata=req.body
    for (const key in newdata) {
        console.log(key)
        if (key == 'cnic') {
            previousTeacher.identity[key] = newdata[key]
        }
        else {
            previousTeacher[key] =newdata[key]
        }
    }
    console.log('after check all the conditions ')
    console.log('previous Teacher Record ')
    console.log(previousTeacher)
    console.log('current updated Data ')
    console.log(req.body)
    await previousTeacher.save()
    res.redirect(`/teacher/${id}`)
}

async function deleteParticularTeacher(req,res,next){
    console.log('teacher delete request')
    const {id}=req.params
    await Teacher.findByIdAndDelete(id)
    console.log(id)
    res.redirect('/teacher/manage')
}
async function showTeacher_EditPage (req, res,next) {
    const { id } = req.params
    const data = await Teacher.findById(id).populate('identity').populate('belong_to').populate('lectures')
    res.render("Teacher/editTeacher.ejs", { data })

}

async function AddCourses (req, res, next) {
    const { id } = req.params
    const data = req.body
    data.course = data.course.trim()
    const check_in_db = await Lecture.find(data)
    console.log(check_in_db)
    if (check_in_db.length > 0) {
        req.flash('error', 'This course is Already Assigned to Another Teacher in that Batch')
        res.redirect(`/teacher/${id}`)
        return

    }
    else {
        const lecture = new Lecture(data)
        const teacher = await Teacher.updateOne(
            { _id: id },
            { $push: { lectures: lecture._id } }
        );
        await lecture.save()
        console.log(lecture)
    }
    res.redirect(`/teacher/${id}`)

}

console.log('hello from last line ')

module.exports={
    TeacherForm,
    addTeacher,
    filterTeacher,
    getParticularTeacher,
    EditParticularTeacher,
    deleteParticularTeacher,
    showTeacher_EditPage,
    AddCourses
}