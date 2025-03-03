import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { courseService } from '../services/api/courseService'
import { authService } from '../services/api/authService'
import EnrollCourseForm from '../components/EnrollCourseForm'
import logo from '../assets/images/learnLoopLogoNoText.svg'
import '../styles/components/_courseGrid.css'

/**
 * Dashboard for student users
 * @component
 * @returns {JSX.Element} The student dashboard view
 */
function StudentDashboard() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showEnrollForm, setShowEnrollForm] = useState(false)
  const navigate = useNavigate()

  const fetchCourses = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      console.log("Fetching courses for user:", user)
      if (!user || (!user._id && !user.userId)) {
        console.error("No valid user ID found:", user)
        setError('User ID not found')
        return
      }
      const userId = user._id || user.userId
      console.log("Using user ID:", userId)
      const response = await courseService.getStudentCourses(userId)
      console.log("Got courses response:", response)
      setCourses(response.courses || [])
    } catch (error) {
      console.error("Error fetching courses:", error)
      if (error.response) {
        console.error("Error response:", error.response.data)
      }
      setError('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleEnrollment = async () => {
    setShowEnrollForm(false)
    await fetchCourses() // Refresh courses after enrollment
  }

  return (
    <div className="dashboard-container">
      <nav className="home-nav">
        <div className="nav-logo">
          <img src={logo} alt="LearnLoop Logo" />
          <Link to="/" className="logo">LearnLoop</Link>
        </div>
        <div className="nav-buttons">
          <button className="nav-button">My Account</button>
          <button className="logout-button" onClick={() => {
            authService.logout()
            navigate('/login')
          }}>
            Log Out
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Your Courses</h2>
            <button 
              className="create-button"
              onClick={() => setShowEnrollForm(true)}
            >
              Join Course
            </button>
          </div>

          {loading ? (
            <div className="loading-message">Loading courses...</div>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : courses.length === 0 ? (
            <div className="empty-state">
              <p>You haven't joined any courses yet.</p>
              <p>Click 'Join Course' to enroll in a course using a course code.</p>
            </div>
          ) : (
            <div className="course-grid">
              {courses.map(course => (
                <div 
                  key={course._id} 
                  className="course-card"
                  onClick={() => navigate(`/course/${course._id}`)}
                >
                  <h3>{course.courseName}</h3>
                  <div className="course-details">
                    <p>
                      <strong>{course.department} {course.courseNumber}</strong>
                    </p>
                    <p>
                      {course.term} {course.year}
                    </p>
                    <p className="teacher-name">
                      Instructor: {course.teacher?.firstName} {course.teacher?.lastName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showEnrollForm && (
          <EnrollCourseForm 
            onEnrollment={handleEnrollment}
            onClose={() => setShowEnrollForm(false)}
          />
        )}
      </div>
    </div>
  )
}

export default StudentDashboard 