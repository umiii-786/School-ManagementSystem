
const { required } = require('joi')
const mongoose=require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/School')
const Schema=new mongoose.Schema({
    identity:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    father_name:{
        type:String,
        required:true
    },
    cnic:{
        type:Number,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        required:true
    },

    profileImg:{
        type:String,
        default:"/images/profilelogo.png",
        set :(v)=>v==""?"/images/profilelogo.png":v
    },
    DOB:{
        type:Date,
        required:true
    },  
    class:{
        type:mongoose.Schema.ObjectId,
        ref:"Class",
        required:true
    },
    section:{
        type:String,
        required:true
    },
    Rollno:{
        type:Number,
        required:true
    },
    AddmissionDate:{
        type:Date,
        default:Date.now
    }
})



const Student=mongoose.model('Student',Schema)
module.exports.Student=Student