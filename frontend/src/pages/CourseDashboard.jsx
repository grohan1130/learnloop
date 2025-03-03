import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { courseService } from '../services/api/courseService'
import { authService } from '../services/api/authService'
import UploadMaterialForm from '../components/UploadMaterialForm'
import CourseFiles from '../components/CourseFiles'
import CourseCodeDisplay from '../components/CourseCodeDisplay'
import logo from '../assets/images/learnLoopLogoNoText.svg'
import StudentManagement from '../components/StudentManagement'

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

  const handleLogout = () => {
    authService.logout()
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
      
      <div className="dashboard-content">
        {course.teacher && <CourseCodeDisplay courseId={courseId} />}
        
        <div className="course-management">
          <h2>Course Management</h2>
          <div className="management-options">
            <button onClick={() => setShowStudentManagement(true)}>
              Manage Students
            </button>
            <button>Create Assignment</button>
            <button onClick={() => setShowUploadForm(true)}>
              Add Course Material
            </button>
          </div>
        </div>

        <CourseFiles courseId={courseId} refreshTrigger={refreshFiles} />

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