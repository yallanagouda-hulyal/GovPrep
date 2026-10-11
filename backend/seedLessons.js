require("dotenv").config();

const mongoose = require("mongoose");

const Course = require("./models/Course");
const Lesson = require("./models/Lesson");

const lessons = [
  {
    title: "Introduction to SSC CGL",
    description:
      "Understand the SSC CGL examination structure, subjects, preparation strategy and important topics.",
    videoUrl:
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    content:
      "This lesson introduces the SSC CGL examination and explains how to plan your preparation.",
    duration: "20 min",
    orderNo: 1,
  },

  {
    title: "Quantitative Aptitude Basics",
    description:
      "Learn the fundamental concepts required for quantitative aptitude preparation.",
    videoUrl:
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    content:
      "Learn number systems, basic calculations and important quantitative aptitude concepts.",
    duration: "35 min",
    orderNo: 2,
  },

  {
    title: "Reasoning Ability Fundamentals",
    description:
      "Build your reasoning fundamentals with important logical and analytical concepts.",
    videoUrl:
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    content:
      "Understand the basic reasoning concepts needed for SSC CGL preparation.",
    duration: "30 min",
    orderNo: 3,
  },

  {
    title: "English Language Basics",
    description:
      "Learn important English grammar, vocabulary and comprehension concepts.",
    videoUrl:
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    content:
      "Build your English fundamentals with grammar and vocabulary practice.",
    duration: "30 min",
    orderNo: 4,
  },

  {
    title: "General Awareness",
    description:
      "Study important general awareness topics relevant to competitive examinations.",
    videoUrl:
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    content:
      "Learn how to approach general awareness and important examination topics.",
    duration: "25 min",
    orderNo: 5,
  },
];


const seedLessons = async () => {

  try {

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected successfully ✅"
    );


    // Find the existing SSC CGL course
    const course = await Course.findOne({
      title: "SSC CGL Complete Preparation",
    });


    if (!course) {

      console.log(
        "SSC CGL course not found ❌"
      );

      process.exit(1);
    }


    // Remove old lessons for this course
    await Lesson.deleteMany({
      course: course._id,
    });


    // Add course ID to every lesson
    const lessonsWithCourse =
      lessons.map((lesson) => ({
        ...lesson,
        course: course._id,
      }));


    // Insert lessons
    await Lesson.insertMany(
      lessonsWithCourse
    );


    console.log(
      `${lessons.length} lessons inserted successfully ✅`
    );


    process.exit(0);

  } catch (error) {

    console.error(
      "Lesson seeding failed ❌"
    );

    console.error(error.message);

    process.exit(1);
  }
};


seedLessons();