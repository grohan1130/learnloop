import { useState } from 'react'

function UploadMaterialForm({ onClose }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!title.trim() || !file) {
      setError('Please provide both a title and a file')
      return
    }

    // For now, just log the form data
    console.log('Form submitted:', {
      title,
      description,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    })

    // Clear form
    setTitle('')
    setDescription('')
    setFile(null)
    onClose()
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
            <label htmlFor="file">Select File:</label>
            <input
              type="file"
              id="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UploadMaterialForm 