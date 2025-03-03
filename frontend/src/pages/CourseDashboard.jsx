import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { courseService } from '../services/api/courseService'
import { authService } from '../services/api/authService'
import UploadMaterialForm from '../components/UploadMaterialForm'
import CourseFiles from '../components/CourseFiles'
import CourseCodeDisplay from '../components/CourseCodeDisplay'
import logo from '../assets/images/learnLoopLogoNoText.svg'
import StudentManagement from '../components/StudentManagement'
import '../styles/components/_courseDashboard.css'

/**
 * Dashboard for managing a specific course
 * @component
 * @returns {JSX.Element} The course dashboard view
 */
function CourseDashboard() {
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [refreshFiles, setRefreshFiles] = useState(0)
  const [showStudentManagement, setShowStudentManagement] = useState(false)

  /**
   * Handles user logout
   * @function
   * @returns {void}
   */
  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  /**
   * Handles course management and displays course details
   * @async
   * @function fetchCourse
   * @returns {Promise<void>}
   */
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        if (!user) {
          navigate('/login')
          return
        }

        const response = await courseService.getCourseDetails(courseId)
        
        if (response && response.course) {
          setCourse(response.course)
        } else {
          setError('Invalid course data received')
        }
      } catch (error) {
        console.error('Error fetching course:', error.response?.data || error)
        setError(error.response?.data?.error || 'Failed to load course details')
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [courseId, navigate])

  /**
   * Handles completion of file upload
   * @function
   * @returns {void}
   */
  const handleUploadComplete = () => {
    setShowUploadForm(false)
    setRefreshFiles(prev => prev + 1)
  }

  if (loading) return <div>Loading course details...</div>
  if (error) return <div style={{color: 'red'}}>{error}</div>
  if (!course) return <div>Course not found</div>

  return (
    <div className="dashboard-container">
      <nav className="home-nav">
        <div className="nav-logo">
          <img src={logo} alt="LearnLoop Logo" />
          <Link to="/" className="logo">LearnLoop</Link>
        </div>
        <div className="nav-buttons">
          <button className="nav-button">My Account</button>
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>{course?.courseName}</h1>
            <p>{course?.department} {course?.courseNumber} • {course?.term} {course?.year}</p>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Course Materials</h2>
            <button 
              className="create-button"
              onClick={() => setShowUploadForm(true)}
            >
              Add Course Material
            </button>
          </div>

          <CourseFiles courseId={courseId} refreshTrigger={refreshFiles} />
        </div>

        <div className="course-management">
          <h2>Course Management</h2>
          <div className="management-options">
            <button onClick={() => setShowStudentManagement(true)}>
              Manage Students
            </button>
            <button>Create Assignment</button>
          </div>
        </div>

        {showStudentManagement && (
          <StudentManagement
            courseId={courseId}
            onClose={() => setShowStudentManagement(false)}
          />
        )}

        {showUploadForm && (
          <UploadMaterialForm 
            courseId={courseId}
            onClose={() => setShowUploadForm(false)}
            onUploadComplete={handleUploadComplete}
          />
        )}
      </div>
    </div>
  )
}

export default CourseDashboard 