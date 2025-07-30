require('dotenv').config()
const express = require('express')
const { Student} = require('./models/student')
const { Teacher, } = require('./models/Teacher')
const { User } = require('./models/users')
const { Department } = require('./models/DeptModel')
const {Connect_To_DB}=require('./connection')
const path = require('path')
const app = express()
const flash = require('connect-flash')
const expressSession = require("express-session")
const methodride = require('method-override')
const passport = require('passport')
const passportLocal = require('passport-local')
const cookieParser = require('cookie-parser')
const engine = require('ejs-mate');
const userRoutes=require('./routes/userRoutes')
console.log('every thing is right ')
const teacherRoutes=require('./routes/teacherRoutes')
const departmentRoutes=require('./routes/departmentRoutes')
const attendenceRoutes=require('./routes/attendenceRoutes')

const {IsLogin,PopulateLoginUser,setFlashMessages,ErrorHandled_Middleware}=require('./middlewares')
const {UserValidate}=require('./middlewares/validationMiddlewares')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.engine('ejs', engine)
app.use(express.static('public'))
app.use(express.urlencoded({ extends: false }))
app.use(express.json())
app.use(methodride('_method'))
app.use(cookieParser())

app.use(expressSession({
    secret: "helloworld",
    saveUninitialized: true,
    resave: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
passport.use(new passportLocal({ usernameField: 'cnic' }, User.authenticate()))

const db_url=process.env.MONGO_URL
Connect_To_DB(db_url).then(()=> console.log('connected to db'))

app.use(PopulateLoginUser)
app.use(flash())
app.use(setFlashMessages)

const PORT=process.env.PORT || 8000

app.get('/', IsLogin, async (req, res) => {
    const students = await Student.find({})
    const teachers = await Teacher.find({})
    const department = await Department.find({})
    res.cookie('theme', req.cookies.theme ? req.cookies.theme : "light")
    res.render('dashborad/overall.ejs', { no_of_students: students.length, no_of_teachers: teachers.length, no_of_departments: department.length })
})

app.post('/admin', UserValidate, async (req, res) => {
    console.log(req.userModel_data)
    const { password } = req.userModel_data
    let user = new User(req.userModel_data)
    user = await user.setPassword(password)
    console.log(user)
    await user.save()
    console.log('admin created')
    res.send('done created')
})

app.post('/check/user', async (req, res) => {
    const { cnic } = req.body;
    console.log(req.body)
    const data = await User.find({ cnic: cnic.trim() })
    if (data.length > 0) {
        return res.send('exist');
    }
    else {
        return res.send('not_exist')
    }
})

app.get('/Questgpt', IsLogin, (req, res) => {
    res.render('QuestBot/quest_bot.ejs')
})

app.get('/login', (req, res) => {
    res.cookie('theme', req.cookies.theme ? req.cookies.theme : "light")
    res.render('Login.ejs')
})

app.post("/login", passport.authenticate('local', {
    failureRedirect: "/login",
    failureFlash: "Invalid Cnic or Password"
}), (req, res) => {
    req.flash("success", "Logged in Successfully")
    res.redirect('/')
})
app.get("/logout", (req, res) => {
    req.logOut((err) => {
        if (err) {
            throw new MyError(400, "Some thing Went Wrong");
        }
        console.log(err)
        res.redirect('/login')
    })
})

app.use('/student',userRoutes)
app.use('/teacher',teacherRoutes)
app.use('/department',departmentRoutes)
app.use('/attendence',attendenceRoutes)

app.get('*', (req, res,) => {
    throw new MyError(404, "Page Not Found")
})
app.post("*", (req, res) => {
    throw new MyError(404, "Route Not Found")
})

app.use(ErrorHandled_Middleware)
app.listen(PORT, (req, res) => {
    console.log(`istend at http://localhost/${PORT}`)
})