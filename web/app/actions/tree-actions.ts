'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { treeNodes, treeFavorites, treeRecent } from '@/db/schema/tree';
import { eq, and, isNull, desc } from 'drizzle-orm';
import { z } from 'zod';

// Define validation schemas
const createNodeSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.string().min(1).max(50),
  path: z.string().min(1),
  content: z.string().optional(),
  parentId: z.number().optional(),
  workspaceId: z.number(),
  metadata: z.record(z.any()).optional(),
  order: z.number().optional(),
  createdBy: z.number(),
  updatedBy: z.number(),
});

const updateNodeSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(255).optional(),
  type: z.string().min(1).max(50).optional(),
  path: z.string().min(1).optional(),
  content: z.string().optional(),
  parentId: z.number().optional(),
  isOpen: z.boolean().optional(),
  isSelected: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
  order: z.number().optional(),
  updatedBy: z.number(),
});

// Server actions for CRUD operations

/**
 * Create a new tree node
 */
export async function createTreeNode(formData: FormData | Record<string, any>) {
  try {
    const data =
      typeof formData.get === 'function'
        ? Object.fromEntries(formData.entries())
        : formData;

    const validatedData = createNodeSchema.parse(data);

    const [newNode] = await db
      .insert(treeNodes)
      .values({
        ...validatedData,
        isOpen: false,
        isSelected: false,
      })
      .returning();

    revalidatePath('/');
    return { success: true, data: newNode };
  } catch (error) {
    console.error('Error creating tree node:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get all root nodes for a workspace
 */
export async function getRootNodes(workspaceId: number) {
  try {
    const nodes = await db
      .select()
      .from(treeNodes)
      .where(
        and(eq(treeNodes.workspaceId, workspaceId), isNull(treeNodes.parentId))
      )
      .orderBy(treeNodes.order);

    return { success: true, data: nodes };
  } catch (error) {
    console.error('Error fetching root nodes:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get all child nodes for a parent node
 */
export async function getChildNodes(parentId: number) {
  try {
    const nodes = await db
      .select()
      .from(treeNodes)
      .where(eq(treeNodes.parentId, parentId))
      .orderBy(treeNodes.order);

    return { success: true, data: nodes };
  } catch (error) {
    console.error('Error fetching child nodes:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get a single node by ID
 */
export async function getNodeById(id: number) {
  try {
    const node = await db
      .select()
      .from(treeNodes)
      .where(eq(treeNodes.id, id))
      .limit(1);

    if (!node.length) {
      return { success: false, error: 'Node not found' };
    }

    return { success: true, data: node[0] };
  } catch (error) {
    console.error('Error fetching node:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update an existing tree node
 */
export async function updateTreeNode(formData: FormData | Record<string, any>) {
  try {
    const data =
      typeof formData.get === 'function'
        ? Object.fromEntries(formData.entries())
        : formData;

    const validatedData = updateNodeSchema.parse(data);
    const { id, ...updateData } = validatedData;

    const [updatedNode] = await db
      .update(treeNodes)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(treeNodes.id, id))
      .returning();

    if (!updatedNode) {
      return { success: false, error: 'Node not found' };
    }

    revalidatePath('/');
    return { success: true, data: updatedNode };
  } catch (error) {
    console.error('Error updating tree node:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Delete a tree node
 */
export async function deleteTreeNode(id: number) {
  try {
    // First get all child nodes recursively to delete them as well
    const childNodes = await getAllChildNodeIds(id);
    const allNodeIds = [id, ...childNodes];

    // Delete nodes
    const result = await db
      .delete(treeNodes)
      .where(eq(treeNodes.id, id))
      .returning({ id: treeNodes.id });

    if (!result.length) {
      return { success: false, error: 'Node not found' };
    }

    revalidatePath('/');
    return { success: true, data: { id } };
  } catch (error) {
    console.error('Error deleting tree node:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Helper function to get all child node IDs recursively
async function getAllChildNodeIds(parentId: number): Promise<number[]> {
  const children = await db
    .select({ id: treeNodes.id })
    .from(treeNodes)
    .where(eq(treeNodes.parentId, parentId));

  const childIds = children.map((child) => child.id);
  const nestedChildPromises = childIds.map((id) => getAllChildNodeIds(id));
  const nestedChildren = await Promise.all(nestedChildPromises);

  return [...childIds, ...nestedChildren.flat()];
}

/**
 * Add a node to favorites
 */
export async function addNodeToFavorites(nodeId: number, userId: number) {
  try {
    // Check if already favorited
    const existing = await db
      .select()
      .from(treeFavorites)
      .where(
        and(eq(treeFavorites.nodeId, nodeId), eq(treeFavorites.userId, userId))
      )
      .limit(1);

    if (existing.length) {
      return { success: true, data: existing[0] };
    }

    // Add to favorites
    const [favorite] = await db
      .insert(treeFavorites)
      .values({ nodeId, userId })
      .returning();

    revalidatePath('/');
    return { success: true, data: favorite };
  } catch (error) {
    console.error('Error adding node to favorites:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Remove a node from favorites
 */
export async function removeNodeFromFavorites(nodeId: number, userId: number) {
  try {
    const result = await db
      .delete(treeFavorites)
      .where(
        and(eq(treeFavorites.nodeId, nodeId), eq(treeFavorites.userId, userId))
      )
      .returning({ id: treeFavorites.id });

    revalidatePath('/');
    return { success: true, data: { id: result[0]?.id } };
  } catch (error) {
    console.error('Error removing node from favorites:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Track a node access in recent list
 */
export async function trackNodeAccess(nodeId: number, userId: number) {
  try {
    // Get existing access entry
    const existing = await db
      .select()
      .from(treeRecent)
      .where(and(eq(treeRecent.nodeId, nodeId), eq(treeRecent.userId, userId)))
      .limit(1);

    if (existing.length) {
      // Update the access time
      const [updated] = await db
        .update(treeRecent)
        .set({ accessedAt: new Date() })
        .where(eq(treeRecent.id, existing[0].id))
        .returning();

      return { success: true, data: updated };
    }

    // Add new entry
    const [recent] = await db
      .insert(treeRecent)
      .values({ nodeId, userId })
      .returning();

    // Clean up old entries if more than 10
    const recentEntries = await db
      .select()
      .from(treeRecent)
      .where(eq(treeRecent.userId, userId))
      .orderBy(desc(treeRecent.accessedAt));

    if (recentEntries.length > 10) {
      const entriesToDelete = recentEntries.slice(10);
      if (entriesToDelete.length) {
        await db
          .delete(treeRecent)
          .where(eq(treeRecent.id, entriesToDelete[0].id));
      }
    }

    return { success: true, data: recent };
  } catch (error) {
    console.error('Error tracking node access:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get recent nodes for a user
 */
export async function getRecentNodes(userId: number) {
  try {
    const recentAccesses = await db
      .select({
        id: treeRecent.id,
        nodeId: treeRecent.nodeId,
        accessedAt: treeRecent.accessedAt,
      })
      .from(treeRecent)
      .where(eq(treeRecent.userId, userId))
      .orderBy(desc(treeRecent.accessedAt))
      .limit(10);

    // Get the actual nodes
    const nodeIds = recentAccesses.map((access) => access.nodeId);
    const nodes = await Promise.all(nodeIds.map((id) => getNodeById(id)));

    const successfulNodes = nodes
      .filter((result) => result.success)
      .map((result) => result.data);

    return { success: true, data: successfulNodes };
  } catch (error) {
    console.error('Error fetching recent nodes:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get favorite nodes for a user
 */
export async function getFavoriteNodes(userId: number) {
  try {
    const favorites = await db
      .select({
        id: treeFavorites.id,
        nodeId: treeFavorites.nodeId,
        createdAt: treeFavorites.createdAt,
      })
      .from(treeFavorites)
      .where(eq(treeFavorites.userId, userId));

    // Get the actual nodes
    const nodeIds = favorites.map((fav) => fav.nodeId);
    const nodes = await Promise.all(nodeIds.map((id) => getNodeById(id)));

    const successfulNodes = nodes
      .filter((result) => result.success)
      .map((result) => result.data);

    return { success: true, data: successfulNodes };
  } catch (error) {
    console.error('Error fetching favorite nodes:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
