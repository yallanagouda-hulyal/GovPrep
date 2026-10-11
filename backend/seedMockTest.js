require("dotenv").config();

const mongoose = require("mongoose");
const MockTest = require("./models/MockTest");

const questions = [
  // =========================================
  // MATHEMATICS - 5 QUESTIONS
  // =========================================

  {
    subject: "Mathematics",
    question: "What is 25% of 200?",
    options: ["25", "40", "50", "75"],
    correctAnswer: "50",
    marks: 1,
  },

  {
    subject: "Mathematics",
    question:
      "If a train travels 120 km in 2 hours, what is its average speed?",
    options: [
      "40 km/h",
      "50 km/h",
      "60 km/h",
      "80 km/h",
    ],
    correctAnswer: "60 km/h",
    marks: 1,
  },

  {
    subject: "Mathematics",
    question:
      "What is the simple interest on ₹5,000 at 10% per annum for 2 years?",
    options: ["₹500", "₹750", "₹1,000", "₹1,500"],
    correctAnswer: "₹1,000",
    marks: 1,
  },

  {
    subject: "Mathematics",
    question:
      "The ratio of two numbers is 2:3. If the first number is 20, what is the second number?",
    options: ["25", "30", "35", "40"],
    correctAnswer: "30",
    marks: 1,
  },

  {
    subject: "Mathematics",
    question:
      "What is the average of 10, 20, 30, 40 and 50?",
    options: ["25", "30", "35", "40"],
    correctAnswer: "30",
    marks: 1,
  },

  // =========================================
  // GENERAL KNOWLEDGE - 5 QUESTIONS
  // =========================================

  {
    subject: "General Knowledge",
    question: "What is the capital of India?",
    options: [
      "Mumbai",
      "New Delhi",
      "Kolkata",
      "Chennai",
    ],
    correctAnswer: "New Delhi",
    marks: 1,
  },

  {
    subject: "General Knowledge",
    question:
      "Who is known as the Father of the Indian Constitution?",
    options: [
      "Mahatma Gandhi",
      "Dr. B. R. Ambedkar",
      "Jawaharlal Nehru",
      "Sardar Patel",
    ],
    correctAnswer: "Dr. B. R. Ambedkar",
    marks: 1,
  },

  {
    subject: "General Knowledge",
    question:
      "Which planet is known as the Red Planet?",
    options: [
      "Earth",
      "Venus",
      "Mars",
      "Jupiter",
    ],
    correctAnswer: "Mars",
    marks: 1,
  },

  {
    subject: "General Knowledge",
    question:
      "How many states are there in India?",
    options: ["26", "27", "28", "29"],
    correctAnswer: "28",
    marks: 1,
  },

  {
    subject: "General Knowledge",
    question:
      "Which is the largest ocean in the world?",
    options: [
      "Atlantic Ocean",
      "Indian Ocean",
      "Pacific Ocean",
      "Arctic Ocean",
    ],
    correctAnswer: "Pacific Ocean",
    marks: 1,
  },

  // =========================================
  // ENGLISH - 5 QUESTIONS
  // =========================================

  {
    subject: "English",
    question:
      "Choose the synonym of the word 'Rapid'.",
    options: [
      "Slow",
      "Quick",
      "Weak",
      "Late",
    ],
    correctAnswer: "Quick",
    marks: 1,
  },

  {
    subject: "English",
    question:
      "Choose the antonym of the word 'Ancient'.",
    options: [
      "Old",
      "Historic",
      "Modern",
      "Traditional",
    ],
    correctAnswer: "Modern",
    marks: 1,
  },

  {
    subject: "English",
    question:
      "Choose the correctly spelled word.",
    options: [
      "Definately",
      "Definitely",
      "Definetely",
      "Definatly",
    ],
    correctAnswer: "Definitely",
    marks: 1,
  },

  {
    subject: "English",
    question:
      "Choose the correct sentence.",
    options: [
      "She go to school every day.",
      "She going to school every day.",
      "She goes to school every day.",
      "She gone to school every day.",
    ],
    correctAnswer:
      "She goes to school every day.",
    marks: 1,
  },

  {
    subject: "English",
    question:
      "Fill in the blank: He is good ___ mathematics.",
    options: ["in", "at", "on", "for"],
    correctAnswer: "at",
    marks: 1,
  },

  // =========================================
  // REASONING - 10 QUESTIONS
  // =========================================

  {
    subject: "Reasoning",
    question:
      "Find the next number: 2, 4, 8, 16, ?",
    options: ["20", "24", "32", "36"],
    correctAnswer: "32",
    marks: 1,
  },

  {
    subject: "Reasoning",
    question:
      "Find the odd one out.",
    options: [
      "Apple",
      "Mango",
      "Carrot",
      "Banana",
    ],
    correctAnswer: "Carrot",
    marks: 1,
  },

  {
    subject: "Reasoning",
    question:
      "If CAT is coded as DBU, how is DOG coded?",
    options: [
      "EPH",
      "EOH",
      "DPH",
      "EPG",
    ],
    correctAnswer: "EPH",
    marks: 1,
  },

  {
    subject: "Reasoning",
    question:
      "Complete the series: A, C, E, G, ?",
    options: ["H", "I", "J", "K"],
    correctAnswer: "I",
    marks: 1,
  },

  {
    subject: "Reasoning",
    question:
      "If all roses are flowers and some flowers are red, which statement is definitely true?",
    options: [
      "All roses are red.",
      "Some roses are red.",
      "All roses are flowers.",
      "No roses are flowers.",
    ],
    correctAnswer:
      "All roses are flowers.",
    marks: 1,
  },

  {
    subject: "Reasoning",
    question:
      "A person walks 5 km north and then 5 km south. How far is he from his starting point?",
    options: ["0 km", "5 km", "10 km", "15 km"],
    correctAnswer: "0 km",
    marks: 1,
  },

  {
    subject: "Reasoning",
    question:
      "Find the missing number: 3, 6, 12, 24, ?",
    options: ["36", "42", "48", "52"],
    correctAnswer: "48",
    marks: 1,
  },

  {
    subject: "Reasoning",
    question:
      "If Monday is coded as 1, Tuesday as 2, and so on, what number represents Friday?",
    options: ["4", "5", "6", "7"],
    correctAnswer: "5",
    marks: 1,
  },

  {
    subject: "Reasoning",
    question:
      "Book is related to Reading in the same way as Food is related to:",
    options: [
      "Cooking",
      "Eating",
      "Buying",
      "Selling",
    ],
    correctAnswer: "Eating",
    marks: 1,
  },

  {
    subject: "Reasoning",
    question:
      "Find the next number: 5, 10, 15, 20, ?",
    options: ["22", "24", "25", "30"],
    correctAnswer: "25",
    marks: 1,
  },
];

const seedMockTest = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully ✅");

    // Remove existing copy of this mock test
    await MockTest.deleteMany({
      title:
        "GovPrep Mock Test 1 — General Competitive Exams",
    });

    const mockTest = await MockTest.create({
      title:
        "GovPrep Mock Test 1 — General Competitive Exams",

      exam: "General Competitive Exams",

      description:
        "Practice Mathematics, General Knowledge, English and Reasoning in a 25-question mock test.",

      duration: 30,

      totalQuestions: 25,

      totalMarks: 25,

      negativeMarking: false,

      questions,
    });

    console.log(
      "Mock test created successfully ✅"
    );

    console.log("Mock Test ID:");
    console.log(mockTest._id);

    console.log(
      `Total Questions: ${mockTest.questions.length}`
    );

    console.log("Mathematics: 5");
    console.log("General Knowledge: 5");
    console.log("English: 5");
    console.log("Reasoning: 10");

    await mongoose.connection.close();

    console.log("MongoDB connection closed.");
  } catch (error) {
    console.error(
      "Mock test seed error:",
      error.message
    );

    process.exit(1);
  }
};

seedMockTest();