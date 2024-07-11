import express from "express";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { Student } from "../model.js";


const router = express.Router();
const saltRounds = 10;

// student auth function
function studentLoginRequired(req, res, next) {
  if (!req.session.studentId) {
    res.status(401).json({ error: "Unauthorized" });
  } else {
    next();
  }
}

// get students
router.get("/students", async (req, res) => {
  const studentList = await Student.findAll();
  res.json(studentList);
});

// post create user
router.post("/create", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newStudent = await Student.create({
      firstName,
      lastName,
      email,
      password,
    });
    res.json(newStudent);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create student", details: error.message });
  }
});

// student login
router.post("/student-auth", async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await Student.findOne({ where: { email: email } });

    if (student && (await bcrypt.compare(password, student.password))) {
      req.session.studentId = student.studentId;
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to login", details: error.message });
  }
});

// student private profile
router.get("/student-profile", studentLoginRequired, async (req, res) => {
  const { studentId } = req.session;
  const session = req.session;
  const student = await Student.findByPk(studentId);

  console.log(session);
  res.json(student);
});

// student public profile
router.get("/:studentId", async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findByPk(studentId);
  res.json(student);
});

export default router