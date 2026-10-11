const express = require("express");

const LessonProgress = require("../models/LessonProgress");
const Lesson = require("../models/Lesson");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* MARK LESSON AS COMPLETE */
router.patch(
  "/lesson/:lessonId",
  authMiddleware,
  async (req, res) => {
    try {
      const lesson = await Lesson.findById(
        req.params.lessonId
      );

      if (!lesson) {
        return res.status(404).json({
          message: "Lesson not found.",
        });
      }

      const progress = await LessonProgress.findOneAndUpdate(
        {
          user: req.user.id,
          lesson: lesson._id,
        },
        {
          user: req.user.id,
          course: lesson.course,
          lesson: lesson._id,
          completed: true,
          completedAt: new Date(),
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );

      res.status(200).json({
        message: "Lesson marked as complete.",
        progress,
      });
    } catch (error) {
      console.error(
        "Lesson progress error:",
        error.message
      );

      res.status(500).json({
        message: "Failed to update lesson progress.",
        error: error.message,
      });
    }
  }
);


/* GET COURSE PROGRESS */
router.get(
  "/course/:courseId",
  authMiddleware,
  async (req, res) => {
    try {
      const lessons = await Lesson.find({
        course: req.params.courseId,
      }).sort({ orderNo: 1 });

      const progress = await LessonProgress.find({
        user: req.user.id,
        course: req.params.courseId,
        completed: true,
      });

      const completedLessonIds = progress.map(
        (item) => item.lesson.toString()
      );

      const totalLessons = lessons.length;

      const completedLessons = completedLessonIds.length;

      const percentage =
        totalLessons === 0
          ? 0
          : Math.round(
              (completedLessons / totalLessons) * 100
            );

      res.status(200).json({
        totalLessons,
        completedLessons,
        percentage,
        completedLessonIds,
      });
    } catch (error) {
      console.error(
        "Course progress error:",
        error.message
      );

      res.status(500).json({
        message: "Failed to fetch course progress.",
        error: error.message,
      });
    }
  }
);

module.exports = router;