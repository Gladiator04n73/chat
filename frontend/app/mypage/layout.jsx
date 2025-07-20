import React from 'react';
export const metadata = {
  title: 'Профиль',
};
export default function AuthLayout ({ children }) {
  return (
    <div className="auth-layout">
      
      <main>
        {children}
      </main>
    </div>
  );
};

