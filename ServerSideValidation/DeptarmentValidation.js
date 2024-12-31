const joi=require('joi');
const joiObjectid = require('joi-objectid');


const CourseSchemaValidation=joi.object({
    course_name:joi.string().required().trim(),
    coursecategory:joi.string().required().trim()
})

const SemesterValidation=joi.object({
    semesterNo:joi.number().min(1).max(4),
    semesterCourse:joi.array().items(CourseSchemaValidation)
})

const DeptSchemaValidation=joi.object({
    Department_name:joi.string().required(),
    semesters:joi.array().items(SemesterValidation).length(8)
})

module.exports.DeptSchemaValidation=DeptSchemaValidation;