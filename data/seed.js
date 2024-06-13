import { Admin, Instructor, Resort, Lesson, Student, db } from "../server/model.js";
import adminData from "./adminData.json" assert { type: "json" };
import instructorData from "./instructorData.json" assert { type: "json" };
import lessonData from "./lessonData.json" assert { type: "json" };
import resortData from "./resortData.json" assert { type: "json" };
import studentData from "./studentData.json" assert { type: "json" };

const seedDatabase = async () => {
  await db.sync({ force: true });

  const adminsInDb = await Promise.all(
    adminData.map((admin) => {
      const { userName, password } = admin;
      const newAdmin = Admin.create({
        userName,
        password,
      });

      return newAdmin;
    })
  );
  const instructorsInDb = await Promise.all(
    instructorData.map((instructor) => {
      const {
        firstName,
        lastName,
        email,
        password,
        bio,
        location,
        certification,
        tags,
        venmo,
        cashapp,
        isClockedIn,
      } = instructor;

      const newInstructor = Instructor.create({
        firstName,
        lastName,
        email,
        password,
        bio,
        location,
        certification,
        tags,
        venmo,
        cashapp,
        isClockedIn,
      });

      return newInstructor;
    })
  );

  const studentsInDb = await Promise.all(
    studentData.map((student) => {
      const { firstName, lastName, email, password } = student;

      const newStudent = Student.create({
        firstName,
        lastName,
        email,
        password,
      });
      return newStudent;
    })
  );

  const resortsInDb = await Promise.all(
    resortData.map((resort) => {
      const { name, location, logo, banner } = resort;

      const newResort = Resort.create({
        name,
        location,
        logo,
        banner,
      });
      return newResort;
    })
  );

  const lessonsInDb = await Promise.all(
    lessonData.map((lesson) => {
      const { lessonType, date, time, location, instructorId, roster } = lesson;

      const newLesson = Lesson.create({
        lessonType,
        date,
        time,
        location,
        instructorId,
        roster,
      });
      return newLesson;
    })
  );

  await db.close();
};

seedDatabase().catch((error) => {
  console.error("Error during seeding:", error);
});
