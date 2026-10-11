require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use(
  "/api/enrollments",
  require("./routes/enrollmentRoutes")
);
app.use("/api/lessons", require("./routes/lessonRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));
app.use("/api/quizzes", require("./routes/quizRoutes"));
app.use(
  "/api/mock-tests",
  require("./routes/mockTestRoutes")
);

app.use(
  "/api/results",
  require("./routes/resultRoutes")
);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
  });

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "GovPrep Backend API is running successfully",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`GovPrep server running on http://localhost:${PORT}`);
});