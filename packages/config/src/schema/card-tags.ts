import { pgTable, uuid, timestamp, primaryKey } from 'drizzle-orm/pg-core'
import { cards } from './cards'
import { tags } from './tags'

export const cardTags = pgTable(
  'card_tags',
  {
    cardId: uuid('card_id').references(() => cards.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id').references(() => tags.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.cardId, t.tagId] }),
  })
)

export type CardTag = typeof cardTags.$inferSelect
export type NewCardTag = typeof cardTags.$inferInsert
