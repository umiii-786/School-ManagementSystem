
const mongoose = require("mongoose")

const departmentSchema = mongoose.Schema({
    department_name: {
        type: String,
        required: true,
    },
    curriculum_image: {
        type: String,
        required: true
    },
    faculty_members: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Teacher',
        validate: {
            validator: function (v) {
                return v.length >= 0 && v.length <= 5;
            },
            message: 'Department Has Atmost 5 Faculty Member'
        }
    }

})

const Department = mongoose.model('Department', departmentSchema);
module.exports = {
    Department,
}
