import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'
import { cards } from './cards'
import { users } from './users'

export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  cardId: uuid('card_id').references(() => cards.id, { onDelete: 'cascade' }),
  authorId: uuid('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Comment = typeof comments.$inferSelect
export type NewComment = typeof comments.$inferInsert
