const mongoose = require("mongoose")


const LectureSchema = mongoose.Schema({
    CorrespondClass: {
        type: String,
    },
    subject: {
        type: String
    },
    subjectTeacher: {
        type: String
    }
})

const Lecture = mongoose.model('Lecture', LectureSchema)
module.exports.Lecture=Lecture