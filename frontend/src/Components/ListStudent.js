import { useEffect, useState, useMemo } from "react";
import StudentService from "../Services/StudentService";
import { useNavigate } from "react-router-dom";

const GRADS = [
  "linear-gradient(135deg,#667eea,#764ba2)",
  "linear-gradient(135deg,#43e97b,#38f9d7)",
  "linear-gradient(135deg,#4facfe,#00f2fe)",
  "linear-gradient(135deg,#f093fb,#f5576c)",
  "linear-gradient(135deg,#f6d365,#fda085)",
  "linear-gradient(135deg,#30cfd0,#5b86e5)",
  "linear-gradient(135deg,#a18cd1,#fbc2eb)",
];
const COURSE_DOTS = ["#63b3ed","#9f7aea","#4fd1c5","#f687b3","#68d391","#f6ad55","#fc8181"];

const avatarGrad = (n = "") => GRADS[(n.charCodeAt(0) || 0) % GRADS.length];
const initials   = (f = "", l = "") => `${f[0]||""}${l[0]||""}`.toUpperCase() || "?";
const gradeClass = (g = "") => {
  const u = g.toString().toUpperCase();
  if (u.startsWith("A")) return "grade-a";
  if (u.startsWith("B")) return "grade-b";
  if (u.startsWith("C")) return "grade-c";
  return "grade-d";
};
const attGrad = (p) =>
  p >= 80 ? "linear-gradient(90deg,#43e97b,#38f9d7)"
: p >= 60 ? "linear-gradient(90deg,#f6d365,#fda085)"
: "linear-gradient(90deg,#f093fb,#f5576c)";

const ListStudent = () => {
  const navigate = useNavigate();
  const [students,   setStudents]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [search,     setSearch]     = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true); setError("");
      const res = await StudentService.getStudents();
      setStudents(res.data);
    } catch {
      setError("Failed to load students. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      setDeletingId(id); setError("");
      await StudentService.deleteStudent(id);
      setStudents((p) => p.filter((s) => String(s.id) !== String(id)));
    } catch (e) {
      setError(e.response ? `Delete failed (status ${e.response.status})` : "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  const courseSummary = useMemo(() => {
    const m = {};
    students.forEach((s) => { if (s.course) m[s.course] = (m[s.course] || 0) + 1; });
    return Object.entries(m)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count], i) => ({ name, count, dot: COURSE_DOTS[i % COURSE_DOTS.length] }));
  }, [students]);

  const filtered = students.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (s.firstName || "").toLowerCase().includes(q) ||
      (s.lastName  || "").toLowerCase().includes(q) ||
      (s.email     || "").toLowerCase().includes(q) ||
      (s.course    || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="sp-content">

      {error && (
        <div className="sp-alert-error">
          <span>⚠ {error}</span>
          <button className="sp-alert-retry" onClick={fetchStudents}>Retry</button>
        </div>
      )}

      <div className="sp-content-grid">

        {/* ── Students table ── */}
        <div className="sp-panel">
          <div className="sp-panel-header">
            <div className="sp-panel-title">All Students</div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              {/* Search box */}
              <input
                type="text"
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  background:"rgba(255,255,255,0.05)", border:"1px solid var(--border)",
                  borderRadius:"var(--radius-sm)", padding:"5px 11px",
                  color:"var(--text-primary)", fontSize:12,
                  outline:"none", width:160, fontFamily:"Inter,sans-serif"
                }}
              />
              {!loading && (
                <span className="sp-panel-count">{filtered.length} / {students.length}</span>
              )}
            </div>
          </div>

          {loading ? (
            <div className="sp-state">
              <div className="sp-spinner" />
              <div className="sp-state-text">Loading students…</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="sp-state">
              <div className="sp-state-icon">🎓</div>
              <div className="sp-state-text">{search ? "No matches found" : "No students yet"}</div>
              <div className="sp-state-sub">
                {search ? "Try a different search term" : "Add your first student to get started"}
              </div>
            </div>
          ) : (
            <div className="sp-table-wrap">
              <table className="sp-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Grade</th>
                    <th>Attendance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => {
                    const pct = Number(s.attendance ?? 0);
                    return (
                      <tr key={s.id}>
                        <td>
                          <div className="sp-cell-student">
                            <div className="sp-avatar" style={{ background: avatarGrad(s.firstName) }}>
                              {initials(s.firstName, s.lastName)}
                            </div>
                            <div>
                              <div className="sp-cell-name">{s.firstName} {s.lastName}</div>
                              <div className="sp-cell-id">#{s.id}</div>
                            </div>
                          </div>
                        </td>

                        <td><span className="sp-cell-email">{s.email || "—"}</span></td>

                        <td>
                          {s.course
                            ? <span className="sp-course-pill">{s.course}</span>
                            : <span style={{ color:"var(--text-muted)" }}>—</span>}
                        </td>

                        <td>
                          {s.grade
                            ? <div className={`sp-grade ${gradeClass(s.grade)}`}>{s.grade}</div>
                            : <span style={{ color:"var(--text-muted)" }}>—</span>}
                        </td>

                        <td>
                          <div className="sp-attendance">
                            <div className="sp-att-track">
                              <div className="sp-att-fill" style={{ width:`${Math.min(pct,100)}%`, background:attGrad(pct) }} />
                            </div>
                            <span className="sp-att-pct">{pct}%</span>
                          </div>
                        </td>

                        <td>
                          <div className="sp-actions">
                            <button className="sp-btn-icon btn-edit"
                              onClick={() => navigate(`/add-student/${s.id}`)}
                              disabled={deletingId !== null}>Edit</button>
                            <button className="sp-btn-icon btn-delete"
                              onClick={() => deleteStudent(s.id)}
                              disabled={deletingId !== null}>
                              {deletingId === s.id ? "…" : "Delete"}
                            </button>
                            <button className="sp-btn-icon btn-view"
                              onClick={() => navigate(`/view-student/${s.id}`)}
                              disabled={deletingId !== null}>View</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Course list panel ── */}
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

export default ListStudent;
