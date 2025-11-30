"use client"

import { useState, memo, useCallback } from "react"
import { ChevronDown, ChevronRight, Home } from "lucide-react"

interface SidebarProps {
  datasets: { id: string; label: string }[]
  selectedDataset: string
  onDatasetChange: (dataset: string) => void
  categories: Record<string, any>
  selectedCategory: string | null
  selectedPath: string[]
  onCategorySelect: (category: string | null, path?: string[]) => void
}

export const Sidebar = memo(function Sidebar({
  datasets,
  selectedDataset,
  onDatasetChange,
  categories,
  selectedCategory,
  selectedPath,
  onCategorySelect,
}: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const toggleCategory = useCallback((category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }, [])

  const categoryKeys = Object.keys(categories)

  return (
    <aside className="w-56 bg-white border-r border-slate-200 min-h-[calc(100vh-48px)] overflow-y-auto">
      <div className="p-3 border-b border-slate-200">
        <label className="block text-xs text-slate-500 mb-1">Category:</label>
        <select
          value={selectedDataset}
          onChange={(e) => onDatasetChange(e.target.value)}
          className="w-full text-sm border border-slate-300 rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {datasets.map((ds) => (
            <option key={ds.id} value={ds.id}>
              {ds.label}
            </option>
          ))}
        </select>
      </div>

      <nav className="py-2">
        <button
          onClick={() => onCategorySelect(null, [])}
          className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left hover:bg-slate-50 ${
            selectedCategory === null && selectedPath.length === 0 ? "bg-slate-100 font-medium" : ""
          }`}
        >
          <Home className="w-4 h-4 text-slate-400" />
          Homepage
        </button>

        {categoryKeys.map((category) => (
          <CategoryItem
            key={category}
            name={category}
            data={categories[category]}
            expandedCategories={expandedCategories}
            selectedPath={selectedPath}
            onToggle={toggleCategory}
            onSelect={onCategorySelect}
            level={0}
            path={[category]}
          />
        ))}
      </nav>
    </aside>
  )
})

interface CategoryItemProps {
  name: string
  data: Record<string, any>
  expandedCategories: Set<string>
  selectedPath: string[]
  onToggle: (category: string) => void
  onSelect: (category: string | null, path?: string[]) => void
  level: number
  path: string[]
}

const CategoryItem = memo(function CategoryItem({
  name,
  data,
  expandedCategories,
  selectedPath,
  onToggle,
  onSelect,
  level,
  path,
}: CategoryItemProps) {
  const pathKey = path.join(" > ")
  const hasChildren = data && Object.keys(data).length > 0
  const isExpanded = expandedCategories.has(pathKey)
  
  // Check if this item is selected by comparing paths
  const isSelected = selectedPath.length === path.length && 
    selectedPath.every((p, i) => p === path[i])

  return (
    <div>
      <button
        onClick={() => {
          onSelect(name, path)
          if (hasChildren) onToggle(pathKey)
        }}
        className={`w-full flex items-center gap-1 py-1.5 text-sm text-left hover:bg-slate-50 ${
          isSelected ? "bg-blue-50 text-blue-700" : ""
        }`}
        style={{ paddingLeft: `${12 + level * 12}px`, paddingRight: "12px" }}
      >
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          ) : (
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          )
        ) : (
          <span className="w-3 shrink-0" />
        )}
        <span className="truncate">{name}</span>
      </button>

      {hasChildren && isExpanded && (
        <div>
          {Object.entries(data).map(([subName, subData]) => (
            <CategoryItem
              key={subName}
              name={subName}
              data={subData as Record<string, any>}
              expandedCategories={expandedCategories}
              selectedPath={selectedPath}
              onToggle={onToggle}
              onSelect={onSelect}
              level={level + 1}
              path={[...path, subName]}
            />
          ))}
        </div>
      )}
    </div>
  )
})
