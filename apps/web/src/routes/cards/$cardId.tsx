import React from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'

export const CardDetail = () => {
  // Get cardId from URL path
  const pathParts = window.location.pathname.split('/')
  const cardId = pathParts[pathParts.length - 1]
  const queryClient = useQueryClient()
  const [newComment, setNewComment] = React.useState('')

  const { data: card, isLoading } = useQuery({
    queryKey: ['card', cardId],
    queryFn: () => api.get(`/api/cards/${cardId}`),
  })

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/api/users'),
  })

  const updateCard = useMutation({
    mutationFn: (data: any) => api.put(`/api/cards/${cardId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card', cardId] })
    },
  })

  const addComment = useMutation({
    mutationFn: (content: string) =>
      api.post(`/api/cards/${cardId}/comments`, { content, authorId: 'current-user-id' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card', cardId] })
      setNewComment('')
    },
  })

  const handleAssign = (assigneeId: string) => {
    updateCard.mutate({ assigneeId })
  }

  const handleStatusChange = (status: string) => {
    updateCard.mutate({ status })
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      addComment.mutate(newComment)
    }
  }

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  if (!card) {
    return <div className="p-6">Card not found</div>
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/cards" className="text-sm text-primary-600 hover:text-primary-700">
          ← Back to Cards
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          <div className="card">
            <h1 className="mb-4 text-2xl font-bold text-gray-900">{card.title}</h1>
            {card.description && (
              <p className="whitespace-pre-wrap text-gray-600">{card.description}</p>
            )}
          </div>

          {/* Comments */}
          <div className="card">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Comments</h2>

            <div className="mb-4 space-y-4">
              {card.comments?.map((comment: any) => (
                <div key={comment.id} className="border-l-4 border-gray-200 pl-4">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {comment.author?.name || 'Unknown'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600">{comment.content}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="input mb-2"
                rows={3}
              />
              <button type="submit" className="btn btn-primary">
                Add Comment
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="card">
            <h3 className="mb-2 text-sm font-medium text-gray-500">Status</h3>
            <select
              value={card.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="input"
            >
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting_feedback">Waiting Feedback</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Priority */}
          <div className="card">
            <h3 className="mb-2 text-sm font-medium text-gray-500">Priority</h3>
            <span
              className={`rounded px-3 py-1 text-sm font-medium ${
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

          {/* Assignee */}
          <div className="card">
            <h3 className="mb-2 text-sm font-medium text-gray-500">Assignee</h3>
            <select
              value={card.assigneeId || ''}
              onChange={(e) => handleAssign(e.target.value)}
              className="input"
            >
              <option value="">Unassigned</option>
              {users?.map((user: any) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Requester */}
          <div className="card">
            <h3 className="mb-2 text-sm font-medium text-gray-500">Requester</h3>
            <p className="text-gray-900">{card.requesterName || 'Unknown'}</p>
            <p className="text-sm text-gray-500">{card.requesterEmail}</p>
          </div>

          {/* Dates */}
          <div className="card">
            <h3 className="mb-2 text-sm font-medium text-gray-500">Dates</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Created:</span>{' '}
                <span className="text-gray-900">
                  {new Date(card.createdAt).toLocaleDateString()}
                </span>
              </div>
              {card.dueDate && (
                <div>
                  <span className="text-gray-500">Due:</span>{' '}
                  <span className="text-gray-900">
                    {new Date(card.dueDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
