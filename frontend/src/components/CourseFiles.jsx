import { useState, useEffect } from 'react'
import axios from 'axios'

function CourseFiles({ courseId }) {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        const response = await axios.get(
          `http://localhost:5002/api/courses/${courseId}/files`,
          {
            headers: {
              'Authorization': JSON.stringify(user)
            }
          }
        )

        if (response.data && response.data.files) {
          setFiles(response.data.files)
        }
      } catch (error) {
        console.error('Error fetching files:', error)
        setError('Failed to load course files')
      } finally {
        setLoading(false)
      }
    }

    fetchFiles()
  }, [courseId])

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
              <a 
                href={file.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="download-link"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CourseFiles 