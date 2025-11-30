"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { type User } from "firebase/auth"
import { onAuthChange, signIn, signUp, logout } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  authMode: "test" | "development"
  isTestMode: boolean
  setAuthMode: (mode: "test" | "development") => void
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logoutUser: () => Promise<void>
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Get initial auth mode from localStorage or env
function getInitialAuthMode(): "test" | "development" {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("authMode")
    if (stored === "test" || stored === "development") {
      return stored
    }
  }
  return (process.env.NEXT_PUBLIC_AUTH_MODE as "test" | "development") || "test"
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [testModeLoggedIn, setTestModeLoggedIn] = useState(false)
  const [authMode, setAuthModeState] = useState<"test" | "development">("test")

  // Initialize auth mode from localStorage
  useEffect(() => {
    const mode = getInitialAuthMode()
    setAuthModeState(mode)
  }, [])

  const isTestModeActive = authMode === "test"

  // Set auth mode and persist to localStorage
  const setAuthMode = (mode: "test" | "development") => {
    setAuthModeState(mode)
    if (typeof window !== "undefined") {
      localStorage.setItem("authMode", mode)
    }
    // Reset auth state when switching modes
    setUser(null)
    setTestModeLoggedIn(false)
    setError(null)
  }

  useEffect(() => {
    // In test mode, don't use Firebase auth
    if (isTestModeActive) {
      setIsLoading(false)
      return
    }

    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [isTestModeActive])

  const login = async (email: string, password: string) => {
    setError(null)
    setIsLoading(true)

    try {
      if (isTestModeActive) {
        // In test mode, accept any credentials
        setTestModeLoggedIn(true)
        setIsLoading(false)
        return
      }

      await signIn(email, password)
    } catch (err: any) {
      const errorMessage = getFirebaseErrorMessage(err.code)
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string) => {
    setError(null)
    setIsLoading(true)

    try {
      if (isTestModeActive) {
        setTestModeLoggedIn(true)
        setIsLoading(false)
        return
      }

      await signUp(email, password)
    } catch (err: any) {
      const errorMessage = getFirebaseErrorMessage(err.code)
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const logoutUser = async () => {
    try {
      if (isTestModeActive) {
        setTestModeLoggedIn(false)
        return
      }

      await logout()
    } catch (err: any) {
      setError("Failed to logout")
    }
  }

  const clearError = () => setError(null)

  // Determine if user is authenticated
  const isAuthenticated = isTestModeActive ? testModeLoggedIn : !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        authMode,
        isTestMode: isTestModeActive,
        setAuthMode,
        login,
        register,
        logoutUser,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Helper function to convert Firebase error codes to user-friendly messages
function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "Invalid email address"
    case "auth/user-disabled":
      return "This account has been disabled"
    case "auth/user-not-found":
      return "No account found with this email"
    case "auth/wrong-password":
      return "Incorrect password"
    case "auth/email-already-in-use":
      return "An account already exists with this email"
    case "auth/weak-password":
      return "Password should be at least 6 characters"
    case "auth/operation-not-allowed":
      return "Email/password accounts are not enabled"
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later"
    case "auth/invalid-credential":
      return "Invalid email or password"
    default:
      return "Authentication failed. Please try again"
  }
}
