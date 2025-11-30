"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { DataTable } from "./data-table"

interface FrequentItem {
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

interface ResponseData {
  categories: Record<string, any>
  frequent: FrequentItem[]
}

interface DashboardProps {
  onLogout: () => void
}

const DATASETS = [
  { id: "india", label: "India & States" },
  { id: "global", label: "Global Data" },
  { id: "bis", label: "BIS" },
  { id: "imf", label: "IMF" },
  { id: "worldbank", label: "World Bank" },
  { id: "un", label: "United Nations" },
]

// Country code to name mapping for IMF data
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
  EST: "Estonia",
  FIN: "Finland",
  FRA: "France",
  GBR: "United Kingdom",
  GRC: "Greece",
  HUN: "Hungary",
  IRL: "Ireland",
  ISL: "Iceland",
  ISR: "Israel",
  ITA: "Italy",
  JPN: "Japan",
  KOR: "Korea",
  LTU: "Lithuania",
  LUX: "Luxembourg",
  LVA: "Latvia",
  MEX: "Mexico",
  NLD: "Netherlands",
  NOR: "Norway",
  NZL: "New Zealand",
  POL: "Poland",
  PRT: "Portugal",
  SVK: "Slovakia",
  SVN: "Slovenia",
  SWE: "Sweden",
  TUR: "Turkey",
  USA: "United States",
  ZAF: "South Africa",
  BRA: "Brazil",
  CHN: "China",
  IND: "India",
  RUS: "Russia",
  ARG: "Argentina",
  EGY: "Egypt",
  NGA: "Nigeria",
  SAU: "Saudi Arabia",
  ARE: "United Arab Emirates",
  HKG: "Hong Kong",
  SGP: "Singapore",
  TWN: "Taiwan",
  EUR: "Euro Area",
  G7C: "G7 Countries",
  ADE: "Advanced Economies",
  OAE: "Other Advanced Economies",
  CHL: "Chile",
  COL: "Colombia",
  ECU: "Ecuador",
  BHR: "Bahrain",
  BTN: "Bhutan",
  ETH: "Ethiopia",
  GHA: "Ghana",
  KEN: "Kenya",
  LBY: "Libya",
  MUS: "Mauritius",
  MAR: "Morocco",
  SOM: "Somalia",
  SDN: "Sudan",
  TZA: "Tanzania",
  UGA: "Uganda",
  AGO: "Angola",
  BWA: "Botswana",
  MOZ: "Mozambique",
  NAM: "Namibia",
  ZMB: "Zambia",
  ZWE: "Zimbabwe",
  BGD: "Bangladesh",
  IDN: "Indonesia",
  MYS: "Malaysia",
  PAK: "Pakistan",
  PHL: "Philippines",
  THA: "Thailand",
  VNM: "Vietnam",
  IRN: "Iran",
  IRQ: "Iraq",
  JOR: "Jordan",
  KWT: "Kuwait",
  LBN: "Lebanon",
  OMN: "Oman",
  QAT: "Qatar",
  SYR: "Syria",
  YEM: "Yemen",
}

// Reverse mapping: Country name to code
const COUNTRY_NAME_TO_CODE: Record<string, string> = Object.entries(COUNTRY_CODE_MAP).reduce(
  (acc, [code, name]) => {
    acc[name.toLowerCase()] = code
    return acc
  },
  {} as Record<string, string>
)

export function Dashboard({ onLogout }: DashboardProps) {
  const [selectedDataset, setSelectedDataset] = useState("india")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedPath, setSelectedPath] = useState<string[]>([]) // Track full path for nested categories
  const [currentPage, setCurrentPage] = useState(1)
  const [indiaData, setIndiaData] = useState<ResponseData | null>(null)
  const [imfData, setImfData] = useState<ResponseData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const itemsPerPage = 10

  // Load India data from response1.json on mount
  useEffect(() => {
    if (!indiaData) {
      setIsLoading(true)
      fetch("/response1.json")
        .then((res) => res.json())
        .then((data: ResponseData) => {
          setIndiaData(data)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error("Error loading India data:", error)
          setIsLoading(false)
        })
    }
  }, [indiaData])

  // Load IMF data from response2.json when IMF is selected
  useEffect(() => {
    if (selectedDataset === "imf" && !imfData) {
      setIsLoading(true)
      fetch("/response2.json")
        .then((res) => res.json())
        .then((data: ResponseData) => {
          setImfData(data)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error("Error loading IMF data:", error)
          setIsLoading(false)
        })
    }
  }, [selectedDataset, imfData])

  const categories = useMemo(() => {
    if (selectedDataset === "imf" && imfData) {
      return imfData.categories
    }
    return indiaData?.categories || {}
  }, [selectedDataset, imfData, indiaData])

  const frequentData = useMemo(() => {
    const sourceData = selectedDataset === "imf" && imfData ? imfData : indiaData
    const frequent = sourceData?.frequent || []
    
    if (!selectedCategory && selectedPath.length === 0) {
      return frequent
    }
    
    if (selectedDataset === "imf") {
      // For IMF data, filter by path
      // Path can be: [Region] or [Region, Country] or [Region, Country, Category]
      if (selectedPath.length === 0) {
        return frequent
      }
      
      const regionName = selectedPath[0] // e.g., "Africa", "Australasia", "Europe"
      const countryName = selectedPath.length >= 2 ? selectedPath[1] : null
      const categoryName = selectedPath.length >= 3 ? selectedPath[2] : null
      
      // Get all country names in the selected region
      const regionData = imfData?.categories[regionName] as Record<string, any> | undefined
      const countriesInRegion = regionData ? Object.keys(regionData) : []
      
      return frequent.filter((item: FrequentItem) => {
        // Get the country name from the item's region code
        const itemCountryName = item.region ? COUNTRY_CODE_MAP[item.region] : null
        
        // If we have a specific country selected, filter by that country
        if (countryName) {
          if (!itemCountryName || itemCountryName.toLowerCase() !== countryName.toLowerCase()) {
            return false
          }
        } else {
          // If only region is selected, filter by countries in that region
          if (itemCountryName && countriesInRegion.length > 0) {
            const isInRegion = countriesInRegion.some(
              (c) => c.toLowerCase() === itemCountryName.toLowerCase()
            )
            if (!isInRegion) {
              return false
            }
          }
        }
        
        // Also filter by category if specified
        if (categoryName && item.cat !== categoryName) {
          return false
        }
        
        return true
      })
    } else {
      // For India data, filter by category and subcategory
      if (selectedPath.length === 0 && !selectedCategory) {
        return frequent
      }
      
      const categoryFromPath = selectedPath[0] || selectedCategory
      const subCategoryFromPath = selectedPath.length >= 2 ? selectedPath[1] : null
      
      return frequent.filter((item: FrequentItem) => {
        if (categoryFromPath && item.cat !== categoryFromPath) {
          return false
        }
        if (subCategoryFromPath && item.subCat !== subCategoryFromPath) {
          return false
        }
        return true
      })
    }
  }, [selectedDataset, imfData, selectedCategory, selectedPath])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return frequentData.slice(start, start + itemsPerPage)
  }, [frequentData, currentPage])

  const totalPages = Math.ceil(frequentData.length / itemsPerPage)

  const handleCategorySelect = useCallback((category: string | null, path: string[] = []) => {
    setSelectedCategory(category)
    setSelectedPath(path)
    setCurrentPage(1)
  }, [])

  const handleDatasetChange = useCallback((dataset: string) => {
    setSelectedDataset(dataset)
    setSelectedCategory(null)
    setSelectedPath([])
    setCurrentPage(1)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onLogout={onLogout} />

      <div className="flex">
        <Sidebar
          datasets={DATASETS}
          selectedDataset={selectedDataset}
          onDatasetChange={handleDatasetChange}
          categories={categories}
          selectedCategory={selectedCategory}
          selectedPath={selectedPath}
          onCategorySelect={handleCategorySelect}
        />

        <main className="flex-1 p-4">
          <DataTable
            data={paginatedData}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={frequentData.length}
            onPageChange={setCurrentPage}
            selectedCategory={selectedCategory}
            selectedPath={selectedPath}
            isLoading={isLoading}
          />
        </main>
      </div>
    </div>
  )
}
