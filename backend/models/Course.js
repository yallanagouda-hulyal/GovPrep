const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    exam: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    lessons: {
      type: String,
      required: true,
    },

    students: {
      type: String,
      default: "0 Students",
    },

    duration: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);