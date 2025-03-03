import { useState } from 'react'
import axios from 'axios'

/**
 * Form component for creating a new course
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onCourseCreated - Callback function called after successful course creation
 * @param {Function} props.onClose - Callback function called when the form is closed
 * @returns {JSX.Element} A form for creating a course
 * @example
 * <CreateCourseForm onCourseCreated={() => fetchCourses()} onClose={() => closeModal()} />
 */
function CreateCourseForm({ onClose, onCourseCreated }) {
  const [formData, setFormData] = useState({
    courseName: '',
    department: '',
    courseNumber: '',
    term: 'Fall', // Default value
    year: '2024', // Default value
    institution: ''
  })
  const [error, setError] = useState('')

  const terms = ['Fall', 'Spring', 'Summer']
  const years = Array.from({ length: 11 }, (_, i) => 2020 + i)

  /**
   * Handles form submission
   * @async
   * @function
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event
   * @returns {Promise<void>}
   * @throws {Error} When the API request fails
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      const response = await axios.post('http://localhost:5002/api/courses/create', {
        ...formData,
        teacherId: user._id
      })

      if (response.data) {
        onCourseCreated()
        onClose()
      }
    } catch (error) {
      console.error('Error creating course:', error)
      setError(error.response?.data?.error || 'Failed to create course')
    }
  }

  /**
   * Handles changes to form inputs
   * @function
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - The input change event
   * @returns {void}
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Course</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="courseName">Course Name:</label>
            <input
              type="text"
              id="courseName"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              placeholder="Enter course name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="department">Department:</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Enter department"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="courseNumber">Course Number:</label>
            <input
              type="text"
              id="courseNumber"
              name="courseNumber"
              value={formData.courseNumber}
              onChange={handleChange}
              placeholder="Enter course number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="term">Term:</label>
            <select
              id="term"
              name="term"
              value={formData.term}
              onChange={handleChange}
              required
              className="form-select"
            >
              {terms.map(term => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="year">Year:</label>
            <select
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="form-select"
            >
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="institution">Institution:</label>
            <input
              type="text"
              id="institution"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              placeholder="Enter institution"
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCourseForm 