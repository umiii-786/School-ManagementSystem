const {Department}=require('../models/DeptModel')
const {User}=require('../models/users')
const {Student}=require('../models/student')
const {getAttendenceRecord}=require('../utils/utils')

async function showStudentPage(req, res,next) {
    const departments = await Department.find({})
    res.render('Student/addstudent', { departments })
}



async function CreateStudent (req, res,next) {
        const req_data = req.body
        const { password } = req.userModel_data
        let user = new User(req.userModel_data)
        user = await user.setPassword(password)
        delete req.body.password, delete req.body.cnic;
        const detail = req.body
        detail.identity = user._id

        const selected_class = await Department.findOne({ department_name: req.body.department })
        console.log('adding or setting department in student pofile ')
        console.log(selected_class)
        detail.department = selected_class._id
        const stud = new Student(detail)
        user.information = stud._id
        await stud.save()
        await user.save()
        req.flash("success", "Student Added Successfully")
        res.redirect('/student')
    }


async function FilterStudent (req, res,next){
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
            if (check) {
                data = await Student.find(filter).populate('department')
                console.log('populating')
            }
            else {
                console.log('else run hoya ')
                const target_dept = await Department.findOne({ department_name: department })
                console.log(target_dept)
                filter['department'] = target_dept._id
                data = await Student.find(filter).populate('department')
            }
        }
        console.log(filter)
        console.log(data)
        res.render('Student/managestudent', { departmentNames, data })
    }


async function getParticularStudent  (req, res, next) {
        console.log('ma run hoya hn')
        const { id } = req.params
        const data = await Student.findById(id).populate('identity').populate('department')
        console.log(data)
        let correctdate = new Date(data.DOB)
        correctdate = correctdate.toLocaleDateString();
        console.log(id)
        const attendenceRecord = await getAttendenceRecord(id)

        console.log("ma run hoya hu")
        res.render('Student/studentProfile.ejs', { data, correctdate, attendenceRecord })
    }

async function EditParticularStudent  (req, res,next){
        const { id } = req.params;
        const data = await Student.findById(id).populate('identity');
        const { username, father_name, DOB, cnic, phone, rollno, gender, batch, department } = req.body;
        if (cnic != data.identity.cnic) {
            const check = await User.find({ cnic: cnic })
            if (check && check.length > 0) {
                req.flash("error", 'This Cnic is already Of Another User Enter valid Cnic')
                res.redirect(`/student/edit/${id}`)
                return;
            }
        }
        if (rollno != data.rollno) {
            const check = await Student.find({ department: department, rollno: rollno, batch: batch })
            if (check && check.length > 0) {
                req.flash("error", 'This Roll is already Assign to Another Student')
                res.redirect(`/student/edit/${id}`)
                return;
            }
        }
        data.username = username
        data.identity.cnic = cnic;
        data.gender = gender;
        data.father_name = father_name;
        data.phone = phone;
        data.rollno = rollno;
        data.DOB = DOB

        await data.save()
        console.log(req.body)
        console.log(data)
        res.redirect(`/student/${id}`)
    }

async function deleteParticularStudent  (req,res,next) {
        const {id}=req.params
        await Student.findByIdAndDelete(id)
        console.log(id)
        res.redirect('/student/manage')
}



async function getParticular_student_EditPage  (req, res,next) {
        const { id } = req.params
        const data = await Student.findById(id).populate('identity').populate('department')
        res.render("Student/editstudent.ejs", { data })
}


async function editStudentProfile (req, res, next){
    const { id } = req.params
    const stud = await Student.findById(id)
    stud.profileImg = '/profile_pics/' + req.file.filename
    await stud.save()
    res.redirect(`/student/${id}`)
}


module.exports = {
    showStudentPage,
    CreateStudent,
    FilterStudent,
    getParticularStudent,
    EditParticularStudent,
    deleteParticularStudent,
    getParticular_student_EditPage,
    editStudentProfile
}