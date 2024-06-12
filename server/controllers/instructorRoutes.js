import express from "express";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { Instructor } from "../model.js";

const router = express.Router();
const saltRounds = 10;

// instructor delete profile
router.post("/delete", async (req, res) => {
  await Instructor.destroy({
    where: {
      instructorId: req.session.instructorId,
    },
  });

  res.json(`User ${req.session.firstName} has been deleted`);

  req.session.destroy;
});

// instructor edit profiile
router.post("/edit", loginRequired, async (req, res) => {
  const { instructorId } = req.session;
  const { bio, location, certification } = req.body;

  //split certifications
  const parsedCertification = certification
    .split(",")
    .filter((cert) => cert.trim() == !"");

  console.log(instructorId);
  const instructor = await Instructor.findByPk(instructorId);

  // Only update the values that are provided in req.body
  instructor.bio = bio ?? instructor.bio;
  instructor.location = location ?? instructor.location;
  instructor.certification = parsedCertification ?? instructor.certification;

  await instructor.save();
  res.json(instructor);
});

// instructor private profile
router.get("/dashboard", loginRequired, async (req, res) => {
  const { instructorId } = req.session;
  const instructor = await Instructor.findByPk(instructorId);

  console.log(instructor.firstName);
  res.json(instructor);
});

// instructor login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const istructor = await Instructor.findOne({ where: { email: email } });

  if (istructor && istructor.password === password) {
    req.session.instructorId = istructor.instructorId;
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// post create instructor
router.post("/create", async (req, res) => {
  const {
    firstName,
    lastName,
    bio,
    location,
    certification,
    venmo,
    cashapp,
    email,
    password,
    profilePicture,
  } = req.body;

  //split certifications
  const parsedCertification = certification
    ? certification.split(",").filter((cert) => cert.trim() !== "")
    : [];
  // split tags
  // const parsedTags = tags ? tags.split(',').filter(tag => tag.trim() !== '') : [];

  const hashedPassword = await bcrypt.hash(password, saltRounds);


  // Create instructor
  const newInstructor = await Instructor.create({
    firstName,
    lastName,
    bio,
    location,
    certification: parsedCertification,
    venmo,
    cashapp,
    email,
    password: hashedPassword,
    profilePicture,
  });

  res.json(newInstructor);
});

// get instructor:id
router.get("/:instructorId", async (req, res) => {
  const { instructorId } = req.params;
  const istructor = await Instructor.findByPk(instructorId);
  res.json(istructor);
});

// get instructors based on location
router.get("/instructors-by-location", async (req, res) => {
  const { location } = req.query;
  try {
    const instructors = await Instructor.findAll({ where: { location } });
    res.json({ instructors });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch instructors", details: error.message });
  }
});

// top 5 instructors
router.get("/top-instructors", async (req, res) => {
  const topInstructors = await Instructor.findAll({
    // limit: 5,
  });

  res.json(topInstructors);
});

// search instructors
router.get("/search-instructors", async (req, res) => {
  const { query } = req.query;

  try {
    const instructors = await Instructor.findAll({
      where: {
        [Sequelize.Op.or]: [
          { firstName: { [Sequelize.Op.iLike]: `%${query}%` } },
          { lastName: { [Sequelize.Op.iLike]: `%${query}%` } },
          { email: { [Sequelize.Op.iLike]: `%${query}%` } },
          { location: { [Sequelize.Op.iLike]: `%${query}%` } },
          Sequelize.literal(
            `CONCAT("first_name", ' ', "last_name") ILIKE '%${query}%'`
          ),
        ],
      },
    });

    res.json(instructors);
  } catch (error) {
    console.error("Failed to search instructors", error);
    res.status(500).json({ error: "Failed to search instructors" });
  }
});

// check session
router.get("/check-instructor-session", (req, res) => {
  if (req.session.instructorId) {
    res.json({ instructorLoggedIn: true });
  } else {
    res.json({ instructorLoggedIn: false });
  }
});

export default router;
