import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

type Route = '/' | '/wishlist'

interface RouterContextType {
  currentRoute: Route
  navigate: (route: Route) => void
}

const RouterContext = createContext<RouterContextType | undefined>(undefined)

interface RouterProviderProps {
  children: ReactNode
}

export const RouterProvider = ({ children }: RouterProviderProps) => {
  const [currentRoute, setCurrentRoute] = useState<Route>('/')

  useEffect(() => {
    // Initialize route from URL
    const path = window.location.pathname as Route
    if (path === '/wishlist' || path === '/') {
      setCurrentRoute(path)
    }

    // Listen to popstate events (back/forward browser navigation)
    const handlePopState = () => {
      const path = window.location.pathname as Route
      if (path === '/wishlist' || path === '/') {
        setCurrentRoute(path)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (route: Route) => {
    if (route !== currentRoute) {
      setCurrentRoute(route)
      window.history.pushState(null, '', route)
    }
  }

  return (
    <RouterContext.Provider value={{ currentRoute, navigate }}>
      {children}
    </RouterContext.Provider>
  )
}

export const useRouter = () => {
  const context = useContext(RouterContext)
  if (context === undefined) {
    throw new Error('useRouter must be used within a RouterProvider')
  }
  return context
}