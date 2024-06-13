import express from "express";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { Resort } from "../model.js";

const router = express.Router();
const saltRounds = 10;

// get resorts
router.get("/all-resorts", async (req, res) => {
  const resortLIist = await Resort.findAll();

  res.json(resortLIist);
});

//get resort by id
router.get("/:resortId", async (req, res) => {
  const { resortId } = req.params;
  const resort = await Resort.findByPk(resortId);

  res.json(resort);
});

export default router;
