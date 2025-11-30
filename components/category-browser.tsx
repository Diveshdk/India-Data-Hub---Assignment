"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronRight, ChevronDown, Folder, FolderOpen, Globe, MapPin, Building2, FileText } from "lucide-react"

interface CategoryData {
  categories: Record<string, any>
}

interface CategoryBrowserProps {
  indiaData: CategoryData
  worldData: CategoryData
}

export function CategoryBrowser({ indiaData, worldData }: CategoryBrowserProps) {
  const [activeTab, setActiveTab] = useState<"india" | "world">("india")

  return (
    <div className="space-y-6">
      <div className="flex gap-1 rounded-lg bg-muted p-1 w-fit">
        <button
          onClick={() => setActiveTab("india")}
          className={cn(
            "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
            activeTab === "india"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Building2 className="h-4 w-4" />
          India Data
        </button>
        <button
          onClick={() => setActiveTab("world")}
          className={cn(
            "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
            activeTab === "world"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Globe className="h-4 w-4" />
          World Data
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        {activeTab === "india" ? (
          <div>
            <h2 className="text-lg font-medium text-foreground mb-4">Indian Economic Indicators</h2>
            <CategoryTree data={indiaData.categories} level={0} />
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-medium text-foreground mb-4">Global Economic Data by Region</h2>
            <CategoryTree data={worldData.categories} level={0} isWorld />
          </div>
        )}
      </div>
    </div>
  )
}

interface CategoryTreeProps {
  data: Record<string, any>
  level: number
  isWorld?: boolean
}

function CategoryTree({ data, level, isWorld }: CategoryTreeProps) {
  const entries = Object.entries(data)

  if (entries.length === 0) return null

  return (
    <div className={cn("space-y-1", level > 0 && "ml-4 mt-1")}>
      {entries.map(([key, value]) => (
        <CategoryItem key={key} name={key} children={value} level={level} isWorld={isWorld} />
      ))}
    </div>
  )
}

interface CategoryItemProps {
  name: string
  children: Record<string, any>
  level: number
  isWorld?: boolean
}

function CategoryItem({ name, children, level, isWorld }: CategoryItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = children && Object.keys(children).length > 0

  const getIcon = () => {
    if (level === 0 && isWorld) {
      return <Globe className="h-4 w-4 text-blue-500" />
    }
    if (level === 1 && isWorld) {
      return <MapPin className="h-4 w-4 text-emerald-500" />
    }
    if (hasChildren) {
      return isOpen ? <FolderOpen className="h-4 w-4 text-amber-500" /> : <Folder className="h-4 w-4 text-amber-500" />
    }
    return <FileText className="h-4 w-4 text-muted-foreground" />
  }

  return (
    <div>
      <button
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
          "hover:bg-muted/50",
          hasChildren ? "cursor-pointer" : "cursor-default",
          level === 0 && "font-medium",
        )}
      >
        {hasChildren ? (
          <span className="text-muted-foreground">
            {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </span>
        ) : (
          <span className="w-3" />
        )}
        {getIcon()}
        <span className={cn("text-foreground", !hasChildren && "text-muted-foreground")}>{name}</span>
        {hasChildren && <span className="ml-auto text-xs text-muted-foreground">{Object.keys(children).length}</span>}
      </button>

      {isOpen && hasChildren && <CategoryTree data={children} level={level + 1} isWorld={isWorld} />}
    </div>
  )
}
