# IndiaDataHub - Economic Data Dashboard

A Next.js application for browsing and analyzing economic data from India and international sources (IMF/World Bank).

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone/download the project
cd assigment

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Authentication

The app supports two authentication modes that can be toggled **directly on the login page**:

### Test Mode (Default)
- **Any email/password combination works**
- Perfect for testing and evaluation
- No Firebase setup required

### Firebase Mode
- Real Firebase authentication
- Requires valid credentials
- Uses Email/Password authentication

**To switch modes:** Simply click the toggle button on the login page - no environment file changes needed!

### Firebase Configuration (Optional)

If you want to use Firebase authentication, create a `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_AUTH_MODE=development
```

## 📊 Data Architecture

### Data Sources

The application uses two JSON files for economic data, both served from the `/public` folder:

| File | Location | Description | Size |
|------|----------|-------------|------|
| `response1.json` | `/public/response1.json` | India economic indicators | ~2MB |
| `response2.json` | `/public/response2.json` | IMF/World Bank international data | ~3MB |

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATA SOURCES                              │
│                    (Both in /public folder)                      │
├─────────────────────────────────────────────────────────────────┤
│  /public/response1.json (India)  /public/response2.json (IMF)   │
│  ├── categories{}                ├── categories{}               │
│  │   ├── Agriculture             │   ├── Africa                 │
│  │   ├── Banking                 │   ├── Americas               │
│  │   ├── Capital Markets         │   ├── Asia Pacific           │
│  │   └── ...                     │   └── Europe                 │
│  └── frequent[]                  └── frequent[]                 │
│      ├── title                       ├── title                  │
│      ├── cat                         ├── cat                    │
│      ├── subCat                      ├── subCat                 │
│      ├── freq                        ├── freq                   │
│      ├── unit                        ├── unit                   │
│      └── region                      └── region (country code)  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATA LOADING STRATEGY                        │
│              (Dynamic Fetch from /public folder)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Dashboard Component (dashboard.tsx)                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  // India data: Fetched on component mount                  │ │
│  │  useEffect(() => {                                          │ │
│  │    fetch('/response1.json')                                 │ │
│  │      .then(res => res.json())                               │ │
│  │      .then(data => setIndiaData(data))                      │ │
│  │  }, [])                                                     │ │
│  │                                                              │ │
│  │  // IMF data: Fetched only when IMF tab is selected         │ │
│  │  useEffect(() => {                                          │ │
│  │    if (selectedDataset === 'imf' && !imfData) {            │ │
│  │      fetch('/response2.json')                               │ │
│  │        .then(res => res.json())                             │ │
│  │        .then(data => setImfData(data))                      │ │
│  │    }                                                         │ │
│  │  }, [selectedDataset])                                      │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EFFICIENT FILTERING                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Path-Based Category Selection                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  selectedPath = ["Asia Pacific", "Australia", "Economy"]    │ │
│  │                                                              │ │
│  │  // Memoized filtering - only recalculates when needed      │ │
│  │  const frequentData = useMemo(() => {                       │ │
│  │    if (!selectedCategory) return allFrequent;               │ │
│  │                                                              │ │
│  │    // For IMF: Filter by region code (AUS, GBR, etc.)      │ │
│  │    if (selectedDataset === 'imf' && countryCode) {         │ │
│  │      return allFrequent.filter(item =>                      │ │
│  │        item.region === countryCode &&                       │ │
│  │        item.cat === selectedCategory                        │ │
│  │      );                                                      │ │
│  │    }                                                         │ │
│  │                                                              │ │
│  │    // For India: Filter by category name                    │ │
│  │    return allFrequent.filter(item =>                        │ │
│  │      item.cat === selectedCategory                          │ │
│  │    );                                                        │ │
│  │  }, [selectedCategory, selectedPath, allFrequent]);         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      UI COMPONENTS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Sidebar    │  │  DataTable   │  │   CategoryBrowser    │  │
│  │              │  │              │  │                      │  │
│  │ • Categories │  │ • Paginated  │  │ • Hierarchical nav   │  │
│  │ • Tree view  │  │ • Sortable   │  │ • Breadcrumbs        │  │
│  │ • Expandable │  │ • Searchable │  │ • Region/Country     │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Optimizations

#### 1. **Dynamic Data Loading from Public Folder**
```typescript
// Both JSON files are in /public folder - served as static assets
// India data: Loaded on component mount
useEffect(() => {
  if (!indiaData) {
    fetch("/response1.json")
      .then(res => res.json())
      .then(data => setIndiaData(data));
  }
}, [indiaData]);

// IMF data: Loaded only when IMF tab is selected (lazy loading)
useEffect(() => {
  if (selectedDataset === "imf" && !imfData) {
    fetch("/response2.json")
      .then(res => res.json())
      .then(data => setImfData(data));
  }
}, [selectedDataset]);
```

**Benefits:**
- ✅ No bundling of large JSON files (faster initial load)
- ✅ Browser caching for subsequent requests
- ✅ IMF data only loads when needed (lazy loading)
- ✅ Easy to update data without rebuilding the app

#### 2. **Memoized Filtering with useMemo**
```typescript
// Prevents recalculation on every render
const frequentData = useMemo(() => {
  return filterDataByCategory(allFrequent, selectedCategory);
}, [allFrequent, selectedCategory, selectedPath]);
```

#### 3. **Country Code Mapping**
```typescript
// Efficient lookup for region codes
const COUNTRY_CODE_MAP: Record<string, string> = {
  "AUS": "Australia",
  "GBR": "United Kingdom",
  "USA": "United States",
  // ... 50+ countries
};
```

#### 4. **Path-Based Navigation**
```typescript
// Track full navigation path for accurate filtering
// ["Region", "Country", "Category", "Subcategory"]
const [selectedPath, setSelectedPath] = useState<string[]>([]);
```

#### 5. **Client-Side Pagination**
```typescript
// Only render visible rows
const paginatedData = frequentData.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);
```

### Data Structure Examples

#### India Data (/public/response1.json)
```json
{
  "categories": [
    {
      "name": "National Accounts",
      "children": [
        { "name": "GDP", "children": [...] },
        { "name": "Consumption", "children": [...] }
      ]
    }
  ],
  "frequent": [
    {
      "title": "GDP at Current Prices",
      "cat": "National Accounts",
      "subCat": "GDP",
      "freq": "Quarterly",
      "unit": "INR Billion"
    }
  ]
}
```

#### IMF/World Data (response2.json)
```json
{
  "categories": [
    {
      "name": "Asia Pacific",
      "children": [
        {
          "name": "Australia",
          "children": [
            { "name": "Economy", "children": [...] }
          ]
        }
      ]
    }
  ],
  "frequent": [
    {
      "title": "Real GDP Growth",
      "cat": "Economy",
      "subCat": "National Accounts",
      "freq": "Annual",
      "unit": "Percent",
      "region": "AUS"
    }
  ]
}
```

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with AuthProvider
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles
├── components/
│   ├── dashboard.tsx       # Main dashboard with data logic
│   ├── sidebar.tsx         # Category navigation tree
│   ├── data-table.tsx      # Paginated data display
│   ├── header.tsx          # Navigation header
│   ├── login-page.tsx      # Authentication page with auth mode toggle
│   └── ui/                 # Reusable UI components (shadcn/ui)
├── lib/
│   ├── firebase.ts         # Firebase configuration
│   ├── auth-context.tsx    # Authentication state management
│   └── utils.ts            # Utility functions
├── public/
│   ├── response1.json      # India economic data (served statically)
│   ├── response2.json      # IMF/World data (served statically)
│   └── logo.svg            # Application logo
├── .env.local              # Environment variables (Firebase config)
└── .env.example            # Example environment file
```

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Authentication:** Firebase Auth
- **State Management:** React Context + Hooks

## 📝 License

This project is for educational/assignment purposes.# India-Data-Hub---Assignment
# India-Data-Hub---Assignment
