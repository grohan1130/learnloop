import axiosInstance from './axiosInstance'

export const courseService = {
    // Course materials
    uploadMaterial: async (courseId, formData) => {
        const response = await axiosInstance.post(`/api/courses/${courseId}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    },

    listMaterials: async (courseId) => {
        const response = await axiosInstance.get(`/api/courses/${courseId}/files`)
        return response.data
    },

    deleteMaterial: async (courseId, fileKey) => {
        const response = await axiosInstance.delete(`/api/courses/${courseId}/files/${fileKey}`)
        return response.data
    },

    // Course details
    getCourseDetails: async (courseId) => {
        const response = await axiosInstance.get(`/api/courses/${courseId}`)
        return response.data
    },

    // Course management
    createCourse: async (courseData) => {
        // Get logged in user
        const user = JSON.parse(localStorage.getItem('user'))
        // Add teacherId to course data
        const courseWithTeacher = {
            ...courseData,
            teacherId: user._id || user.userId  // Handle both ID formats
        }
        const response = await axiosInstance.post('/api/courses/create', courseWithTeacher)
        return response.data
    },

    getTeacherCourses: async (teacherId) => {
        const response = await axiosInstance.get(`/api/courses/teacher/${teacherId}`)
        return response.data
    },

    getStudentCourses: async (studentId) => {
        const response = await axiosInstance.get(`/api/courses/student/${studentId}`)
        return response.data
    },

    enrollStudent: async (courseId, studentId) => {
        const response = await axiosInstance.post(`/api/courses/${courseId}/enroll`, { studentId })
        return response.data
    },

    // Update course details
    updateCourse: async (courseId, courseData) => {
        const response = await axiosInstance.put(`/api/courses/${courseId}`, courseData)
        return response.data
    },

    // Delete course
    deleteCourse: async (courseId) => {
        const response = await axiosInstance.delete(`/api/courses/${courseId}`)
        return response.data
    },

    // Get enrolled students
    getCourseStudents: async (courseId) => {
        const response = await axiosInstance.get(`/api/courses/${courseId}/students`)
        return response.data
    },

    // Remove student from course
    removeStudent: async (courseId, studentId) => {
        const response = await axiosInstance.delete(`/api/courses/${courseId}/students/${studentId}`)
        return response.data
    },

    // Get course code (for teachers)
    getCourseCode: async (courseId) => {
        const response = await axiosInstance.get(`/api/courses/${courseId}/code`)
        return response.data
    },

    // Generate new course code
    generateCourseCode: async (courseId) => {
        const response = await axiosInstance.post(`/api/courses/${courseId}/code/generate`)
        return response.data
    },

    // Enroll with code (for students)
    enrollWithCode: async (courseCode) => {
        const user = JSON.parse(localStorage.getItem('user'))
        const response = await axiosInstance.post('/api/courses/enroll', {
            courseCode,
            studentId: user._id || user.userId
        })
        return response.data
    }
} 