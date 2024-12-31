
const mongoose=require('mongoose')
const semesterScheme=mongoose.Schema({
    semesterNo:{
        type:Number,
        required:true,
        min:1,
        max:4
    },
    semesterCourse:{
        type:[{
            _id:false,
            course_name:{
                type:String,
                required:true,
            },
            coursecategory:{
                type:String,
                required:true,
            } 
        }]
    }
})
const Semester=mongoose.model('Semester',semesterScheme)