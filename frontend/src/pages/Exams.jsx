import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaUniversity,
  FaLandmark,
  FaTrain,
  FaBuilding,
  FaShieldAlt,
  FaUserShield,
} from "react-icons/fa";

import "../styles/Exams.css";

const exams = [
  {
    name: "SSC",
    title: "Staff Selection Commission",
    description:
      "Prepare for SSC CGL, CHSL, MTS and other major SSC examinations.",
    types: "SSC CGL • CHSL • MTS",
    icon: <FaUniversity />,
    image:
      "https://images.unsplash.com/photo-1760872646618-13594fc00567?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    
      
  },

  {
    name: "BANKING",
    title: "Banking Examinations",
    description:
      "Build your preparation for IBPS, SBI and other banking examinations.",
    types: "IBPS PO • Clerk • SBI PO",
    icon: <FaLandmark />,
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85",
    fallback:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=85",
    theme: "green",
  },

  {
    name: "RAILWAY",
    title: "Railway Examinations",
    description:
      "Prepare for RRB NTPC, Group D and other railway recruitment exams.",
    types: "RRB NTPC • Group D • ALP",
    icon: <FaTrain />,
    image:
      "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=900&q=85",
    fallback:
      "https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=900&q=85",
    theme: "orange",
  },

  {
    name: "UPSC",
    title: "Civil Services",
    description:
      "Develop strong fundamentals for UPSC Civil Services examinations.",
    types: "UPSC CSE • Prelims • Mains",
    icon: <FaBuilding />,
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=900&q=85",
    fallback:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=85",
    theme: "purple",
  },

  {
    name: "DEFENCE",
    title: "Defence Examinations",
    description:
      "Prepare for defence entrance examinations with focused practice.",
    types: "AFCAT • CDS • NDA",
    icon: <FaShieldAlt />,
    image:
      "https://plus.unsplash.com/premium_photo-1682097234698-eb9040b2072d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    fallback:
      "https://images.unsplash.com/photo-1521292270410-a8c4d716d518?auto=format&fit=crop&w=900&q=85",
    theme: "red",
  },

  {
    name: "POLICE",
    title: "Police Examinations",
    description:
      "Prepare for police recruitment examinations with structured practice.",
    types: "State Police • SI • Constable",
    icon: <FaUserShield />,
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=85",
    fallback:
      "https://images.unsplash.com/photo-1589578527966-fdac0f44566c?auto=format&fit=crop&w=900&q=85",
    theme: "blue",
  },
];

function Exams() {
  const navigate = useNavigate();

  const openExam = (examName) => {
    navigate(`/courses?exam=${examName.toLowerCase()}`);
  };

  return (
    <section className="exams-page">

      {/* HEADER */}
      <div className="exams-header">

        <span className="exams-label">
          🎯 &nbsp; EXPLORE EXAMS
        </span>

        <h1>
          Choose Your <span>Target Exam</span>
        </h1>

        <p>
          Select your target examination and start your preparation
          with structured courses, practice questions and mock tests.
        </p>

      </div>


      {/* EXAM CARDS */}
      <div className="exams-grid">

        {exams.map((exam) => (
          <div
            className={`exam-card exam-${exam.theme}`}
            key={exam.name}
          >

            {/* CONTENT */}
            <div className="exam-card-content">

              <div className="exam-card-top">

                <div className="exam-icon">
                  {exam.icon}
                </div>

                <span className="exam-name">
                  {exam.name}
                </span>

              </div>

              <h2>
                {exam.title}
              </h2>

              <p>
                {exam.description}
              </p>

              <div className="exam-types">
                {exam.types}
              </div>

              <button
                type="button"
                className="exam-explore-button"
                onClick={() => openExam(exam.name)}
              >
                Explore Preparation
                <FaArrowRight />
              </button>

            </div>


            {/* IMAGE */}
            <div className="exam-card-image">

              <img
                src={exam.image}
                alt={exam.title}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = exam.fallback;
                }}
              />

            </div>

          </div>
        ))}

      </div>


      {/* CTA */}
      <div className="exams-cta">

        <div className="cta-decoration">
          📚
        </div>

        <div className="exams-cta-content">

          <strong>
            Not sure where to start?
          </strong>

          <p>
            Explore our courses and find the right preparation path
            for your target examination.
          </p>

        </div>

        <button
          type="button"
          onClick={() => navigate("/courses")}
        >
          View All Courses
          <FaArrowRight />
        </button>

      </div>

    </section>
  );
}

export default Exams;