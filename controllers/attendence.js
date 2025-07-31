 
 
 const {Teacher}=require('../models/Teacher')
 const {Student}=require('../models/student')
 const {Lecture}=require('../models/LectureModel')
 const {Attendence}=require('../models/AttendenceModel')
 
 async function showAttendencePortal (req, res,next) {
    const teacher_id=req.user.information
    console.log(teacher_id)
    const teacher = await Teacher.findById(teacher_id).populate({
        path: "lectures",
        populate: {
            path: 'department',
            model: 'Department'
        }
    })
    console.log(teacher)
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    console.log(teacher.lectures)
    res.render('Attendence/AttendencePortal', { lectures: teacher.lectures, current_date: formattedDate })
}

async function Add_Attendence_of_particular_lecture(req, res,next) {
    const check = AttendenceSchemaValidation.validate(req.body)
    if (check.error) {
        console.log("eror ha")
        throw new MyError(400, check.error.details[0].message)
    }
    console.log(check)

    const attendence = new Attendence(req.body);
    await Lecture.findByIdAndUpdate(attendence.lectureId, { last_attendence_data: attendence.Date })
    await attendence.save();
    res.redirect('/attendence');
}



async function ShowParticular_lecture_portal(req, res,next){
    const { lectureId } = req.params
    const lecture = await Lecture.findById(lectureId)
    console.log(lecture)
    const Students = await Student.find({ batch: lecture.batch, department: lecture.department }).sort({ Rollno: -1 }).populate('department');
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10); // Format: YYYY-MM-DD
    console.log(Students)
    console.log(formattedDate)
    console.log(lecture)
    res.render('Attendence/StudentAttendence', { Students, lecture, date: formattedDate })
}

module.exports={
        showAttendencePortal,
        Add_Attendence_of_particular_lecture,
        ShowParticular_lecture_portal

}