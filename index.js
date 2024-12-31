const express = require('express')
const { Student, } = require('./models/student')
const { Teacher, } = require('./models/Teacher')
const { User } = require('./models/users')
const { Department } = require('./models/DeptModel')
// const { Lecture } = require('./models/LectureModel')
const { Attendence } = require('./models/AttendenceModel')
const path = require('path')
const app = express()
const flash = require('connect-flash')
const engine = require('ejs-mate')
const expressSession = require("express-session")
const { userSchemaValidate } = require('./ServerSideValidation/userValidation')
const { studentschemaValidate } = require('./ServerSideValidation/studentValidation')
const { AttendenceSchemaValidation } = require('./ServerSideValidation/attendenceValidation')
const { MyError } = require("./ServerSideValidation/MyError")
const methodride = require('method-override')
const multer = require('multer')
const { teacherSchemaValidation } = require('./ServerSideValidation/TeacherValidation')
const { DeptSchemaValidation } = require('./ServerSideValidation/DeptarmentValidation')
const { v4: uuidv4 } = require('uuid');
const passport = require('passport')
const passportLocal = require('passport-local')
const cookieParser = require('cookie-parser')
const { format } = require('date-fns');
// console.log(passportLocal)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        const filename = uuidv4() + file.originalname
        cb(null, filename)
    }
})
const upload = multer({ storage })

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.engine('ejs', engine)
app.use(express.static('public'))
app.use(express.urlencoded({ extends: false }))
app.use(methodride('_method'))
app.use(cookieParser())




// app.use(methodride('_method'))
function wrapAsync(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => { console.log(err,); next(err) })
    }
}

app.use(expressSession({
    secret: "helloworld",
    saveUninitialized: true,
    resave: false
}))


app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// console.log(new passportLocal({ usernameField: 'cnic' },User.authenticate()))
passport.use(new passportLocal({ usernameField: 'cnic' }, User.authenticate()))
app.use(flash())



app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.enteredData = req.session.enteredData ? req.session.enteredData : {};
    res.locals.class_data = req.session.preserved_class_data ? req.session.preserved_class_data : "";
    console.log(res.locals.class_data)
    res.locals.name = "umair"

    // console.log(req.cookies.theme)

    next()
})


app.delete('/student/:id', async (req, res) => {
    const { id } = req.params
    const data = await Student.findByIdAndDelete(id)
    res.send('hoya delete ya nhi ')
})

app.get('/', (req, res) => {
  
    res.cookie('theme', req.cookies.theme ? req.cookies.theme : "light")
    res.render('dashborad/overall.ejs')
})

// app.get('/student', async (req, res) => {
//     const classes = await Class.find({});
//     console.log("hello ma run hoya ")
//     // res.locals.enteredData = req.session.enteredData ? req.session.enteredData : "Default Value";
//     res.render('Student/addstudent', { classes })
// })


// async function checkRollno(req, res, next) {
//     const { Rollno, section } = req.body;
//     const className = req.body.class;
//     const EachClass = await Class.findOne({ className: className })
//     const data = await Student.find({ Rollno: Rollno, section: section, class: EachClass._id })
//     console.log(data)
//     if (data.length > 0) {
//         req.session.enteredData = req.body
//         req.flash("error", 'This Rollno is Already Taken to the Student')
//         res.redirect('/student')
//         return;
//     }

//     next()
// }

// async function CheckTeacherName(req, res, next) {
//     const req_data = req.body;
//     const check = await Teacher.find({ username: req_data.username })
//     console.log(check)
//     if (check.length > 0) {
//         req.flash('error', 'Make your name Litte bit different because having already Teacher with Same name')
//         req.session.enteredData = req.body
//         res.redirect('/teacher')
//         return;
//     }
//     next()
// }


function UserValidate(req, res, next) {
    let role = req.originalUrl.substr(1, 7)
    role = role.charAt(0).toUpperCase() + role.substr(1)

    const userModel_data = {
        cnic: req.body.cnic ? req.body.cnic : "",
        password: req.body.password ? req.body.password.trim() : "",
        Role: role,
    }
    const check = userSchemaValidate.validate(userModel_data)
    if (check.error) { throw new MyError(400, check.error.details[0].message); }
    req.userModel_data = userModel_data
    next()
}
function StudentValidate(req, res, next) {
    let data = { ...req.body };
    data.cnic ? delete data.cnic : "",
        data.password ? delete data.password : "";
    const check = studentschemaValidate.validate(data)
    if (check.error) { throw new MyError(400, check.error.details[0].message); }
    next()
}

function TeacherValidate(req, res, next) {
    let data = { ...req.body };
    data.cnic ? delete data.cnic : "", data.password ? delete data.password : "";
    const check = teacherSchemaValidation.validate(data)
    if (check.error) { throw new MyError(400, check.error.details[0].message); }
    console.log(req.body)
    next()
}

// function lectureValidate(req, res, next) {

//     let subjects = req.body.subjects
//     let classname = subjects[0].CorrespondClass
//     let allsubject = []
//     for (let i = 0; i < subjects.length; i++) {

//         const check = lectureSchemaValidation.validate(subjects[i])

//         if (check.error) {
//             throw new MyError(400, check.error.details[0].message)
//         }

//         if (classname != subjects[i].CorrespondClass) {
//             throw new MyError(400, "All Subject Must be of Same Class")
//         }
//         allsubject.push(subjects[i].subject)
//     }
//     console.log(allsubject)
//     const findDuplicates = allsubject.filter((item, index) => allsubject.indexOf(item) !== index);
//     if (findDuplicates.length > 0) {
//         req.session.preserved_class_data = req.body
//         console.log(req.session.preserved_class_data)
//         req.flash("error", "All Subject's Must be Unique")
//         res.redirect('/class/add')
//         return;
//     }
//     next()
// }

// function IsLogin(req, res, next) {
//     if (req.user) {
//         next()
//         return;
//     }
//     res.redirect('/login')
// }

// async function checkCnic(req, res, next) {
//     const { cnic } = req.body;
//     console.log(req.body)
//     const data = await User.find({ cnic: cnic })
//     if (data.length > 0) {
//         req.session.enteredData = req.body
//         req.flash("error", 'This Cnic is Already Registered')
//         res.redirect(req.originalUrl)
//         return;
//     }
//     next()
// }

// app.post('/student', UserValidate, StudentValidate, checkCnic, checkRollno, wrapAsync(async (req, res, next) => {

//     const req_data = req.body
//     // console.log(req.userModel_data)
//     const { password } = req.userModel_data

//     let user = new User(req.userModel_data)
//     user = await user.setPassword(password)
//     delete req.body.password, delete req.body.cnic;
//     const detail = req.body
//     detail.identity = user._id

//     const selected_class = await Class.findOne({ className: detail.class })
//     detail.class = selected_class._id
//     const stud = new Student(detail)
//     user.information = stud._id
//     await stud.save()
//     await user.save()
//     req.flash("success", "Student Added Successfully")
//     req.session.enteredData = {}
//     res.redirect('/student')
// }))



// app.get('/student/TC', (req, res) => {
//     res.send("Tc")
// })

// app.get('/student/manage', async (req, res) => {
//     let querries = req.query
//     console.log(querries)
//     let filter = {}
//     let check = false
//     let data = []
//     for (const key in querries) {
//         if (querries[key]) {
//             if (querries[key] == 'All') {
//                 continue;
//             }
//             filter[key] = querries[key]
//             check = true
//         }
//     }
//     if (filter.class) {
//         const classdata = await Class.findOne({ className: filter.class })
//         console.log(classdata)
//         if (classdata == null) {
//             req.flash("error", "Data is Not Available")
//             return res.redirect('/student/manage');
//         }
//         filter.class = classdata ? classdata._id : ""
//     }
//     console.log(filter)
//     if (check) {
//         data = await Student.find(filter).populate('identity').populate('class')
//     }
//     else data = await Student.find({}).populate('identity').populate('class')
//     console.log(data)
//     res.render('Student/managestudent', { data })
// })

// app.get('/student/:id', wrapAsync(async (req, res, next) => {
//     console.log('ma run hoya hn')
//     const { id } = req.params
//     const data = await Student.findById(id).populate('identity').populate('class')
//     let correctdate = new Date(data.DOB)
//     correctdate = correctdate.toLocaleDateString();
//     console.log("ma run hoya hu")
//     res.render('Student/studentProfile.ejs', { data, correctdate })
// }))

// app.put('/student/:id', StudentValidate, wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     const data = await Student.findById(id).populate('identity');
//     const { username, father_name, DOB, cnic, phone, Rollno, gender } = req.body;
//     if (cnic != data.identity.cnic) {
//         const check = await User.find({ cnic: cnic })
//         if (check && check.length > 0) {
//             req.flash("error", 'This Cnic is already Of Another User Enter valid Cnic')
//             res.redirect(`/student/edit/${id}`)
//             return;
//         }
//     }

//     if (Rollno != data.Rollno) {
//         const check = await Student.find({ class: req.body.class, Rollno: Rollno })
//         if (check && check.length > 0) {
//             req.flash("error", 'This Roll is already Assign to Another Student')
//             res.redirect(`/student/edit/${id}`)
//             return;
//         }
//     }
//     data.username = username
//     data.identity.cnic = cnic;
//     data.gender = gender;
//     data.father_name = father_name;
//     data.phone = phone;
//     data.Rollno = Rollno;
//     data.DOB = DOB


//     await data.save()
//     console.log(req.body)
//     console.log(data)
//     res.redirect(`/student/${id}`)
// }))


// app.get("/student/edit/:id", wrapAsync(async (req, res) => {
//     const { id } = req.params
//     const data = await Student.findById(id).populate('identity').populate('class')
//     res.render("Student/editstudent.ejs", { data })

// }))

// app.patch('/student/:id/pic', upload.single('profileImg'), wrapAsync(async (req, res, next) => {
//     const { id } = req.params
//     const stud = await Student.findById(id)
//     stud.profileImg = '/images/' + req.file.filename
//     await stud.save()
//     res.redirect(`/student/${id}`)
// }))

// app.get('/teacher', (req, res) => {
//     res.render('teacher/addTeacher')
// })
// app.post('/teacher', UserValidate, TeacherValidate, checkCnic, CheckTeacherName, wrapAsync(async (req, res, next) => {
//     const { password } = req.userModel_data

//     let user = new User(req.userModel_data)
//     user = await user.setPassword(password)
//     delete req.body.cnic, delete req.body.password
//     const teacher = new Teacher(req.body)
//     teacher.identity = user._id
//     user.information = teacher._id
//     await teacher.save()
//     await user.save()
//     req.flash("success", "Teacher Added Successfully")
//     req.session.enteredData = {}
//     res.redirect('/teacher')
// }))



app.get('/Department', async (req, res) => {


    // let Allclasses = ["One", "Two", "Three", "Four", "Five",
    //     "Six", "Seven", "Eight", "Nine", "Matrix", "Intermediate-I", "Intermediate-II"]
    // const Created_Classes = await Class.find({}).populate('subjects')
    // if (Created_Classes.length > 0) {
    //     for (let i = 0; i < Created_Classes.length; i++) {
    //         if (Allclasses.includes(Created_Classes[i].className)) {
    //             Allclasses = Allclasses.filter((ele) => ele != Created_Classes[i].className)
    //         }
    //     }
    // }
    // let Available_teachers = await Teacher.find({})
    // console.log(Available_teachers)
    // let preserved_class_data = ""
    res.render('Department/AddDepartment.ejs',)
})


// app.post('/class/add', wrapAsync(async (req, res) => {
//     const req_data = req.body
//     console.log(req_data)
//    console.log(ClassSchemaValidation.validate(req_data))

//     // for (let i = 0; i < req_data.subjects.length; i++) {
//     //     console.log(req_data.subjects[i])
//     //     const lecture = new Lecture(req_data.subjects[i])
//     //     console.log(lecture)
//     //     req_data.subjects[i] = lecture._id
//     //     let teacher_data = await Teacher.findOne({ username: lecture.subjectTeacher })
//     //     teacher_data.lectures.push(lecture._id)
//     //     await teacher_data.save()
//     //     await lecture.save()
//     // }
//     // console.log(req_data.subjects)
//     // const newclass = await Class(req_data)
//     // await newclass.save()
//     req.flash('success', "Class successfully created!  ")
//     req.session.preserved_class_data = ""
//     res.redirect("/class/add")
// }))



// app.get('/class/manage', async (req, res) => {
//     const querries = req.query
//     let filter = {}
//     let check = false
//     // let data = {}
//     for (const key in querries) {
//         if (querries[key]) {
//             if (querries[key] == 'All') {
//                 continue;
//             }
//             filter[key] = querries[key]
//             check = true
//         }
//     }
//     console.log(filter)
//     // let querries = req.query
//     // let filter = {}
//     // let data = []
//     // for (const key in querries) {
//     //     if (querries[key]) {
//     //         if(querries[key]=='All'){
//     //             continue;
//     //         }
//     //         filter[key] = querries[key]
//     //     }
//     // }
//     // console.log(querries)
//     // console.log(Object.keys(filter).length)
//     // if(Object.keys(filter).length>0){
//     //     console.log(filter)
//     // }
//     // else{
//     //     console.log(" nhi hn bro ", filter)
//     // }
//     // let classdata = 'All;'
//     // data = await Class.find({ class: classdata == 'All' ? '' : classdata })
//     // console.log(data)
//     let data = []
//     res.render('Class/Manageclass', data)
// })


// app.get('/attendence', async (req, res) => {

//     // const teacher=req.user
//     // teacher=await teacher.populate({
//     //         path:"information",
//     //         populate:{
//     //             path:"lectures"
//     //         }
//     //     })

//     // console.log(teacher)
//     console.log(req.user)
//     const teacher = await Teacher.findById(req.user.information).populate({
//         path: "lectures"
//     })
//     console.log(teacher)

//     console.log(await Attendence.find({ lectureId: { $in: teacher.lectures }, lastTaken: true }))

//     // const teacher_data=await User.findById(req.user._id).populate({
//     //     path: 'information',
//     //     populate: {
//     //       path: 'lectures',
//     //     },
//     //   })
//     // console.log(teacher)
//     // console.log(teacher_data)

//     res.render('Attendence/AttendencePortal', { lectures: teacher.lectures })
// })

// app.post('/attendence', async (req, res) => {
//     const check = AttendenceSchemaValidation.validate(req.body)
//     if (check.error) {
//         console.log("eror ha")
//         throw new MyError(400, check.error.details[0].message)
//     }
//     const attendence = new Attendence(req.body);
//     const updated = await Attendence.updateMany({ lectureId: attendence.lectureId }, { $set: { lastTaken: false } })
//     await attendence.save();
//     res.redirect('/attendence');
// })

// app.get('/attendence/lecture/:lectureId/section/:section', async (req, res) => {
//     const { lectureId, section } = req.params
//     const lecture = await Lecture.findById(lectureId)
//     const classData = await Class.findOne({ className: lecture.CorrespondClass })
//     const Students = await Student.find({ class: classData._id, section: section }).sort({ Rollno: -1 });

//     const currentDate = new Date();
//     const formattedDate = currentDate.toISOString().slice(0, 10); // Format: YYYY-MM-DD
//     console.log(formattedDate);

//     console.log(Students)
//     res.render('Attendence/StudentAttendence', { Students, lecture, date: formattedDate })
// })

// app.get('/login', (req, res) => {


//     res.cookie('theme', req.cookies.theme ? req.cookies.theme : "light")
//     res.render('Login.ejs')
// })

// app.post("/login", passport.authenticate('local', {
//     failureRedirect: "/login",
//     failureFlash: "Invalid Cnic or Password"
// }), (req, res) => {
//     req.flash("success", "Logged in Successfully")
//     res.redirect('/')
// })
// app.get("/logout", (req, res) => {
//     req.logOut((err) => {
//         if (err) {
//             throw new MyError(400, "Some thing Went Wrong");
//         }
//         console.log(err)
//         res.redirect('/login')
//     })
// })


app.post('/check', (req, res) => {
    console.log(req.body)
    res.send("ok")
})

app.get('*', (req, res,) => {
    throw new MyError(404, "Page Not Found")
})
app.post("*", (req, res) => {
    throw new MyError(404, "Route Not Found")
})

app.use((err, req, res, next) => {
    console.log("ma run hoya ")
    const { message = "Bad Request" } = err
    const { status = 404 } = err
    res.render("Error.ejs", { status, message })
})
app.listen(80, (req, res) => {
    console.log('listend at http://localhost/')
})