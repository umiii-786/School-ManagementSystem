const mongoose=require("mongoose")
const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
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

module.exports.User=mongoose.model('User',userSchema)




