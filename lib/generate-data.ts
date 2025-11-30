interface DataItem {
  id: string
  name: string
  category: string
  subcategory: string
  range: string
  frequency: string
  unit: string
  coverage: { national: boolean; state: boolean; district: boolean }
}

const DATA_NAMES = [
  "CPI Weight - All Commodities (2012 series)",
  "CPI Urban Weight - All Commodities (2012 series)",
  "CPI Rural Weight - All Commodities (2012 series)",
  "Total Expenditure outstanding under NREGA (annual)",
  "Number of Cash Withdrawal Transactions at ATMs",
  "Number of Domestic Payment Frauds Reported (monthly)",
  "Number of Cash Withdrawal Transactions at POS Terminals",
  "Number of Cash Withdrawal Transactions through Micro ATMs",
  "Consumer Price Index - Combined",
  "Wholesale Price Index - All Commodities",
  "Index of Industrial Production",
  "GDP at Current Prices",
  "GDP at Constant Prices",
  "Gross Fixed Capital Formation",
  "Private Final Consumption Expenditure",
  "Merchandise Exports",
  "Merchandise Imports",
  "Trade Balance",
  "Foreign Exchange Reserves",
  "External Debt",
  "FDI Inflows",
  "FDI Outflows",
  "Portfolio Investment",
  "Exchange Rate (INR/USD)",
  "Repo Rate",
  "Reverse Repo Rate",
  "Bank Rate",
  "CRR",
  "SLR",
  "Money Supply (M3)",
  "Credit to Commercial Sector",
  "Deposits of Scheduled Commercial Banks",
  "Non-Food Credit",
  "Priority Sector Lending",
  "Agricultural Credit",
  "MSME Credit",
  "Housing Credit",
  "Education Loans",
  "Vehicle Loans",
  "Personal Loans",
]

const UNITS = ["INR", "USD", "Percent", "Index", "Kilometers", "Number", "Tonnes", "Crores"]
const FREQUENCIES = ["Daily", "Weekly", "Monthly", "Quarterly", "Annually"]

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function generateFrequentData(categories: Record<string, any>, selectedCategory: string | null): DataItem[] {
  const items: DataItem[] = []
  const categoryKeys = Object.keys(categories)

  const filteredCategories = selectedCategory ? { [selectedCategory]: categories[selectedCategory] } : categories

  let id = 0
  for (const [category, subcategories] of Object.entries(filteredCategories)) {
    const subKeys = Object.keys(subcategories as Record<string, any>)

    for (const subcategory of subKeys.length > 0 ? subKeys : [category]) {
      const numItems = Math.floor(seededRandom(id + 1) * 3) + 2

      for (let i = 0; i < numItems; i++) {
        const nameIndex = (id + i) % DATA_NAMES.length
        const seed = id + i + nameIndex

        const startYear = 2011 + Math.floor(seededRandom(seed) * 5)
        const endYear = 2024
        const startMonth = ["Jan", "Apr", "Jul", "Oct"][Math.floor(seededRandom(seed + 1) * 4)]
        const endMonth = ["Mar", "Apr", "Jun", "Dec"][Math.floor(seededRandom(seed + 2) * 4)]

        items.push({
          id: `item-${id}-${i}`,
          name: DATA_NAMES[nameIndex],
          category,
          subcategory: subKeys.length > 0 ? subcategory : "General",
          range: `${startMonth} ${startYear} - ${endMonth} ${endYear}`,
          frequency: FREQUENCIES[Math.floor(seededRandom(seed + 3) * FREQUENCIES.length)],
          unit: UNITS[Math.floor(seededRandom(seed + 4) * UNITS.length)],
          coverage: {
            state: seededRandom(seed + 5) > 0.5,
            national: seededRandom(seed + 6) > 0.3,
            district: seededRandom(seed + 7) > 0.7,
          },
        })
      }
      id++
    }
  }

  return items
}
