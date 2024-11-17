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

const classSchema = mongoose.Schema({
    className: {
        type: String,
        enum: ["One", 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Matrix', 'Intermediate-I', 'Intermediate-II'],
        required: true
    },
    subjects: {
        type: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "Lecture"
            }
        ],
        validate: {
            validator: function (v) {
                return v.length > 0 && v.length <= 7;
            },
            message: 'Courses must be 1 to 7'
        }
    },
    sections: {
        type: [
            {
                _id: false,
                section: String,
                classTeacher: String
            }

        ],
        validate: {
            validator: function (v) {
                return v.length > 0 && v.length == 2; // Constraint: Max 5 items
            },
            message: 'Class Can have Only Two Section'
        }
    }
})

const Class = mongoose.model('Class', classSchema)
module.exports = {
    Class,
    Lecture
} 