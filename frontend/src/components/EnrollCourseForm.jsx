import { useState } from 'react'
import { courseService } from '../services/api/courseService'

/**
 * Form for students to enroll in courses using a course code
 * @component
 * @param {Object} props - Component properties
 * @param {Function} props.onEnrollment - Callback function called after successful enrollment
 * @param {Function} props.onClose - Callback function to close the form
 * @returns {JSX.Element} Course enrollment form
 */
function EnrollCourseForm({ onEnrollment, onClose }) {
    const [courseCode, setCourseCode] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    /**
     * Handles form submission for course enrollment
     * @async
     * @function
     * @param {React.FormEvent<HTMLFormElement>} e - The form submission event
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await courseService.enrollWithCode(courseCode.toUpperCase())
            onEnrollment()
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to enroll in course')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Join a Course</h2>
                    <button 
                        className="close-button"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="courseCode">Enter Course Code</label>
                        <input
                            type="text"
                            id="courseCode"
                            value={courseCode}
                            onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
                            placeholder="Enter 6-digit code"
                            maxLength={6}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="cancel-button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading ? 'Enrolling...' : 'Join Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EnrollCourseForm 