import { useState, useEffect } from 'react'
import { authService } from '../services/api/authService'

function UserProfile({ userId }) {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await authService.getProfile(userId)
                setProfile(response.user)
            } catch (error) {
                setError('Failed to load profile')
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [userId])

    const handleProfileUpdate = async (updatedData) => {
        try {
            const response = await authService.updateProfile(userId, updatedData)
            setProfile(response.user)
        } catch (error) {
            setError('Failed to update profile')
        }
    }

    // ... render profile form
} 