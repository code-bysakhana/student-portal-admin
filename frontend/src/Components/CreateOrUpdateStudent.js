import { useEffect, useState } from "react";
import StudentService from "../Services/StudentService";
import { useNavigate, useParams } from "react-router-dom";

const CreateOrUpdateStudent = () => {
    const navigate = useNavigate();
    const { id }   = useParams();
    const isNew    = Number(id) < 0;

    const [fields, setFields] = useState({
        firstName: "", lastName: "", email: "",
        course: "", grade: "", attendance: ""
    });
    const [saving, setSaving] = useState(false);
    const [error,  setError]  = useState("");

    const set = (k) => (e) => setFields((f) => ({ ...f, [k]: e.target.value }));

    useEffect(() => {
        if (isNew) return;
        StudentService.getStudentByID(id)
            .then((res) => {
                const s = res.data;
                setFields({
                    firstName:  s.firstName  || "",
                    lastName:   s.lastName   || "",
                    email:      s.email      || "",
                    course:     s.course     || "",
                    grade:      s.grade      || "",
                    attendance: s.attendance ?? "",
                });
            })
            .catch(() => setError("Failed to load student data."));
    }, [id, isNew]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true); setError("");
        try {
            if (isNew) await StudentService.createStudent(fields);
            else       await StudentService.updateStudent(id, fields);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Save failed. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="sp-form-page">
            <div className="sp-form-card">
                <div className="sp-form-head">
                    <div className="sp-form-title">{isNew ? "Enrol New Student" : "Update Student"}</div>
                    <div className="sp-form-subtitle">
                        {isNew ? "Fill in the details below to register a new student"
                               : "Edit the student's information and save changes"}
                    </div>
                </div>

                {error && (
                    <div className="sp-alert-error" style={{ marginBottom: 20 }}>
                        ⚠ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="sp-form-row2">
                        <div className="sp-form-group">
                            <label className="sp-form-label">First Name</label>
                            <input className="sp-input" type="text" placeholder="e.g. Ramiya"
                                value={fields.firstName} onChange={set("firstName")} required />
                        </div>
                        <div className="sp-form-group">
                            <label className="sp-form-label">Last Name</label>
                            <input className="sp-input" type="text" placeholder="e.g. Rajesh"
                                value={fields.lastName} onChange={set("lastName")} required />
                        </div>
                    </div>

                    <div className="sp-form-group">
                        <label className="sp-form-label">Email Address</label>
                        <input className="sp-input" type="email" placeholder="student@example.com"
                            value={fields.email} onChange={set("email")} required />
                    </div>

                    <div className="sp-form-row2">
                        <div className="sp-form-group">
                            <label className="sp-form-label">Course</label>
                            <input className="sp-input" type="text" placeholder="e.g. Python"
                                value={fields.course} onChange={set("course")} required />
                        </div>
                        <div className="sp-form-group">
                            <label className="sp-form-label">Grade</label>
                            <input className="sp-input" type="text" placeholder="e.g. A+"
                                value={fields.grade} onChange={set("grade")} required />
                        </div>
                    </div>

                    <div className="sp-form-group">
                        <label className="sp-form-label">Attendance (%)</label>
                        <input className="sp-input" type="number" placeholder="0 – 100"
                            min="0" max="100" step="any"
                            value={fields.attendance} onChange={set("attendance")} required />
                    </div>

                    <div className="sp-form-footer">
                        <button type="submit" className="sp-btn-save" disabled={saving}>
                            {saving ? "Saving…" : isNew ? "Enrol Student" : "Save Changes"}
                        </button>
                        <button type="button" className="sp-btn-cancel-form" onClick={() => navigate("/")}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateOrUpdateStudent;
