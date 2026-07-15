import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

export const Settings = () => {
  const [activeTab, setActiveTab] = React.useState('profile')

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/api/users'),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/api/categories'),
  })

  const { data: tags } = useQuery({
    queryKey: ['tags'],
    queryFn: () => api.get('/api/tags'),
  })

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Settings</h1>

      <div className="flex gap-6">
        {/* Tabs */}
        <div className="w-48">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full rounded-lg px-4 py-2 text-left ${
                activeTab === 'profile'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`w-full rounded-lg px-4 py-2 text-left ${
                activeTab === 'team'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Team
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full rounded-lg px-4 py-2 text-left ${
                activeTab === 'categories'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab('tags')}
              className={`w-full rounded-lg px-4 py-2 text-left ${
                activeTab === 'tags'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Tags
            </button>
            <button
              onClick={() => setActiveTab('sla')}
              className={`w-full rounded-lg px-4 py-2 text-left ${
                activeTab === 'sla'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              SLA Config
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="card">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Profile Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" className="input" defaultValue="Current User" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" className="input" defaultValue="user@example.com" />
                </div>
                <button className="btn btn-primary">Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="card">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
                <button className="btn btn-primary">Add Member</button>
              </div>
              <div className="space-y-3">
                {users?.map((user: any) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                        <span className="font-medium text-primary-600">{user.name?.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <span className="rounded bg-gray-100 px-2 py-1 text-sm text-gray-600">
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="card">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
                <button className="btn btn-primary">Add Category</button>
              </div>
              <div className="space-y-3">
                {categories?.map((cat: any) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      {cat.color && (
                        <div
                          className="h-4 w-4 rounded"
                          style={{ backgroundColor: cat.color }}
                        ></div>
                      )}
                      <span className="font-medium text-gray-900">{cat.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">SLA: {cat.slaHours}h</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tags' && (
            <div className="card">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Tags</h2>
                <button className="btn btn-primary">Add Tag</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags?.map((tag: any) => (
                  <span
                    key={tag.id}
                    className="rounded-full px-3 py-1 text-sm"
                    style={{ backgroundColor: tag.color || '#e5e7eb', color: '#374151' }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sla' && (
            <div className="card">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">SLA Configuration</h2>
              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-2 font-medium text-gray-900">High Priority</h3>
                  <p className="text-sm text-gray-600">Response within 24 hours</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-2 font-medium text-gray-900">Medium Priority</h3>
                  <p className="text-sm text-gray-600">Response within 48 hours</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-2 font-medium text-gray-900">Low Priority</h3>
                  <p className="text-sm text-gray-600">Response within 72 hours</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
