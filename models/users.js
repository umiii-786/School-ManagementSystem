const mongoose=require("mongoose")
const passportLocaLMongoose=require('passport-local-mongoose')
const userSchema=mongoose.Schema({
    cnic:{
        type:Number,
        required:true,
        unique:true
    },
    Role:{
        type:String,
        enum: ["Student", "Teacher", "Admin"],
        required:true
    },
    information:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:"Role"
    }
})

userSchema.plugin(passportLocaLMongoose,{ usernameField: 'cnic' })
const User=mongoose.model('User',userSchema)
module.exports={
    User, 
}




