const joi=require('joi');


const DeptSchemaValidation=joi.object({
    department_name:joi.string().required(),
    curriculum_image:joi.string().required()
    // semesters:joi.array().items(SemesterValidation).length(8)
})

module.exports.DeptSchemaValidation=DeptSchemaValidation;