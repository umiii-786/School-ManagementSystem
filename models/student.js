const mongoose=require('mongoose')
// mongoose.connect('mongodb://127.0.0.1:27017/School')
const StudentSchema=new mongoose.Schema({
    identity:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    username:{
        type:String,
        required:true
    },
    father_name:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        required:true,
        enum:["Male",'Female','Custom']
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
    
    department:{
        type:mongoose.Schema.ObjectId,
        ref:"Department"
    },
    Rollno:{
        type:Number,
        required:true
    },
    AddmissionDate:{
        type:Date,
        default:Date.now
    },
})


StudentSchema.pre('findOneAndDelete',(next)=>{
    console.log("id ha bro kya kr ha ha ")
    
    
})

const Student=mongoose.model('Student',StudentSchema)
module.exports={
    Student,
}