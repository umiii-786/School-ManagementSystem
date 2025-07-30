const mongoose = require("mongoose")


const LectureSchema = mongoose.Schema({
    course: {
        type: String,
        required:true
    },
    semester_no: {
        type: Number,
        required:true
    },
    batch: {
        type: Number,
        required:true
    },
    department:{
        type:mongoose.Schema.ObjectId,
        ref:'Department'
    },
    last_attendence_data:{
        type:String,
        default:'not_conducted'
    }
})

const Lecture = mongoose.model('Lecture', LectureSchema)
module.exports.Lecture=Lecture