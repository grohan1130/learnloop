import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import logo from '../assets/images/learnLoopLogoNoText.svg'

/**
 * Registration page component for new user sign up
 * @component
 * @returns {JSX.Element} A form for user registration
 */
function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    role: 'student',
    institution: ''
  })

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    institution: ''
  })

  const [submitError, setSubmitError] = useState('')

  /**
   * Validates the registration form data
   * @function
   * @returns {boolean} Whether the form is valid
   */
  const validateForm = () => {
    let tempErrors = {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      institution: ''
    }
    let isValid = true

    // First Name validation
    if (!formData.firstName.trim()) {
      tempErrors.firstName = 'First name is required'
      isValid = false
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      tempErrors.lastName = 'Last name is required'
      isValid = false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      tempErrors.email = 'Email is required'
      isValid = false
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Invalid email format'
      isValid = false
    }

    // Username validation
    if (!formData.username.trim()) {
      tempErrors.username = 'Username is required'
      isValid = false
    } else if (formData.username.length < 4) {
      tempErrors.username = 'Username must be at least 4 characters'
      isValid = false
    }

    // Password validation
    if (!formData.password) {
      tempErrors.password = 'Password is required'
      isValid = false
    } else if (formData.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters'
      isValid = false
    } else if (!/(?=.*[0-9])/.test(formData.password)) {
      tempErrors.password = 'Password must contain at least one number'
      isValid = false
    } else if (!/(?=.*[!@#$%^&*])/.test(formData.password)) {
      tempErrors.password = 'Password must contain at least one special character (!@#$%^&*)'
      isValid = false
    }

    // Institution validation
    if (!formData.institution.trim()) {
      tempErrors.institution = 'Institution is required'
      isValid = false
    }

    setErrors(tempErrors)
    return isValid
  }

  /**
   * Handles form submission for registration
   * @function
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event
   * @returns {void}
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        setSubmitError('')
        console.log('Sending registration data:', formData)
        const response = await axios.post('http://localhost:5002/api/register', formData)
        console.log('Registration response:', response.data)
        navigate('/login')
      } catch (error) {
        console.error('Registration error:', error)
        console.error('Error response:', error.response?.data)
        console.error('Error status:', error.response?.status)
        setSubmitError(
          error.response?.data?.error || 
          'Registration failed. Please try again.'
        )
      }
    }
  }

  /**
   * Handles changes to form inputs
   * @function
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - The input change event
   * @returns {void}
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
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
          <h2>Create Account</h2>
          <p className="auth-subtitle">Join LearnLoop to enhance your learning experience</p>

          {submitError && <div className="auth-error">{submitError}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
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

            <div className="form-group">
              <label htmlFor="institution">Institution</label>
              <input
                type="text"
                id="institution"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="auth-submit">
              Create Account
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage 