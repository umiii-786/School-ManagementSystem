const Joi = require('joi');
const JoiObjectId = require('joi-objectid')(Joi);

const LectureschemaValidate = Joi.object({
    course: Joi.string().required().trim(),
    semester_no: Joi.number().required(),
    batch: Joi.number().required(),
    department: JoiObjectId().required()
});

module.exports.LectureschemaValidate=LectureschemaValidate;