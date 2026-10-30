import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StudentService from "../Services/StudentService";

const GRADS = [
  "linear-gradient(135deg,#667eea,#764ba2)",
  "linear-gradient(135deg,#43e97b,#38f9d7)",
  "linear-gradient(135deg,#4facfe,#00f2fe)",
  "linear-gradient(135deg,#f093fb,#f5576c)",
  "linear-gradient(135deg,#f6d365,#fda085)",
];
const avatarGrad   = (n = "") => GRADS[(n.charCodeAt(0) || 0) % GRADS.length];
const attGradColor = (p) =>
  p >= 80 ? "linear-gradient(90deg,#43e97b,#38f9d7)"
: p >= 60 ? "linear-gradient(90deg,#f6d365,#fda085)"
: "linear-gradient(90deg,#f093fb,#f5576c)";
const attTextColor = (p) =>
  p >= 80 ? "var(--accent-green)" : p >= 60 ? "var(--accent-orange)" : "var(--accent-red)";

const ViewStudent = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    StudentService.getStudentByID(id)
      .then((res) => { setStudent(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="sp-view-page">
        <div className="sp-state">
          <div className="sp-spinner" />
          <div className="sp-state-text">Loading profile…</div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="sp-view-page">
        <div className="sp-view-card">
          <div className="sp-view-hero">
            <div style={{ fontSize:40, marginBottom:10 }}>❌</div>
            <div style={{ color:"var(--text-secondary)" }}>Student not found</div>
            <button className="sp-view-back" style={{ marginTop:20, width:"auto", padding:"9px 22px" }} onClick={() => navigate("/")}>
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pct      = Number(student.attendance ?? 0);
  const fullName = `${student.firstName || ""} ${student.lastName || ""}`.trim() || "Unknown Student";
  const mono     = `${(student.firstName || "?")[0]}${(student.lastName || "")[0]}`.toUpperCase();

  return (
    <div className="sp-view-page">
      <div className="sp-view-card">
        <div className="sp-view-hero">
          <div className="sp-view-av" style={{ background: avatarGrad(student.firstName) }}>
            {mono}
          </div>
          <div className="sp-view-name">{fullName}</div>
          <div className="sp-view-email">{student.email || "No email on record"}</div>
        </div>

        <div className="sp-view-body">
          <div className="sp-info-grid">

            <div className="sp-info-item">
              <div className="sp-info-label">Course</div>
              <div className="sp-info-value">{student.course || "—"}</div>
            </div>

            <div className="sp-info-item">
              <div className="sp-info-label">Grade</div>
              <div className="sp-info-value" style={{ color:"var(--accent-green)" }}>
                {student.grade || "—"}
              </div>
            </div>

            <div className="sp-info-item">
              <div className="sp-info-label">Student ID</div>
              <div className="sp-info-value" style={{ color:"var(--text-secondary)", fontSize:14 }}>
                #{student.id}
              </div>
            </div>

            <div className="sp-info-item">
              <div className="sp-info-label">First Name</div>
              <div className="sp-info-value">{student.firstName || "—"}</div>
            </div>

            <div className="sp-info-item sp-info-full">
              <div className="sp-info-label">Attendance</div>
              <div className="sp-att-label-row" style={{ marginTop:8 }}>
                <span>Overall attendance rate</span>
                <span style={{ color: attTextColor(pct), fontWeight:800 }}>{pct}%</span>
              </div>
              <div className="sp-big-track">
                <div className="sp-big-fill" style={{ width:`${Math.min(pct,100)}%`, background: attGradColor(pct) }} />
              </div>
            </div>

          </div>

          <button className="sp-view-back" onClick={() => navigate("/")}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewStudent;
