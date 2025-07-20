export const checkSession = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/sessions/current', {
      method: 'GET',
      credentials: 'include',
    });


    if (!response.ok || response.status === 401) {
      console.log('No active session found. Please ensure the user is logged in and the session cookie is being sent.');
      return null;
    }

    const sessionData = await response.json();
    

    if (!sessionData?.user?.id) {
      console.log('Invalid session data. Please check the session response structure.');
      return null;
    }


    const userResponse = await fetch(`http://localhost:3001/api/users/${sessionData.user.id}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!userResponse.ok) {
      console.error('Failed to fetch user data:', userResponse.status);
      return null;
    }

    const userData = await userResponse.json();
    console.log('User data fetched successfully:', userData);
    console.log('User ID:', userData.id);
    return userData;

  } catch (error) {
    console.error('Session check error:', error);
    return null;
  }
};
