import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

export const Dashboard = () => {
  const { data: cards, isLoading } = useQuery({
    queryKey: ['cards'],
    queryFn: () => api.get('/api/cards'),
  })

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/api/notifications'),
  })

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  const myCards = cards?.filter((card: any) => card.status === 'in_progress') || []
  const newCards = cards?.filter((card: any) => card.status === 'new') || []
  const urgentCards = cards?.filter((card: any) => card.priority === 'high') || []

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="card">
          <p className="text-sm text-gray-500">Total Cards</p>
          <p className="text-3xl font-bold text-gray-900">{cards?.length || 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">New</p>
          <p className="text-3xl font-bold text-blue-600">{newCards.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-3xl font-bold text-yellow-600">{myCards.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Urgent</p>
          <p className="text-3xl font-bold text-red-600">{urgentCards.length}</p>
        </div>
      </div>

      {/* My Cards */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">My Cards</h2>
        <div className="space-y-3">
          {myCards.slice(0, 5).map((card: any) => (
            <div key={card.id} className="card flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{card.title}</h3>
                <p className="text-sm text-gray-500">{card.category?.name}</p>
              </div>
              <span
                className={`rounded px-2 py-1 text-xs font-medium ${
                  card.priority === 'high'
                    ? 'bg-red-100 text-red-700'
                    : card.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                }`}
              >
                {card.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Notifications */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Notifications</h2>
        <div className="space-y-3">
          {notifications?.slice(0, 5).map((notif: any) => (
            <div key={notif.id} className={`card ${notif.isRead ? 'opacity-60' : ''}`}>
              <h3 className="font-medium text-gray-900">{notif.title}</h3>
              <p className="text-sm text-gray-500">{notif.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
