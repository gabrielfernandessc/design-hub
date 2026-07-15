import { pgTable, uuid, varchar, timestamp, bigint } from 'drizzle-orm/pg-core'
import { cards } from './cards'
import { users } from './users'

export const attachments = pgTable('attachments', {
  id: uuid('id').defaultRandom().primaryKey(),
  filename: varchar('filename', { length: 255 }).notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }),
  size: bigint('size', { mode: 'number' }),
  cardId: uuid('card_id').references(() => cards.id, { onDelete: 'cascade' }),
  uploadedById: uuid('uploaded_by_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Attachment = typeof attachments.$inferSelect
export type NewAttachment = typeof attachments.$inferInsert
