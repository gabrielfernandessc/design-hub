import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '../../.env') })

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  console.log('Seeding database...')

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', 'admin@designhub.com')
    .single()

  let userId = existingUser?.id

  if (!userId) {
    // Create test user
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        email: 'admin@designhub.com',
        name: 'Admin User',
        password: 'admin123', // In production, this should be hashed
        role: 'admin'
      })
      .select()
      .single()

    if (userError) {
      console.error('Error creating user:', userError)
      return
    }
    userId = user.id
    console.log('User created:', user.email)
  } else {
    console.log('User already exists')
  }

  // Check if project already exists
  const { data: existingProject } = await supabase
    .from('projects')
    .select('id')
    .eq('name', 'Website Redesign')
    .single()

  let projectId = existingProject?.id

  if (!projectId) {
    // Create test project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        name: 'Website Redesign',
        description: 'Complete redesign of the company website',
        color: '#3B82F6',
        owner_id: userId
      })
      .select()
      .single()

    if (projectError) {
      console.error('Error creating project:', projectError)
      return
    }
    projectId = project.id
    console.log('Project created:', project.name)
  } else {
    console.log('Project already exists')
  }

  // Get categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')

  // Check if cards already exist
  const { data: existingCards } = await supabase
    .from('cards')
    .select('id')
    .limit(1)

  if (!existingCards || existingCards.length === 0) {
    // Create test cards
    if (categories && categories.length > 0) {
      const cards = [
        {
          title: 'Design new landing page',
          description: 'Create a modern landing page for the new product launch',
          status: 'new',
          priority: 'high',
          requester_name: 'Marketing Team',
          requester_email: 'marketing@company.com',
          project_id: projectId,
          category_id: categories.find(c => c.name === 'UI/UX')?.id
        },
        {
          title: 'Update brand guidelines',
          description: 'Update the brand guidelines document with new color palette',
          status: 'in_progress',
          priority: 'medium',
          requester_name: 'CEO',
          requester_email: 'ceo@company.com',
          project_id: projectId,
          category_id: categories.find(c => c.name === 'Branding')?.id,
          assignee_id: userId
        },
        {
          title: 'Social media graphics',
          description: 'Create graphics for upcoming social media campaign',
          status: 'new',
          priority: 'low',
          requester_name: 'Social Media Manager',
          requester_email: 'social@company.com',
          project_id: projectId,
          category_id: categories.find(c => c.name === 'Marketing')?.id
        }
      ]

      for (const card of cards) {
        const { error } = await supabase
          .from('cards')
          .insert(card)

        if (error) {
          console.error('Error creating card:', error)
        } else {
          console.log('Card created:', card.title)
        }
      }
    }
  } else {
    console.log('Cards already exist')
  }

  // Get tags
  const { data: tags } = await supabase
    .from('tags')
    .select('*')

  // Get cards to add tags
  const { data: cards } = await supabase
    .from('cards')
    .select('*')

  // Check if card_tags already exist
  const { data: existingCardTags } = await supabase
    .from('card_tags')
    .select('card_id')
    .limit(1)

  // Add tags to first card
  if (!existingCardTags || existingCardTags.length === 0) {
    if (cards && cards.length > 0 && tags && tags.length > 0) {
      const { error } = await supabase
        .from('card_tags')
        .insert({
          card_id: cards[0].id,
          tag_id: tags.find(t => t.name === 'Urgent')?.id
        })

      if (error) {
        console.error('Error adding tag:', error)
      } else {
        console.log('Tag added to card')
      }
    }
  } else {
    console.log('Card tags already exist')
  }

  console.log('Seed completed!')
}

seed().catch(console.error)
