import axiosInstance from './axiosInstance'

export const courseService = {
    // Course materials
    uploadMaterial: async (courseId, formData) => {
        const response = await axiosInstance.post(`/courses/${courseId}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    },

    listMaterials: async (courseId) => {
        const response = await axiosInstance.get(`/courses/${courseId}/files`)
        return response.data
    },

    deleteMaterial: async (courseId, fileKey) => {
        const response = await axiosInstance.delete(`/courses/${courseId}/files/${fileKey}`)
        return response.data
    },

    // Course details
    getCourseDetails: async (courseId) => {
        const response = await axiosInstance.get(`/courses/${courseId}`)
        return response.data
    },

    // Course management
    createCourse: async (courseData) => {
        const response = await axiosInstance.post('/courses/create', courseData)
        return response.data
    },

    getTeacherCourses: async (teacherId) => {
        const response = await axiosInstance.get(`/courses/teacher/${teacherId}`)
        return response.data
    },

    getStudentCourses: async (studentId) => {
        const response = await axiosInstance.get(`/courses/student/${studentId}`)
        return response.data
    },

    enrollStudent: async (courseId, studentId) => {
        const response = await axiosInstance.post(`/courses/${courseId}/enroll`, { studentId })
        return response.data
    },

    // Update course details
    updateCourse: async (courseId, courseData) => {
        const response = await axiosInstance.put(`/courses/${courseId}`, courseData)
        return response.data
    },

    // Delete course
    deleteCourse: async (courseId) => {
        const response = await axiosInstance.delete(`/courses/${courseId}`)
        return response.data
    },

    // Get enrolled students
    getCourseStudents: async (courseId) => {
        const response = await axiosInstance.get(`/courses/${courseId}/students`)
        return response.data
    },

    // Remove student from course
    removeStudent: async (courseId, studentId) => {
        const response = await axiosInstance.delete(`/courses/${courseId}/students/${studentId}`)
        return response.data
    }
} 