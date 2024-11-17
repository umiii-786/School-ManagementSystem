const mongoose=require("mongoose")

const SectionSchema=mongoose.Schema({
    className:{
        type:mongoose.Schema.ObjectId,
        ref:"Class"
    },
    section:{
        type:String,
        enum:['A','B'],
        required:true
    },
    classTeacher:{
        type:String,
        required:true
    }
})

module.exports.Section=mongoose.model('Section',SectionSchema)