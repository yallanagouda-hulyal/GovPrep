const mongoose = require("mongoose");

const mockTestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    exam: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    duration: {
      type: Number,
      default: 30,
    },

    totalQuestions: {
      type: Number,
      default: 25,
    },

    totalMarks: {
      type: Number,
      default: 25,
    },

    negativeMarking: {
      type: Boolean,
      default: false,
    },

    questions: [
      {
        subject: {
          type: String,
          enum: [
            "Mathematics",
            "General Knowledge",
            "English",
            "Reasoning",
          ],
          required: true,
        },

        question: {
          type: String,
          required: true,
        },

        options: {
          type: [String],
          required: true,
        },

        correctAnswer: {
          type: String,
          required: true,
        },

        marks: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "MockTest",
  mockTestSchema
);