const {Department}=require('../models/DeptModel')
const {Teacher}=require('../models/Teacher')
const fs = require('fs');
const path = require('path')

function showAddDepartment(req, res){
    res.render('Department/AddDepartment.ejs')
}

async function AddDepartment (req, res,next) {
    const filePath = path.join('public', req.data.curriculum_image);
    fs.writeFileSync(filePath, req.file.buffer);
    const data = req.data
    console.log(data)
    const department = new Department(data)
    await department.save()
    req.flash('success', 'Department Has been Added Suceess')
    res.redirect('/department')
}

async function ManageDepartment (req, res,next){
    const data = await Department.aggregate([
        {
            $lookup: {
                from: "students",               // MongoDB collection name (lowercase, plural)
                localField: "_id",
                foreignField: "department",
                as: "students"
            }
        },
        {
            $project: {
                _id: 0,                         // Optional: hide MongoDB default _id
                departmentId: "$_id",
                departmentName: "$department_name",       // ✅ Add this line
                studentCount: { $size: "$students" }
            }
        }
    ]);


    console.log(data)
    res.render('Department/ManageDepartment.ejs', { data })
}

async function Particular_department  (req, res,next)  {
    const { id } = req.params
    console.log(id)
    const department = await Department.findById(id).populate('faculty_members')
    console.log(department)
    const teachers = await Teacher.find({ belong_to: { $exists: false } }).populate('identity')
    console.log(teachers)
    res.render('Department/eachDepartment.ejs', { department, teachers })
}

async function AddFaculty (req, res,next) {
    const { id } = req.params
    console.log('in the put request of department', id)
    const members = req.body.members.split(',')
    const updated = await Teacher.updateMany(
        { _id: { $in: members } },
        { $set: { belong_to: id } }
    );
    const department = await Department.updateOne(
        { _id: id },
        { $push: { faculty_members: { $each: members } } }
    );

    console.log(updated)
    console.log(department)
    res.redirect(`/department/${id}`)

}

module.exports={
    showAddDepartment,
    AddDepartment,
    ManageDepartment,
    Particular_department,
    AddFaculty
}