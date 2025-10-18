// src/context/UserContext.tsx

"use client";

import { createContext, useContext, useState, ReactNode } from "react";

/**
 * User type
 * 
 * Optional properties for the authenticated user
 */
type User = {
  name?: string;
  email?: string;
  [key: string]: any; // allow extra fields like id, avatar, etc.
};

/**
 * UserContextType
 * 
 * - `user`: current logged-in user, or null if not logged in
 * - `setUser`: function to update user state
 */
type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

// Create the context (undefined by default so we can enforce usage inside provider)
const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * UserProvider
 * 
 * Wrap your app (or a part of it) to provide user state.
 */
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * useUser hook
 * 
 * A convenient hook to access user context anywhere in the app.
 * Throws an error if used outside UserProvider.
 */
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
