export const login = async (email, password) => {
    try {
      console.log('Logging in with:', { email, password });
      const response = await fetch('http://localhost:3001/api/sessions', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          user: {
            email,
            password
          }
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid server response');
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      let data;
      try {
        data = await response.json();
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return {
          name: 'Имя пользователя не указано',
          nickname: 'Имя пользователя не указано',
          email: 'Email не указан',
          description: 'Описание не указано',
          gender: 'Не указан'
        };
      }
      
      const session = await checkSession();
      console.log('Session verification result:', session);

      return data;
    } catch (error) {

      try {
        if (error && typeof error === 'object' && error.message && error.message.includes('Вы уже вошли в систему')) {
          return { alreadyLoggedIn: true };
        }
        if (error && error.toString && error.toString().includes('Вы уже вошли в систему')) {
          return { alreadyLoggedIn: true };
        }
      } catch (e) {
        console.error('Error processing login error:', e);
      }
      throw new Error(error.message || 'Произошла ошибка при входе. Попробуйте еще раз.');
    }
  };

export const logout = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/sessions', {
        method: 'DELETE',
        credentials: 'include',
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

export const register = async (email, name, nickname, password) => {
    try {
      console.log('Registering with:', { email, name, nickname, password });
      const response = await fetch('http://localhost:3001/api/registrations', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          user: {
            email,
            name,
            nickname,
            password
          }
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid server response');
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Произошла ошибка при регистрации. Попробуйте еще раз.');
    }
  };
