import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

// For Drizzle ORM compatibility, we'll use a wrapper
// that converts Supabase queries to a Drizzle-like interface
export const db = {
  query: {
    users: {
      findMany: async (options?: any) => {
        const { data, error } = await supabase.from('users').select('*')
        if (error) throw error
        return data || []
      },
      findFirst: async (options?: any) => {
        const { data, error } = await supabase.from('users').select('*').limit(1).single()
        if (error) throw error
        return data
      }
    },
    projects: {
      findMany: async (options?: any) => {
        const { data, error } = await supabase.from('projects').select('*')
        if (error) throw error
        return data || []
      },
      findFirst: async (options?: any) => {
        const { data, error } = await supabase.from('projects').select('*').limit(1).single()
        if (error) throw error
        return data
      }
    },
    cards: {
      findMany: async (options?: any) => {
        const { data, error } = await supabase.from('cards').select('*')
        if (error) throw error
        return data || []
      },
      findFirst: async (options?: any) => {
        const { data, error } = await supabase.from('cards').select('*').limit(1).single()
        if (error) throw error
        return data
      }
    },
    categories: {
      findMany: async (options?: any) => {
        const { data, error } = await supabase.from('categories').select('*')
        if (error) throw error
        return data || []
      }
    },
    tags: {
      findMany: async (options?: any) => {
        const { data, error } = await supabase.from('tags').select('*')
        if (error) throw error
        return data || []
      }
    },
    comments: {
      findMany: async (options?: any) => {
        const { data, error } = await supabase.from('comments').select('*')
        if (error) throw error
        return data || []
      }
    },
    notifications: {
      findMany: async (options?: any) => {
        const { data, error } = await supabase.from('notifications').select('*')
        if (error) throw error
        return data || []
      }
    }
  },
  insert: async (table: string, data: any) => {
    const { data: result, error } = await supabase.from(table).insert(data).select()
    if (error) throw error
    return result
  },
  update: async (table: string, data: any, match: any) => {
    const { data: result, error } = await supabase.from(table).update(data).match(match).select()
    if (error) throw error
    return result
  },
  delete: async (table: string, match: any) => {
    const { error } = await supabase.from(table).delete().match(match)
    if (error) throw error
  }
}
