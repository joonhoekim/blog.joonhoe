"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { PencilIcon, Check, X } from "lucide-react";

// This represents a file or folder in our tree
type TreeItem = {
  id: string;
  name: string;
  isFolder: boolean;
  children?: TreeItem[];
  level: number;
  isOpen?: boolean;
};

// Sample data for our tree structure
const initialItems: TreeItem[] = [
  {
    id: "web",
    name: "web",
    isFolder: true,
    level: 0,
    isOpen: true,
    children: [
      {
        id: "app",
        name: "app",
        isFolder: true,
        level: 1,
        isOpen: false,
        children: [
          {
            id: "page.tsx",
            name: "page.tsx",
            isFolder: false,
            level: 2,
          },
          {
            id: "layout.tsx",
            name: "layout.tsx",
            isFolder: false,
            level: 2,
          },
        ],
      },
      {
        id: "components",
        name: "components",
        isFolder: true,
        level: 1,
        isOpen: false,
        children: [
          {
            id: "Button.tsx",
            name: "Button.tsx",
            isFolder: false,
            level: 2,
          },
          {
            id: "Card.tsx",
            name: "Card.tsx",
            isFolder: false,
            level: 2,
          },
        ],
      },
    ],
  },
];

// Function to flatten tree structure for rendering and sorting
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

// A recursive function to toggle folder open/close state
const toggleFolder = (items: TreeItem[], itemId: string): TreeItem[] => {
  return items.map((item) => {
    if (item.id === itemId) {
      return { ...item, isOpen: !item.isOpen };
    }

    if (item.children) {
      return {
        ...item,
        children: toggleFolder(item.children, itemId),
      };
    }

    return item;
  });
};

// Find an item in the tree by its ID
const findItemById = (items: TreeItem[], id: string): TreeItem | null => {
  for (const item of items) {
    if (item.id === id) {
      return item;
    }

    if (item.children) {
      const result = findItemById(item.children, id);
      if (result) {
        return result;
      }
    }
  }

  return null;
};

// Component for displaying a file or folder item (not sortable)
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
      <span>{item.name}</span>
    </div>
  );
};

// Component for individual tree items
const SortableTreeItem = ({
  item,
  onToggleFolder,
  onRenameItem,
  isDragging = false,
  isEditMode = false,
}: {
  item: TreeItem;
  onToggleFolder: (id: string) => void;
  onRenameItem?: (id: string, newName: string) => void;
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center space-x-2 py-1 rounded group ${
        isSortableDragging ? "bg-accent/30" : "hover:bg-accent/50"
      }`}>
      {isRenaming ? (
        <div className="flex items-center space-x-2 pl-6 flex-grow">
          <input
            ref={inputRef}
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleRename}
            className="bg-background text-foreground border border-input rounded px-2 py-0.5 text-sm w-full"
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

          {isEditMode && (
            <button
              className="ml-auto opacity-0 group-hover:opacity-100 cursor-pointer mr-1"
              onClick={startRenaming}
              aria-label="Rename item">
              <PencilIcon size={14} />
            </button>
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
const TreeEditor = () => {
  const [items, setItems] = useState<TreeItem[]>(initialItems);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<TreeItem | null>(null);

  const { isEditMode } = useVSCodeLayout();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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
      console.log(`Moved ${active.id} over ${over.id}`);
    }

    setActiveId(null);
    setActiveItem(null);
  };

  const handleToggleFolder = (id: string) => {
    setItems(toggleFolder(items, id));
  };

  const handleRenameItem = (id: string, newName: string) => {
    if (!isEditMode) return;

    console.log(`Renamed ${id} to ${newName}`);
  };

  return (
    <div className="w-full">
      {isEditMode && (
        <div className="px-4 py-2 text-xs text-primary border-t border-border mb-2">
          <p>Edit Mode Active</p>
          <p>• Drag items to reorder</p>
          <p>• Click the pencil icon to rename</p>
        </div>
      )}

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

export default TreeEditor;
