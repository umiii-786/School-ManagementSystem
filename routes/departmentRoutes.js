const express=require('express')
const router=express.Router()
const { IsLogin, wrapAsync } = require('../middlewares')

const {
    showAddDepartment,
    AddDepartment,
    ManageDepartment,
    Particular_department,
    AddFaculty
}=require('../controllers/department')

const {upload}=require('../utils/ImageStorage')
const {department_validate}=require('../middlewares/validationMiddlewares')


router.get('/', IsLogin,showAddDepartment )


router.post('/', IsLogin, upload.single('curriculum'), department_validate,wrapAsync(AddDepartment))

router.get('/manage', IsLogin,wrapAsync(ManageDepartment))

router.get('/:id',IsLogin,wrapAsync(Particular_department))

router.put('/:id', IsLogin,wrapAsync(AddFaculty))

module.exports=router