const {User}=require('../models/users')
function wrapAsync(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => { console.log(err,); next(err) })
    }
}


async function PopulateLoginUser (req, res, next) {
    if (req.user) {
        const newuser = await User.findById(req.user._id).populate('information')
        req.user = newuser
    }
    next()

}


function setFlashMessages (req, res, next) {
    res.locals.itself = undefined
    if (req.user) {
        res.locals.itself = req.user
    }
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
}

function ErrorHandled_Middleware(err, req, res, next)  {
    console.log("ma run hoya ")
    const { message = "Bad Request" } = err
    const { status = 404 } = err
    res.render("Error.ejs", { status, message })
}


function IsLogin(req, res, next) {
    if (req.user) {
        next()
        return;
    }
    res.redirect('/login')
}
module.exports={
    IsLogin,
    wrapAsync,
    PopulateLoginUser,
    setFlashMessages,
    ErrorHandled_Middleware
}