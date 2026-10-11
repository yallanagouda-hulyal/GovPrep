const express = require("express");

const Course = require("../models/Course");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// GET ALL COURSES
// Public
// ==========================================

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().sort({
      createdAt: -1,
    });

    res.status(200).json(courses);
  } catch (error) {
    console.error("Fetch courses error:", error.message);

    res.status(500).json({
      message: "Failed to fetch courses.",
      error: error.message,
    });
  }
});

// ==========================================
// GET SINGLE COURSE
// Public
// ==========================================

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error("Fetch course error:", error.message);

    res.status(500).json({
      message: "Failed to fetch course.",
      error: error.message,
    });
  }
});

// ==========================================
// CREATE COURSE
// Admin / Instructor only
// ==========================================

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "instructor"),
  async (req, res) => {
    try {
      const {
        exam,
        title,
        description,
        image,
        lessons,
        students,
        duration,
        level,
      } = req.body;

      // Validate required fields
      if (
        !exam ||
        !title ||
        !description ||
        !image ||
        !lessons ||
        !duration ||
        !level
      ) {
        return res.status(400).json({
          message:
            "Exam, title, description, image, lessons, duration and level are required.",
        });
      }

      const course = await Course.create({
        exam,
        title,
        description,
        image,
        lessons,
        students: students || "0 Students",
        duration,
        level,
      });

      res.status(201).json({
        message: "Course created successfully.",
        course,
      });
    } catch (error) {
      console.error("Create course error:", error.message);

      res.status(500).json({
        message: "Failed to create course.",
        error: error.message,
      });
    }
  }
);

// ==========================================
// UPDATE COURSE
// Admin / Instructor only
// ==========================================

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "instructor"),
  async (req, res) => {
    try {
      const {
        exam,
        title,
        description,
        image,
        lessons,
        students,
        duration,
        level,
      } = req.body;

      const course = await Course.findById(
        req.params.id
      );

      if (!course) {
        return res.status(404).json({
          message: "Course not found.",
        });
      }

      // Update only fields that are provided
      if (exam !== undefined) {
        course.exam = exam;
      }

      if (title !== undefined) {
        course.title = title;
      }

      if (description !== undefined) {
        course.description = description;
      }

      if (image !== undefined) {
        course.image = image;
      }

      if (lessons !== undefined) {
        course.lessons = lessons;
      }

      if (students !== undefined) {
        course.students = students;
      }

      if (duration !== undefined) {
        course.duration = duration;
      }

      if (level !== undefined) {
        course.level = level;
      }

      await course.save();

      res.status(200).json({
        message: "Course updated successfully.",
        course,
      });
    } catch (error) {
      console.error("Update course error:", error.message);

      res.status(500).json({
        message: "Failed to update course.",
        error: error.message,
      });
    }
  }
);

// ==========================================
// DELETE COURSE
// Admin / Instructor only
// ==========================================

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "instructor"),
  async (req, res) => {
    try {
      const course = await Course.findById(
        req.params.id
      );

      if (!course) {
        return res.status(404).json({
          message: "Course not found.",
        });
      }

      await Course.findByIdAndDelete(req.params.id);

      res.status(200).json({
        message: "Course deleted successfully.",
      });
    } catch (error) {
      console.error("Delete course error:", error.message);

      res.status(500).json({
        message: "Failed to delete course.",
        error: error.message,
      });
    }
  }
);

module.exports = router;