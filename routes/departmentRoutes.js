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


router.get('/',showAddDepartment )


router.post('/', upload.single('curriculum'), department_validate,wrapAsync(AddDepartment))

router.get('/manage',wrapAsync(ManageDepartment))

router.get('/:id',wrapAsync(Particular_department))

router.put('/:id',wrapAsync(AddFaculty))

module.exports=router