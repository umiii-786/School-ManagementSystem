
// const { required } = require('joi');
const mongoose=require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/School')
const Teacher_Schema=new mongoose.Schema({
    identity:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
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
        enum:["Male",'Female','Custom'],
        required:true
    },
    age:{
        type:Number,
        required:true,
        min:18,
        max:65
    },
    qualification:{
        type:String,
        enum:["Bachelor",'Master','PHD'],
        required:true
    },
    lectures:{
        type:[mongoose.Schema.ObjectId],
        ref:"Lecture",
        validate: {
            validator: function (v) {
                return v.length >= 0 && v.length <= 7;
            },
            message: 'Teacher can have atmost 7 courses'
        }
    } 
})
const Teacher=mongoose.model('Teacher',Teacher_Schema)
module.exports={
    Teacher,
}
// Teacher.insertMany(teachers).then((dt)=>console.log("inserted data"))