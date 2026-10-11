const mongoose = require("mongoose");

const mockTestAttemptSchema = new mongoose.Schema(
  {
    /* =========================================
       USER
    ========================================= */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* =========================================
       MOCK TEST
    ========================================= */

    mockTest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MockTest",
      required: true,
    },

    /* =========================================
       SCORE
    ========================================= */

    score: {
      type: Number,
      required: true,
    },

    totalQuestions: {
      type: Number,
      required: true,
    },

    correctAnswers: {
      type: Number,
      required: true,
    },

    wrongAnswers: {
      type: Number,
      required: true,
    },

    unansweredQuestions: {
      type: Number,
      required: true,
    },

    percentage: {
      type: Number,
      required: true,
    },

    /* =========================================
       ACCURACY
    ========================================= */

    accuracy: {
      type: Number,
      default: 0,
    },

    /* =========================================
       TIME
    ========================================= */

    timeTaken: {
      type: Number,
      default: 0,
    },

    /* =========================================
       SUBJECT-WISE PERFORMANCE
    ========================================= */

    subjectResults: [
      {
        subject: {
          type: String,
          required: true,
        },

        totalQuestions: {
          type: Number,
          required: true,
        },

        correctAnswers: {
          type: Number,
          required: true,
        },

        wrongAnswers: {
          type: Number,
          required: true,
        },

        unansweredQuestions: {
          type: Number,
          required: true,
        },

        percentage: {
          type: Number,
          required: true,
        },
      },
    ],

    /* =========================================
       ATTEMPT DATE
    ========================================= */

    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "MockTestAttempt",
  mockTestAttemptSchema
);