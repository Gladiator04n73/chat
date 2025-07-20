'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { checkSession } from '../utils/api';


const AuthContext = createContext(); // Create AuthContext


console.log('AuthContext created'); // Debugging log

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize user state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
        const verifySession = async () => { // Verify user session
            console.log('Verifying session...'); // Debugging log
      console.log('Loading state set to true'); // Debugging log

        const session = await checkSession(); // Call checkSession to verify
      setLoading(true); 
      try {
        const session = await checkSession();
        if (session) { // If session exists
          console.log('User session found:', session); // Debugging log
          console.log('Setting user state:', session); // Debugging log
          setUser(session);
        } else { // No session found
          console.log('No session found, clearing user state'); // Debugging log
          console.log('User state cleared'); // Debugging log
          setUser(null); // Clear user if no session found
        }
      } catch (error) { 
        console.error('Session verification error:', error);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children} 
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
}
