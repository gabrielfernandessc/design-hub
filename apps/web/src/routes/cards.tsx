import React from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

export const CardsList = () => {
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [priorityFilter, setPriorityFilter] = React.useState('all')

  const { data: cards, isLoading } = useQuery({
    queryKey: ['cards', statusFilter, priorityFilter],
    queryFn: () => {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      return fetch(`/api/cards?${params}`).then((res) => res.json())
    },
  })

  const filteredCards =
    cards?.filter((card: any) => {
      const matchesSearch =
        card.title.toLowerCase().includes(search.toLowerCase()) ||
        card.description?.toLowerCase().includes(search.toLowerCase())
      const matchesPriority = priorityFilter === 'all' || card.priority === priorityFilter
      return matchesSearch && matchesPriority
    }) || []

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Cards</h1>
        <Link to="/cards/new" className="btn btn-primary">
          New Card
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search cards..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input w-48"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="in_progress">In Progress</option>
          <option value="waiting_feedback">Waiting Feedback</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="input w-48"
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Cards Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Assignee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCards.map((card: any) => (
              <tr key={card.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <Link
                    to="/cards/$cardId"
                    params={{ cardId: card.id }}
                    className="font-medium text-gray-900 hover:text-primary-600"
                  >
                    {card.title}
                  </Link>
                  {card.description && (
                    <p className="line-clamp-1 text-sm text-gray-500">{card.description}</p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      card.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : card.status === 'in_progress'
                          ? 'bg-yellow-100 text-yellow-700'
                          : card.status === 'waiting_feedback'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {card.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
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
                </td>
                <td className="px-6 py-4">
                  {card.assignee ? (
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100">
                        <span className="text-xs text-primary-600">
                          {card.assignee.name?.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-900">{card.assignee.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Unassigned</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(card.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
