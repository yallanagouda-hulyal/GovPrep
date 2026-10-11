import { useNavigate } from "react-router-dom";
import "../styles/PopularExams.css";

const exams = [
  {
    name: "SSC",
    title: "SSC CGL, CHSL & More",
    description:
      "Prepare for major Staff Selection Commission examinations.",
    image:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Lion_Capital_of_Ashoka%2C_Vidhana_Soudha_%2802%29.jpg",
  },

  {
    name: "Banking",
    title: "Banking Exams",
    description:
      "Prepare for IBPS, SBI and other banking examinations.",
    image:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/State_Bank_of_India_Corporate_Centre_Mumbai.jpg",
  },

  {
    name: "Railway",
    title: "Railway Exams",
    description:
      "Prepare for RRB NTPC, Group D and other railway exams.",
    image:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian_Railways_Train_in_2025.jpg",
  },

  {
    name: "UPSC",
    title: "Civil Services",
    description:
      "Build your preparation for UPSC and civil services exams.",
    image:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Parliament_House%2CNew_Delhi.jpg",
  },

  {
    name: "Defence",
    title: "Defence Exams",
    description:
      "Prepare for AFCAT, CDS, NDA and other defence exams.",
    image:
      "https://images.unsplash.com/photo-1661113248101-f2881bea4abb?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    name: "Police",
    title: "Police Exams",
    description:
      "Prepare for police and government recruitment examinations.",
    image:
      "https://images.unsplash.com/photo-1611680551824-535bd90d1415?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];
function PopularExams() {
  const navigate = useNavigate();

  return (
    <section className="popular-exams">

      {/* SECTION HEADING */}
      <div className="popular-exams-heading">
        <span>EXPLORE EXAMS</span>

        <h2>Choose Your Target Exam</h2>

        <p>
          Select your target examination and start your preparation
          with structured courses, practice and mock tests.
        </p>
      </div>

      {/* EXAM CARDS */}
      <div className="exam-grid">

        {exams.map((exam) => (
          <div className="exam-card" key={exam.name}>

            {/* IMAGE */}
            <div className="exam-image">

              <img
                src={exam.image}
                alt={`${exam.name} exam preparation`}
              />

              {/* BLUE BADGE */}
              <span className="exam-name">
                {exam.name}
              </span>

            </div>

            {/* CONTENT */}
            <div className="exam-content">

              <h3>{exam.title}</h3>

              <p>{exam.description}</p>

              {/* BUTTON */}
              <button
                onClick={() =>
                  navigate(
                    `/courses?exam=${exam.name.toLowerCase()}`
                  )
                }
              >
                <span>Explore {exam.name}</span>

                <span className="exam-arrow">
                  →
                </span>
              </button>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}

export default PopularExams;