import { pgTable, uuid, varchar, text, timestamp, boolean } from 'drizzle-orm/pg-core'
import { users } from './users'
import { cards } from './cards'

export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: varchar('type', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message'),
  isRead: boolean('is_read').notNull().default(false),
  userId: uuid('user_id').references(() => users.id),
  cardId: uuid('card_id').references(() => cards.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Notification = typeof notifications.$inferSelect
export type NewNotification = typeof notifications.$inferInsert
