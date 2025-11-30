"use client"

import { memo } from "react"
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Bookmark,
  Copy,
  Share2,
  MoreVertical,
} from "lucide-react"

// Country code to name mapping
const COUNTRY_CODE_MAP: Record<string, string> = {
  AUS: "Australia",
  AUT: "Austria",
  BEL: "Belgium",
  CAN: "Canada",
  CHE: "Switzerland",
  CZE: "Czech Republic",
  DEU: "Germany",
  DNK: "Denmark",
  ESP: "Spain",
  FIN: "Finland",
  FRA: "France",
  GBR: "United Kingdom",
  GRC: "Greece",
  HKG: "Hong Kong",
  IRL: "Ireland",
  ISR: "Israel",
  ITA: "Italy",
  JPN: "Japan",
  KOR: "Korea",
  LUX: "Luxembourg",
  NLD: "Netherlands",
  NOR: "Norway",
  NZL: "New Zealand",
  PRT: "Portugal",
  SGP: "Singapore",
  SVK: "Slovakia",
  SWE: "Sweden",
  TWN: "Taiwan",
  USA: "United States",
  EUR: "Euro Area",
  G7C: "G7",
  ADE: "Advanced",
  OAE: "Other Adv.",
  ARG: "Argentina",
  BRA: "Brazil",
  CHN: "China",
  IND: "India",
  EGY: "Egypt",
  BHR: "Bahrain",
  BTN: "Bhutan",
  CHL: "Chile",
  COL: "Colombia",
  ECU: "Ecuador",
}

interface DataItem {
  id: string
  title: string
  cat: string
  subCat: string
  freq: string
  unit: string
  src: string
  datatype: string
  hierarchy: string[]
  db: string
  subset?: string
  sData?: string
  table_name?: string
  region?: string
}

interface DataTableProps {
  data: DataItem[]
  currentPage: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
  selectedCategory: string | null
  selectedPath?: string[]
  isLoading?: boolean
}

export const DataTable = memo(function DataTable({
  data,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  selectedCategory,
  selectedPath = [],
  isLoading,
}: DataTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded border border-slate-200 p-8 flex items-center justify-center">
        <div className="text-slate-500">Loading data...</div>
      </div>
    )
  }

  // Display path as breadcrumb or just category name
  const displayTitle = selectedPath.length > 0 
    ? selectedPath.join(" > ") 
    : selectedCategory || "Economic Monitor"

  return (
    <div className="bg-white rounded border border-slate-200">
      <div className="flex items-center justify-between p-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button className="text-slate-400 hover:text-slate-600">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="font-medium text-slate-800">{displayTitle}</h2>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded">
            <Search className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded">
            <Filter className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded">
            <ArrowUpDown className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-500 mx-2">Selected (0)</span>
          <button className="flex items-center gap-1 bg-blue-600 text-white text-xs px-3 py-1.5 rounded hover:bg-blue-700">
            <BarChart3 className="w-3 h-3" />
            View Graph
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs text-slate-500 uppercase tracking-wide">
              <th className="px-3 py-2 font-medium">New Releases ({totalItems})</th>
              <th className="px-3 py-2 font-medium">Range</th>
              <th className="px-3 py-2 font-medium">Unit</th>
              <th className="px-3 py-2 font-medium">Coverage</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-slate-500">
                  No data available for this selection. Try selecting a different category or country.
                </td>
              </tr>
            ) : (
              data.map((item) => (
              <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-3 py-2.5">
                  <div className="font-medium text-slate-800">{item.title}</div>
                  <span className="inline-block mt-0.5 text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                    {item.cat} / {item.subCat}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-slate-600">
                  <div>{item.region ? (COUNTRY_CODE_MAP[item.region] || item.region) : item.db}</div>
                  <div className="text-xs text-slate-400">{item.freq}</div>
                </td>
                <td className="px-3 py-2.5 text-slate-600">{item.unit}</td>
                <td className="px-3 py-2.5">
                  <div className="flex gap-1">
                    {item.sData === "Y" && (
                      <span className="w-5 h-5 flex items-center justify-center bg-green-100 text-green-700 text-[10px] font-medium rounded">
                        S
                      </span>
                    )}
                    {item.datatype === "N" && (
                      <span className="w-5 h-5 flex items-center justify-center bg-orange-100 text-orange-700 text-[10px] font-medium rounded">
                        N
                      </span>
                    )}
                    {item.sData === "D" && (
                      <span className="w-5 h-5 flex items-center justify-center bg-red-100 text-red-700 text-[10px] font-medium rounded">
                        D
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1">
                    <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded">
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded">
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded">
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-3 border-t border-slate-200">
        <div className="text-xs text-slate-500">
          {totalItems > 0 
            ? `Showing ${(currentPage - 1) * 10 + 1}-${Math.min(currentPage * 10, totalItems)} of ${totalItems}`
            : "No items to display"
          }
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || totalItems === 0}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-7 h-7 text-xs rounded ${
                  currentPage === page ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {page}
              </button>
            )
          })}
          {totalPages > 5 && <span className="text-slate-400">...</span>}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
})
