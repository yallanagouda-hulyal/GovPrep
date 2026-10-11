const express = require("express");

const Enrollment = require("../models/Enrollment");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


/* =========================================
   ENROLL IN COURSE
========================================= */

router.post("/", authMiddleware, async (req, res) => {
  try {

    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        message: "Course ID is required.",
      });
    }

    const existingEnrollment =
      await Enrollment.findOne({
        user: req.user.id,
        course: courseId,
      });

    if (existingEnrollment) {
      return res.status(400).json({
        message: "You are already enrolled in this course.",
      });
    }

    const enrollment = await Enrollment.create({
      user: req.user.id,
      course: courseId,
    });

    res.status(201).json({
      message: "Enrollment successful.",
      enrollment,
    });

  } catch (error) {

    console.error(
      "Enrollment error:",
      error.message
    );

    res.status(500).json({
      message: "Enrollment failed.",
      error: error.message,
    });
  }
});


/* =========================================
   GET MY COURSES
========================================= */

router.get(
  "/my-courses",
  authMiddleware,
  async (req, res) => {

    try {

      const enrollments =
        await Enrollment.find({
          user: req.user.id,
        })
        .populate("course")
        .sort({
          enrolledAt: -1,
        });


      const courses = enrollments.map(
        (enrollment) => ({
          enrollmentId: enrollment._id,

          enrolledAt:
            enrollment.enrolledAt,

          status:
            enrollment.status,

          course:
            enrollment.course,
        })
      );


      res.status(200).json(courses);

    } catch (error) {

      console.error(
        "My courses error:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to fetch your courses.",
        error: error.message,
      });
    }
  }
);


module.exports = router;