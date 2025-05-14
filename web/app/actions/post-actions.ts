'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { posts, categories, favorites, recentItems } from '@/db/schema/tree';
import { eq, and, isNull, desc, sql } from 'drizzle-orm';
import { z } from 'zod';

// 유효성 검증 스키마
const createCategorySchema = z.object({
  name: z.string().min(1).max(255),
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9-]+$/, '소문자, 숫자, 하이픈만 허용됩니다'),
  description: z.string().optional(),
  isVisible: z.boolean().optional(),
  order: z.number().optional(),
  createdBy: z.number(),
  updatedBy: z.number(),
});

const updateCategorySchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(255).optional(),
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9-]+$/, '소문자, 숫자, 하이픈만 허용됩니다')
    .optional(),
  description: z.string().optional(),
  isVisible: z.boolean().optional(),
  order: z.number().optional(),
  updatedBy: z.number(),
});

const createPostSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9-]+$/, '소문자, 숫자, 하이픈만 허용됩니다'),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  categoryId: z.number(),
  parentId: z.number().optional(),
  isPublished: z.boolean().optional(),
  isOpen: z.boolean().optional(),
  isSelected: z.boolean().optional(),
  order: z.number().optional(),
  metadata: z.record(z.any()).optional(),
  createdBy: z.number(),
  updatedBy: z.number(),
});

const updatePostSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(255).optional(),
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9-]+$/, '소문자, 숫자, 하이픈만 허용됩니다')
    .optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  categoryId: z.number().optional(),
  parentId: z.number().optional(),
  isPublished: z.boolean().optional(),
  publishedAt: z.date().optional(),
  isOpen: z.boolean().optional(),
  isSelected: z.boolean().optional(),
  order: z.number().optional(),
  metadata: z.record(z.any()).optional(),
  updatedBy: z.number(),
});

// 카테고리 관련 액션

/**
 * 새 카테고리 생성
 */
export async function createCategory(formData: FormData | Record<string, any>) {
  try {
    const data =
      typeof formData.get === 'function'
        ? Object.fromEntries(formData.entries())
        : formData;

    const validatedData = createCategorySchema.parse(data);

    // 슬러그 중복 확인
    const existingCategory = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, validatedData.slug))
      .limit(1);

    if (existingCategory.length > 0) {
      return { success: false, error: '이미 사용 중인 슬러그입니다' };
    }

    const [newCategory] = await db
      .insert(categories)
      .values(validatedData)
      .returning();

    revalidatePath('/');
    return { success: true, data: newCategory };
  } catch (error) {
    console.error('카테고리 생성 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 에러',
    };
  }
}

/**
 * 모든 카테고리 조회
 */
export async function getAllCategories() {
  try {
    const result = await db.select().from(categories).orderBy(categories.order);

    return { success: true, data: result };
  } catch (error) {
    console.error('카테고리 조회 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 에러',
    };
  }
}

/**
 * 카테고리 ID로 조회
 */
export async function getCategoryById(id: number) {
  try {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    if (result.length === 0) {
      return { success: false, error: '카테고리를 찾을 수 없습니다' };
    }

    return { success: true, data: result[0] };
  } catch (error) {
    console.error('카테고리 조회 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 에러',
    };
  }
}

/**
 * 카테고리 업데이트
 */
export async function updateCategory(formData: FormData | Record<string, any>) {
  try {
    const data =
      typeof formData.get === 'function'
        ? Object.fromEntries(formData.entries())
        : formData;

    const validatedData = updateCategorySchema.parse(data);
    const { id, ...updateData } = validatedData;

    // 슬러그 업데이트 시 중복 확인
    if (updateData.slug) {
      const existingCategory = await db
        .select({ id: categories.id })
        .from(categories)
        .where(
          and(
            eq(categories.slug, updateData.slug),
            sql`${categories.id} != ${id}`
          )
        )
        .limit(1);

      if (existingCategory.length > 0) {
        return { success: false, error: '이미 사용 중인 슬러그입니다' };
      }
    }

    const [updatedCategory] = await db
      .update(categories)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();

    if (!updatedCategory) {
      return { success: false, error: '카테고리를 찾을 수 없습니다' };
    }

    revalidatePath('/');
    return { success: true, data: updatedCategory };
  } catch (error) {
    console.error('카테고리 업데이트 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 에러',
    };
  }
}

/**
 * 카테고리 삭제 (주의: 하위 포스트도 모두 삭제됨)
 */
export async function deleteCategory(id: number) {
  try {
    // 먼저 이 카테고리에 속한 모든 포스트 삭제
    await db.delete(posts).where(eq(posts.categoryId, id));

    // 카테고리 삭제
    const result = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning({ id: categories.id });

    if (!result.length) {
      return { success: false, error: '카테고리를 찾을 수 없습니다' };
    }

    revalidatePath('/');
    return { success: true, data: { id } };
  } catch (error) {
    console.error('카테고리 삭제 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 에러',
    };
  }
}

// 포스트 관련 액션

/**
 * 새 포스트 생성
 */
export async function createPost(formData: FormData | Record<string, any>) {
  try {
    const data =
      typeof formData.get === 'function'
        ? Object.fromEntries(formData.entries())
        : formData;

    const validatedData = createPostSchema.parse(data);

    // 슬러그 중복 확인
    const existingPost = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.slug, validatedData.slug))
      .limit(1);

    if (existingPost.length > 0) {
      return { success: false, error: '이미 사용 중인 슬러그입니다' };
    }

    // 카테고리 존재 확인
    const categoryExists = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.id, validatedData.categoryId))
      .limit(1);

    if (categoryExists.length === 0) {
      return { success: false, error: '카테고리가 존재하지 않습니다' };
    }

    // 부모 포스트 존재 확인 (있는 경우)
    if (validatedData.parentId) {
      const parentExists = await db
        .select({ id: posts.id })
        .from(posts)
        .where(eq(posts.id, validatedData.parentId))
        .limit(1);

      if (parentExists.length === 0) {
        return { success: false, error: '부모 포스트가 존재하지 않습니다' };
      }
    }

    const [newPost] = await db
      .insert(posts)
      .values({
        ...validatedData,
        isPublished: validatedData.isPublished || false,
        isOpen: validatedData.isOpen || false,
        isSelected: validatedData.isSelected || false,
      })
      .returning();

    revalidatePath('/');
    return { success: true, data: newPost };
  } catch (error) {
    console.error('포스트 생성 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 에러',
    };
  }
}

/**
 * 카테고리의 루트 포스트 조회 (상위 포스트가 없는 포스트)
 */
export async function getRootPosts(categoryId: number) {
  try {
    const result = await db
      .select()
      .from(posts)
      .where(and(eq(posts.categoryId, categoryId), isNull(posts.parentId)))
      .orderBy(posts.order);

    return { success: true, data: result };
  } catch (error) {
    console.error('루트 포스트 조회 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 에러',
    };
  }
}

/**
 * 상위 포스트의 하위 포스트 조회
 */
export async function getChildPosts(parentId: number) {
  try {
    const result = await db
      .select()
      .from(posts)
      .where(eq(posts.parentId, parentId))
      .orderBy(posts.order);

    return { success: true, data: result };
  } catch (error) {
    console.error('하위 포스트 조회 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 에러',
    };
  }
}

/**
 * 포스트 ID로 조회
 */
export async function getPostById(id: number) {
  try {
    const result = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    if (result.length === 0) {
      return { success: false, error: '포스트를 찾을 수 없습니다' };
    }

    return { success: true, data: result[0] };
  } catch (error) {
    console.error('포스트 조회 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 에러',
    };
  }
}

/**
 * 포스트 업데이트
 */
export async function updatePost(formData: FormData | Record<string, any>) {
  try {
    const data =
      typeof formData.get === 'function'
        ? Object.fromEntries(formData.entries())
        : formData;

    const validatedData = updatePostSchema.parse(data);
    const { id, ...updateData } = validatedData;

    // 슬러그 업데이트 시 중복 확인
    if (updateData.slug) {
      const existingPost = await db
        .select({ id: posts.id })
        .from(posts)
        .where(and(eq(posts.slug, updateData.slug), sql`${posts.id} != ${id}`))
        .limit(1);

      if (existingPost.length > 0) {
        return { success: false, error: '이미 사용 중인 슬러그입니다' };
      }
    }

    // 카테고리 변경 시 존재 확인
    if (updateData.categoryId) {
      const categoryExists = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.id, updateData.categoryId))
        .limit(1);

      if (categoryExists.length === 0) {
        return { success: false, error: '카테고리가 존재하지 않습니다' };
      }
    }

    // 부모 포스트 변경 시 존재 확인
    if (updateData.parentId) {
      const parentExists = await db
        .select({ id: posts.id })
        .from(posts)
        .where(eq(posts.id, updateData.parentId))
        .limit(1);

      if (parentExists.length === 0) {
        return { success: false, error: '부모 포스트가 존재하지 않습니다' };
      }

      // 자기 자신을 부모로 지정하는 것 방지
      if (updateData.parentId === id) {
        return {
          success: false,
          error: '자기 자신을 부모로 지정할 수 없습니다',
        };
      }
    }

    // 발행 상태 변경 시 발행일 업데이트
    if (updateData.isPublished === true && !updateData.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const [updatedPost] = await db
      .update(posts)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id))
      .returning();

    if (!updatedPost) {
      return { success: false, error: '포스트를 찾을 수 없습니다' };
    }

    revalidatePath('/');
    return { success: true, data: updatedPost };
  } catch (error) {
    console.error('포스트 업데이트 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 에러',
    };
  }
}

/**
 * 포스트 삭제 (하위 포스트도 모두 삭제)
 */
export async function deletePost(id: number) {
  try {
    // 하위 포스트 ID 재귀적으로 찾기
    const childIds = await getAllChildPostIds(id);

    // 모든 하위 포스트 삭제
    if (childIds.length > 0) {
      await db
        .delete(posts)
        .where(sql`${posts.id} IN (${childIds.join(', ')})`);
    }

    // 포스트와 관련된 즐겨찾기, 최근 목록 삭제
    await db.delete(favorites).where(eq(favorites.postId, id));

    await db.delete(recentItems).where(eq(recentItems.postId, id));

    // 포스트 삭제
    const result = await db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning({ id: posts.id });

    if (!result.length) {
      return { success: false, error: '포스트를 찾을 수 없습니다' };
    }

    revalidatePath('/');
    return { success: true, data: { id } };
  } catch (error) {
    console.error('포스트 삭제 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 에러',
    };
  }
}

// 하위 포스트 ID 모두 얻기 (재귀 함수)
async function getAllChildPostIds(parentId: number): Promise<number[]> {
  const children = await db
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.parentId, parentId));

  const childIds = children.map((child) => child.id);

  if (childIds.length === 0) {
    return [];
  }

  const nestedChildPromises = childIds.map((id) => getAllChildPostIds(id));
  const nestedChildren = await Promise.all(nestedChildPromises);

  return [...childIds, ...nestedChildren.flat()];
}

/**
 * 포스트 폴더 열기/닫기 상태 토글
 */
export async function togglePostFolder(id: number) {
  try {
    // 현재 상태 조회
    const currentPost = await db
      .select({ isOpen: posts.isOpen })
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    if (currentPost.length === 0) {
      return { success: false, error: '포스트를 찾을 수 없습니다' };
    }

    // 상태 토글
    const newIsOpen = !currentPost[0].isOpen;

    const [updatedPost] = await db
      .update(posts)
      .set({
        isOpen: newIsOpen,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id))
      .returning();

    return { success: true, data: updatedPost };
  } catch (error) {
    console.error('폴더 토글 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 에러',
    };
  }
}

/**
 * 포스트 선택
 */
export async function selectPost(id: number, userId: number) {
  try {
    // 이전에 선택된 포스트 선택 해제
    await db
      .update(posts)
      .set({ isSelected: false })
      .where(eq(posts.isSelected, true));

    // 새 포스트 선택
    const [selectedPost] = await db
      .update(posts)
      .set({
        isSelected: true,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id))
      .returning();

    if (!selectedPost) {
      return { success: false, error: '포스트를 찾을 수 없습니다' };
    }

    // 최근 액세스 기록 추가/업데이트
    const existing = await db
      .select()
      .from(recentItems)
      .where(and(eq(recentItems.postId, id), eq(recentItems.userId, userId)))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(recentItems)
        .set({ accessedAt: new Date() })
        .where(eq(recentItems.id, existing[0].id));
    } else {
      await db
        .insert(recentItems)
        .values({ postId: id, userId, accessedAt: new Date() });

      // 최근 항목이 10개 이상이면 가장 오래된 항목 삭제
      const allRecents = await db
        .select()
        .from(recentItems)
        .where(eq(recentItems.userId, userId))
        .orderBy(desc(recentItems.accessedAt));

      if (allRecents.length > 10) {
        const oldestItems = allRecents.slice(10);
        for (const item of oldestItems) {
          await db.delete(recentItems).where(eq(recentItems.id, item.id));
        }
      }
    }

    revalidatePath('/');
    return { success: true, data: selectedPost };
  } catch (error) {
    console.error('포스트 선택 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 에러',
    };
  }
}

/**
 * 즐겨찾기에 포스트 추가
 */
export async function addToFavorites(postId: number, userId: number) {
  try {
    // 이미 즐겨찾기에 있는지 확인
    const existing = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.postId, postId), eq(favorites.userId, userId)))
      .limit(1);

    if (existing.length > 0) {
      return { success: true, data: existing[0] }; // 이미 즐겨찾기에 있음
    }

    // 즐겨찾기에 추가
    const [favorite] = await db
      .insert(favorites)
      .values({ postId, userId })
      .returning();

    revalidatePath('/');
    return { success: true, data: favorite };
  } catch (error) {
    console.error('즐겨찾기 추가 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 에러',
    };
  }
}

/**
 * 즐겨찾기에서 포스트 제거
 */
export async function removeFromFavorites(postId: number, userId: number) {
  try {
    const result = await db
      .delete(favorites)
      .where(and(eq(favorites.postId, postId), eq(favorites.userId, userId)))
      .returning({ id: favorites.id });

    revalidatePath('/');
    return { success: true, data: { id: result[0]?.id } };
  } catch (error) {
    console.error('즐겨찾기 제거 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 에러',
    };
  }
}

/**
 * 사용자의 즐겨찾기 포스트 조회
 */
export async function getFavorites(userId: number) {
  try {
    const favoriteIds = await db
      .select({
        postId: favorites.postId,
      })
      .from(favorites)
      .where(eq(favorites.userId, userId));

    if (favoriteIds.length === 0) {
      return { success: true, data: [] };
    }

    const postIds = favoriteIds.map((f) => f.postId);

    const favoritePosts = await db
      .select()
      .from(posts)
      .where(sql`${posts.id} IN (${postIds.join(', ')})`);

    return { success: true, data: favoritePosts };
  } catch (error) {
    console.error('즐겨찾기 조회 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 에러',
    };
  }
}

/**
 * 사용자의 최근 포스트 조회
 */
export async function getRecentPosts(userId: number) {
  try {
    const recentIds = await db
      .select({
        postId: recentItems.postId,
      })
      .from(recentItems)
      .where(eq(recentItems.userId, userId))
      .orderBy(desc(recentItems.accessedAt))
      .limit(10);

    if (recentIds.length === 0) {
      return { success: true, data: [] };
    }

    const postIds = recentIds.map((r) => r.postId);

    const recentPosts = await db
      .select()
      .from(posts)
      .where(sql`${posts.id} IN (${postIds.join(', ')})`);

    // 최근 액세스 순으로 재정렬
    const orderedPosts = postIds
      .map((id) => recentPosts.find((post) => post.id === id))
      .filter(Boolean);

    return { success: true, data: orderedPosts };
  } catch (error) {
    console.error('최근 포스트 조회 에러:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 에러',
    };
  }
}
