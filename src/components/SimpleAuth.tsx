"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { getStoredUser, setStoredUser, removeStoredUser, LocalUser } from "@/lib/local-storage";
import { toast } from "sonner";

/**
 * SimpleAuth
 * - Optional props to control the login panel visibility externally (Navbar)
 */
type Props = {
  showLogin?: boolean;
  setShowLogin?: (v: boolean) => void;
};

export function SimpleAuth(props: Props) {
  const { showLogin: externalShow, setShowLogin: externalSet } = props;

  // internal fallbacks if parent doesn't control it
  const [internalShow, setInternalShow] = useState(false);
  const showLogin = externalShow ?? internalShow;
  const setShowLogin = externalSet ?? setInternalShow;

  const [user, setUser] = useState<LocalUser | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Please fill in all fields");
      return;
    }
    const newUser: LocalUser = {
      id: Date.now().toString(),
      name,
      email,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString(),
    };
    setStoredUser(newUser);
    setUser(newUser);
    setShowLogin(false);
    toast.success(`Welcome, ${name}!`);
  };

  const handleLogout = () => {
    removeStoredUser();
    setUser(null);
    toast.success("Logged out successfully");
  };

  // If logged in -> compact logged-in view
  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm hidden sm:inline">Welcome, {user.name}</span>
        <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full" />
        <Button onClick={handleLogout} variant="outline" size="sm">Logout</Button>
      </div>
    );
  }

  // If showLogin is true -> render the login form inline (keeps height small)
  if (showLogin) {
    return (
      <form onSubmit={handleLogin} className="flex items-center gap-2">
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
        <Button type="button" variant="ghost" size="sm" onClick={() => setShowLogin(false)}>Cancel</Button>
      </form>
    );
  }

  // Default: show login button. Clicking toggles showLogin in parent (if provided)
  return (
    <Button onClick={() => setShowLogin(true)} size="sm">Login</Button>
  );
}
