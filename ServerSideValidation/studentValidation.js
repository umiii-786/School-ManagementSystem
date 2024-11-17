const joi=require('joi')
const studentschemaValidate=joi.object({
    // identity:joi.string().required(),
    father_name:joi.string().required(),
    cnic:joi.number().required(),
    phone:joi.number().required(),
    gender:joi.string().required(),
    DOB:joi.string().required(),
    class:joi.string().required(),
    section:joi.string().required(),
    Rollno:joi.number().required()
})

module.exports.studentschemaValidate=studentschemaValidate;

