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

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: text('name'),
  avatar: text('avatar'),
  password: text('password'),
  isActive: boolean('is_active').default(true),
  isAdmin: boolean('is_admin').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const workspaces = pgTable('workspaces', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  ownerId: integer('owner_id').notNull(), // Instead of FK, just store the ID
  settings: jsonb('settings').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

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

export const views = pgTable('views', {
  id: serial('id').primaryKey(),
  itemId: integer('item_id').notNull(), // Instead of FK, just store the ID
  userId: integer('user_id'), // Optional - can be null for anonymous views
  viewedAt: timestamp('viewed_at').defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  deviceInfo: jsonb('device_info').$type<Record<string, any>>(),
});
