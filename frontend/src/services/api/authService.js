import axiosInstance from './axiosInstance'

export const authService = {
    // Teacher registration
    registerTeacher: async (teacherData) => {
        const response = await axiosInstance.post('/register/teacher', teacherData)
        return response.data
    },

    // Student registration
    registerStudent: async (studentData) => {
        const response = await axiosInstance.post('/register/student', studentData)
        return response.data
    },

    // Login
    login: async (credentials) => {
        const response = await axiosInstance.post('/api/auth/login', credentials)
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user))
        }
        return response.data
    },

    // Logout
    logout: () => {
        localStorage.removeItem('user')
    },

    // Update user profile
    updateProfile: async (userId, profileData) => {
        const response = await axiosInstance.put(`/users/${userId}`, profileData)
        return response.data
    },

    // Change password
    changePassword: async (userId, passwordData) => {
        const response = await axiosInstance.put(`/users/${userId}/password`, passwordData)
        return response.data
    },

    // Get user profile
    getProfile: async (userId) => {
        const response = await axiosInstance.get(`/users/${userId}`)
        return response.data
    },

    register: async (userData) => {
        const response = await axiosInstance.post('/api/auth/register', userData)
        return response.data
    }
} 