"use client"

import { Search, HelpCircle, Calendar, Database, LogOut, User, ChevronDown } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"

interface HeaderProps {
  showLogin?: boolean
  onLogout?: () => void
}

export function Header({ showLogin, onLogout }: HeaderProps) {
  const { user, isTestMode } = useAuth()

  return (
    <header className="bg-[#1a1a5e] text-white shadow-md">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo Section */}
        <div className="flex items-center">
          <div className="bg-[#1a1a5e] rounded flex items-center justify-center">
            <Image 
              src="/logo.svg" 
              alt="IndiaDataHub Logo" 
              width={140} 
              height={40}
              className="h-10 w-auto"
              priority
            />
          </div>
        </div>

        {/* Search Bar - styled to match logo colors */}
        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1a5e]" />
            <input
              type="text"
              placeholder="Search for data and analytics..."
              className="w-full bg-white text-sm text-[#1a1a5e] placeholder-[#1a1a5e]/60 rounded-md py-2 pl-9 pr-4 border-2 border-[#f7931e] focus:outline-none focus:ring-2 focus:ring-[#f7931e] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          <NavButton icon={<Database className="w-4 h-4" />} label="Database" hasDropdown />
          <NavButton icon={<Calendar className="w-4 h-4" />} label="Calendar" />
          <NavButton icon={<HelpCircle className="w-4 h-4" />} label="Help" />
          
          <div className="w-px h-6 bg-white/20 mx-2" />
          
          {showLogin ? (
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md hover:bg-white/10 transition-colors">
              <User className="w-4 h-4" />
              <span>Login</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              {/* User Info */}
              <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-white/10">
                <div className="w-6 h-6 rounded-full bg-[#f7931e] flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs max-w-[100px] truncate">
                  {isTestMode ? "Test User" : (user?.email?.split("@")[0] || "User")}
                </span>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-[#f7931e] hover:bg-[#e8851a] transition-colors"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

// Reusable navigation button component
function NavButton({ 
  icon, 
  label, 
  hasDropdown 
}: { 
  icon: React.ReactNode
  label: string
  hasDropdown?: boolean 
}) {
  return (
    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md hover:bg-white/10 transition-colors">
      {icon}
      <span className="hidden md:inline">{label}</span>
      {hasDropdown && <ChevronDown className="w-3 h-3 opacity-60" />}
    </button>
  )
}
