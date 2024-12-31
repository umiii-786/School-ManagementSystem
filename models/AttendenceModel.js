
const { required } = require('joi')
const mongoose=require('mongoose')
const { validate } = require('uuid')


// Each student attendence Object schema 

const attendence_record_schema=mongoose.Schema({
    _id:false,
    status:{
        type:String,
        required:true,
        enum:['L','P','A']
    },
    studId:{
        type:mongoose.Schema.ObjectId,
        ref:"Student",
        required:true
    }
})

const attendenceSchema=mongoose.Schema({
    lectureId:{
        type:mongoose.Schema.ObjectId,
         ref:"Lecture",
         required:true
     },
    attendenceStudent:{
        type:[attendence_record_schema],
        validate:function (v) {
            return v.length > 0
        },
        message: 'attendence record will not be empty'
    },
    lastTaken:{
        type:Boolean,
        default:true,
    },
    Date:{
        type:String,
        required:true
    }
})

module.exports.Attendence=mongoose.model('Attendence',attendenceSchema)


