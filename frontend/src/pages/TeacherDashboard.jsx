import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import CreateCourseForm from '../components/CreateCourseForm'
import logo from '../assets/images/learnLoopLogoNoText.svg'

/**
 * Dashboard for teacher users
 * @component
 * @returns {JSX.Element} The teacher dashboard view
 */
function TeacherDashboard() {
  const [userData, setUserData] = useState(null)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const navigate = useNavigate()

  /**
   * Fetches courses taught by the teacher
   * @async
   * @function
   * @param {string} teacherId - The ID of the teacher
   * @returns {Promise<void>}
   */
  const fetchCourses = async (teacherId) => {
    try {
      console.log('Attempting to fetch courses with ID:', teacherId)
      const response = await axios.get(`http://localhost:5002/api/courses/teacher/${teacherId}`)
      
      if (response.data && response.data.courses) {
        console.log('Received courses:', response.data.courses)
        setCourses(response.data.courses)
      } else {
        console.log('No courses found:', response.data)
        setCourses([])
      }
      
    } catch (error) {
      console.error('Error details:', error.response || error)
      setError('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    console.log('Full user data:', user)
    
    if (!user || user.role !== 'teacher') {
      navigate('/login')
      return
    }
    
    // Try both ID formats
    const teacherId = user._id || user.userId
    if (!teacherId) {
      console.error('No valid ID found in user data:', user)
      setError('Invalid user data')
      return
    }
    
    setUserData(user)
    fetchCourses(teacherId)
  }, [navigate])

  /**
   * Renders a list of courses
   * @function
   * @returns {JSX.Element} The course list component
   */
  const CourseList = () => {
    if (loading) return <div className="course-section">Loading courses...</div>
    if (error) return <div className="course-section" style={{color: 'red'}}>{error}</div>
    if (courses.length === 0) return (
      <div className="course-section">
        <h2>Your Courses</h2>
        <p>No courses created yet.</p>
        <button 
          className="submit-button"
          onClick={() => setShowCreateForm(true)}
        >
          Create New Course
        </button>
      </div>
    )

    return (
      <div className="course-section">
        <div className="course-section-header">
          <h2>Your Courses</h2>
          <button 
            className="submit-button"
            onClick={() => setShowCreateForm(true)}
          >
            Create New Course
          </button>
        </div>
        <div className="course-list">
          {courses.map(course => (
            <div 
              key={course._id} 
              className="course-card"
              onClick={() => navigate(`/course/${course._id}`)}
              role="button"
              tabIndex={0}
            >
              <h4>{course.courseName}</h4>
              <p>{course.department} {course.courseNumber}</p>
              <p>{course.term} {course.year}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (!userData) return null

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

      <div className="dashboard-header">
        <div>
          <h1>Welcome, {userData.firstName}!</h1>
          <p>Instructor at {userData.institution}</p>
        </div>
      </div>

      <CourseList />

      {showCreateForm && (
        <CreateCourseForm 
          onClose={() => setShowCreateForm(false)}
          onCourseCreated={() => fetchCourses(userData._id)}
        />
      )}
    </div>
  )
}

export default TeacherDashboard 