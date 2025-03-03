import { useState } from 'react'
import { courseService } from '../services/api/courseService'

function UploadMaterialForm({ courseId, onClose, onUploadComplete }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim() || !file) {
      setError('Please provide both a title and a file')
      return
    }

    // Check file type
    if (!file.type.includes('pdf')) {
      setError('Only PDF files are allowed')
      return
    }

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title)
      formData.append('description', description)

      await courseService.uploadMaterial(courseId, formData)

      onUploadComplete && onUploadComplete()
      onClose()
    } catch (error) {
      console.error('Upload error:', error)
      setError(error.response?.data?.error || 'Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Upload Course Material</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for this material"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (optional):</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="file">Select PDF File:</label>
            <input
              type="file"
              id="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UploadMaterialForm 