const joi=require('joi')
const teacherSchemaValidation=joi.object({
    username:joi.string().required().trim(),
    father_name:joi.string().required().trim(),
    phone:joi.number().required(),
    gender:joi.string().valid("Male","Female","Custom").required(),
    age:joi.number().min(18).max(65).required(),
    qualification:joi.string().valid("Bachelor",'Master','PHD').required(),
    post:joi.string().valid("Lecturer",'Assistant Professor','Associate Professor','Professor').required(),
})

module.exports.teacherSchemaValidation=teacherSchemaValidation;