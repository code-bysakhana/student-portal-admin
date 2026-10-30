import { useEffect, useState, useMemo } from "react";
import StudentService from "../Services/StudentService";
import { useNavigate } from "react-router-dom";

const COURSE_DOTS = ["#63b3ed","#9f7aea","#4fd1c5","#f687b3","#68d391","#f6ad55","#fc8181"];

const attGrad = (p) =>
  p >= 80 ? "linear-gradient(90deg,#43e97b,#38f9d7)"
: p >= 60 ? "linear-gradient(90deg,#f6d365,#fda085)"
: "linear-gradient(90deg,#f093fb,#f5576c)";

const Dashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true); setError("");
      const res = await StudentService.getStudents();
      setStudents(res.data);
    } catch {
      setError("Cannot reach backend. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const total    = students.length;
  const avgAtt   = total
    ? +(students.reduce((s, x) => s + (x.attendance ?? 0), 0) / total).toFixed(1)
    : 0;
  const topGrade = students.filter((s) => s.grade?.toUpperCase().startsWith("A")).length;

  const courseSummary = useMemo(() => {
    const m = {};
    students.forEach((s) => { if (s.course) m[s.course] = (m[s.course] || 0) + 1; });
    return Object.entries(m)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count], i) => ({ name, count, dot: COURSE_DOTS[i % COURSE_DOTS.length] }));
  }, [students]);

  // Top 5 by attendance for the quick list
  const topStudents = [...students]
    .sort((a, b) => (b.attendance ?? 0) - (a.attendance ?? 0))
    .slice(0, 5);

  return (
    <div className="sp-content">

      {/* Stats row */}
      <div className="sp-stats-grid">
        <div className="sp-stat-card blue">
          <div className="sp-stat-top">
            <div className="sp-stat-icon blue">👥</div>
            <span className="sp-stat-trend up">Live</span>
          </div>
          <div>
            <div className="sp-stat-value">{loading ? "—" : total}</div>
            <div className="sp-stat-label">Total Students</div>
          </div>
        </div>

        <div className="sp-stat-card green">
          <div className="sp-stat-top">
            <div className="sp-stat-icon green">📈</div>
            <span className="sp-stat-trend up">Avg</span>
          </div>
          <div>
            <div className="sp-stat-value">{loading ? "—" : `${avgAtt}%`}</div>
            <div className="sp-stat-label">Avg Attendance</div>
          </div>
        </div>

        <div className="sp-stat-card violet">
          <div className="sp-stat-top">
            <div className="sp-stat-icon violet">🏆</div>
            <span className="sp-stat-trend up">A Grade</span>
          </div>
          <div>
            <div className="sp-stat-value">{loading ? "—" : topGrade}</div>
            <div className="sp-stat-label">Top Performers</div>
          </div>
        </div>

        <div className="sp-stat-card orange">
          <div className="sp-stat-top">
            <div className="sp-stat-icon orange">📚</div>
            <span className="sp-stat-trend up">Active</span>
          </div>
          <div>
            <div className="sp-stat-value">{loading ? "—" : courseSummary.length}</div>
            <div className="sp-stat-label">Courses</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="sp-alert-error">
          <span>⚠ {error}</span>
          <button className="sp-alert-retry" onClick={fetchStudents}>Retry</button>
        </div>
      )}

      {/* 2-col: top students + courses */}
      <div className="sp-content-grid">

        {/* Top students by attendance */}
        <div className="sp-panel">
          <div className="sp-panel-header">
            <div className="sp-panel-title">Top Attendance</div>
            <button
              onClick={() => navigate("/students")}
              style={{ fontSize:11, color:"var(--accent-blue)", background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}
            >
              View All →
            </button>
          </div>

          {loading ? (
            <div className="sp-state"><div className="sp-spinner" /></div>
          ) : topStudents.length === 0 ? (
            <div className="sp-state">
              <div className="sp-state-icon">🎓</div>
              <div className="sp-state-text">No students yet</div>
              <div className="sp-state-sub">Add students to see statistics</div>
            </div>
          ) : (
            <div style={{ padding:"8px 0" }}>
              {topStudents.map((s, i) => {
                const pct = Number(s.attendance ?? 0);
                return (
                  <div key={s.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 20px", borderBottom: i < topStudents.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <div style={{ width:22, height:22, borderRadius:6, background:"rgba(255,255,255,0.07)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"var(--text-muted)", flexShrink:0 }}>
                      {i+1}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:600, fontSize:13, color:"var(--text-primary)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {s.firstName} {s.lastName}
                      </div>
                      <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:1 }}>{s.course || "—"}</div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                      <div style={{ width:60, height:4, background:"rgba(255,255,255,0.06)", borderRadius:2, overflow:"hidden" }}>
                        <div style={{ width:`${Math.min(pct,100)}%`, height:"100%", background:attGrad(pct), borderRadius:2 }} />
                      </div>
                      <span style={{ fontSize:12, fontWeight:600, color:"var(--text-secondary)", minWidth:32, textAlign:"right" }}>{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Course breakdown */}
        <div className="sp-panel">
          <div className="sp-panel-header">
            <div className="sp-panel-title">Courses</div>
            <span className="sp-panel-count">{courseSummary.length}</span>
          </div>

          {loading ? (
            <div className="sp-state" style={{ padding:"28px" }}><div className="sp-spinner" /></div>
          ) : courseSummary.length === 0 ? (
            <div className="sp-state" style={{ padding:"28px" }}><div className="sp-state-sub">No courses yet</div></div>
          ) : (
            <div className="sp-course-list">
              {courseSummary.map((c) => (
                <div key={c.name} className="sp-course-item">
                  <div className="sp-course-left">
                    <div className="sp-course-dot" style={{ background: c.dot }} />
                    <div>
                      <div className="sp-course-name">{c.name}</div>
                      <div className="sp-course-sub">{c.count} student{c.count !== 1 ? "s" : ""}</div>
                    </div>
                  </div>
                  <span className="sp-course-count">{c.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
