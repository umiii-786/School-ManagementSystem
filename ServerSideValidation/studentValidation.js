const joi=require('joi')
const studentschemaValidate=joi.object({
    username:joi.string().required().trim(),
    father_name:joi.string().required().trim(),
    phone:joi.number().required(),
    gender:joi.string().valid("Male","Female","Custom").required(),
    DOB:joi.string().required().trim(),
    class:joi.string().required().trim(),
    section:joi.string().required().trim(),
   
})

module.exports.studentschemaValidate=studentschemaValidate;

