const express = require('express')
const { Student } = require('./models/student')
const { Teacher } = require('./models/Teacher')
const { User } = require('./models/users')
const { Class, Lecture } = require('./models/classModel')
const path = require('path')
const app = express()
const flash = require('connect-flash')
const engine = require('ejs-mate')
const expressSession = require("express-session")
const {userSchemaValidate}=require('./ServerSideValidation/userValidation')
const {studentschemaValidate}=require('./ServerSideValidation/studentValidation')
const cookiePaser = require('cookie-parser')
const {MyError}=require("./ServerSideValidation/MyError")
const methodOveride=require('method-override')

const { teacherSchemaValidation } = require('./ServerSideValidation/TeacherValidation')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.engine('ejs', engine)
app.use(express.static('public'))
app.use(express.urlencoded({ extends: false }))



app.use(expressSession({
    secret: "helloworld",
    saveUninitialized: true,
    resave: false
}))
app.use(cookiePaser("helloworld"))

app.use(flash())
app.use(methodOveride('_method'))

app.use((req, res, next) => {
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    
    res.locals.enteredData=req.session.enteredData?req.session.enteredData:{};
    // console.log(res.locals.enteredData)
    next()
})


app.get('/', (req, res) => { 
    res.render('dashborad/overall.ejs')
})
app.get('/student', async (req, res) => {
    const classes = await Class.find({});
    // res.locals.enteredData = req.session.enteredData ? req.session.enteredData : "Default Value";
    res.render('Student/addstudent', { classes })
})


async function checkInDatabase(req, res, next) {
    const req_data = req.body
    const check = await User.find({}).populate('information');
    for (let i = 0; i < check.length; i++) {
        if (check[i].information.cnic == req_data.cnic) {
            req.session.enteredData=req_data
            req.flash("error", 'User With Same Id Number Already Exists')
            return res.redirect(req.originalUrl)
        } 
        if(req.originalUrl.includes('student')){
            if(check[i].information.Rollno==req_data.Rollno && check[i].information.class==req_data.class){
                console.log(req_data)
                req.session.enteredData=req_data
                req.flash("error", 'This rollno is Already Assign to the Student in that Class')
                return res.redirect(req.originalUrl)

            }
        }
        
    }
    console.log("not existed ")
    next()
}

function UserValidate(req,res,next){
    let role=req.originalUrl.substr(1,7)
    role=role.charAt(0).toUpperCase()+role.substr(1)

    const userModel_data = {
        username: req.body.username?req.body.username.trim():"",
        password: req.body.password?req.body.password.trim():"",
        Role: role,
    }
    const check=userSchemaValidate.validate(userModel_data)
    if(check.error){throw new MyError(400,check.error.details[0].message) }
    req.userModel_data=userModel_data
    next()

}
function StudentValidate(req,res,next){
    let data={...req.body};
    data.username?delete data.username:"",
    data.password?delete data.password:"";
    const check=studentschemaValidate.validate(data)
    if(check.error) { throw new MyError(400,check.error.details[0].message)}
    next()
}

function TeacherValidate(req,res,next){
    let data={...req.body};
    data.username?delete data.username:"", data.password?delete delete data.password:"";
    const check=teacherSchemaValidation.validate(data)
    if(check.error){throw new MyError(400,check.error.details[0].message)}
    console.log(req.body)
    next()
}


app.post('/student',UserValidate,StudentValidate,checkInDatabase,async (req, res) => {
    const user = new User(req.userModel_data)
    const detail = req.body
    detail.identity = user._id
    console.log(req.body)
    const selected_class = await Class.findOne({ className: detail.class })
    detail.class = selected_class._id
    const stud = new Student(detail)
    user.information = stud._id

    await stud.save()
    await user.save()
    req.flash("success","Student Added Successfully")
    req.session.enteredData={}
    res.redirect('/student/add')
})



app.get('/student/manage', async (req, res) => {
    let querries = req.query
    console.log(querries)
    let filter = {}
    let check = false
    let data = []
    for (const key in querries) {
        if (querries[key]) {
            if(querries[key]=='All'){
                continue;
            }
            filter[key] = querries[key]
            check = true
        }
    }
    if(filter.class){
        const classdata=await Class.findOne({className:filter.class})
        filter.class=classdata?classdata._id:""
    }
    console.log(filter)
    if (check){
        data=await Student.find(filter).populate('identity').populate('class')
    } 
    else  data=await Student.find({}).populate('identity').populate('class')
    console.log(data)
    res.render('Student/managestudent', {data})
})


app.get('/student/:id',async(req,res)=>{
    const {id}=req.params
    const data=await Student.findById(id).populate('identity').populate('class')
    let correctdate=new Date(data.DOB)
    correctdate=correctdate.toLocaleDateString();
    console.log("ma run hoya hu")
    res.render('Student/studentProfile.ejs',{data,correctdate})
})
app.put('/student/:id',(req,res)=>{
    const {id}=req.params;
    console.log(id,req.body)
    res.send("received Requests ")
})
app.get("/student/edit/:id",async(req,res)=>{
       const {id}=req.params
       const data=await Student.findById(id).populate('identity').populate('class')
       const Available_Classes=await Class.find({})
       console.log(Available_Classes)
       res.render("Student/editstudent.ejs",{data,Available_Classes})
})

app.get('/teacher/add', (req, res) => {
    res.render('teacher/addTeacher')
})
app.post('/teacher/add',UserValidate,TeacherValidate ,checkInDatabase,async (req, res) => {
    delete req.body.name, delete req.body.password
    const teacher = new Teacher(req.body)
    const user = new User(req.userModel_data)
    teacher.identity = user._id
    user.information = teacher._id
    await teacher.save()
    await user.save()
    req.flash("success","Teacher Added Successfully")
    req.session.enteredData={}
    res.redirect('/teacher/add')
})


app.get('/check', async (req, res) => {
    console.log(await Teacher.findOne({ father_name: 'sarwar' }).populate('lectures'))
})
app.get('/student/TC', (req, res) => {
    res.send("Tc")
})


app.get('/class/add', async (req, res) => {
    let Allclasses = ["One", "Two", "Three", "Four", "Five",
        "Six", "Seven", "Eight", "Nine", "Matrix", "Intermediate-I", "Intermediate-II"]
    const Created_Classes = await Class.find({})
    for (let i = 0; i < Created_Classes.length; i++) {
        if (Allclasses.includes(Created_Classes[i].className)) {
            Allclasses = Allclasses.filter((ele) => ele != Created_Classes[i].className)
        }
    }
    let Available_teachers = await User.find({ Role: "Teacher" })
    res.render('Class/AddClass.ejs', { Allclasses, Available_teachers })
})

app.post('/class/add', async (req, res) => {
    const req_data = req.body
    console.log(req_data)

    for (let i = 0; i < req_data.subjects.length; i++) {
        const lecture = await new Lecture(req_data.subjects[i])
        req_data.subjects[i] = lecture._id
        user_data = await User.findOne({ username: lecture.subjectTeacher, Role: "Teacher" })
        teacher_data = await Teacher.findById(user_data.information)
        teacher_data.lectures.push(lecture._id)
        await teacher_data.save()
        await lecture.save()
    }
    const newclass = await Class(req_data)
    await newclass.save()
    res.redirect("/class/add")
})


app.get('/class/manage', async (req, res) => {
    // let querries = req.query
    // let filter = {}
    let data = []
    // for (const key in querries) {
    //     if (querries[key]) {
    //         if(querries[key]=='All'){
    //             continue;
    //         }
    //         filter[key] = querries[key]
    //     }
    // }
    // console.log(querries)
    // console.log(Object.keys(filter).length)
    // if(Object.keys(filter).length>0){
    //     console.log(filter)
    // }
    // else{
    //     console.log(" nhi hn bro ", filter)
    // }
    let classdata = 'All;'
    data = await Class.find({ class: classdata == 'All' ? '' : classdata })
    console.log(data)
    res.render('Class/Manageclass', data)
})


app.get('/login', (req, res) => {
    res.render('Login.ejs')
})

app.get('*',(req,res,)=>{
    throw new MyError(404,"Page Not Found")
})
app.post("*",(req,res)=>{
    throw new MyError(404,"Route Not Found")
})

app.use((err,req,res,next)=>{
    const {message="Bad Request"}=err
    const {status=404}=err
    res.render("Error.ejs",{status,message})
})
app.listen(80, (req, res) => {
    console.log('listend')
})