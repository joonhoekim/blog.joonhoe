import { integer, jsonb, pgTable, timestamp, varchar, uuid } from "drizzle-orm/pg-core";

/**
 * Comment 작성 방법:
 * `//C: 주석`
 * `//E: 예시`
 * `//T: 타입`
 * `//R: 참고`
 * `//P: 프로세스`
 * `//A: 주의`
 * TODO1: 해당 주석들을 실제 COMMENT 문으로 DB에 저장하는 스크립트 작성하기
 * TODO2: 해당 스크립트를 drizzle-kit에 통합하기
 */

export const postsTable = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar({ length: 255 }).notNull(),
  content: jsonb().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const commentsTable = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").references(() => postsTable.id),
  content: jsonb().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});
