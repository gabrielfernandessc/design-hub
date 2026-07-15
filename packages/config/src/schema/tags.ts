import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core'

export const tags = pgTable('tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  color: varchar('color', { length: 7 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Tag = typeof tags.$inferSelect
export type NewTag = typeof tags.$inferInsert
