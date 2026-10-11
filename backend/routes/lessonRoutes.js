const express = require("express");

const Lesson = require("../models/Lesson");
const Enrollment = require("../models/Enrollment");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

/* =====================================================
   STUDENT - GET COURSE LESSONS
   ===================================================== */

router.get(
  "/course/:courseId",
  authMiddleware,
  async (req, res) => {
    try {
      /* CHECK ENROLLMENT */

      const enrollment = await Enrollment.findOne({
        user: req.user.id,
        course: req.params.courseId,
      });

      if (!enrollment) {
        return res.status(403).json({
          message:
            "You must enroll in this course before accessing the lessons.",
        });
      }

      /* FETCH LESSONS */

      const lessons = await Lesson.find({
        course: req.params.courseId,
      }).sort({ orderNo: 1 });

      res.status(200).json(lessons);
    } catch (error) {
      console.error(
        "Fetch lessons error:",
        error.message
      );

      res.status(500).json({
        message: "Failed to fetch lessons.",
        error: error.message,
      });
    }
  }
);

/* =====================================================
   ADMIN / INSTRUCTOR - GET ALL LESSONS
   ===================================================== */

router.get(
  "/admin/all",
  authMiddleware,
  roleMiddleware("admin", "instructor"),
  async (req, res) => {
    try {
      const lessons = await Lesson.find()
        .populate("course", "title exam")
        .sort({
          course: 1,
          orderNo: 1,
        });

      res.status(200).json(lessons);
    } catch (error) {
      console.error(
        "Admin fetch lessons error:",
        error.message
      );

      res.status(500).json({
        message: "Failed to fetch lessons.",
        error: error.message,
      });
    }
  }
);

/* =====================================================
   ADMIN / INSTRUCTOR - GET LESSONS BY COURSE
   ===================================================== */

router.get(
  "/admin/course/:courseId",
  authMiddleware,
  roleMiddleware("admin", "instructor"),
  async (req, res) => {
    try {
      const lessons = await Lesson.find({
        course: req.params.courseId,
      }).sort({ orderNo: 1 });

      res.status(200).json(lessons);
    } catch (error) {
      console.error(
        "Admin fetch course lessons error:",
        error.message
      );

      res.status(500).json({
        message: "Failed to fetch course lessons.",
        error: error.message,
      });
    }
  }
);

/* =====================================================
   ADMIN / INSTRUCTOR - GET SINGLE LESSON
   ===================================================== */

router.get(
  "/admin/:id",
  authMiddleware,
  roleMiddleware("admin", "instructor"),
  async (req, res) => {
    try {
      const lesson = await Lesson.findById(
        req.params.id
      ).populate("course", "title exam");

      if (!lesson) {
        return res.status(404).json({
          message: "Lesson not found.",
        });
      }

      res.status(200).json(lesson);
    } catch (error) {
      console.error(
        "Fetch lesson error:",
        error.message
      );

      res.status(500).json({
        message: "Failed to fetch lesson.",
        error: error.message,
      });
    }
  }
);

/* =====================================================
   ADMIN / INSTRUCTOR - CREATE LESSON
   ===================================================== */

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "instructor"),
  async (req, res) => {
    try {
      const {
        course,
        title,
        description,
        videoUrl,
        content,
        duration,
        orderNo,
      } = req.body;

      /* VALIDATION */

      if (
        !course ||
        !title ||
        !description ||
        !duration ||
        orderNo === undefined
      ) {
        return res.status(400).json({
          message:
            "Course, title, description, duration and order number are required.",
        });
      }

      /* CREATE LESSON */

      const lesson = await Lesson.create({
        course,
        title,
        description,
        videoUrl: videoUrl || "",
        content: content || "",
        duration,
        orderNo,
      });

      res.status(201).json({
        message: "Lesson created successfully.",
        lesson,
      });
    } catch (error) {
      console.error(
        "Create lesson error:",
        error.message
      );

      res.status(500).json({
        message: "Failed to create lesson.",
        error: error.message,
      });
    }
  }
);

/* =====================================================
   ADMIN / INSTRUCTOR - UPDATE LESSON
   ===================================================== */

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "instructor"),
  async (req, res) => {
    try {
      const {
        course,
        title,
        description,
        videoUrl,
        content,
        duration,
        orderNo,
      } = req.body;

      const lesson = await Lesson.findById(
        req.params.id
      );

      if (!lesson) {
        return res.status(404).json({
          message: "Lesson not found.",
        });
      }

      /* UPDATE ONLY PROVIDED FIELDS */

      if (course !== undefined) {
        lesson.course = course;
      }

      if (title !== undefined) {
        lesson.title = title;
      }

      if (description !== undefined) {
        lesson.description = description;
      }

      if (videoUrl !== undefined) {
        lesson.videoUrl = videoUrl;
      }

      if (content !== undefined) {
        lesson.content = content;
      }

      if (duration !== undefined) {
        lesson.duration = duration;
      }

      if (orderNo !== undefined) {
        lesson.orderNo = orderNo;
      }

      await lesson.save();

      res.status(200).json({
        message: "Lesson updated successfully.",
        lesson,
      });
    } catch (error) {
      console.error(
        "Update lesson error:",
        error.message
      );

      res.status(500).json({
        message: "Failed to update lesson.",
        error: error.message,
      });
    }
  }
);

/* =====================================================
   ADMIN / INSTRUCTOR - DELETE LESSON
   ===================================================== */

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "instructor"),
  async (req, res) => {
    try {
      const lesson = await Lesson.findById(
        req.params.id
      );

      if (!lesson) {
        return res.status(404).json({
          message: "Lesson not found.",
        });
      }

      await Lesson.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({
        message: "Lesson deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete lesson error:",
        error.message
      );

      res.status(500).json({
        message: "Failed to delete lesson.",
        error: error.message,
      });
    }
  }
);

module.exports = router;