# Papr Frontend Architecture

## MVVM Architecture Overview

This project follows the **Model-View-ViewModel (MVVM)** architectural pattern, which provides clear separation of concerns and makes the codebase maintainable and testable.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                           │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                        VIEWS                                │   │
│  │  (React Components - UI Layer)                             │   │
│  │                                                             │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │   │
│  │  │  SearchPage  │  │DashboardView │  │   AuthView   │    │   │
│  │  │              │  │              │  │              │    │   │
│  │  │ • SearchBar  │  │ • PaperList  │  │ • SignUpForm │    │   │
│  │  │ • Results    │  │ • Folders    │  │ • LoginForm  │    │   │
│  │  │ • InfoCard   │  │ • SearchBar  │  │              │    │   │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │   │
│  │         │                 │                 │             │   │
│  │         └─────────────────┼─────────────────┘             │   │
│  │                           │                               │   │
│  │                    Binds to ViewModels                    │   │
│  │                    via React Hooks                        │   │
│  └────────────────────────────┬───────────────────────────────┘   │
│                               │                                   │
└───────────────────────────────┼───────────────────────────────────┘
                                │
┌───────────────────────────────┼───────────────────────────────────┐
│                         VIEWMODEL LAYER                           │
│                                │                                   │
│  ┌────────────────────────────┴───────────────────────────────┐  │
│  │             ViewModelProvider (Context API)                 │  │
│  │         Centralized State Management Container              │  │
│  └────────────────────┬─────────────┬──────────────────────────┘  │
│                       │             │                             │
│  ┌────────────────────┼─────────────┼─────────────────────────┐  │
│  │                    ▼             ▼                          │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │              Core ViewModels                          │  │  │
│  │  │                                                       │  │  │
│  │  │  ┌──────────────────┐    ┌───────────────────────┐  │  │  │
│  │  │  │  AuthViewModel   │◄───┤ SearchViewModel       │  │  │  │
│  │  │  │                  │    │                       │  │  │  │
│  │  │  │ • isAuthenticated│    │ • query               │  │  │  │
│  │  │  │ • user           │    │ • results             │  │  │  │
│  │  │  │ • token          │    │ • savedPapers         │  │  │  │
│  │  │  │                  │    │ • folders             │  │  │  │
│  │  │  │ Methods:         │    │                       │  │  │  │
│  │  │  │ • checkAuth()    │    │ Methods:              │  │  │  │
│  │  │  │ • logout()       │    │ • performSearch()     │  │  │  │
│  │  │  │ • uploadThumb()  │    │ • savePaper()         │  │  │  │
│  │  │  └────────┬─────────┘    │ • loadFolders()       │  │  │  │
│  │  │           │              └───────────┬───────────┘  │  │  │
│  │  │           │                          │              │  │  │
│  │  │           └──────────┬───────────────┘              │  │  │
│  │  │                      │                              │  │  │
│  │  │           ┌──────────▼──────────────────┐           │  │  │
│  │  │           │  DashboardViewModel         │           │  │  │
│  │  │           │                             │           │  │  │
│  │  │           │ • folders                   │           │  │  │
│  │  │           │ • savedPapers               │           │  │  │
│  │  │           │ • filters                   │           │  │  │
│  │  │           │                             │           │  │  │
│  │  │           │ Methods:                    │           │  │  │
│  │  │           │ • loadFolders()             │           │  │  │
│  │  │           │ • loadSavedPapers()         │           │  │  │
│  │  │           │ • movePaperToFolder()       │           │  │  │
│  │  │           │ • unsavePaper()             │           │  │  │
│  │  │           └─────────────────────────────┘           │  │  │
│  │  │                                                     │  │  │
│  │  │  ┌──────────────────────┐  ┌─────────────────────┐│  │  │
│  │  │  │ AuthFormViewModel    │  │ CitationViewModel   ││  │  │
│  │  │  │                      │  │                     ││  │  │
│  │  │  │ • username/email     │  │ • selectedFormat    ││  │  │
│  │  │  │ • password           │  │ • selectedPapers    ││  │  │
│  │  │  │ • fieldErrors        │  │                     ││  │  │
│  │  │  │                      │  │ Methods:            ││  │  │
│  │  │  │ Methods:             │  │ • generateCitations ││  │  │
│  │  │  │ • onSubmit()         │  │ • copyToClipboard() ││  │  │
│  │  │  │ • validateForm()     │  │ • formatCitations() ││  │  │
│  │  │  └──────────────────────┘  └─────────────────────┘│  │  │
│  │  └───────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │         All ViewModels:                                  │  │
│  │         • Are class-based with getters/methods           │  │
│  │         • Manage their own state via setState            │  │
│  │         • Expose hooks for React components              │  │
│  │         • Contain business logic                         │  │
│  └──────────────────────────┬───────────────────────────────┘  │
│                             │                                  │
│                    Calls API Layer                            │
└─────────────────────────────┼─────────────────────────────────┘
                              │
┌─────────────────────────────┼─────────────────────────────────┐
│                         MODEL LAYER                            │
│                             │                                  │
│  ┌──────────────────────────┴───────────────────────────────┐ │
│  │               Data & API Services                         │ │
│  │                                                            │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │          GraphQL Client (lib/graphql/)              │ │ │
│  │  │                                                      │ │ │
│  │  │  • graphqlClient.request()                          │ │ │
│  │  │  • setAuthToken() / removeAuthToken()               │ │ │
│  │  │  • Handles HTTP communication with backend          │ │ │
│  │  └──────────────────────┬───────────────────────────────┘ │ │
│  │                         │                                 │ │
│  │  ┌──────────────────────┴───────────────────────────────┐│ │
│  │  │         GraphQL Queries (lib/graphql/queries.ts)     ││ │
│  │  │                                                       ││ │
│  │  │  • SEARCH_PAPERS      • GET_CURRENT_USER            ││ │
│  │  │  • SAVE_PAPER         • GET_SAVED_PAPERS            ││ │
│  │  │  • UNSAVE_PAPER       • GET_FOLDERS                 ││ │
│  │  │  • REGISTER_USER      • CREATE_FOLDER               ││ │
│  │  │  • LOGIN_USER         • MOVE_PAPER_TO_FOLDER        ││ │
│  │  └───────────────────────────────────────────────────────┘│ │
│  │                                                            │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │         Utilities & Helpers                          │ │ │
│  │  │                                                      │ │ │
│  │  │  • api.ts      - REST API wrapper                   │ │ │
│  │  │  • auth.ts     - Auth token management              │ │ │
│  │  │  • utils.ts    - Helper functions                   │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │         Type Definitions (types/)                    │ │ │
│  │  │                                                      │ │ │
│  │  │  • User          • Paper         • Folder           │ │ │
│  │  │  • SavedPaper    • SearchResult  • AuthState        │ │ │
│  │  │  • SearchState   • DashboardState                   │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│                    Communicates with Backend                    │
│                    GraphQL API Server                           │
└─────────────────────────────────────────────────────────────────┘
```

## Detailed Component Breakdown

### 1. **View Layer** (`components/` & `app/`)

The View layer consists of React components responsible for rendering the UI and handling user interactions.

#### Key Components:

- **Search Components** (`components/search/`)
  - `search-page.tsx` - Main search interface
  - `search-results.tsx` - Display search results
- **Dashboard Components** (`components/dashboard/`)
  - `dashboard-page.tsx` - User's saved papers dashboard
- **Auth Components** (`components/signup/`)
  - `signup-page.tsx` - Registration and login forms
- **UI Components** (`components/ui/`)
  - `search-bar.tsx` - Search input component
  - `button.tsx` - Reusable button component
  - `citation-popup.tsx` - Citation generation modal
  - `folder-selection-popup.tsx` - Folder picker modal
  - `paper-folder.tsx` - Paper folder display
  - `user-avatar.tsx` - User profile avatar
  - `theme-switch.tsx` - Dark/light mode toggle

#### View Characteristics:

- **Declarative**: Views declare what they want to render based on ViewModel state
- **Reactive**: Automatically re-render when ViewModel state changes
- **No Business Logic**: Views only handle presentation and user interactions
- **Data Binding**: Use React hooks to access ViewModels

### 2. **ViewModel Layer** (`lib/viewmodels/`)

ViewModels are the bridge between Views and Models. They contain presentation logic and state management.

#### Core ViewModels:

##### **AuthViewModel** (`auth-viewmodel.ts`)

```typescript
class AuthViewModel {
  // State
  isAuthenticated: boolean
  user: User | null
  token: string | null

  // Actions
  checkAuthStatus() // Validate token and load user
  logout() // Clear auth state
  uploadThumbnail() // Upload user profile picture
}
```

##### **SearchViewModel** (`search-viewmodel.ts`)

```typescript
class SearchViewModel {
  // State
  query: string
  results: SearchResult | null
  savedPapers: Set<string>
  folders: Folder[]

  // Actions
  performSearch() // Execute search query
  savePaper() // Save paper to collection
  unsavePaper() // Remove paper from collection
  loadFolders() // Load user folders
  savePaperToFolder() // Save paper to specific folder
}
```

##### **DashboardViewModel** (`dashboard-viewmodel.ts`)

```typescript
class DashboardViewModel {
  // State
  folders: Folder[]
  savedPapers: SavedPaper[]
  filters: DashboardFilters

  // Actions
  loadFolders() // Load all folders
  loadSavedPapers() // Load saved papers
  createFolder() // Create new folder
  movePaperToFolder() // Move paper between folders
  unsavePaper() // Remove paper
}
```

##### **AuthFormViewModel** (`signup-viewmodel.ts`)

```typescript
class AuthFormViewModel {
  // State
  mode: 'signup' | 'login'
  email: string
  password: string
  fieldErrors: Record<string, string>

  // Actions
  onSubmit() // Handle form submission
  validateForm() // Validate form fields
  setMode() // Switch between signup/login
}
```

##### **CitationViewModel** (`citation-viewmodel.ts`)

```typescript
class CitationViewModel {
  // State
  selectedFormat: CitationFormat
  selectedPapers: SavedPaper[]
  generatedCitations: string

  // Actions
  generateCitations() // Generate formatted citations
  copyToClipboard() // Copy citations to clipboard
  setFormat() // Change citation format
}
```

#### ViewModel Provider (`viewmodel-provider.tsx`)

The `ViewModelProvider` is a React Context provider that:

- Creates singleton instances of all ViewModels
- Manages their lifecycle
- Provides them to the component tree
- Syncs state between ViewModels (e.g., folder changes)

```typescript
<ViewModelProvider>
  {/* All child components can access ViewModels */}
</ViewModelProvider>
```

#### ViewModel Characteristics:

- **Class-Based**: All ViewModels are ES6 classes with methods and getters
- **State Management**: Each ViewModel manages its own state using React's `useState`
- **Business Logic**: Contains validation, transformation, and orchestration logic
- **API Communication**: ViewModels call the Model layer for data operations
- **React Integration**: Exposed via custom hooks (`useSearchViewModel()`, etc.)

### 3. **Model Layer** (`lib/`, `types/`)

The Model layer handles data, API communication, and type definitions.

#### GraphQL Client (`lib/graphql/client.ts`)

```typescript
class GraphQLClient {
  request<T>(query, variables): Promise<T>
  setAuthToken(token: string)
  removeAuthToken()
}
```

#### API Queries (`lib/graphql/queries.ts`)

Defines all GraphQL queries and mutations:

- User authentication (register, login, getCurrentUser)
- Paper operations (search, save, unsave)
- Folder management (create, update, delete, move papers)

#### Utilities

- **`lib/api.ts`**: REST API wrapper with methods like `api.get()`, `api.post()`
- **`lib/auth.ts`**: Authentication helpers
  - `getAuthState()` - Read stored auth state
  - `validateToken()` - Validate JWT token
  - `logout()` - Clear auth data

#### Type Definitions (`types/`)

```typescript
// Core domain models
interface User {
  id
  email
  username
  thumbnailUrl
}
interface Paper {
  id
  title
  authors
  abstract
  year
  venue
}
interface Folder {
  id
  name
  paperCount
  papers
}
interface SavedPaper {
  id
  paperId
  folderId
  paper
  notes
}

// State models
interface AuthState {
  isAuthenticated
  user
  token
}
interface SearchState {
  query
  results
  filters
  savedPapers
}
interface DashboardState {
  folders
  savedPapers
  filters
}
```

## Data Flow

### Example: User Searches for Papers

```
1. USER INTERACTION (View Layer)
   └─► User types in SearchBar component
       User clicks "Search" button

2. VIEW CALLS VIEWMODEL
   └─► SearchPage calls searchViewModel.performSearch()

3. VIEWMODEL PROCESSES REQUEST
   └─► SearchViewModel.performSearch()
       ├─► Updates state: isLoading = true
       ├─► Calls Model layer: searchPapersAPI(query, filters)
       │
       4. MODEL LAYER API CALL
          └─► graphqlClient.request(SEARCH_PAPERS, variables)
              └─► HTTP POST to backend GraphQL endpoint
                  │
                  5. BACKEND RESPONSE
                     └─► Returns SearchResult with papers[]
       │
       ├─► Updates state: results = data, isLoading = false
       └─► setState triggers React re-render

6. VIEW UPDATES (View Layer)
   └─► SearchResults component re-renders with new data
       └─► Displays list of papers to user
```

### Example: User Saves a Paper

```
1. USER CLICKS "Save" BUTTON (View Layer)
   └─► Paper card component calls searchViewModel.savePaper(paperId)

2. VIEWMODEL ORCHESTRATION
   └─► SearchViewModel.savePaper()
       ├─► Opens folder selection modal
       ├─► User selects folder
       └─► SearchViewModel.savePaperToFolder(paperId, folderId)
           ├─► Updates state: savingPapers.add(paperId)
           ├─► Calls Model layer: savePaperAPI(paperId, notes, tags)
           │
           3. MODEL LAYER API CALL
              └─► graphqlClient.request(SAVE_PAPER, variables)
                  └─► Backend saves paper to database
                      └─► Returns SavedPaper object
           │
           ├─► If folderId provided: movePaperToFolderAPI(paperId, folderId)
           ├─► Updates state: savedPapers.add(paperId)
           └─► Refreshes folders to update counts

4. VIEW UPDATES
   └─► Paper card shows "Saved" state
       Folder counts update
```

## Key MVVM Principles Applied

### 1. **Separation of Concerns**

- **View**: Only handles presentation
- **ViewModel**: Contains all presentation logic
- **Model**: Manages data and API communication

### 2. **Unidirectional Data Flow**

- User actions → ViewModel methods
- ViewModel methods → Model API calls
- Model responses → ViewModel state updates
- State changes → View re-renders

### 3. **Testability**

- ViewModels can be unit tested without React
- Models can be mocked for ViewModel tests
- Views can be tested with mocked ViewModels

### 4. **Reusability**

- ViewModels can be shared between different views
- UI components are decoupled from business logic
- Same ViewModel can power web and potentially mobile apps

### 5. **State Management**

- Centralized state through `ViewModelProvider`
- ViewModels can reference each other (e.g., SearchViewModel references AuthViewModel)
- State synchronization between ViewModels (e.g., folder state synced between Search and Dashboard)

## File Structure

```
aiprog-frontend/
├── app/                          # Next.js 13+ App Directory
│   ├── layout.tsx               # Root layout with ViewModelProvider
│   ├── page.tsx                 # Home/Search page
│   ├── dashboard/page.tsx       # Dashboard page
│   ├── signup/page.tsx          # Auth page
│   └── api/                     # API routes
│
├── components/                   # VIEW LAYER
│   ├── search/
│   │   ├── search-page.tsx      # Main search view
│   │   └── search-results.tsx   # Results display
│   ├── dashboard/
│   │   └── dashboard-page.tsx   # Dashboard view
│   ├── signup/
│   │   └── signup-page.tsx      # Auth view
│   └── ui/                      # Reusable UI components
│       ├── search-bar.tsx
│       ├── button.tsx
│       ├── citation-popup.tsx
│       └── ...
│
├── lib/                         # VIEWMODEL + MODEL LAYERS
│   ├── viewmodels/              # VIEWMODEL LAYER
│   │   ├── viewmodel-provider.tsx      # Context provider
│   │   ├── auth-viewmodel.ts           # Auth ViewModel
│   │   ├── search-viewmodel.ts         # Search ViewModel
│   │   ├── dashboard-viewmodel.ts      # Dashboard ViewModel
│   │   ├── signup-viewmodel.ts         # Auth Form ViewModel
│   │   └── citation-viewmodel.ts       # Citation ViewModel
│   │
│   ├── graphql/                 # MODEL LAYER - API
│   │   ├── client.ts            # GraphQL client
│   │   └── queries.ts           # GraphQL queries/mutations
│   │
│   ├── api.ts                   # REST API wrapper
│   ├── auth.ts                  # Auth utilities
│   └── utils.ts                 # Utility functions
│
└── types/                       # MODEL LAYER - Types
    ├── index.ts                 # Type exports
    ├── shared.ts                # Shared types (User, etc.)
    ├── search.ts                # Search-related types
    ├── dashboard.ts             # Dashboard types
    ├── signup.ts                # Auth types
    └── citation.ts              # Citation types
```

## Technology Stack

- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + Custom ViewModel classes
- **API Communication**: GraphQL (custom client)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Benefits of This Architecture

1. **Maintainability**: Clear separation makes code easier to understand and modify
2. **Testability**: Each layer can be tested independently
3. **Scalability**: Easy to add new features without touching existing code
4. **Reusability**: ViewModels and UI components can be reused
5. **Type Safety**: Full TypeScript coverage ensures type safety
6. **Performance**: State management is optimized with proper re-render control
7. **Developer Experience**: Clear patterns make onboarding easier

## Best Practices

1. **Views should never directly access the Model layer**
   - Always go through ViewModels

2. **ViewModels should not import React components**
   - Keeps business logic separate from UI

3. **Keep ViewModels focused**
   - Each ViewModel has a single responsibility

4. **Use TypeScript strictly**
   - All props, state, and API responses are typed

5. **Error handling at the ViewModel level**
   - ViewModels catch errors and update state accordingly

6. **Immutable state updates**
   - Always create new state objects, never mutate

---

**Last Updated**: October 15, 2025
