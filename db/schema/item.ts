import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  jsonb,
} from 'drizzle-orm/pg-core';

export const items = pgTable('items', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content'),
  workspaceId: integer('workspace_id').notNull(), // Instead of FK, just store the ID
  authorId: integer('author_id').notNull(), // Instead of FK, just store the ID
  isPublished: boolean('is_published').default(false),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  publishedAt: timestamp('published_at'),
});
