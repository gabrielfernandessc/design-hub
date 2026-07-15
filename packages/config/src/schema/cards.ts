import { pgTable, uuid, varchar, timestamp, text, integer, boolean } from 'drizzle-orm/pg-core'
import { users } from './users'
import { projects } from './projects'
import { categories } from './categories'

export const cards = pgTable('cards', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).notNull().default('new'),
  priority: varchar('priority', { length: 20 }).notNull().default('medium'),
  requesterName: varchar('requester_name', { length: 255 }),
  requesterEmail: varchar('requester_email', { length: 255 }),
  dueDate: timestamp('due_date'),
  slaStartedAt: timestamp('sla_started_at'),
  slaPausedAt: timestamp('sla_paused_at'),
  slaResumedAt: timestamp('sla_resumed_at'),
  assigneeId: uuid('assignee_id').references(() => users.id),
  projectId: uuid('project_id').references(() => projects.id),
  categoryId: uuid('category_id').references(() => categories.id),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Card = typeof cards.$inferSelect
export type NewCard = typeof cards.$inferInsert
