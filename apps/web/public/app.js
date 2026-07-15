// Design Hub - Frontend React (simplified version)
const API_URL = window.location.origin + '/api'

// Simple router
let currentPage = 'dashboard'
let currentCardId = null

// API helper
async function api(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  return response.json()
}

// Render functions
function renderApp() {
  const root = document.getElementById('root')
  root.innerHTML = `
    <div class="flex min-h-screen">
      ${renderSidebar()}
      <main class="flex-1 p-6">
        ${renderPage()}
      </main>
    </div>
  `
  setupEventListeners()
}

function renderSidebar() {
  return `
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div class="p-6 border-b border-gray-200">
        <h1 class="text-xl font-bold text-blue-600">Design Hub</h1>
      </div>
      <nav class="flex-1 p-4 space-y-2">
        <a href="#" onclick="navigate('dashboard')" class="block px-4 py-2 rounded-lg ${currentPage === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}">Dashboard</a>
        <a href="#" onclick="navigate('cards')" class="block px-4 py-2 rounded-lg ${currentPage === 'cards' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}">Cards</a>
        <a href="#" onclick="navigate('projects')" class="block px-4 py-2 rounded-lg ${currentPage === 'projects' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}">Projects</a>
        <a href="#" onclick="navigate('settings')" class="block px-4 py-2 rounded-lg ${currentPage === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}">Settings</a>
      </nav>
      <div class="p-4 border-t border-gray-200">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span class="text-blue-600 font-medium">A</span>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">Admin</p>
            <p class="text-xs text-gray-500">admin@designhub.com</p>
          </div>
        </div>
      </div>
    </aside>
  `
}

function renderPage() {
  switch(currentPage) {
    case 'dashboard': return renderDashboard()
    case 'cards': return renderCards()
    case 'projects': return renderProjects()
    case 'settings': return renderSettings()
    default: return renderDashboard()
  }
}

async function renderDashboard() {
  const cards = await api('/cards')
  const newCards = cards.filter(c => c.status === 'new').length
  const inProgress = cards.filter(c => c.status === 'in_progress').length
  const urgent = cards.filter(c => c.priority === 'high').length

  return `
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm text-gray-500">Total Cards</p>
        <p class="text-3xl font-bold text-gray-900">${cards.length}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm text-gray-500">New</p>
        <p class="text-3xl font-bold text-blue-600">${newCards}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm text-gray-500">In Progress</p>
        <p class="text-3xl font-bold text-yellow-600">${inProgress}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm text-gray-500">Urgent</p>
        <p class="text-3xl font-bold text-red-600">${urgent}</p>
      </div>
    </div>
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Cards</h2>
      ${cards.slice(0, 5).map(card => `
        <div class="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
          <div>
            <p class="font-medium text-gray-900">${card.title}</p>
            <p class="text-sm text-gray-500">${card.category?.name || 'No category'}</p>
          </div>
          <span class="px-2 py-1 text-xs font-medium rounded ${
            card.priority === 'high' ? 'bg-red-100 text-red-700' :
            card.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-700'
          }">${card.priority}</span>
        </div>
      `).join('')}
      ${cards.length === 0 ? '<p class="text-gray-500">No cards yet. Create one!</p>' : ''}
    </div>
  `
}

async function renderCards() {
  const cards = await api('/cards')
  return `
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Cards</h1>
      <button onclick="showCreateCard()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">New Card</button>
    </div>
    <div id="create-card-form" class="hidden bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Create New Card</h2>
      <form onsubmit="createCard(event)">
        <div class="grid grid-cols-2 gap-4 mb-4">
          <input type="text" name="title" placeholder="Title" required class="border rounded-lg px-4 py-2">
          <select name="priority" class="border rounded-lg px-4 py-2">
            <option value="low">Low</option>
            <option value="medium" selected>Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <textarea name="description" placeholder="Description" rows="3" class="w-full border rounded-lg px-4 py-2 mb-4"></textarea>
        <div class="flex gap-2">
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Create</button>
          <button type="button" onclick="hideCreateCard()" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
        </div>
      </form>
    </div>
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          ${cards.map(card => `
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 font-medium text-gray-900">${card.title}</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs font-medium rounded ${
                  card.status === 'completed' ? 'bg-green-100 text-green-700' :
                  card.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }">${card.status.replace('_', ' ')}</span>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs font-medium rounded ${
                  card.priority === 'high' ? 'bg-red-100 text-red-700' :
                  card.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }">${card.priority}</span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">${new Date(card.created_at).toLocaleDateString()}</td>
            </tr>
          `).join('')}
          ${cards.length === 0 ? '<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">No cards found</td></tr>' : ''}
        </tbody>
      </table>
    </div>
  `
}

async function renderProjects() {
  const projects = await api('/projects')
  return `
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Projects</h1>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${projects.map(project => `
        <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-3 mb-4">
            ${project.color ? `<div class="w-4 h-4 rounded" style="background-color: ${project.color}"></div>` : ''}
            <h2 class="text-lg font-semibold text-gray-900">${project.name}</h2>
          </div>
          ${project.description ? `<p class="text-sm text-gray-600 mb-4">${project.description}</p>` : ''}
          <p class="text-sm text-gray-500">Created ${new Date(project.created_at).toLocaleDateString()}</p>
        </div>
      `).join('')}
      ${projects.length === 0 ? '<p class="text-gray-500 col-span-3">No projects yet.</p>' : ''}
    </div>
  `
}

function renderSettings() {
  return `
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input type="text" value="Admin User" class="w-full border rounded-lg px-4 py-2">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value="admin@designhub.com" class="w-full border rounded-lg px-4 py-2">
        </div>
        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Save Changes</button>
      </div>
    </div>
  `
}

// Event handlers
function navigate(page) {
  currentPage = page
  renderApp()
}

function showCreateCard() {
  document.getElementById('create-card-form').classList.remove('hidden')
}

function hideCreateCard() {
  document.getElementById('create-card-form').classList.add('hidden')
}

async function createCard(event) {
  event.preventDefault()
  const form = event.target
  const data = {
    title: form.title.value,
    description: form.description.value,
    priority: form.priority.value
  }
  await api('/cards', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  hideCreateCard()
  renderApp()
}

function setupEventListeners() {
  // Add any event listeners here
}

// Initialize
renderApp()
