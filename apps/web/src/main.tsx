import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from './components/Layout'
import { Dashboard } from './routes/index'
import { Board } from './routes/board'
import { CardsList } from './routes/cards'
import { CardDetail } from './routes/cards/$cardId'
import { Projects } from './routes/projects'
import { Settings } from './routes/settings'
import './styles/globals.css'

const queryClient = new QueryClient()

// Simple router for now - will be replaced with TanStack Router
const App = () => {
  const [currentPath, setCurrentPath] = React.useState(window.location.pathname)

  React.useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
  }

  const renderPage = () => {
    switch (currentPath) {
      case '/board':
        return <Board />
      case '/cards':
        return <CardsList />
      case '/projects':
        return <Projects />
      case '/settings':
        return <Settings />
      default:
        if (currentPath.startsWith('/cards/')) {
          return <CardDetail />
        }
        return <Dashboard />
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Layout navigate={navigate} currentPath={currentPath}>
        {renderPage()}
      </Layout>
    </QueryClientProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
