const joi=require('joi')
const teacherSchemaValidation=joi.object({
    father_name:joi.string().required(),
    cnic:joi.number().required(),
    phone:joi.number().required(),
    gender:joi.string().valid("Male","Female","Custom").required(),
    age:joi.number().min(18).max(65).required(),
    qualification:joi.string().valid("Bachelor",'Master','PHD').required(),


})

module.exports.teacherSchemaValidation=teacherSchemaValidation;