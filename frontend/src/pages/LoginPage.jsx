import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/api/authService'
import logo from '../assets/images/learnLoopLogoNoText.svg'

/**
 * Login page component that handles user authentication
 * @component
 * @returns {JSX.Element} A form for user login
 */
function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'student'
  })
  const [error, setError] = useState('')

  /**
   * Handles form submission for login
   * @async
   * @function
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event
   * @returns {Promise<void>}
   * @throws {Error} When the API request fails
   * @example
   * <form onSubmit={handleSubmit}>
   *   // form elements
   * </form>
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear any previous errors
    setError('')
    
    // Validation
    if (!formData.username.trim()) {
      setError('Username is required')
      return
    }
    if (!formData.password.trim()) {
      setError('Password is required')
      return
    }

    try {
      const response = await authService.login({
        username: formData.username,
        password: formData.password,
        role: formData.role
      })
      
      if (response) {
        localStorage.setItem('user', JSON.stringify(response))
        navigate(formData.role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student')
      }
    } catch (error) {
      console.error('Login error:', error)
      if (error.response?.status === 401) {
        setError('Invalid username or password')
      } else if (error.response?.data?.error) {
        setError(error.response.data.error)
      } else {
        setError('Login failed. Please try again.')
      }
    }
  }

  /**
   * Handles changes to form inputs
   * @function
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - The input change event
   * @returns {void}
   * @example
   * <input onChange={handleChange} />
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="auth-container">
      <nav className="home-nav">
        <div className="nav-logo">
          <img src={logo} alt="LearnLoop Logo" />
          <Link to="/" className="logo">LearnLoop</Link>
        </div>
      </nav>

      <div className="auth-form-container">
        <div className="auth-card">
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Sign in to continue your learning journey</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">I am a:</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-select"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            <button type="submit" className="auth-submit">
              Sign In
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage 