import express from "express";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { Instructor } from "../model.js";
import Sequelize from "sequelize";

const router = express.Router();
const saltRounds = 10;

// login required
function instructorLoginRequired(req, res, next) {
    if (!req.session.instructorId) {
        res.status(401).json({ error: 'Unauthorized' });
    } else {
        next();
    }
}

// instructor delete profile
router.post("/delete", instructorLoginRequired, async (req, res) => {
    try {
        await Instructor.destroy({
            where: {
                instructorId: req.session.instructorId,
            },
        });

        res.json(`User ${req.session.firstName} has been deleted`);

        req.session.destroy((err) => {
            if (err) {
                console.error('Failed to destroy session:', err);
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete profile', details: error.message });
    }
});

// instructor edit profile
router.post("/edit", instructorLoginRequired, async (req, res) => {
    const { instructorId } = req.session;
    const { bio, location, certification } = req.body;

    //split certifications
    const parsedCertification = certification
        .split(",")
        .filter((cert) => cert.trim() !== "");

    try {
        const instructor = await Instructor.findByPk(instructorId);

        if (!instructor) {
            return res.status(404).json({ error: 'Instructor not found' });
        }

        // Only update the values that are provided in req.body
        instructor.bio = bio ?? instructor.bio;
        instructor.location = location ?? instructor.location;
        instructor.certification = parsedCertification.length ? parsedCertification : instructor.certification;

        await instructor.save();
        res.json(instructor);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile', details: error.message });
    }
});

// instructor dashboard
router.get("/dashboard", instructorLoginRequired, async (req, res) => {
    const { instructorId } = req.session;

    try {
        const instructor = await Instructor.findByPk(instructorId);

        if (!instructor) {
            return res.status(404).json({ error: 'Instructor not found' });
        }

        res.json(instructor);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard', details: error.message });
    }
});

// instructor login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const instructor = await Instructor.findOne({ where: { email: email } });

        if (instructor && await bcrypt.compare(password, instructor.password)) {
            req.session.instructorId = instructor.instructorId;
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to login', details: error.message });
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

    try {
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
    } catch (error) {
        res.status(500).json({ error: 'Failed to create instructor', details: error.message });
    }
});

// get instructor by id
router.get("/:instructorId", async (req, res) => {
    const { instructorId } = req.params;

    try {
        const instructor = await Instructor.findByPk(instructorId);

        if (!instructor) {
            return res.status(404).json({ error: 'Instructor not found' });
        }

        res.json(instructor);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch instructor', details: error.message });
    }
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
router.get("/", async (req, res) => {
    try {
        const allInstructors = await Instructor.findAll({
            // limit: 5,
        });

        res.json(allInstructors);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch instructors', details: error.message });
    }
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
