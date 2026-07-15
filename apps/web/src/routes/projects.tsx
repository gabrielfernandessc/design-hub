import React from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

export const Projects = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => fetch('/api/projects').then((res) => res.json()),
  })

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <Link to="/projects/new" className="btn btn-primary">
          New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project: any) => (
          <div key={project.id} className="card transition-shadow hover:shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              {project.color && (
                <div className="h-4 w-4 rounded" style={{ backgroundColor: project.color }}></div>
              )}
              <h2 className="text-lg font-semibold text-gray-900">{project.name}</h2>
            </div>
            {project.description && (
              <p className="mb-4 line-clamp-2 text-sm text-gray-600">{project.description}</p>
            )}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
              <Link
                to="/projects/$projectId"
                params={{ projectId: project.id }}
                className="text-primary-600 hover:text-primary-700"
              >
                View →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
