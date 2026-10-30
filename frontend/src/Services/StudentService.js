import axios from 'axios';
const STUDENT_BASE_URL = "http://localhost:8080/api/students";
class StudentService {
    getStudents() {
        return axios.get(STUDENT_BASE_URL);
    }
    createStudent(student) {
        return axios.post(STUDENT_BASE_URL, student);
    }
    getStudentByID(studentId) {
        return axios.get(STUDENT_BASE_URL+'/'+studentId);
    }
    updateStudent(studentId, student) {
        return axios.put(STUDENT_BASE_URL+'/'+studentId,student);
    }
    deleteStudent(studentId) {  
        return axios.delete(STUDENT_BASE_URL+'/'+studentId);
    }
}
export default new StudentService();  
