"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useVSCodeLayout } from "./VSCodeLayoutContext";
import {
  PencilIcon,
  Check,
  X,
  Star,
  StarOff,
  Plus,
  Trash2,
} from "lucide-react";
import {
  TreeDataProvider,
  useTreeData,
  TreeItem,
} from "../providers/TreeDataProvider";
import { Button } from "../ui/button";

// Component for displaying a file or folder item content
const TreeItemContent = ({ item }: { item: TreeItem }) => {
  return (
    <div className="flex items-center space-x-2">
      {item.isFolder && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${item.isOpen ? "transform rotate-90" : ""} transition-transform`}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      )}

      {item.isFolder ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-folder">
          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-file">
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        </svg>
      )}
      <span className={item.isSelected ? "font-medium text-primary" : ""}>
        {item.name}
      </span>
    </div>
  );
};

// Component for individual sortable tree items
const SortableTreeItem = ({
  item,
  onToggleFolder,
  onRenameItem,
  onSelectItem,
  onDeleteItem,
  onAddToFavorites,
  onRemoveFromFavorites,
  isFavorite = false,
  isDragging = false,
  isEditMode = false,
}: {
  item: TreeItem;
  onToggleFolder: (id: string) => void;
  onRenameItem?: (id: string, newName: string) => void;
  onSelectItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onAddToFavorites: (id: string) => void;
  onRemoveFromFavorites: (id: string) => void;
  isFavorite?: boolean;
  isDragging?: boolean;
  isEditMode?: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: item.id, disabled: !isEditMode });

  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(item.name);
  const [showActions, setShowActions] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    paddingLeft: `${item.level * 16}px`,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const handleFolderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.isFolder) {
      onToggleFolder(item.id);
    } else {
      onSelectItem(item.id);
    }
  };

  const startRenaming = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditMode) {
      setIsRenaming(true);
    }
  };

  const handleRename = () => {
    if (newName.trim() && onRenameItem) {
      onRenameItem(item.id, newName.trim());
    }
    setIsRenaming(false);
  };

  const cancelRename = () => {
    setNewName(item.name);
    setIsRenaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRename();
    } else if (e.key === "Escape") {
      cancelRename();
    }
  };

  const handleMouseEnter = () => {
    setShowActions(true);
  };

  const handleMouseLeave = () => {
    setShowActions(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      onDeleteItem(item.id);
    }
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      onRemoveFromFavorites(item.id);
    } else {
      onAddToFavorites(item.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center space-x-2 py-1 rounded group ${
        isSortableDragging ? "bg-accent/30" : "hover:bg-accent/50"
      } ${item.isSelected ? "bg-accent" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      {isRenaming ? (
        <div className="flex items-center space-x-2 pl-6 flex-grow">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleRename}
            className="bg-background text-foreground border border-input rounded px-2 py-0.5 text-sm w-full"
            autoFocus
          />
          <button
            onClick={handleRename}
            className="text-primary hover:text-primary/80"
            aria-label="Save rename">
            <Check size={16} />
          </button>
          <button
            onClick={cancelRename}
            className="text-destructive hover:text-destructive/80"
            aria-label="Cancel rename">
            <X size={16} />
          </button>
        </div>
      ) : (
        <>
          <div
            className="flex items-center space-x-2 cursor-pointer flex-grow"
            onClick={handleFolderClick}>
            <TreeItemContent item={item} />
          </div>

          {showActions && (
            <div className="flex items-center space-x-1">
              <button
                className="opacity-70 hover:opacity-100"
                onClick={handleFavoriteToggle}
                aria-label={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }>
                {isFavorite ? <StarOff size={14} /> : <Star size={14} />}
              </button>

              {isEditMode && (
                <>
                  <button
                    className="opacity-70 hover:opacity-100"
                    onClick={startRenaming}
                    aria-label="Rename item">
                    <PencilIcon size={14} />
                  </button>
                  <button
                    className="opacity-70 hover:opacity-100 text-destructive"
                    onClick={handleDelete}
                    aria-label="Delete item">
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          )}

          {isEditMode && (
            <div
              className="ml-auto opacity-0 group-hover:opacity-100 cursor-move"
              {...attributes}
              {...listeners}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-grip-vertical">
                <circle cx="9" cy="5" r="1" />
                <circle cx="9" cy="12" r="1" />
                <circle cx="9" cy="19" r="1" />
                <circle cx="15" cy="5" r="1" />
                <circle cx="15" cy="12" r="1" />
                <circle cx="15" cy="19" r="1" />
              </svg>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Main tree editor component
const DBTreeEditorContent = () => {
  const {
    items,
    loading,
    error,
    favoriteItems,
    recentItems,
    selectedNodeId,
    createNode,
    updateNode,
    deleteNode,
    toggleFolder,
    selectNode,
    addToFavorites,
    removeFromFavorites,
  } = useTreeData();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<TreeItem | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showRecent, setShowRecent] = useState(false);

  const { isEditMode } = useVSCodeLayout();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Flatten the tree structure for rendering
  const flattenTree = (
    items: TreeItem[],
    result: TreeItem[] = [],
  ): TreeItem[] => {
    items.forEach((item) => {
      result.push(item);

      if (item.isFolder && item.isOpen && item.children) {
        flattenTree(item.children, result);
      }
    });

    return result;
  };

  const flattenedItems = flattenTree(items);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveItem(findItemById(items, active.id as string));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!isEditMode) return;

    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Here we would implement the logic to update the item order in the database
      console.log(`Moved ${active.id} over ${over.id}`);

      // For now, just log. In a real implementation, we'd call a server action to update order
    }

    setActiveId(null);
    setActiveItem(null);
  };

  const handleToggleFolder = (id: string) => {
    toggleFolder(id);
  };

  const handleRenameItem = (id: string, newName: string) => {
    if (!isEditMode) return;
    updateNode(id, { name: newName });
  };

  const handleSelectItem = (id: string) => {
    selectNode(id);
  };

  const handleDeleteItem = (id: string) => {
    if (!isEditMode) return;
    deleteNode(id);
  };

  const handleCreateFolder = () => {
    if (!isEditMode) return;
    createNode({
      name: "New Folder",
      isFolder: true,
      path: "/",
      level: 0,
    });
  };

  const handleCreateFile = () => {
    if (!isEditMode) return;
    createNode({
      name: "New File.txt",
      isFolder: false,
      path: "/",
      level: 0,
      content: "",
    });
  };

  // Helper function to find an item by ID in the tree
  const findItemById = (items: TreeItem[], id: string): TreeItem | null => {
    for (const item of items) {
      if (item.id === id) {
        return item;
      }

      if (item.children) {
        const found = findItemById(item.children, id);
        if (found) {
          return found;
        }
      }
    }

    return null;
  };

  // Check if a node is in favorites
  const isInFavorites = (id: string) => {
    return favoriteItems.some((item) => item.id === id);
  };

  if (loading) {
    return <div className="p-4 text-muted-foreground">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-destructive">Error: {error}</div>;
  }

  return (
    <div className="w-full">
      {isEditMode && (
        <div className="px-4 py-2 text-xs text-primary border-t border-border mb-2">
          <p>Edit Mode Active</p>
          <p>• Drag items to reorder</p>
          <p>• Click the pencil icon to rename</p>
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCreateFolder}
              className="h-7 text-xs">
              <Plus className="mr-1 h-3 w-3" /> Folder
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCreateFile}
              className="h-7 text-xs">
              <Plus className="mr-1 h-3 w-3" /> File
            </Button>
          </div>
        </div>
      )}

      {/* Favorites section */}
      {favoriteItems.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className="flex items-center px-4 py-1 w-full text-left font-medium text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`mr-2 ${showFavorites ? "transform rotate-90" : ""} transition-transform`}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
            FAVORITES
          </button>

          {showFavorites && (
            <div className="mt-1">
              {favoriteItems.map((item) => (
                <SortableTreeItem
                  key={`favorite-${item.id}`}
                  item={{ ...item, level: 1 }}
                  onToggleFolder={handleToggleFolder}
                  onRenameItem={handleRenameItem}
                  onSelectItem={handleSelectItem}
                  onDeleteItem={handleDeleteItem}
                  onAddToFavorites={addToFavorites}
                  onRemoveFromFavorites={removeFromFavorites}
                  isFavorite={true}
                  isEditMode={isEditMode}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent section */}
      {recentItems.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setShowRecent(!showRecent)}
            className="flex items-center px-4 py-1 w-full text-left font-medium text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`mr-2 ${showRecent ? "transform rotate-90" : ""} transition-transform`}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
            RECENTLY OPENED
          </button>

          {showRecent && (
            <div className="mt-1">
              {recentItems.map((item) => (
                <SortableTreeItem
                  key={`recent-${item.id}`}
                  item={{ ...item, level: 1 }}
                  onToggleFolder={handleToggleFolder}
                  onRenameItem={handleRenameItem}
                  onSelectItem={handleSelectItem}
                  onDeleteItem={handleDeleteItem}
                  onAddToFavorites={addToFavorites}
                  onRemoveFromFavorites={removeFromFavorites}
                  isFavorite={isInFavorites(item.id)}
                  isEditMode={isEditMode}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main file explorer */}
      <div className="px-4 py-1 font-medium text-sm">EXPLORER</div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}>
        <SortableContext
          items={flattenedItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}>
          <div className="space-y-1 p-2">
            {flattenedItems.map((item) => (
              <SortableTreeItem
                key={item.id}
                item={item}
                onToggleFolder={handleToggleFolder}
                onRenameItem={handleRenameItem}
                onSelectItem={handleSelectItem}
                onDeleteItem={handleDeleteItem}
                onAddToFavorites={addToFavorites}
                onRemoveFromFavorites={removeFromFavorites}
                isFavorite={isInFavorites(item.id)}
                isEditMode={isEditMode}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeItem ? (
            <div className="bg-accent/30 rounded py-1 px-2">
              <TreeItemContent item={activeItem} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

// Wrap with provider
const DBTreeEditor = () => {
  return (
    <TreeDataProvider>
      <DBTreeEditorContent />
    </TreeDataProvider>
  );
};

export default DBTreeEditor;
