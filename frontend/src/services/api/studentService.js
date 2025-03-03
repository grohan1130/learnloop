import axiosInstance from './axiosInstance'

export const studentService = {
    // Get enrolled courses
    getEnrolledCourses: async (studentId) => {
        const response = await axiosInstance.get(`/students/${studentId}/courses`)
        return response.data
    },

    // Enroll in a course
    enrollInCourse: async (studentId, courseCode) => {
        const response = await axiosInstance.post(`/students/${studentId}/enroll`, {
            courseCode
        })
        return response.data
    },

    // View course materials
    getCourseMaterials: async (courseId) => {
        const response = await axiosInstance.get(`/courses/${courseId}/materials`)
        return response.data
    }
} 