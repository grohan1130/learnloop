import { useState, useEffect } from 'react'
import { courseService } from '../services/api/courseService'

/**
 * Displays and manages course enrollment codes
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.courseId - The ID of the course
 * @returns {JSX.Element} Course code display and management interface
 */
function CourseCodeDisplay({ courseId }) {
    const [courseCode, setCourseCode] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    /**
     * Fetches the current course code from the server
     * @async
     * @function
     * @returns {Promise<void>}
     */
    const fetchCourseCode = async () => {
        try {
            const response = await courseService.getCourseCode(courseId)
            setCourseCode(response.courseCode)
        } catch (error) {
            setError('Failed to load course code')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCourseCode()
    }, [courseId])

    /**
     * Generates a new course code
     * @async
     * @function
     * @returns {Promise<void>}
     */
    const handleGenerateCode = async () => {
        setLoading(true)
        try {
            const response = await courseService.generateCourseCode(courseId)
            setCourseCode(response.courseCode)
        } catch (error) {
            setError('Failed to generate course code')
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="loading-message">Loading course code...</div>
    if (error) return <div className="error-message">{error}</div>

    return (
        <div className="course-management">
            <div className="section-header">
                <h2>Course Code</h2>
            </div>
            <div className="management-options">
                <button 
                    onClick={handleGenerateCode}
                >
                    Generate New Code
                </button>
            </div>
            {courseCode ? (
                <div className="course-code-section">
                    <p>Share this code with your students to join the course:</p>
                    <div className="code-box">{courseCode}</div>
                </div>
            ) : (
                <p>No course code generated yet. Click the button to generate one.</p>
            )}
        </div>
    )
}

export default CourseCodeDisplay 