import {
  pgTable,
  serial,
  timestamp,
  integer,
  varchar,
  jsonb,
  text,
} from 'drizzle-orm/pg-core';

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
