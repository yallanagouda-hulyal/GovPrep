const express = require("express");

const MockTest = require("../models/MockTest");
const MockTestAttempt = require("../models/MockTestAttempt");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================================
   GET ALL MOCK TESTS
   correctAnswer is hidden
========================================= */

router.get("/", async (req, res) => {
  try {
    const mockTests = await MockTest.find()
      .select("-questions.correctAnswer")
      .sort({ createdAt: -1 });

    res.status(200).json(mockTests);
  } catch (error) {
    console.error(
      "Fetch mock tests error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch mock tests.",
      error: error.message,
    });
  }
});


/* =========================================
   GET SINGLE MOCK TEST
   correctAnswer is hidden
========================================= */

router.get("/:id", async (req, res) => {
  try {
    const mockTest = await MockTest.findById(
      req.params.id
    ).select("-questions.correctAnswer");

    if (!mockTest) {
      return res.status(404).json({
        message: "Mock test not found.",
      });
    }

    res.status(200).json(mockTest);
  } catch (error) {
    console.error(
      "Fetch mock test error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch mock test.",
      error: error.message,
    });
  }
});


/* =========================================
   CREATE MOCK TEST
========================================= */

router.post(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        title,
        exam,
        description,
        duration,
        totalQuestions,
        totalMarks,
        negativeMarking,
        questions,
      } = req.body;

      if (!title || !exam || !questions) {
        return res.status(400).json({
          message:
            "Title, exam and questions are required.",
        });
      }

      const mockTest =
        await MockTest.create({
          title,
          exam,
          description,
          duration,
          totalQuestions,
          totalMarks,
          negativeMarking,
          questions,
        });

      res.status(201).json({
        message:
          "Mock test created successfully.",
        mockTest,
      });
    } catch (error) {
      console.error(
        "Create mock test error:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to create mock test.",
        error: error.message,
      });
    }
  }
);


/* =========================================
   SUBMIT MOCK TEST
========================================= */

router.post(
  "/:id/submit",
  authMiddleware,
  async (req, res) => {
    try {
      /* =====================================
         FIND MOCK TEST
      ===================================== */

      const mockTest =
        await MockTest.findById(
          req.params.id
        );

      if (!mockTest) {
        return res.status(404).json({
          message:
            "Mock test not found.",
        });
      }

      const {
        answers = {},
        timeTaken = 0,
      } = req.body;

      let correctAnswers = 0;
      let wrongAnswers = 0;
      let unansweredQuestions = 0;

      /* =====================================
         SUBJECT STATISTICS
      ===================================== */

      const subjectStats = {};

      mockTest.questions.forEach(
        (question, index) => {

          const subject =
            question.subject;

          if (!subjectStats[subject]) {
            subjectStats[subject] = {
              subject,
              totalQuestions: 0,
              correctAnswers: 0,
              wrongAnswers: 0,
              unansweredQuestions: 0,
            };
          }

          subjectStats[
            subject
          ].totalQuestions++;

          const studentAnswer =
            answers[index];

          /* ================================
             UNANSWERED
          ================================= */

          if (
            studentAnswer === undefined ||
            studentAnswer === null ||
            studentAnswer === ""
          ) {
            unansweredQuestions++;

            subjectStats[
              subject
            ].unansweredQuestions++;

            return;
          }

          /* ================================
             CORRECT
          ================================= */

          if (
            studentAnswer ===
            question.correctAnswer
          ) {
            correctAnswers++;

            subjectStats[
              subject
            ].correctAnswers++;
          }

          /* ================================
             WRONG
          ================================= */

          else {
            wrongAnswers++;

            subjectStats[
              subject
            ].wrongAnswers++;
          }
        }
      );


      /* =====================================
         SCORE
      ===================================== */

      const totalQuestions =
        mockTest.questions.length;

      /*
        Correct Answer = +1
        Wrong Answer = 0
        Unanswered = 0
      */

      const score =
        correctAnswers;


      /* =====================================
         PERCENTAGE
      ===================================== */

      const percentage =
        totalQuestions > 0
          ? Math.round(
              (score /
                totalQuestions) *
                100
            )
          : 0;


      /* =====================================
         ACCURACY
      ===================================== */

      const attemptedQuestions =
        correctAnswers +
        wrongAnswers;

      const accuracy =
        attemptedQuestions > 0
          ? Number(
              (
                (correctAnswers /
                  attemptedQuestions) *
                100
              ).toFixed(2)
            )
          : 0;


      /* =====================================
         SUBJECT RESULTS
      ===================================== */

      const subjectResults =
        Object.values(
          subjectStats
        ).map((subject) => {

          const subjectPercentage =
            subject.totalQuestions > 0
              ? Math.round(
                  (subject.correctAnswers /
                    subject.totalQuestions) *
                    100
                )
              : 0;

          return {
            subject:
              subject.subject,

            totalQuestions:
              subject.totalQuestions,

            correctAnswers:
              subject.correctAnswers,

            wrongAnswers:
              subject.wrongAnswers,

            unansweredQuestions:
              subject.unansweredQuestions,

            percentage:
              subjectPercentage,
          };
        });


      /* =====================================
         SAVE ATTEMPT
      ===================================== */

      const attempt =
        await MockTestAttempt.create({
          user: req.user.id,

          mockTest:
            mockTest._id,

          score,

          totalQuestions,

          correctAnswers,

          wrongAnswers,

          unansweredQuestions,

          percentage,

          accuracy,

          timeTaken,

          subjectResults,
        });


      /* =====================================
         SEND RESULT
      ===================================== */

      res.status(201).json({
        message:
          "Mock test submitted successfully.",

        result: {
          score,

          totalQuestions,

          correctAnswers,

          wrongAnswers,

          unansweredQuestions,

          percentage,

          accuracy,

          timeTaken,

          subjectResults,
        },

        attempt,
      });

    } catch (error) {

      console.error(
        "Mock test submission error:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to submit mock test.",

        error: error.message,
      });
    }
  }
);


module.exports = router;