const {Attendence}=require('../models/AttendenceModel')
const {Lecture}=require('../models/LectureModel')

async function getAttendenceRecord(studentId) {

    const attendances = await Attendence.find({
        "attendenceStudent.studId": studentId
    })

    const lectureIds = attendances.map(a => a.lectureId);
    const lectures = await Lecture.find({
        _id: { $in: lectureIds }
    })

    const lectureMap = {};
    lectures.forEach(l => {
        lectureMap[l._id.toString()] = l;
    });

    // Process and group by course
    const courseStats = {};

    attendances.forEach(a => {
        const lecture = lectureMap[a.lectureId.toString()];
        const studentRecord = a.attendenceStudent.find(s =>
            s.studId.toString() === studentId
        );

        const courseName = lecture?.course || 'Unknown';

        if (!courseStats[courseName]) {
            courseStats[courseName] = {
                courseName: courseName,
                totalClasses: 0,
                present: 0,
                absent: 0,
                leave: 0
            };
        }

        courseStats[courseName].totalClasses += a.no_of_classes;

        switch (studentRecord.status) {
            case 'P':
                courseStats[courseName].present += a.no_of_classes;
                break;
            case 'A':
                courseStats[courseName].absent += a.no_of_classes;
                break;
            case 'L':
                courseStats[courseName].leave += a.no_of_classes;
                break;
        }
    });

    // Calculate percentages and convert to array
    const result = Object.values(courseStats).map(course => ({
        ...course,
        attendancePercentage: course.totalClasses > 0
            ? Math.round((course.present / course.totalClasses) * 100)
            : 0
    }));

    return result


}

module.exports={
    getAttendenceRecord
}