const joi=require("joi")

const userSchemaValidate=joi.object({
    cnic:joi.number().required(),
    password:joi.string().required(),
    Role:joi.string().valid('Student','Teacher','Admin').required()
})

module.exports.userSchemaValidate=userSchemaValidate