import axiosInstance from './axiosInstance'

export const assignmentService = {
    // Create assignment
    createAssignment: async (courseId, assignmentData) => {
        const response = await axiosInstance.post(`/courses/${courseId}/assignments`, assignmentData)
        return response.data
    },

    // Get course assignments
    getCourseAssignments: async (courseId) => {
        const response = await axiosInstance.get(`/courses/${courseId}/assignments`)
        return response.data
    },

    // Update assignment
    updateAssignment: async (assignmentId, assignmentData) => {
        const response = await axiosInstance.put(`/assignments/${assignmentId}`, assignmentData)
        return response.data
    },

    // Delete assignment
    deleteAssignment: async (assignmentId) => {
        const response = await axiosInstance.delete(`/assignments/${assignmentId}`)
        return response.data
    },

    // Submit assignment (student)
    submitAssignment: async (assignmentId, submissionData) => {
        const response = await axiosInstance.post(`/assignments/${assignmentId}/submit`, submissionData)
        return response.data
    }
} 