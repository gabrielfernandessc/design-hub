import React from 'react'

interface LayoutProps {
  children: React.ReactNode
  navigate: (path: string) => void
  currentPath: string
}

const NavLink: React.FC<{
  path: string
  currentPath: string
  onClick: (path: string) => void
  children: React.ReactNode
}> = ({ path, currentPath, onClick, children }) => {
  const isActive = currentPath === path || (path !== '/' && currentPath.startsWith(path))
  return (
    <button
      onClick={() => onClick(path)}
      className={`block w-full rounded-lg px-4 py-2 text-left ${
        isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  )
}

export const Layout: React.FC<LayoutProps> = ({ children, navigate, currentPath }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-6">
          <h1 className="text-xl font-bold text-primary-600">Design Hub</h1>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <NavLink path="/" currentPath={currentPath} onClick={navigate}>
            Dashboard
          </NavLink>
          <NavLink path="/board" currentPath={currentPath} onClick={navigate}>
            Kanban Board
          </NavLink>
          <NavLink path="/cards" currentPath={currentPath} onClick={navigate}>
            Cards
          </NavLink>
          <NavLink path="/projects" currentPath={currentPath} onClick={navigate}>
            Projects
          </NavLink>
          <NavLink path="/settings" currentPath={currentPath} onClick={navigate}>
            Settings
          </NavLink>
        </nav>

        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
              <span className="font-medium text-primary-600">U</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">User</p>
              <p className="text-xs text-gray-500">Designer</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
