import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Props {
  children: React.ReactNode;
}

export default function PasswordProtection({ children }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('site-auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Replace this with your desired password
    if (password === process.env.REACT_APP_SITE_PASSWORD) {
      localStorage.setItem('site-auth', 'true');
      setIsAuthenticated(true);
      toast.success('Access granted!');
    } else {
      toast.error('Incorrect password');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-glass-strong backdrop-blur-glass border border-neon-blue/20 rounded-lg">
        <div>
          <h2 className="text-center text-3xl font-display font-bold text-neon-silver">
            ARAM Gamifier
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Enter password to access the site
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-neon-blue/30 bg-black/30 placeholder-gray-500 text-neon-silver focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-neon-blue hover:bg-neon-blue/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-blue"
            >
              Enter Site
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 