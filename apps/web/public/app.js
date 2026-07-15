// Design Hub - Complete Application
const API_URL = window.location.origin + '/api'
const COLORS = {
  ink: '#1a1a2e',
  paper: '#fafafa',
  accent: '#e94560',
  muted: '#6b7280',
  surface: '#ffffff',
  border: '#e5e7eb',
}

let currentPage = 'login'
let currentUser = null
let authToken = null
let notifications = []

// API helper
async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`
  
  const response = await fetch(`${API_URL}${path}`, { headers, ...options })
  return response.json()
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  authToken = localStorage.getItem('authToken')
  if (authToken) {
    currentPage = 'dashboard'
  }
  renderApp()
})

async function renderApp() {
  const root = document.getElementById('root')
  
  if (currentPage === 'login') {
    root.innerHTML = renderLogin()
  } else {
    const pageContent = await renderPage()
    root.innerHTML = `
      <div style="display:flex;min-height:100vh;background:${COLORS.paper};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        ${renderSidebar()}
        <main style="flex:1;padding:2rem;overflow-y:auto;">${pageContent}</main>
      </div>
    `
  }
}

function renderLogin() {
  return `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:${COLORS.ink};">
      <div style="background:${COLORS.surface};border-radius:1rem;padding:2.5rem;width:100%;max-width:400px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);">
        <h1 style="font-size:1.5rem;font-weight:700;color:${COLORS.ink};text-align:center;margin-bottom:0.5rem;">Design Hub</h1>
        <p style="font-size:0.875rem;color:${COLORS.muted};text-align:center;margin-bottom:1.5rem;">Sign in to your account</p>
        <form onsubmit="handleLogin(event)">
          <div style="margin-bottom:1rem;">
            <label style="display:block;font-size:0.875rem;font-weight:500;color:${COLORS.ink};margin-bottom:0.5rem;">Email</label>
            <input type="email" id="loginEmail" placeholder="admin@designhub.com" required style="width:100%;padding:0.75rem;border:1px solid ${COLORS.border};border-radius:0.5rem;font-size:0.875rem;box-sizing:border-box;">
          </div>
          <div style="margin-bottom:1.5rem;">
            <label style="display:block;font-size:0.875rem;font-weight:500;color:${COLORS.ink};margin-bottom:0.5rem;">Password</label>
            <input type="password" id="loginPassword" placeholder="Enter password" required style="width:100%;padding:0.75rem;border:1px solid ${COLORS.border};border-radius:0.5rem;font-size:0.875rem;box-sizing:border-box;">
          </div>
          <div id="loginError" style="display:none;color:#dc2626;font-size:0.875rem;margin-bottom:1rem;"></div>
          <button type="submit" style="width:100%;background:${COLORS.accent};color:white;padding:0.75rem;border-radius:0.5rem;font-weight:500;border:none;cursor:pointer;font-size:0.875rem;">Sign In</button>
        </form>
      </div>
    </div>
  `
}

async function handleLogin(e) {
  e.preventDefault()
  const email = document.getElementById('loginEmail').value
  const password = document.getElementById('loginPassword').value
  const errorDiv = document.getElementById('loginError')
  
  try {
    const result = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    
    if (result.error) {
      errorDiv.textContent = result.error
      errorDiv.style.display = 'block'
      return
    }
    
    authToken = result.token
    currentUser = result.user
    localStorage.setItem('authToken', authToken)
    currentPage = 'dashboard'
    renderApp()
  } catch (err) {
    errorDiv.textContent = 'Login failed. Please try again.'
    errorDiv.style.display = 'block'
  }
}

function logout() {
  authToken = null
  currentUser = null
  localStorage.removeItem('authToken')
  currentPage = 'login'
  renderApp()
}

function renderSidebar() {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '◉' },
    { id: 'kanban', label: 'Kanban Board', icon: '◧' },
    { id: 'cards', label: 'All Requests', icon: '☰' },
    { id: 'projects', label: 'Projects', icon: '◫' },
    { id: 'users', label: 'Users', icon: '☺' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'settings', label: 'Settings', icon: '⚙' },
  ]

  return `
    <aside style="width:260px;background:${COLORS.ink};color:white;display:flex;flex-direction:column;">
      <div style="padding:1.5rem;border-bottom:1px solid rgba(255,255,255,0.1);">
        <h1 style="font-size:1.25rem;font-weight:700;">Design Hub</h1>
        <p style="font-size:0.75rem;color:${COLORS.muted};margin-top:0.25rem;">Request Management</p>
      </div>
      <nav style="flex:1;padding:1rem;">
        ${navItems.map(item => `
          <a href="#" onclick="navigate('${item.id}')" style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1rem;margin-bottom:0.25rem;border-radius:0.5rem;color:${currentPage === item.id ? COLORS.accent : 'rgba(255,255,255,0.7)'};background:${currentPage === item.id ? 'rgba(233,69,96,0.1)' : 'transparent'};text-decoration:none;font-size:0.875rem;">
            <span>${item.icon}</span>${item.label}
          </a>
        `).join('')}
      </nav>
      <div style="padding:1rem;border-top:1px solid rgba(255,255,255,0.1);">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:0.75rem;">
            <div style="width:36px;height:36px;background:${COLORS.accent};border-radius:50%;display:flex;align-items:center;justify-content:center;">
              <span style="font-weight:600;">${currentUser?.name?.charAt(0) || 'U'}</span>
            </div>
            <div>
              <p style="font-size:0.875rem;font-weight:500;">${currentUser?.name || 'User'}</p>
              <p style="font-size:0.75rem;color:${COLORS.muted};">${currentUser?.role || 'user'}</p>
            </div>
          </div>
          <button onclick="logout()" style="background:rgba(255,255,255,0.1);border:none;color:white;padding:0.5rem;border-radius:0.5rem;cursor:pointer;font-size:0.75rem;">Logout</button>
        </div>
      </div>
    </aside>
  `
}

async function renderPage() {
  switch(currentPage) {
    case 'dashboard': return await renderDashboard()
    case 'kanban': return await renderKanban()
    case 'cards': return await renderCards()
    case 'projects': return await renderProjects()
    case 'users': return await renderUsers()
    case 'notifications': return await renderNotifications()
    case 'settings': return renderSettings()
    default: return await renderDashboard()
  }
}

async function renderDashboard() {
  const cards = await api('/cards')
  const newCards = cards.filter(c => c.status === 'new').length
  const inProgress = cards.filter(c => c.status === 'in_progress').length
  const urgent = cards.filter(c => c.priority === 'high').length
  const notifs = await api('/notifications')
  const unreadCount = notifs.filter(n => !n.is_read).length

  return `
    <div style="margin-bottom:2rem;">
      <h1 style="font-size:1.875rem;font-weight:700;color:${COLORS.ink};">Dashboard</h1>
      <p style="color:${COLORS.muted};margin-top:0.25rem;">Overview of your design requests</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:1rem;margin-bottom:2rem;">
      <div style="background:${COLORS.surface};border-radius:0.75rem;padding:1.25rem;border:1px solid ${COLORS.border};">
        <p style="font-size:0.625rem;color:${COLORS.muted};text-transform:uppercase;letter-spacing:0.05em;">Total</p>
        <p style="font-size:1.75rem;font-weight:700;color:${COLORS.ink};">${cards.length}</p>
      </div>
      <div style="background:${COLORS.surface};border-radius:0.75rem;padding:1.25rem;border:1px solid ${COLORS.border};">
        <p style="font-size:0.625rem;color:${COLORS.muted};text-transform:uppercase;letter-spacing:0.05em;">New</p>
        <p style="font-size:1.75rem;font-weight:700;color:${COLORS.accent};">${newCards}</p>
      </div>
      <div style="background:${COLORS.surface};border-radius:0.75rem;padding:1.25rem;border:1px solid ${COLORS.border};">
        <p style="font-size:0.625rem;color:${COLORS.muted};text-transform:uppercase;letter-spacing:0.05em;">In Progress</p>
        <p style="font-size:1.75rem;font-weight:700;color:#f59e0b;">${inProgress}</p>
      </div>
      <div style="background:${COLORS.surface};border-radius:0.75rem;padding:1.25rem;border:1px solid ${COLORS.border};">
        <p style="font-size:0.625rem;color:${COLORS.muted};text-transform:uppercase;letter-spacing:0.05em;">Urgent</p>
        <p style="font-size:1.75rem;font-weight:700;color:#ef4444;">${urgent}</p>
      </div>
      <div style="background:${COLORS.surface};border-radius:0.75rem;padding:1.25rem;border:1px solid ${COLORS.border};">
        <p style="font-size:0.625rem;color:${COLORS.muted};text-transform:uppercase;letter-spacing:0.05em;">Notifications</p>
        <p style="font-size:1.75rem;font-weight:700;color:#8b5cf6;">${unreadCount}</p>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:1.5rem;">
      <div style="background:${COLORS.surface};border-radius:0.75rem;padding:1.5rem;border:1px solid ${COLORS.border};">
        <h2 style="font-size:1rem;font-weight:600;margin-bottom:1rem;">Recent Requests</h2>
        ${cards.slice(0, 5).map(card => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem 0;border-bottom:1px solid ${COLORS.border};">
            <div>
              <p style="font-weight:500;">${card.title}</p>
              <p style="font-size:0.75rem;color:${COLORS.muted};">${card.category?.name || 'No category'}</p>
            </div>
            <span style="padding:0.25rem 0.75rem;font-size:0.75rem;border-radius:9999px;background:${card.priority === 'high' ? '#fef2f2' : card.priority === 'medium' ? '#fffbeb' : '#f3f4f6'};color:${card.priority === 'high' ? '#dc2626' : card.priority === 'medium' ? '#d97706' : '#374151'};">${card.priority}</span>
          </div>
        `).join('') || '<p style="color:${COLORS.muted};text-align:center;padding:2rem;">No requests yet.</p>'}
      </div>
      <div style="background:${COLORS.surface};border-radius:0.75rem;padding:1.5rem;border:1px solid ${COLORS.border};">
        <h2 style="font-size:1rem;font-weight:600;margin-bottom:1rem;">Recent Notifications</h2>
        ${notifs.slice(0, 5).map(notif => `
          <div style="padding:0.5rem 0;border-bottom:1px solid ${COLORS.border};${notif.is_read ? 'opacity:0.5;' : ''}">
            <p style="font-weight:500;font-size:0.875rem;">${notif.title}</p>
            <p style="font-size:0.75rem;color:${COLORS.muted};">${notif.message}</p>
          </div>
        `).join('') || '<p style="color:${COLORS.muted};text-align:center;padding:1rem;">No notifications.</p>'}
      </div>
    </div>
  `
}

async function renderKanban() {
  const cards = await api('/cards')
  const columns = [
    { id: 'new', title: 'New Requests', color: '#3b82f6' },
    { id: 'in_progress', title: 'In Progress', color: '#f59e0b' },
    { id: 'completed', title: 'Completed', color: '#22c55e' }
  ]

  return `
    <div style="margin-bottom:2rem;">
      <h1 style="font-size:1.875rem;font-weight:700;color:${COLORS.ink};">Kanban Board</h1>
      <p style="color:${COLORS.muted};margin-top:0.25rem;">Drag and drop to manage workflow</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;">
      ${columns.map(col => {
        const colCards = cards.filter(c => c.status === col.id)
        return `
          <div style="background:${COLORS.surface};border-radius:0.75rem;border:1px solid ${COLORS.border};overflow:hidden;">
            <div style="padding:1rem;border-bottom:1px solid ${COLORS.border};display:flex;align-items:center;gap:0.5rem;">
              <div style="width:12px;height:12px;border-radius:50%;background:${col.color};"></div>
              <h3 style="font-weight:600;">${col.title}</h3>
              <span style="margin-left:auto;background:${COLORS.paper};padding:0.25rem 0.5rem;border-radius:9999px;font-size:0.75rem;">${colCards.length}</span>
            </div>
            <div style="padding:1rem;min-height:300px;" ondragover="event.preventDefault()" ondrop="handleDrop(event, '${col.id}')">
              ${colCards.map(card => `
                <div draggable="true" ondragstart="handleDragStart(event, '${card.id}')" style="background:${COLORS.paper};border:1px solid ${COLORS.border};border-radius:0.5rem;padding:1rem;margin-bottom:0.75rem;cursor:grab;">
                  <p style="font-weight:500;margin-bottom:0.5rem;">${card.title}</p>
                  <div style="display:flex;align-items:center;justify-content:space-between;">
                    <span style="font-size:0.75rem;color:${COLORS.muted};">${card.category?.name || 'No category'}</span>
                    <span style="padding:0.125rem 0.5rem;font-size:0.625rem;border-radius:9999px;background:${card.priority === 'high' ? '#fef2f2' : '#f3f4f6'};color:${card.priority === 'high' ? '#dc2626' : '#374151'};">${card.priority}</span>
                  </div>
                  ${card.assignee ? `<p style="font-size:0.75rem;color:${COLORS.muted};margin-top:0.5rem;">Assigned to: ${card.assignee.name}</p>` : ''}
                </div>
              `).join('') || '<p style="color:${COLORS.muted};text-align:center;padding:2rem;font-size:0.875rem;">No cards</p>'}
            </div>
          </div>
        `
      }).join('')}
    </div>
  `
}

let draggedCardId = null

function handleDragStart(e, cardId) {
  draggedCardId = cardId
  e.dataTransfer.effectAllowed = 'move'
}

async function handleDrop(e, newStatus) {
  e.preventDefault()
  if (!draggedCardId) return
  
  await api(`/cards/${draggedCardId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: newStatus })
  })
  
  draggedCardId = null
  renderApp()
}

async function renderCards() {
  const cards = await api('/cards')
  const users = await api('/users')
  const projects = await api('/projects')
  const categories = await api('/categories')

  return `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;">
      <div>
        <h1 style="font-size:1.875rem;font-weight:700;color:${COLORS.ink};">Design Requests</h1>
        <p style="color:${COLORS.muted};">Manage all incoming requests</p>
      </div>
      <button onclick="showCreateCard()" style="background:${COLORS.accent};color:white;padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:500;border:none;cursor:pointer;">New Request</button>
    </div>
    <div id="create-card-form" style="display:none;background:${COLORS.surface};border-radius:0.75rem;padding:1.5rem;border:1px solid ${COLORS.border};margin-bottom:1.5rem;">
      <h2 style="font-size:1rem;font-weight:600;margin-bottom:1rem;">New Design Request</h2>
      <form onsubmit="createCard(event)">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
          <input type="text" name="title" placeholder="Request title" required style="width:100%;padding:0.75rem;border:1px solid ${COLORS.border};border-radius:0.5rem;">
          <select name="priority" style="padding:0.75rem;border:1px solid ${COLORS.border};border-radius:0.5rem;">
            <option value="low">Low priority</option>
            <option value="medium" selected>Medium priority</option>
            <option value="high">High priority</option>
          </select>
        </div>
        <textarea name="description" placeholder="Describe what you need..." rows="3" style="width:100%;padding:0.75rem;border:1px solid ${COLORS.border};border-radius:0.5rem;margin-bottom:1rem;box-sizing:border-box;"></textarea>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
          <select name="category_id" style="padding:0.75rem;border:1px solid ${COLORS.border};border-radius:0.5rem;">
            <option value="">Select category</option>
            ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
          </select>
          <select name="project_id" style="padding:0.75rem;border:1px solid ${COLORS.border};border-radius:0.5rem;">
            <option value="">Select project</option>
            ${projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
          </select>
        </div>
        <div style="display:flex;gap:0.5rem;">
          <button type="submit" style="background:${COLORS.accent};color:white;padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:500;border:none;cursor:pointer;">Create</button>
          <button type="button" onclick="hideCreateCard()" style="background:${COLORS.border};color:${COLORS.ink};padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:500;border:none;cursor:pointer;">Cancel</button>
        </div>
      </form>
    </div>
    <div style="background:${COLORS.surface};border-radius:0.75rem;border:1px solid ${COLORS.border};overflow:hidden;">
      <table style="width:100%;border-collapse:collapse;">
        <thead style="background:${COLORS.paper};">
          <tr>
            <th style="padding:0.75rem 1rem;text-align:left;font-size:0.75rem;font-weight:600;color:${COLORS.muted};text-transform:uppercase;">Request</th>
            <th style="padding:0.75rem 1rem;text-align:left;font-size:0.75rem;font-weight:600;color:${COLORS.muted};text-transform:uppercase;">Status</th>
            <th style="padding:0.75rem 1rem;text-align:left;font-size:0.75rem;font-weight:600;color:${COLORS.muted};text-transform:uppercase;">Priority</th>
            <th style="padding:0.75rem 1rem;text-align:left;font-size:0.75rem;font-weight:600;color:${COLORS.muted};text-transform:uppercase;">Assignee</th>
            <th style="padding:0.75rem 1rem;text-align:left;font-size:0.75rem;font-weight:600;color:${COLORS.muted};text-transform:uppercase;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${cards.map(card => `
            <tr style="border-bottom:1px solid ${COLORS.border};">
              <td style="padding:1rem;font-weight:500;">${card.title}</td>
              <td style="padding:1rem;">
                <select onchange="updateCardStatus('${card.id}', this.value)" style="padding:0.25rem 0.5rem;border:1px solid ${COLORS.border};border-radius:0.25rem;font-size:0.75rem;">
                  <option value="new" ${card.status === 'new' ? 'selected' : ''}>New</option>
                  <option value="in_progress" ${card.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                  <option value="completed" ${card.status === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
              </td>
              <td style="padding:1rem;">
                <span style="padding:0.25rem 0.5rem;font-size:0.75rem;border-radius:9999px;background:${card.priority === 'high' ? '#fef2f2' : '#f3f4f6'};color:${card.priority === 'high' ? '#dc2626' : '#374151'};">${card.priority}</span>
              </td>
              <td style="padding:1rem;">
                <select onchange="assignCard('${card.id}', this.value)" style="padding:0.25rem 0.5rem;border:1px solid ${COLORS.border};border-radius:0.25rem;font-size:0.75rem;">
                  <option value="">Unassigned</option>
                  ${users.map(u => `<option value="${u.id}" ${card.assignee_id === u.id ? 'selected' : ''}>${u.name}</option>`).join('')}
                </select>
              </td>
              <td style="padding:1rem;">
                <button onclick="deleteCard('${card.id}')" style="color:#dc2626;background:none;border:none;cursor:pointer;font-size:0.75rem;">Delete</button>
              </td>
            </tr>
          `).join('') || '<tr><td colspan="5" style="padding:2rem;text-align:center;color:${COLORS.muted};">No requests found</td></tr>'}
        </tbody>
      </table>
    </div>
  `
}

async function renderUsers() {
  const users = await api('/users')
  
  return `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;">
      <div>
        <h1 style="font-size:1.875rem;font-weight:700;color:${COLORS.ink};">Users</h1>
        <p style="color:${COLORS.muted};">Manage team members</p>
      </div>
      <button onclick="showCreateUser()" style="background:${COLORS.accent};color:white;padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:500;border:none;cursor:pointer;">Add User</button>
    </div>
    <div id="create-user-form" style="display:none;background:${COLORS.surface};border-radius:0.75rem;padding:1.5rem;border:1px solid ${COLORS.border};margin-bottom:1.5rem;">
      <h2 style="font-size:1rem;font-weight:600;margin-bottom:1rem;">Add New User</h2>
      <form onsubmit="createUser(event)">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
          <input type="text" name="name" placeholder="Full name" required style="width:100%;padding:0.75rem;border:1px solid ${COLORS.border};border-radius:0.5rem;">
          <input type="email" name="email" placeholder="Email address" required style="width:100%;padding:0.75rem;border:1px solid ${COLORS.border};border-radius:0.5rem;">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
          <input type="password" name="password" placeholder="Password" required style="width:100%;padding:0.75rem;border:1px solid ${COLORS.border};border-radius:0.5rem;">
          <select name="role" style="padding:0.75rem;border:1px solid ${COLORS.border};border-radius:0.5rem;">
            <option value="designer">Designer</option>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        <div style="display:flex;gap:0.5rem;">
          <button type="submit" style="background:${COLORS.accent};color:white;padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:500;border:none;cursor:pointer;">Add User</button>
          <button type="button" onclick="hideCreateUser()" style="background:${COLORS.border};color:${COLORS.ink};padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:500;border:none;cursor:pointer;">Cancel</button>
        </div>
      </form>
    </div>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;">
      ${users.map(user => `
        <div style="background:${COLORS.surface};border-radius:0.75rem;padding:1.5rem;border:1px solid ${COLORS.border};display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:1rem;">
            <div style="width:48px;height:48px;background:${COLORS.accent};border-radius:50%;display:flex;align-items:center;justify-content:center;">
              <span style="font-weight:600;color:white;font-size:1.125rem;">${user.name?.charAt(0) || 'U'}</span>
            </div>
            <div>
              <p style="font-weight:500;">${user.name}</p>
              <p style="font-size:0.875rem;color:${COLORS.muted};">${user.email}</p>
              <span style="font-size:0.75rem;color:${COLORS.muted};">${user.role}</span>
            </div>
          </div>
          <button onclick="deleteUser('${user.id}')" style="color:#dc2626;background:none;border:none;cursor:pointer;">Delete</button>
        </div>
      `).join('') || '<p style="color:${COLORS.muted};grid-column:span 2;text-align:center;padding:2rem;">No users found.</p>'}
    </div>
  `
}

async function renderProjects() {
  const projects = await api('/projects')
  return `
    <div style="margin-bottom:2rem;">
      <h1 style="font-size:1.875rem;font-weight:700;color:${COLORS.ink};">Projects</h1>
      <p style="color:${COLORS.muted};">Organize your design work</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;">
      ${projects.map(project => `
        <div style="background:${COLORS.surface};border-radius:0.75rem;padding:1.5rem;border:1px solid ${COLORS.border};">
          <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;">
            ${project.color ? `<div style="width:12px;height:12px;border-radius:50%;background:${project.color};"></div>` : ''}
            <h2 style="font-size:1.125rem;font-weight:600;">${project.name}</h2>
          </div>
          ${project.description ? `<p style="font-size:0.875rem;color:${COLORS.muted};margin-bottom:1rem;">${project.description}</p>` : ''}
          <p style="font-size:0.75rem;color:${COLORS.muted};">Created ${new Date(project.created_at).toLocaleDateString()}</p>
        </div>
      `).join('') || '<p style="color:${COLORS.muted};grid-column:span 3;text-align:center;padding:2rem;">No projects yet.</p>'}
    </div>
  `
}

async function renderNotifications() {
  const notifs = await api('/notifications')
  return `
    <div style="margin-bottom:2rem;">
      <h1 style="font-size:1.875rem;font-weight:700;color:${COLORS.ink};">Notifications</h1>
      <p style="color:${COLORS.muted};">Stay updated on your design requests</p>
    </div>
    <div style="background:${COLORS.surface};border-radius:0.75rem;border:1px solid ${COLORS.border};">
      ${notifs.length === 0 ? '<p style="padding:2rem;text-align:center;color:${COLORS.muted};">No notifications yet.</p>' : ''}
      ${notifs.map(notif => `
        <div style="padding:1rem 1.5rem;border-bottom:1px solid ${COLORS.border};${notif.is_read ? 'opacity:0.6;' : ''}">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div>
              <p style="font-weight:500;">${notif.title}</p>
              <p style="font-size:0.875rem;color:${COLORS.muted};">${notif.message}</p>
              <p style="font-size:0.75rem;color:${COLORS.muted};margin-top:0.25rem;">${new Date(notif.created_at).toLocaleString()}</p>
            </div>
            ${!notif.is_read ? `<button onclick="markNotificationRead('${notif.id}')" style="background:${COLORS.accent};color:white;padding:0.25rem 0.75rem;border-radius:0.25rem;border:none;cursor:pointer;font-size:0.75rem;">Mark Read</button>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `
}

function renderSettings() {
  return `
    <div style="margin-bottom:2rem;">
      <h1 style="font-size:1.875rem;font-weight:700;color:${COLORS.ink};">Settings</h1>
      <p style="color:${COLORS.muted};">Manage your preferences</p>
    </div>
    <div style="background:${COLORS.surface};border-radius:0.75rem;padding:1.5rem;border:1px solid ${COLORS.border};max-width:600px;">
      <h2 style="font-size:1rem;font-weight:600;margin-bottom:1.5rem;">Profile</h2>
      <div style="display:flex;flex-direction:column;gap:1rem;">
        <div>
          <label style="display:block;font-size:0.875rem;font-weight:500;margin-bottom:0.5rem;">Name</label>
          <input type="text" value="${currentUser?.name || ''}" style="width:100%;padding:0.75rem;border:1px solid ${COLORS.border};border-radius:0.5rem;">
        </div>
        <div>
          <label style="display:block;font-size:0.875rem;font-weight:500;margin-bottom:0.5rem;">Email</label>
          <input type="email" value="${currentUser?.email || ''}" style="width:100%;padding:0.75rem;border:1px solid ${COLORS.border};border-radius:0.5rem;">
        </div>
        <button style="background:${COLORS.accent};color:white;padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:500;border:none;cursor:pointer;align-self:flex-start;">Save Changes</button>
      </div>
    </div>
  `
}

// Navigation
function navigate(page) {
  currentPage = page
  renderApp()
}

// Notification functions
async function markNotificationRead(notifId) {
  await api(`/notifications/${notifId}/read`, { method: 'PATCH' })
  renderApp()
}

// Card functions
function showCreateCard() { document.getElementById('create-card-form').style.display = 'block' }
function hideCreateCard() { document.getElementById('create-card-form').style.display = 'none' }

async function createCard(e) {
  e.preventDefault()
  const form = e.target
  await api('/cards', {
    method: 'POST',
    body: JSON.stringify({
      title: form.title.value,
      description: form.description.value,
      priority: form.priority.value,
      category_id: form.category_id.value || null,
      project_id: form.project_id.value || null
    })
  })
  hideCreateCard()
  renderApp()
}

async function updateCardStatus(cardId, status) {
  await api(`/cards/${cardId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
}

async function assignCard(cardId, assigneeId) {
  await api(`/cards/${cardId}/assign`, {
    method: 'PATCH',
    body: JSON.stringify({ assigneeId })
  })
  renderApp()
}

async function deleteCard(cardId) {
  if (confirm('Are you sure you want to delete this card?')) {
    await api(`/cards/${cardId}`, { method: 'DELETE' })
    renderApp()
  }
}

// User functions
function showCreateUser() { document.getElementById('create-user-form').style.display = 'block' }
function hideCreateUser() { document.getElementById('create-user-form').style.display = 'none' }

async function createUser(e) {
  e.preventDefault()
  const form = e.target
  await api('/users', {
    method: 'POST',
    body: JSON.stringify({
      name: form.name.value,
      email: form.email.value,
      password: form.password.value,
      role: form.role.value
    })
  })
  hideCreateUser()
  renderApp()
}

async function deleteUser(userId) {
  if (confirm('Are you sure you want to delete this user?')) {
    await api(`/users/${userId}`, { method: 'DELETE' })
    renderApp()
  }
}
