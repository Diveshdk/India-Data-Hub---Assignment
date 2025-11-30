"use client"

import { LoginPage } from "@/components/login-page"
import { Dashboard } from "@/components/dashboard"
import { useAuth } from "@/lib/auth-context"

export default function Home() {
  const { isAuthenticated, isLoading, logoutUser } = useAuth()

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return <Dashboard onLogout={logoutUser} />
}
