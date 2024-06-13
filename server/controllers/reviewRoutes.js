import express from "express";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { Review, Student } from "../model.js";

const router = express.Router();

// get all reviews
router.get("/reviews", async (req, res) => {
  //const { instructorId } = req.session {where: {reviews: instructorId}}
  const reviewsList = await Review.findAll();
  res.json(reviewsList);
});

// post create review
router.post("/:instructorId/leave-review", async (req, res) => {
  const { studentId } = req.session;
  const { instructorId } = req.params;
  const { name, reviewMessage, stars } = req.body;

  const student = await Student.findByPk(studentId);

  // create new review
  const newReview = await Review.create({
    instructorId: instructorId,
    name: name,
    reviewMessage: reviewMessage,
    stars: stars,
    studentId: student.studentId
  });
  res.json(newReview);
});

// get reviews for specific instructor
router.get("/:instructorId/reviews", async (req, res) => {
  const { instructorId } = req.params;

  try {
    const reviews = await Review.findAll({ where: { instructorId } });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "An error occurred while fetching reviews" });
  }
});

export default router;
