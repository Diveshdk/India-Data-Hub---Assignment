"use client"

import type React from "react"

import { useState } from "react"
import { Lock, AlertCircle, Info, ToggleLeft, ToggleRight } from "lucide-react"
import { Header } from "./header"
import { useAuth } from "@/lib/auth-context"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  
  const { login, register, error, clearError, isLoading, isTestMode, authMode, setAuthMode } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    clearError()

    try {
      if (isSignUp) {
        await register(email, password)
      } else {
        await login(email, password)
      }
    } catch (err: any) {
      setLocalError(err.message)
    }
  }

  const toggleAuthMode = () => {
    setAuthMode(isTestMode ? "development" : "test")
    setLocalError(null)
    clearError()
  }

  const displayError = localError || error

  return (
    <div className="min-h-screen bg-slate-100">
      <Header showLogin />

      <main className="flex items-center justify-center py-20">
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          {/* Auth Mode Toggle */}
          <div className={`mb-4 p-3 rounded-lg ${
            isTestMode 
              ? "bg-amber-50 border border-amber-200" 
              : "bg-blue-50 border border-blue-200"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Info className={`w-4 h-4 ${isTestMode ? "text-amber-600" : "text-blue-600"}`} />
                <span className={`text-sm font-medium ${isTestMode ? "text-amber-800" : "text-blue-800"}`}>
                  {isTestMode ? "Test Mode" : "Firebase Mode"}
                </span>
              </div>
              <button
                onClick={toggleAuthMode}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                  isTestMode 
                    ? "bg-amber-200 text-amber-800 hover:bg-amber-300" 
                    : "bg-blue-200 text-blue-800 hover:bg-blue-300"
                }`}
              >
                {isTestMode ? (
                  <>
                    <ToggleLeft className="w-4 h-4" />
                    Switch to Firebase
                  </>
                ) : (
                  <>
                    <ToggleRight className="w-4 h-4" />
                    Switch to Test
                  </>
                )}
              </button>
            </div>
            <p className={`text-xs ${isTestMode ? "text-amber-700" : "text-blue-700"}`}>
              {isTestMode 
                ? "Any email/password will work for testing. Click the button above to use Firebase authentication."
                : "Firebase authentication is enabled. Use valid credentials or switch to test mode."
              }
            </p>
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-slate-600" />
            </div>
            <h2 className="text-xl font-medium text-slate-800">
              {isSignUp ? "Create Account" : "Sign in"}
            </h2>
          </div>

          {displayError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-sm text-red-700">{displayError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder={isTestMode ? "any@email.com" : "Enter your email"}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder={isTestMode ? "any password" : "Enter your password"}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="flex justify-between mt-4 text-xs">
            <a href="#" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp)
                setLocalError(null)
                clearError()
              }}
              className="text-blue-600 hover:underline"
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
