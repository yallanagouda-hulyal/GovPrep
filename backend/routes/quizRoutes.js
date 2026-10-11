const express = require("express");

const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

/* =========================================
   ADMIN / INSTRUCTOR
   CREATE QUIZ
========================================= */

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
        questions,
        passingScore,
      } = req.body;

      if (
        !course ||
        !title ||
        !Array.isArray(questions) ||
        questions.length === 0
      ) {
        return res.status(400).json({
          message:
            "Course, title and at least one question are required.",
        });
      }

      const quiz = await Quiz.create({
        course,
        title,
        description: description || "",
        questions,
        passingScore:
          passingScore !== undefined
            ? Number(passingScore)
            : 40,
      });

      res.status(201).json({
        message: "Quiz created successfully.",
        quiz,
      });
    } catch (error) {
      console.error(
        "Create quiz error:",
        error.message
      );

      res.status(500).json({
        message: "Failed to create quiz.",
        error: error.message,
      });
    }
  }
);

/* =========================================
   ADMIN / INSTRUCTOR
   GET ALL QUIZZES
========================================= */

router.get(
  "/admin/all",
  authMiddleware,
  roleMiddleware("admin", "instructor"),
  async (req, res) => {
    try {
      const quizzes = await Quiz.find()
        .populate("course", "title exam")
        .sort({ createdAt: -1 });

      res.status(200).json(quizzes);
    } catch (error) {
      console.error(
        "Admin fetch quizzes error:",
        error.message
      );

      res.status(500).json({
        message: "Failed to fetch quizzes.",
        error: error.message,
      });
    }
  }
);

/* =========================================
   ADMIN / INSTRUCTOR
   GET QUIZZES BY COURSE
========================================= */

router.get(
  "/admin/course/:courseId",
  authMiddleware,
  roleMiddleware("admin", "instructor"),
  async (req, res) => {
    try {
      const quizzes = await Quiz.find({
        course: req.params.courseId,
      }).sort({ createdAt: -1 });

      res.status(200).json(quizzes);
    } catch (error) {
      console.error(
        "Admin fetch course quizzes error:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to fetch course quizzes.",
        error: error.message,
      });
    }
  }
);

/* =========================================
   ADMIN / INSTRUCTOR
   GET SINGLE QUIZ
========================================= */

router.get(
  "/admin/:id",
  authMiddleware,
  roleMiddleware("admin", "instructor"),
  async (req, res) => {
    try {
      const quiz = await Quiz.findById(
        req.params.id
      ).populate("course", "title exam");

      if (!quiz) {
        return res.status(404).json({
          message: "Quiz not found.",
        });
      }

      res.status(200).json(quiz);
    } catch (error) {
      console.error(
        "Admin fetch quiz error:",
        error.message
      );

      res.status(500).json({
        message: "Failed to fetch quiz.",
        error: error.message,
      });
    }
  }
);

/* =========================================
   STUDENT
   GET QUIZZES FOR A COURSE
   HIDE CORRECT ANSWERS
========================================= */

router.get(
  "/course/:courseId",
  async (req, res) => {
    try {
      const quizzes = await Quiz.find({
        course: req.params.courseId,
      })
        .select("-questions.correctAnswer")
        .sort({ createdAt: -1 });

      res.status(200).json(quizzes);
    } catch (error) {
      console.error(
        "Fetch quizzes error:",
        error.message
      );

      res.status(500).json({
        message: "Failed to fetch quizzes.",
        error: error.message,
      });
    }
  }
);

/* =========================================
   STUDENT
   GET SINGLE QUIZ
   HIDE CORRECT ANSWERS
========================================= */

router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(
      req.params.id
    ).select("-questions.correctAnswer");

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found.",
      });
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error(
      "Fetch quiz error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch quiz.",
      error: error.message,
    });
  }
});

/* =========================================
   ADMIN / INSTRUCTOR
   UPDATE QUIZ
========================================= */

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
        questions,
        passingScore,
      } = req.body;

      const quiz = await Quiz.findById(
        req.params.id
      );

      if (!quiz) {
        return res.status(404).json({
          message: "Quiz not found.",
        });
      }

      if (course !== undefined) {
        quiz.course = course;
      }

      if (title !== undefined) {
        quiz.title = title;
      }

      if (description !== undefined) {
        quiz.description = description;
      }

      if (questions !== undefined) {
        if (
          !Array.isArray(questions) ||
          questions.length === 0
        ) {
          return res.status(400).json({
            message:
              "Quiz must contain at least one question.",
          });
        }

        quiz.questions = questions;
      }

      if (passingScore !== undefined) {
        quiz.passingScore =
          Number(passingScore);
      }

      await quiz.save();

      res.status(200).json({
        message: "Quiz updated successfully.",
        quiz,
      });
    } catch (error) {
      console.error(
        "Update quiz error:",
        error.message
      );

      res.status(500).json({
        message: "Failed to update quiz.",
        error: error.message,
      });
    }
  }
);

/* =========================================
   ADMIN / INSTRUCTOR
   DELETE QUIZ
========================================= */

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "instructor"),
  async (req, res) => {
    try {
      const quiz = await Quiz.findById(
        req.params.id
      );

      if (!quiz) {
        return res.status(404).json({
          message: "Quiz not found.",
        });
      }

      await Quiz.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({
        message: "Quiz deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete quiz error:",
        error.message
      );

      res.status(500).json({
        message: "Failed to delete quiz.",
        error: error.message,
      });
    }
  }
);

/* =========================================
   STUDENT
   SUBMIT QUIZ
========================================= */

router.post(
  "/:id/submit",
  authMiddleware,
  async (req, res) => {
    try {
      const quiz = await Quiz.findById(
        req.params.id
      );

      if (!quiz) {
        return res.status(404).json({
          message: "Quiz not found.",
        });
      }

      const { answers } = req.body;

      if (!answers) {
        return res.status(400).json({
          message: "Answers are required.",
        });
      }

      /* =====================================
         CALCULATE SCORE
      ===================================== */

      let correctAnswers = 0;

      quiz.questions.forEach(
        (question, index) => {
          const studentAnswer =
            answers[index];

          if (
            studentAnswer ===
            question.correctAnswer
          ) {
            correctAnswers++;
          }
        }
      );

      const totalQuestions =
        quiz.questions.length;

      const percentage =
        totalQuestions > 0
          ? Math.round(
              (correctAnswers /
                totalQuestions) *
                100
            )
          : 0;

      const passed =
        percentage >=
        (quiz.passingScore || 40);

      /* =====================================
         SAVE ATTEMPT
      ===================================== */

      const attempt =
        await QuizAttempt.create({
          user: req.user.id,
          quiz: quiz._id,
          score: correctAnswers,
          totalQuestions,
          correctAnswers,
          percentage,
          passed,
        });

      /* =====================================
         RESPONSE
      ===================================== */

      res.status(201).json({
        message:
          "Quiz submitted successfully.",

        result: {
          score: correctAnswers,
          totalQuestions,
          correctAnswers,
          percentage,
          passed,
        },

        attempt,
      });
    } catch (error) {
      console.error(
        "Quiz submission error:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to submit quiz.",
        error: error.message,
      });
    }
  }
);

module.exports = router;