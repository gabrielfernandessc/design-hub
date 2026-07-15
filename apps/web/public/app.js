// Design Hub - Frontend with Distinctive Design
// Subject: Design request management for creative teams
// Audience: Designers, art directors, project managers
// Job: Transform design requests into actionable tasks

const API_URL = window.location.origin + '/api'

// Design Tokens - Deep navy + coral accent
const COLORS = {
  ink: '#1a1a2e',
  paper: '#fafafa',
  accent: '#e94560',
  muted: '#6b7280',
  surface: '#ffffff',
  border: '#e5e7eb',
}

// Simple router
let currentPage = 'dashboard'

// API helper
async function api(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  return response.json()
}

// Render functions
async function renderApp() {
  const root = document.getElementById('root')
  const pageContent = await renderPage()
  root.innerHTML = `
    <div style="display:flex;min-height:100vh;background:${COLORS.paper};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      ${renderSidebar()}
      <main style="flex:1;padding:2rem;overflow-y:auto;">
        ${pageContent}
      </main>
    </div>
  `
}

function renderSidebar() {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '◉' },
    { id: 'cards', label: 'Requests', icon: '◧' },
    { id: 'projects', label: 'Projects', icon: '◫' },
    { id: 'settings', label: 'Settings', icon: '⚙' },
  ]

  return `
    <aside style="width:260px;background:${COLORS.ink};color:white;display:flex;flex-direction:column;">
      <div style="padding:1.5rem;border-bottom:1px solid rgba(255,255,255,0.1);">
        <h1 style="font-size:1.25rem;font-weight:700;letter-spacing:-0.02em;">Design Hub</h1>
        <p style="font-size:0.75rem;color:${COLORS.muted};margin-top:0.25rem;">Request Management</p>
      </div>
      <nav style="flex:1;padding:1rem;">
        ${navItems.map(item => `
          <a href="#" onclick="navigate('${item.id}')" style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1rem;margin-bottom:0.25rem;border-radius:0.5rem;color:${currentPage === item.id ? COLORS.accent : 'rgba(255,255,255,0.7)'};background:${currentPage === item.id ? 'rgba(233,69,96,0.1)' : 'transparent'};text-decoration:none;font-size:0.875rem;transition:all 0.15s ease;">
            <span style="font-size:1rem;">${item.icon}</span>
            ${item.label}
          </a>
        `).join('')}
      </nav>
      <div style="padding:1rem;border-top:1px solid rgba(255,255,255,0.1);">
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <div style="width:36px;height:36px;background:${COLORS.accent};border-radius:50%;display:flex;align-items:center;justify-content:center;">
            <span style="font-weight:600;font-size:0.875rem;">A</span>
          </div>
          <div>
            <p style="font-size:0.875rem;font-weight:500;">Admin</p>
            <p style="font-size:0.75rem;color:${COLORS.muted};">admin@designhub.com</p>
          </div>
        </div>
      </div>
    </aside>
  `
}

async function renderPage() {
  switch(currentPage) {
    case 'dashboard': return await renderDashboard()
    case 'cards': return await renderCards()
    case 'projects': return await renderProjects()
    case 'settings': return renderSettings()
    default: return await renderDashboard()
  }
}

async function renderDashboard() {
  const cards = await api('/cards')
  const newCards = cards.filter(c => c.status === 'new').length
  const inProgress = cards.filter(c => c.status === 'in_progress').length
  const urgent = cards.filter(c => c.priority === 'high').length

  return `
    <div style="margin-bottom:2rem;">
      <h1 style="font-size:1.875rem;font-weight:700;color:${COLORS.ink};letter-spacing:-0.02em;">Dashboard</h1>
      <p style="color:${COLORS.muted};margin-top:0.25rem;">Overview of your design requests</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;margin-bottom:2rem;">
      <div style="background:${COLORS.surface};border-radius:0.75rem;padding:1.5rem;border:1px solid ${COLORS.border};">
        <p style="font-size:0.75rem;color:${COLORS.muted};text-transform:uppercase;letter-spacing:0.05em;">Total</p>
        <p style="font-size:2rem;font-weight:700;color:${COLORS.ink};margin-top:0.25rem;">${cards.length}</p>
      </div>
      <div style="background:${COLORS.surface};border-radius:0.75rem;padding:1.5rem;border:1px solid ${COLORS.border};">
        <p style="font-size:0.75rem;color:${COLORS.muted};text-transform:uppercase;letter-spacing:0.05em;">New</p>
        <p style="font-size:2rem;font-weight:700;color:${COLORS.accent};margin-top:0.25rem;">${newCards}</p>
      </div>
      <div style="background:${COLORS.surface};border-radius:0.75rem;padding:1.5rem;border:1px solid ${COLORS.border};">
        <p style="font-size:0.75rem;color:${COLORS.muted};text-transform:uppercase;letter-spacing:0.05em;">In Progress</p>
        <p style="font-size:2rem;font-weight:700;color:#f59e0b;margin-top:0.25rem;">${inProgress}</p>
      </div>
      <div style="background:${COLORS.surface};border-radius:0.75rem;padding:1.5rem;border:1px solid ${COLORS.border};">
        <p style="font-size:0.75rem;color:${COLORS.muted};text-transform:uppercase;letter-spacing:0.05em;">Urgent</p>
        <p style="font-size:2rem;font-weight:700;color:#ef4444;margin-top:0.25rem;">${urgent}</p>
      </div>
    </div>
    <div style="background:${COLORS.surface};border-radius:0.75rem;padding:1.5rem;border:1px solid ${COLORS.border};">
      <h2 style="font-size:1rem;font-weight:600;color:${COLORS.ink};margin-bottom:1rem;">Recent Requests</h2>
      ${cards.slice(0, 5).map(card => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem 0;border-bottom:1px solid ${COLORS.border};">
          <div>
            <p style="font-weight:500;color:${COLORS.ink};">${card.title}</p>
            <p style="font-size:0.75rem;color:${COLORS.muted};">${card.category?.name || 'Uncategorized'}</p>
          </div>
          <span style="padding:0.25rem 0.75rem;font-size:0.75rem;font-weight:500;border-radius:9999px;background:${card.priority === 'high' ? '#fef2f2' : card.priority === 'medium' ? '#fffbeb' : '#f3f4f6'};color:${card.priority === 'high' ? '#dc2626' : card.priority === 'medium' ? '#d97706' : '#374151'};">${card.priority}</span>
        </div>
      `).join('')}
      ${cards.length === 0 ? '<p style="color:${COLORS.muted};text-align:center;padding:2rem;">No requests yet. Create one to get started.</p>' : ''}
    </div>
  `
}

async function renderCards() {
  const cards = await api('/cards')
  return `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;">
      <div>
        <h1 style="font-size:1.875rem;font-weight:700;color:${COLORS.ink};letter-spacing:-0.02em;">Design Requests</h1>
        <p style="color:${COLORS.muted};margin-top:0.25rem;">Manage incoming design requests</p>
      </div>
      <button onclick="showCreateCard()" style="background:${COLORS.accent};color:white;padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:500;border:none;cursor:pointer;transition:opacity 0.15s ease;">New Request</button>
    </div>
    <div id="create-card-form" style="display:none;background:${COLORS.surface};border-radius:0.75rem;padding:1.5rem;border:1px solid ${COLORS.border};margin-bottom:1.5rem;">
      <h2 style="font-size:1rem;font-weight:600;margin-bottom:1rem;">New Design Request</h2>
      <form onsubmit="createCard(event)">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
          <input type="text" name="title" placeholder="Request title" required style="width:100%;padding:0.75rem;border:1px solid ${COLORS.border};border-radius:0.5rem;font-size:0.875rem;">
          <select name="priority" style="padding:0.75rem;border:1px solid ${COLORS.border};border-radius:0.5rem;font-size:0.875rem;">
            <option value="low">Low priority</option>
            <option value="medium" selected>Medium priority</option>
            <option value="high">High priority</option>
          </select>
        </div>
        <textarea name="description" placeholder="Describe what you need..." rows="3" style="width:100%;padding:0.75rem;border:1px solid ${COLORS.border};border-radius:0.5rem;font-size:0.875rem;margin-bottom:1rem;resize:vertical;"></textarea>
        <div style="display:flex;gap:0.5rem;">
          <button type="submit" style="background:${COLORS.accent};color:white;padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:500;border:none;cursor:pointer;">Create Request</button>
          <button type="button" onclick="hideCreateCard()" style="background:${COLORS.border};color:${COLORS.ink};padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:500;border:none;cursor:pointer;">Cancel</button>
        </div>
      </form>
    </div>
    <div style="background:${COLORS.surface};border-radius:0.75rem;border:1px solid ${COLORS.border};overflow:hidden;">
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:${COLORS.paper};">
            <th style="padding:0.75rem 1.5rem;text-align:left;font-size:0.75rem;font-weight:600;color:${COLORS.muted};text-transform:uppercase;letter-spacing:0.05em;">Request</th>
            <th style="padding:0.75rem 1.5rem;text-align:left;font-size:0.75rem;font-weight:600;color:${COLORS.muted};text-transform:uppercase;letter-spacing:0.05em;">Status</th>
            <th style="padding:0.75rem 1.5rem;text-align:left;font-size:0.75rem;font-weight:600;color:${COLORS.muted};text-transform:uppercase;letter-spacing:0.05em;">Priority</th>
            <th style="padding:0.75rem 1.5rem;text-align:left;font-size:0.75rem;font-weight:600;color:${COLORS.muted};text-transform:uppercase;letter-spacing:0.05em;">Created</th>
          </tr>
        </thead>
        <tbody>
          ${cards.map(card => `
            <tr style="border-bottom:1px solid ${COLORS.border};">
              <td style="padding:1rem 1.5rem;font-weight:500;color:${COLORS.ink};">${card.title}</td>
              <td style="padding:1rem 1.5rem;">
                <span style="padding:0.25rem 0.75rem;font-size:0.75rem;font-weight:500;border-radius:9999px;background:${card.status === 'completed' ? '#dcfce7' : card.status === 'in_progress' ? '#fef3c7' : '#dbeafe'};color:${card.status === 'completed' ? '#16a34a' : card.status === 'in_progress' ? '#d97706' : '#2563eb'};">${card.status.replace('_', ' ')}</span>
              </td>
              <td style="padding:1rem 1.5rem;">
                <span style="padding:0.25rem 0.75rem;font-size:0.75rem;font-weight:500;border-radius:9999px;background:${card.priority === 'high' ? '#fef2f2' : card.priority === 'medium' ? '#fffbeb' : '#f3f4f6'};color:${card.priority === 'high' ? '#dc2626' : card.priority === 'medium' ? '#d97706' : '#374151'};">${card.priority}</span>
              </td>
              <td style="padding:1rem 1.5rem;font-size:0.875rem;color:${COLORS.muted};">${new Date(card.created_at).toLocaleDateString()}</td>
            </tr>
          `).join('')}
          ${cards.length === 0 ? '<tr><td colspan="4" style="padding:2rem;text-align:center;color:${COLORS.muted};">No requests found</td></tr>' : ''}
        </tbody>
      </table>
    </div>
  `
}

async function renderProjects() {
  const projects = await api('/projects')
  return `
    <div style="margin-bottom:2rem;">
      <h1 style="font-size:1.875rem;font-weight:700;color:${COLORS.ink};letter-spacing:-0.02em;">Projects</h1>
      <p style="color:${COLORS.muted};margin-top:0.25rem;">Organize your design work by project</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;">
      ${projects.map(project => `
        <div style="background:${COLORS.surface};border-radius:0.75rem;padding:1.5rem;border:1px solid ${COLORS.border};transition:box-shadow 0.15s ease;">
          <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;">
            ${project.color ? `<div style="width:12px;height:12px;border-radius:50%;background:${project.color};"></div>` : ''}
            <h2 style="font-size:1.125rem;font-weight:600;color:${COLORS.ink};">${project.name}</h2>
          </div>
          ${project.description ? `<p style="font-size:0.875rem;color:${COLORS.muted};margin-bottom:1rem;line-height:1.5;">${project.description}</p>` : ''}
          <p style="font-size:0.75rem;color:${COLORS.muted};">Created ${new Date(project.created_at).toLocaleDateString()}</p>
        </div>
      `).join('')}
      ${projects.length === 0 ? '<p style="color:${COLORS.muted};grid-column:span 3;text-align:center;padding:2rem;">No projects yet. Create one to organize your work.</p>' : ''}
    </div>
  `
}

function renderSettings() {
  return `
    <div style="margin-bottom:2rem;">
      <h1 style="font-size:1.875rem;font-weight:700;color:${COLORS.ink};letter-spacing:-0.02em;">Settings</h1>
      <p style="color:${COLORS.muted};margin-top:0.25rem;">Manage your account and preferences</p>
    </div>
    <div style="background:${COLORS.surface};border-radius:0.75rem;padding:1.5rem;border:1px solid ${COLORS.border};max-width:600px;">
      <h2 style="font-size:1rem;font-weight:600;color:${COLORS.ink};margin-bottom:1.5rem;">Profile</h2>
      <div style="display:flex;flex-direction:column;gap:1rem;">
        <div>
          <label style="display:block;font-size:0.875rem;font-weight:500;color:${COLORS.ink};margin-bottom:0.5rem;">Name</label>
          <input type="text" value="Admin User" style="width:100%;padding:0.75rem;border:1px solid ${COLORS.border};border-radius:0.5rem;font-size:0.875rem;">
        </div>
        <div>
          <label style="display:block;font-size:0.875rem;font-weight:500;color:${COLORS.ink};margin-bottom:0.5rem;">Email</label>
          <input type="email" value="admin@designhub.com" style="width:100%;padding:0.75rem;border:1px solid ${COLORS.border};border-radius:0.5rem;font-size:0.875rem;">
        </div>
        <button style="background:${COLORS.accent};color:white;padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:500;border:none;cursor:pointer;align-self:flex-start;">Save Changes</button>
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
  document.getElementById('create-card-form').style.display = 'block'
}

function hideCreateCard() {
  document.getElementById('create-card-form').style.display = 'none'
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

// Initialize
renderApp()
