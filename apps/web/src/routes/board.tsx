import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'

const columns = [
  { id: 'new', title: 'New', color: 'bg-blue-500' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-yellow-500' },
  { id: 'waiting_feedback', title: 'Waiting Feedback', color: 'bg-orange-500' },
  { id: 'completed', title: 'Completed', color: 'bg-green-500' },
]

export const Board = () => {
  const queryClient = useQueryClient()

  const { data: cards, isLoading } = useQuery({
    queryKey: ['cards'],
    queryFn: () => api.get('/api/cards'),
  })

  const updateStatus = useMutation({
    mutationFn: ({ cardId, status }: { cardId: string; status: string }) =>
      api.patch(`/api/cards/${cardId}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] })
    },
  })

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('cardId', cardId)
  }

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault()
    const cardId = e.dataTransfer.getData('cardId')
    updateStatus.mutate({ cardId, status })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Kanban Board</h1>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((column) => {
          const columnCards = cards?.filter((card: any) => card.status === column.id) || []

          return (
            <div
              key={column.id}
              className="w-80 flex-shrink-0"
              onDrop={(e) => handleDrop(e, column.id)}
              onDragOver={handleDragOver}
            >
              <div className="mb-4 flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${column.color}`}></div>
                <h2 className="font-semibold text-gray-900">{column.title}</h2>
                <span className="text-sm text-gray-500">({columnCards.length})</span>
              </div>

              <div className="min-h-[200px] space-y-3">
                {columnCards.map((card: any) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card.id)}
                    className="card cursor-move transition-shadow hover:shadow-lg"
                  >
                    <h3 className="mb-2 font-medium text-gray-900">{card.title}</h3>
                    {card.description && (
                      <p className="mb-2 line-clamp-2 text-sm text-gray-500">{card.description}</p>
                    )}
                    <div className="flex items-center justify-between">
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
                      {card.assignee && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100">
                          <span className="text-xs text-primary-600">
                            {card.assignee.name?.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
