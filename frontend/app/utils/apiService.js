const API_BASE_URL = 'http://localhost:3001/api';

export const fetchSession = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/sessions`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch session data');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching session:', error);
        throw error;
    }
};

export const fetchUserProfile = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user profile data');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

export const changeUserPassword = async (userId, newPassword) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: newPassword }),
        });

        if (!response.ok) {
            throw new Error('Failed to change password');
        }

        return await response.json();
    } catch (error) {
        console.error('Error changing password:', error);
        throw error;
    }
};
