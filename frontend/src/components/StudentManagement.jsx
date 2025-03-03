import { useState, useEffect } from 'react'
import { courseService } from '../services/api/courseService'

function StudentManagement({ courseId }) {
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await courseService.getCourseStudents(courseId)
                setStudents(response.students)
            } catch (error) {
                setError('Failed to load students')
            } finally {
                setLoading(false)
            }
        }

        fetchStudents()
    }, [courseId])

    const handleRemoveStudent = async (studentId) => {
        try {
            await courseService.removeStudent(courseId, studentId)
            setStudents(students.filter(s => s._id !== studentId))
        } catch (error) {
            setError('Failed to remove student')
        }
    }

    if (loading) return <div>Loading students...</div>
    if (error) return <div className="error-message">{error}</div>

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Manage Students</h2>
                {students.length === 0 ? (
                    <p>No students enrolled in this course.</p>
                ) : (
                    <ul className="student-list">
                        {students.map(student => (
                            <li key={student._id} className="student-item">
                                <span>{student.firstName} {student.lastName}</span>
                                <button 
                                    onClick={() => handleRemoveStudent(student._id)}
                                    className="remove-button"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default StudentManagement 