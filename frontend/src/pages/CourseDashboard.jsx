import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import UploadMaterialForm from '../components/UploadMaterialForm'
import CourseFiles from '../components/CourseFiles'
import logo from '../assets/images/learnLoopLogoNoText.svg'

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

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        if (!user) {
          navigate('/login')
          return
        }

        const response = await axios.get(
          `http://localhost:5002/api/courses/${courseId}`,
          {
            headers: {
              'Authorization': JSON.stringify(user)
            }
          }
        )
        
        if (response.data && response.data.course) {
          setCourse(response.data.course)
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
          <button 
            className="back-button"
            onClick={() => navigate('/dashboard/teacher')}
          >
            ← Back to Dashboard
          </button>
          <button className="nav-button">My Account</button>
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </nav>

      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="course-title">
            {course.department} {course.courseNumber}: {course.courseName}
          </h1>
          <p className="course-term">{course.term} {course.year}</p>
          <p className="course-instructor">
            Professor {course.teacher?.firstName} {course.teacher?.lastName}
          </p>
        </div>
      </div>
      
      <div className="course-management">
        <h2>Course Management</h2>
        <div className="management-options">
          <button>Manage Students</button>
          <button>Create Assignment</button>
          <button onClick={() => setShowUploadForm(true)}>
            Add Course Material
          </button>
        </div>
      </div>

      <CourseFiles courseId={courseId} refreshTrigger={refreshFiles} />

      {showUploadForm && (
        <UploadMaterialForm 
          courseId={courseId}
          onClose={() => setShowUploadForm(false)}
          onUploadComplete={handleUploadComplete}
        />
      )}
    </div>
  )
}

export default CourseDashboard 