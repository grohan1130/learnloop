import { useState, useEffect } from 'react'
import { courseService } from '../services/api/courseService'

/**
 * Displays and manages course materials/files
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.courseId - The ID of the course
 * @param {number} props.refreshTrigger - Trigger to refresh the file list
 * @returns {JSX.Element} Course files management interface
 */
function CourseFiles({ courseId, refreshTrigger }) {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await courseService.listMaterials(courseId)
        if (response && response.files) {
          setFiles(response.files)
        }
      } catch (error) {
        console.error('Error fetching files:', error)
        setError('Failed to load course files')
      } finally {
        setLoading(false)
      }
    }

    fetchFiles()
  }, [courseId, refreshTrigger])

  /**
   * Handles file deletion
   * @async
   * @function
   * @param {string} fileKey - The key of the file to delete
   * @returns {Promise<void>}
   */
  const handleDelete = async (fileKey) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return
    }
    
    try {
      setDeleting(fileKey)
      await courseService.deleteMaterial(courseId, fileKey)
      
      // Remove file from state
      setFiles(files.filter(file => file.key !== fileKey))
    } catch (error) {
      console.error('Error deleting file:', error)
      alert('Failed to delete file')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <div>Loading files...</div>
  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="course-files">
      <h3>Course Materials</h3>
      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <div className="file-list">
          {files.map((file) => (
            <div key={file.key} className="file-item">
              <div className="file-info">
                <span className="file-name">{file.title}</span>
                <span className="file-date">
                  {new Date(file.lastModified).toLocaleDateString()}
                </span>
              </div>
              <div className="file-actions">
                <a 
                  href={file.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="download-link"
                >
                  Download
                </a>
                <button
                  onClick={() => handleDelete(file.key)}
                  className="delete-button"
                  disabled={deleting === file.key}
                >
                  {deleting === file.key ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CourseFiles 