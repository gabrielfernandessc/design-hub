import { Elysia, t } from 'elysia'
import { supabase } from '@design-hub/config'

// Google Spreadsheet ID extracted from URL
const SPREADSHEET_ID = '1oThGtcNg_VIShTNC4E-9odLI3Ha4UjBgT9qWY8fkpcY'

// Export spreadsheet as CSV (public spreadsheet)
async function fetchSpreadsheetData(): Promise<string[][]> {
  const csvUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv`
  
  const response = await fetch(csvUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch spreadsheet: ${response.statusText}`)
  }
  
  const csvText = await response.text()
  const rows = csvText.split('\n').map(row => row.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')))
  return rows
}

// Parse spreadsheet rows into card objects
function parseRowsToCards(rows: string[][]): any[] {
  if (rows.length < 2) return [] // Skip header row
  
  const headers = rows[0].map(h => h.toLowerCase().replace(/\s+/g, '_'))
  const cards = []
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    if (row.length === 0 || !row[0]) continue // Skip empty rows
    
    const card: any = {}
    headers.forEach((header, index) => {
      if (row[index]) {
        card[header] = row[index]
      }
    })
    
    cards.push(card)
  }
  
  return cards
}

// Map spreadsheet columns to card fields
function mapToCard(row: any): any {
  // Try to find the right columns based on common spreadsheet formats
  const title = row.titulo || row.title || row.demanda || row.solicitacao || row[0] || 'Sem título'
  const description = row.descricao || row.description || row.detalhes || row[1] || ''
  const requesterName = row.nome || row.name || row.solicitante || row[2] || 'Desconhecido'
  const requesterEmail = row.email || row[3] || ''
  const priority = row.prioridade || row.priority || row.urgencia || row[4] || 'medium'
  const category = row.categoria || row.category || row.tipo || row[5] || ''
  
  return {
    title,
    description,
    requester_name: requesterName,
    requester_email: requesterEmail,
    priority: priority.toLowerCase(),
    category_name: category,
    status: 'new'
  }
}

export const spreadsheetRoutes = new Elysia({ prefix: '/api/spreadsheet' })
  // Get all rows from spreadsheet
  .get('/', async () => {
    try {
      const rows = await fetchSpreadsheetData()
      const cards = parseRowsToCards(rows)
      return { success: true, count: cards.length, data: cards }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })
  
  // Sync spreadsheet to database
  .post('/sync', async () => {
    try {
      const rows = await fetchSpreadsheetData()
      const spreadsheetCards = parseRowsToCards(rows)
      
      let created = 0
      let skipped = 0
      let errors = 0
      
      for (const row of spreadsheetCards) {
        try {
          const cardData = mapToCard(row)
          
          // Check if card already exists by title
          const { data: existing } = await supabase
            .from('cards')
            .select('id')
            .eq('title', cardData.title)
            .single()
          
          if (existing) {
            skipped++
            continue
          }
          
          // Find category by name if provided
          let categoryId = null
          if (cardData.category_name) {
            const { data: category } = await supabase
              .from('categories')
              .select('id')
              .ilike('name', cardData.category_name)
              .single()
            
            if (category) {
              categoryId = category.id
            }
          }
          
          // Create the card
          const { error } = await supabase
            .from('cards')
            .insert({
              title: cardData.title,
              description: cardData.description,
              requester_name: cardData.requester_name,
              requester_email: cardData.requester_email,
              priority: cardData.priority,
              status: 'new',
              category_id: categoryId
            })
          
          if (error) {
            console.error('Error creating card:', error)
            errors++
          } else {
            created++
          }
        } catch (err) {
          console.error('Error processing row:', err)
          errors++
        }
      }
      
      // Notify designers about new cards
      if (created > 0) {
        const { data: designers } = await supabase
          .from('users')
          .select('id')
          .eq('role', 'designer')
        
        if (designers) {
          for (const designer of designers) {
            await supabase
              .from('notifications')
              .insert({
                type: 'sync_complete',
                title: 'Sincronização concluída',
                message: `${created} novos cards foram criados a partir da planilha`,
                user_id: designer.id
              })
          }
        }
      }
      
      return {
        success: true,
        created,
        skipped,
        errors,
        total: spreadsheetCards.length
      }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })
  
  // Get specific row
  .get('/row/:rowIndex', async ({ params }) => {
    try {
      const rows = await fetchSpreadsheetData()
      const rowIndex = parseInt(params.rowIndex)
      
      if (rowIndex < 0 || rowIndex >= rows.length) {
        return { success: false, error: 'Row index out of bounds' }
      }
      
      const row = rows[rowIndex]
      const headers = rows[0]
      
      const data: any = {}
      headers.forEach((header, index) => {
        data[header] = row[index] || ''
      })
      
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })
