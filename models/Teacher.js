
// const { required } = require('joi');
const mongoose = require('mongoose')
const { User } = require('./users')
const { Lecture } = require('./LectureModel')
const { Department } = require('./DeptModel')
mongoose.connect('mongodb://127.0.0.1:27017/School')
const Teacher_Schema = new mongoose.Schema({
    identity: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    username: {
        type: String,
        required: true
    },
    father_name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ["Male", 'Female', 'Custom'],
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 18,
        max: 65
    },
    qualification: {
        type: String,
        enum: ["Bachelor", 'Master', 'PHD'],
        required: true
    },
    post: {
        type: String,
        enum: ["Lecturer", 'Assistant Professor', 'Associate Professor', 'Professor'],
        required: true
    },
    belong_to: {
        type: mongoose.Schema.ObjectId,
        ref: 'Department'
    },
    profileImg: {
        type: String,
        default: "/images/profilelogo.png",
        set: (v) => v == "" ? "/images/profilelogo.png" : v
    },
    lectures: {
        type: [mongoose.Schema.ObjectId],
        ref: "Lecture",
        validate: {
            validator: function (v) {
                return v.length >= 0 && v.length <= 7;
            },
            message: 'Teacher can have atmost 7 courses'
        }
    }
})

Teacher_Schema.post('findOneAndDelete', async function (doc) {
    // const Teacher=await Teacher.find
    console.log('in the post')
    console.log(doc)
    const userId = doc.identity;
    const lectures = doc.lectures
    const belong_to = doc.belong_to
    const teacherId = doc._id
    await Lecture.deleteMany({
        _id: { $in: lectures }
    });
    await User.findByIdAndDelete(userId);
    await Department.updateOne(
        { _id: belong_to },
        { $pull: { faculty_members: teacherId } }
    );
    return
});
const Teacher = mongoose.model('Teacher', Teacher_Schema)
module.exports = {
    Teacher,
}
