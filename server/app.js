import express from "express";
import session from "express-session";
import morgan from "morgan";
import { Sequelize } from "sequelize";
import { createServer } from "http";
import { Server } from "socket.io";
import ViteExpress from "vite-express";
// import routes
import adminRoutes from "./controllers/adminRoutes.js";
import instructorRoutes from "./controllers/instructorRoutes.js";
import reviewRoutes from "./controllers/reviewRoutes.js";
import lessonRoutes from "./controllers/lessonRoutes.js";
import resortRoutes from "./controllers/resortRoutes.js";
import studentRoutes from "./controllers/studentRoutes.js";
import { Instructor, Student } from "./model.js"; // Import your Sequelize models
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = "8000";
ViteExpress.config({ printViteDevServerHost: true });

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:8000"], // Replace with your actual front-end URL(s)
    methods: ["GET", "POST"],
  },
});

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({ secret: "ssshhhhh", saveUninitialized: true, resave: false })
);

// student auth function
function studentLoginRequired(req, res, next) {
  if (!req.session.studentId) {
    res.status(401).json({ error: "Unauthorized" });
  } else {
    next();
  }
}

// routes

// admin routes
app.use("/api/admin", adminRoutes);
// instructor routes
app.use("/api/instructors", instructorRoutes);
// student routes
app.use("/api/students", studentRoutes);
// review routes
app.use("/api/review", reviewRoutes);
// lesson routes
app.use("/api/lessons", lessonRoutes);
// resort routes
app.use("/api/resorts", resortRoutes);

// search instructors
app.get("/api/search-instructors", async (req, res) => {
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

    // student private profile
    router.get(
      "/api/student-dashboard",
      studentLoginRequired,
      async (req, res) => {
        const { studentId } = req.session;
        const session = req.session;
        const student = await Student.findByPk(studentId);

        console.log(session);
        res.json(student);
      }
    );

    res.json(instructors);
  } catch (error) {
    console.error("Failed to search instructors", error);
    res.status(500).json({ error: "Failed to search instructors" });
  }
});

// end routes

ViteExpress.listen(app, port, () =>
  console.log(`Server is listening on http://localhost:${port}`)
);

server.listen(8001, () => {
  console.log("Socket.io server is listening on http://localhost:8001");
});
