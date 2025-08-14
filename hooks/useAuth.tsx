"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        // In a real app, check for stored tokens/session
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock authentication - replace with real auth logic
      if (email === "demo@example.com" && password === "password") {
        const mockUser: User = {
          id: "1",
          email: "demo@example.com",
          name: "Demo User",
          avatar: "/placeholder.svg?height=40&width=40",
          createdAt: new Date(),
          reviewCount: 5,
        };
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
      } else {
        throw new Error("Invalid credentials");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock signup - replace with real auth logic
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
        avatar: "/placeholder.svg?height=40&width=40",
        createdAt: new Date(),
        reviewCount: 0,
      };
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
