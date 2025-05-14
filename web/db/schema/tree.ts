import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  jsonb,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// 카테고리 테이블 정의
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  isVisible: boolean('is_visible').default(true),
  order: integer('order').default(0), // 카테고리 표시 순서
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  createdBy: integer('created_by').notNull(),
  updatedBy: integer('updated_by').notNull(),
});

// 포스트 테이블 정의 (트리 노드로 작동)
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(), // 노드 이름
  slug: varchar('slug', { length: 255 }).notNull(),
  excerpt: text('excerpt'), // 포스트 요약
  content: text('content'), // Lexical Editor의 JSON 콘텐츠
  categoryId: integer('category_id').notNull(), // 카테고리 ID (루트 참조)
  parentId: integer('parent_id'), // 상위 포스트 ID (계층 구조용, null이면 카테고리 직속)
  isPublished: boolean('is_published').default(false),
  publishedAt: timestamp('published_at'),
  isOpen: boolean('is_open').default(false), // 트리 UI에서 폴더가 열려있는지
  isSelected: boolean('is_selected').default(false), // 트리 UI에서 선택되었는지
  order: integer('order').default(0), // 표시 순서
  metadata: jsonb('metadata').$type<Record<string, any>>(), // 추가 데이터
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  createdBy: integer('created_by').notNull(),
  updatedBy: integer('updated_by').notNull(),
});

// 즐겨찾기 테이블 정의
export const favorites = pgTable(
  'favorites',
  {
    id: serial('id').primaryKey(),
    postId: integer('post_id').notNull(), // 포스트(노드) ID
    userId: integer('user_id').notNull(), // 유저 ID
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => {
    return {
      favUnique: uniqueIndex('favorites_post_user_unique').on(
        table.postId,
        table.userId
      ),
    };
  }
);

// 최근 항목 테이블 정의
export const recentItems = pgTable('recent_items', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').notNull(), // 포스트(노드) ID
  userId: integer('user_id').notNull(), // 유저 ID
  accessedAt: timestamp('accessed_at').defaultNow(), // 접근 시간
});
