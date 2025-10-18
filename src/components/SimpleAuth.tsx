// src/cpomponents/SimpleAuth.tsx

"use client";

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { getStoredUser, setStoredUser, removeStoredUser, LocalUser } from '@/lib/local-storage';
import { toast } from 'sonner';

/**
 * SimpleAuth Component
 * 
 * Provides a lightweight client-side authentication using localStorage.
 * Features:
 * - Login with name + email (stored in localStorage)
 * - Auto-generate avatar using Dicebear
 * - Persist user across page reloads
 * - Logout functionality
 */
export function SimpleAuth() {
  const [user, setUser] = useState<LocalUser | null>(null); // Current logged-in user
  const [showLogin, setShowLogin] = useState(false);        // Controls login form visibility
  const [name, setName] = useState('');                     // Form input: name
  const [email, setEmail] = useState('');                   // Form input: email

  // On mount, check if a user is already stored
  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Handle form submission for login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email) {
      toast.error('Please fill in all fields');
      return;
    }

    // Create a new user object
    const newUser: LocalUser = {
      id: Date.now().toString(),
      name,
      email,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`, // auto-generated avatar
      createdAt: new Date().toISOString()
    };

    // Save user in localStorage and update state
    setStoredUser(newUser);
    setUser(newUser);
    setShowLogin(false);
    toast.success(`Welcome, ${name}!`);
  };

  // Handle logout
  const handleLogout = () => {
    removeStoredUser();
    setUser(null);
    toast.success('Logged out successfully');
  };

  // Logged-in view
  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">Welcome, {user.name}</span>
        <img 
          src={user.image} 
          alt={user.name}
          className="w-8 h-8 rounded-full"
        />
        <Button onClick={handleLogout} variant="outline" size="sm">
          Logout
        </Button>
      </div>
    );
  }

  // Login form view
  if (showLogin) {
    return (
      <form onSubmit={handleLogin} className="flex gap-2 items-center">
        <Input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-32"
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-40"
        />
        <Button type="submit" size="sm">Login</Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => setShowLogin(false)}
        >
          Cancel
        </Button>
      </form>
    );
  }

  // Default button to show login form
  return (
    <Button onClick={() => setShowLogin(true)} size="sm">
      Login
    </Button>
  );
}
