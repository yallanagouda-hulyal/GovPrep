require("dotenv").config();

const mongoose = require("mongoose");
const Course = require("./models/Course");

const courses = [
  {
    exam: "SSC",
    title: "SSC CGL Complete Preparation",
    description:
      "Complete preparation for SSC CGL covering Quantitative Aptitude, Reasoning, English and General Awareness.",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85",
    lessons: "48 Lessons",
    students: "2.5K Students",
    duration: "12 Weeks",
    level: "Beginner",
  },
  {
    exam: "SSC",
    title: "SSC CHSL Foundation Course",
    description:
      "Build strong fundamentals and practice important topics for the SSC CHSL examination.",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=85",
    lessons: "36 Lessons",
    students: "1.8K Students",
    duration: "10 Weeks",
    level: "Beginner",
  },
  {
    exam: "BANKING",
    title: "Banking Exam Foundation",
    description:
      "Prepare for IBPS PO, Clerk, SBI PO and other banking examinations with structured lessons.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85",
    lessons: "42 Lessons",
    students: "1.8K Students",
    duration: "10 Weeks",
    level: "Intermediate",
  },
  {
    exam: "BANKING",
    title: "IBPS PO Complete Preparation",
    description:
      "Master Quantitative Aptitude, Reasoning, English and General Awareness for IBPS PO.",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85",
    lessons: "52 Lessons",
    students: "2.1K Students",
    duration: "14 Weeks",
    level: "Intermediate",
  },
  {
    exam: "RAILWAY",
    title: "RRB NTPC Complete Preparation",
    description:
      "Prepare systematically for RRB NTPC with topic-wise lessons and regular practice.",
    image:
      "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=85",
    lessons: "45 Lessons",
    students: "2.2K Students",
    duration: "12 Weeks",
    level: "Beginner",
  },
  {
    exam: "UPSC",
    title: "UPSC Civil Services Foundation",
    description:
      "Build strong fundamentals across important subjects for UPSC Civil Services preparation.",
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=85",
    lessons: "60 Lessons",
    students: "3.2K Students",
    duration: "16 Weeks",
    level: "Advanced",
  },
  {
    exam: "DEFENCE",
    title: "AFCAT Complete Preparation",
    description:
      "Prepare for AFCAT with structured lessons, practice questions and mock tests.",
    image:
      "https://images.unsplash.com/photo-1521292270410-a8c4d716d518?auto=format&fit=crop&w=1200&q=85",
    lessons: "40 Lessons",
    students: "1.5K Students",
    duration: "10 Weeks",
    level: "Intermediate",
  },
  {
    exam: "POLICE",
    title: "Police Recruitment Preparation",
    description:
      "Prepare for State Police, Sub Inspector and Constable recruitment examinations.",
    image:
      "https://images.unsplash.com/photo-1589578527966-fdac0f44566c?auto=format&fit=crop&w=1200&q=85",
    lessons: "35 Lessons",
    students: "1.3K Students",
    duration: "8 Weeks",
    level: "Beginner",
  },
  {
    exam: "DEFENCE",
    title: "Indian Army Exam Preparation",
    description:
      "Prepare for Indian Army recruitment examinations with structured lessons, practice questions and mock tests.",
    image:
      "https://images.unsplash.com/photo-1579912437766-7896df6d3cd3?auto=format&fit=crop&w=1200&q=85",
    lessons: "42 Lessons",
    students: "1.4K Students",
    duration: "10 Weeks",
    level: "Beginner",
  },
  {
    exam: "DEFENCE",
    title: "Indian Navy SSR Preparation",
    description:
      "Prepare for the Indian Navy SSR examination with structured lessons, practice questions and mock tests.",
    image:
      "https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&w=1200&q=85",
    lessons: "40 Lessons",
    students: "1.2K Students",
    duration: "10 Weeks",
    level: "Beginner",
  },
];

const seedCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully ✅");

    await Course.deleteMany();

    const insertedCourses = await Course.insertMany(courses);

    console.log(
      `${insertedCourses.length} courses inserted successfully ✅`
    );

    await mongoose.connection.close();

    console.log("Database connection closed.");
  } catch (error) {
    console.error("Failed to seed courses ❌");
    console.error(error.message);

    process.exit(1);
  }
};

seedCourses();