const joi=require('joi');
const joiObjectId=require('joi-objectid')(joi)
const attendencObjectSchema=joi.object({
    status:joi.string().valid('A','P','L').required(),
    studId:joiObjectId().required(),
  
})

const AttendenceSchemaValidation=joi.object({
    attendenceStudent:joi.array().items(attendencObjectSchema).min(1),
    Date:joi.string().required() ,
    lectureId:joiObjectId().required()
})

module.exports.AttendenceSchemaValidation=AttendenceSchemaValidation;