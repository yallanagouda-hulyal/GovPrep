const express = require("express");

const MockTestAttempt = require("../models/MockTestAttempt");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================================
   GET MY MOCK TEST RESULTS
========================================= */

router.get(
  "/mock-tests",
  authMiddleware,
  async (req, res) => {
    try {
      const attempts =
        await MockTestAttempt.find({
          user: req.user.id,
        })
          .populate(
            "mockTest",
            "title exam totalQuestions totalMarks duration"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json(attempts);
    } catch (error) {
      console.error(
        "Fetch results error:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to fetch results.",
        error: error.message,
      });
    }
  }
);

module.exports = router;