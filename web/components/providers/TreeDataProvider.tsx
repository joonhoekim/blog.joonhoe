"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  createTreeNode,
  getRootNodes,
  getChildNodes,
  getNodeById,
  updateTreeNode,
  deleteTreeNode,
  addNodeToFavorites,
  removeNodeFromFavorites,
  trackNodeAccess,
  getRecentNodes,
  getFavoriteNodes,
} from "@/app/actions/tree-actions";

// Define the type for tree items
export type TreeItem = {
  id: string;
  name: string;
  isFolder: boolean;
  children?: TreeItem[];
  level: number;
  isOpen?: boolean;
  // Additional fields from our DB schema
  type: string;
  path: string;
  content?: string;
  parentId?: number;
  workspaceId: number;
  metadata?: Record<string, any>;
  isSelected?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy: number;
  updatedBy: number;
};

// Mock user ID until we have auth setup
const MOCK_USER_ID = 1;
const MOCK_WORKSPACE_ID = 1;

// Context type definition
type TreeDataContextType = {
  items: TreeItem[];
  loading: boolean;
  error: string | null;
  recentItems: TreeItem[];
  favoriteItems: TreeItem[];
  selectedNodeId: string | null;
  createNode: (nodeData: Partial<TreeItem>) => Promise<void>;
  updateNode: (id: string, data: Partial<TreeItem>) => Promise<void>;
  deleteNode: (id: string) => Promise<void>;
  toggleFolder: (id: string) => Promise<void>;
  selectNode: (id: string) => Promise<void>;
  addToFavorites: (id: string) => Promise<void>;
  removeFromFavorites: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
};

// Create context
const TreeDataContext = createContext<TreeDataContextType | undefined>(
  undefined,
);

// Provider component
export const TreeDataProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<TreeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentItems, setRecentItems] = useState<TreeItem[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<TreeItem[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const router = useRouter();

  // Helper to convert DB data to TreeItem format
  const mapDbNodeToTreeItem = (
    node: any,
    level: number = 0,
    isOpen: boolean = false,
    children: TreeItem[] = [],
  ): TreeItem => {
    const isFolder = node.type === "folder";

    return {
      id: node.id.toString(),
      name: node.name,
      isFolder,
      level,
      isOpen,
      children: isFolder ? children : undefined,
      type: node.type,
      path: node.path,
      content: node.content,
      parentId: node.parentId,
      workspaceId: node.workspaceId,
      metadata: node.metadata,
      isSelected: node.isSelected,
      createdAt: node.createdAt,
      updatedAt: node.updatedAt,
      createdBy: node.createdBy,
      updatedBy: node.updatedBy,
    };
  };

  // Load initial data
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get root nodes from our workspace
      const rootNodesResult = await getRootNodes(MOCK_WORKSPACE_ID);

      if (!rootNodesResult.success) {
        throw new Error(rootNodesResult.error || "Failed to load root nodes");
      }

      // Convert DB nodes to TreeItem format with children
      const treeItems: TreeItem[] = [];

      for (const rootNode of rootNodesResult.data) {
        // Get children if this is a folder
        let children: TreeItem[] = [];

        if (rootNode.type === "folder" && rootNode.isOpen) {
          const childrenResult = await getChildNodes(parseInt(rootNode.id));

          if (childrenResult.success) {
            // Map children recursively (first level only for now)
            children = childrenResult.data.map((child) =>
              mapDbNodeToTreeItem(child, 1, false),
            );
          }
        }

        treeItems.push(
          mapDbNodeToTreeItem(rootNode, 0, rootNode.isOpen || false, children),
        );
      }

      setItems(treeItems);

      // Get recent and favorite items
      const recentResult = await getRecentNodes(MOCK_USER_ID);
      if (recentResult.success) {
        setRecentItems(
          recentResult.data.map((node) => mapDbNodeToTreeItem(node, 0)),
        );
      }

      const favoritesResult = await getFavoriteNodes(MOCK_USER_ID);
      if (favoritesResult.success) {
        setFavoriteItems(
          favoritesResult.data.map((node) => mapDbNodeToTreeItem(node, 0)),
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error loading tree data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const refreshData = async () => {
    await loadData();
    router.refresh();
  };

  // Initial data load
  useEffect(() => {
    loadData();
  }, []);

  // Create a new node
  const createNode = async (nodeData: Partial<TreeItem>) => {
    try {
      setError(null);

      // Convert TreeItem format to DB format
      const dbData = {
        name: nodeData.name || "New Node",
        type: nodeData.isFolder ? "folder" : "file",
        path: nodeData.path || "/",
        content: nodeData.content || "",
        parentId: nodeData.parentId
          ? parseInt(nodeData.parentId.toString())
          : undefined,
        workspaceId: MOCK_WORKSPACE_ID,
        metadata: nodeData.metadata || {},
        createdBy: MOCK_USER_ID,
        updatedBy: MOCK_USER_ID,
      };

      const result = await createTreeNode(dbData);

      if (!result.success) {
        throw new Error(result.error || "Failed to create node");
      }

      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error creating node:", err);
    }
  };

  // Update a node
  const updateNode = async (id: string, data: Partial<TreeItem>) => {
    try {
      setError(null);

      // Convert TreeItem format to DB format
      const dbData = {
        id: parseInt(id),
        ...(data.name && { name: data.name }),
        ...(data.type && { type: data.type }),
        ...(data.path && { path: data.path }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.parentId !== undefined && {
          parentId: parseInt(data.parentId.toString()),
        }),
        ...(data.isOpen !== undefined && { isOpen: data.isOpen }),
        ...(data.isSelected !== undefined && { isSelected: data.isSelected }),
        ...(data.metadata && { metadata: data.metadata }),
        updatedBy: MOCK_USER_ID,
      };

      const result = await updateTreeNode(dbData);

      if (!result.success) {
        throw new Error(result.error || "Failed to update node");
      }

      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error updating node:", err);
    }
  };

  // Delete a node
  const deleteNode = async (id: string) => {
    try {
      setError(null);

      const result = await deleteTreeNode(parseInt(id));

      if (!result.success) {
        throw new Error(result.error || "Failed to delete node");
      }

      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error deleting node:", err);
    }
  };

  // Toggle folder open/close
  const toggleFolder = async (id: string) => {
    try {
      // Find the node
      const nodeToToggle = findNodeById(items, id);

      if (!nodeToToggle || !nodeToToggle.isFolder) {
        return;
      }

      // Update the isOpen state in the database
      await updateNode(id, { isOpen: !nodeToToggle.isOpen });

      // If we're opening a folder, track this access
      if (!nodeToToggle.isOpen) {
        await trackNodeAccess(parseInt(id), MOCK_USER_ID);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error toggling folder:", err);
    }
  };

  // Select a node
  const selectNode = async (id: string) => {
    try {
      // Clear previous selection
      if (selectedNodeId) {
        await updateNode(selectedNodeId, { isSelected: false });
      }

      // Select new node
      await updateNode(id, { isSelected: true });
      setSelectedNodeId(id);

      // Track this access
      await trackNodeAccess(parseInt(id), MOCK_USER_ID);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error selecting node:", err);
    }
  };

  // Add to favorites
  const addToFavorites = async (id: string) => {
    try {
      const result = await addNodeToFavorites(parseInt(id), MOCK_USER_ID);

      if (!result.success) {
        throw new Error(result.error || "Failed to add to favorites");
      }

      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error adding to favorites:", err);
    }
  };

  // Remove from favorites
  const removeFromFavorites = async (id: string) => {
    try {
      const result = await removeNodeFromFavorites(parseInt(id), MOCK_USER_ID);

      if (!result.success) {
        throw new Error(result.error || "Failed to remove from favorites");
      }

      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error removing from favorites:", err);
    }
  };

  // Helper function to find a node by ID in the tree
  const findNodeById = (nodes: TreeItem[], id: string): TreeItem | null => {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }

      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) {
          return found;
        }
      }
    }

    return null;
  };

  // Context value
  const contextValue: TreeDataContextType = {
    items,
    loading,
    error,
    recentItems,
    favoriteItems,
    selectedNodeId,
    createNode,
    updateNode,
    deleteNode,
    toggleFolder,
    selectNode,
    addToFavorites,
    removeFromFavorites,
    refreshData,
  };

  return (
    <TreeDataContext.Provider value={contextValue}>
      {children}
    </TreeDataContext.Provider>
  );
};

// Custom hook to use the tree data context
export const useTreeData = () => {
  const context = useContext(TreeDataContext);

  if (context === undefined) {
    throw new Error("useTreeData must be used within a TreeDataProvider");
  }

  return context;
};
