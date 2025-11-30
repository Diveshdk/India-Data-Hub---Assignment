import { initializeApp, getApps } from "firebase/app"
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Log config for debugging (only in development)
if (typeof window !== "undefined") {
  console.log("Firebase Config:", {
    apiKey: firebaseConfig.apiKey?.substring(0, 10) + "...",
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
  })
}

// Initialize Firebase only if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)

// Auth mode: "test" = no auth required, "development" = Firebase auth required
export const AUTH_MODE = process.env.NEXT_PUBLIC_AUTH_MODE || "test"
export const isTestMode = () => AUTH_MODE === "test"

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<User> {
  try {
    console.log("Attempting sign in for:", email)
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    console.log("Sign in successful")
    return userCredential.user
  } catch (error: any) {
    console.error("Sign in error:", error.code, error.message)
    throw error
  }
}

// Create new user account
export async function signUp(email: string, password: string): Promise<User> {
  try {
    console.log("Attempting sign up for:", email)
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    console.log("Sign up successful")
    return userCredential.user
  } catch (error: any) {
    console.error("Sign up error:", error.code, error.message)
    throw error
  }
}

// Sign out
export async function logout(): Promise<void> {
  await signOut(auth)
}

// Subscribe to auth state changes
export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback)
}

// Get current user
export function getCurrentUser(): User | null {
  return auth.currentUser
}

export { auth }
