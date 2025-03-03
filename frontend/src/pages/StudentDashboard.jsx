import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { courseService } from '../services/api/courseService'
import { authService } from '../services/api/authService'
import EnrollCourseForm from '../components/EnrollCourseForm'
import logo from '../assets/images/learnLoopLogoNoText.svg'
import '../styles/components/_courseGrid.css'

/**
 * StudentDashboard component displays a student's enrolled courses and provides course management functionality
 * @component
 * @returns {JSX.Element} The rendered student dashboard
 */
const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Fetches the courses for the currently logged-in student
     * @async
     * @function fetchCourses
     * @throws {Error} When user is not found or API call fails
     */
    const fetchCourses = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || (!user._id && !user.userId)) {
          setError('User ID not found');
          setLoading(false);
          return;
        }
        const userId = user._id || user.userId;
        const response = await courseService.getStudentCourses(userId);
        setCourses(response.courses || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to fetch courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  /**
   * Handles the completion of course enrollment process
   * @async
   * @function handleEnrollment
   */
  const handleEnrollment = async () => {
    setShowEnrollForm(false);
    await fetchCourses(); // Refresh courses after enrollment
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard-container">
      <nav className="home-nav">
        <div className="nav-logo">
          <img src={logo} alt="LearnLoop Logo" />
          <Link to="/" className="logo">LearnLoop</Link>
        </div>
        <div className="nav-buttons">
          <button className="nav-button">My Account</button>
          <button 
            className="logout-button" 
            onClick={() => {
              authService.logout()
              navigate('/login')
            }}
          >
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

          {courses.length === 0 ? (
            <div className="empty-state">
              <p>You haven't joined any courses yet.</p>
              <p>Click 'Join Course' to enroll in a course using a course code.</p>
            </div>
          ) : (
            <div className="course-grid">
              {courses.map((course) => (
                <div 
                  key={course._id} 
                  className="course-card"
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
  );
};

export default StudentDashboard 