'use client';

import { useState } from 'react';

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth', {
        method: 'DELETE',
      });

      if (response.ok) {
        // Redirect to the login page
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  );
} 