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
  FolderIcon,
  FileTextIcon,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  PostTreeProvider,
  usePostTree,
  TreeItem,
} from "../providers/PostTreeProvider";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

// 아이템 콘텐츠 컴포넌트
const TreeItemContent = ({ item }: { item: TreeItem }) => {
  return (
    <div className="flex items-center space-x-2">
      {item.isFolder && (
        <span
          className={`transition-transform ${item.isOpen ? "rotate-90" : ""}`}>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}

      {item.isFolder ? (
        <FolderIcon className="h-4 w-4 text-blue-500" />
      ) : (
        <FileTextIcon className="h-4 w-4 text-gray-500" />
      )}

      <span className={item.isSelected ? "font-medium text-primary" : ""}>
        {item.name}
      </span>
    </div>
  );
};

// 정렬 가능한 트리 아이템 컴포넌트
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

  const handleItemClick = (e: React.MouseEvent) => {
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
    if (window.confirm(`정말 "${item.name}"을(를) 삭제하시겠습니까?`)) {
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
      className={`flex items-center space-x-2 py-1 px-2 rounded group ${
        isSortableDragging ? "bg-accent/30" : "hover:bg-accent/50"
      } ${item.isSelected ? "bg-accent" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      {isRenaming ? (
        <div className="flex items-center space-x-2 flex-grow">
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
            aria-label="저장">
            <Check size={16} />
          </button>
          <button
            onClick={cancelRename}
            className="text-destructive hover:text-destructive/80"
            aria-label="취소">
            <X size={16} />
          </button>
        </div>
      ) : (
        <>
          <div
            className="flex items-center space-x-2 cursor-pointer flex-grow"
            onClick={handleItemClick}>
            <TreeItemContent item={item} />
          </div>

          {showActions && (
            <div className="flex items-center space-x-1">
              <button
                className="opacity-70 hover:opacity-100"
                onClick={handleFavoriteToggle}
                aria-label={isFavorite ? "즐겨찾기 제거" : "즐겨찾기 추가"}>
                {isFavorite ? <StarOff size={14} /> : <Star size={14} />}
              </button>

              {isEditMode && (
                <>
                  <button
                    className="opacity-70 hover:opacity-100"
                    onClick={startRenaming}
                    aria-label="이름 변경">
                    <PencilIcon size={14} />
                  </button>
                  <button
                    className="opacity-70 hover:opacity-100 text-destructive"
                    onClick={handleDelete}
                    aria-label="삭제">
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

// 카테고리 탭 컴포넌트
const CategoryTabs = ({
  categories,
  selectedCategory,
  onSelect,
}: {
  categories: any[];
  selectedCategory: number | null;
  onSelect: (id: number) => void;
}) => {
  if (!categories.length) {
    return (
      <div className="px-4 py-2 text-sm text-muted-foreground">
        카테고리가 없습니다
      </div>
    );
  }

  return (
    <Tabs
      value={selectedCategory?.toString()}
      onValueChange={(value) => onSelect(parseInt(value))}>
      <TabsList className="flex w-full overflow-x-auto">
        {categories.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id.toString()}
            className="flex-shrink-0 px-3 py-1.5 text-xs">
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

// 새 항목 생성 메뉴
const CreateMenu = ({
  onCreateFolder,
  onCreateDocument,
}: {
  onCreateFolder: () => void;
  onCreateDocument: () => void;
}) => {
  return (
    <div className="flex gap-2 mb-2">
      <Button
        size="sm"
        variant="outline"
        onClick={onCreateFolder}
        className="h-7 text-xs flex-1">
        <FolderIcon className="mr-1 h-3 w-3" />
        폴더 추가
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={onCreateDocument}
        className="h-7 text-xs flex-1">
        <FileTextIcon className="mr-1 h-3 w-3" />
        문서 추가
      </Button>
    </div>
  );
};

// 메인 포스트 트리 에디터
const PostTreeEditorContent = () => {
  const {
    categories,
    selectedCategory,
    items,
    loading,
    error,
    favoriteItems,
    recentItems,
    selectedItemId,
    setSelectedCategory,
    createFolder,
    createDocument,
    updateItem,
    deleteItem,
    toggleFolder,
    selectItem,
    addToFavorites,
    removeFromFavorites,
  } = usePostTree();

  const router = useRouter();
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

  // 트리 구조 평면화
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

  // 드래그 시작 핸들러
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveItem(findItemById(items, active.id as string));
  };

  // 드래그 종료 핸들러
  const handleDragEnd = (event: DragEndEvent) => {
    if (!isEditMode) return;

    const { active, over } = event;

    if (over && active.id !== over.id) {
      // TODO: 나중에 드래그 앤 드롭으로 항목 위치 변경 구현
      console.log(`Moved ${active.id} over ${over.id}`);
    }

    setActiveId(null);
    setActiveItem(null);
  };

  // 폴더 토글 핸들러
  const handleToggleFolder = async (id: string) => {
    await toggleFolder(id);
  };

  // 이름 변경 핸들러
  const handleRenameItem = async (id: string, newTitle: string) => {
    if (!isEditMode) return;
    await updateItem(id, { title: newTitle });
  };

  // 항목 선택 핸들러
  const handleSelectItem = async (id: string) => {
    await selectItem(id);

    // 문서 항목 선택 시 해당 포스트 편집 페이지로 이동 가능
    const item =
      findItemById(items, id) ||
      findItemById(favoriteItems, id) ||
      findItemById(recentItems, id);

    if (item && !item.isFolder) {
      // TODO: 포스트 편집 페이지로 이동 (나중에 구현)
      // router.push(`/editor/${item.originalData.slug}`);
      console.log(`Selected document: ${item.name}`);
    }
  };

  // 항목 삭제 핸들러
  const handleDeleteItem = async (id: string) => {
    if (!isEditMode) return;
    await deleteItem(id);
  };

  // 새 폴더 생성 핸들러
  const handleCreateFolder = async () => {
    if (!isEditMode || !selectedCategory) return;

    const folderName = prompt("새 폴더 이름을 입력하세요:");
    if (!folderName) return;

    await createFolder({
      title: folderName,
      categoryId: selectedCategory,
    });
  };

  // 새 문서 생성 핸들러
  const handleCreateDocument = async () => {
    if (!isEditMode || !selectedCategory) return;

    const docName = prompt("새 문서 이름을 입력하세요:");
    if (!docName) return;

    await createDocument({
      title: docName,
      categoryId: selectedCategory,
      content: "", // 빈 Lexical Editor 콘텐츠
    });
  };

  // ID로 항목 찾기
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

  // 즐겨찾기 여부 확인
  const isInFavorites = (id: string) => {
    return favoriteItems.some((item) => item.id === id);
  };

  if (loading) {
    return <div className="p-4 text-muted-foreground">로딩 중...</div>;
  }

  if (error) {
    return <div className="p-4 text-destructive">오류: {error}</div>;
  }

  return (
    <div className="w-full">
      {/* 카테고리 탭 */}
      <div className="px-2 py-2 border-b border-border">
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* 편집 모드 안내 */}
      {isEditMode && (
        <div className="px-4 py-2 text-xs text-primary border-t border-border mb-2">
          <p>편집 모드 활성화됨</p>
          <CreateMenu
            onCreateFolder={handleCreateFolder}
            onCreateDocument={handleCreateDocument}
          />
        </div>
      )}

      {/* 즐겨찾기 섹션 */}
      {favoriteItems.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className="flex items-center px-4 py-1 w-full text-left font-medium text-sm">
            <ChevronDown
              className={`mr-2 h-4 w-4 transition-transform ${showFavorites ? "" : "-rotate-90"}`}
            />
            즐겨찾기
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

      {/* 최근 항목 섹션 */}
      {recentItems.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setShowRecent(!showRecent)}
            className="flex items-center px-4 py-1 w-full text-left font-medium text-sm">
            <ChevronDown
              className={`mr-2 h-4 w-4 transition-transform ${showRecent ? "" : "-rotate-90"}`}
            />
            최근 문서
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

      {/* 메인 콘텐츠 */}
      {selectedCategory ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}>
          <SortableContext
            items={flattenedItems.map((item) => item.id)}
            strategy={verticalListSortingStrategy}>
            <div className="space-y-0.5 p-2">
              {flattenedItems.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground">
                  {isEditMode
                    ? "이 카테고리에 항목이 없습니다. 항목을 추가해보세요."
                    : "이 카테고리에 항목이 없습니다."}
                </div>
              ) : (
                flattenedItems.map((item) => (
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
                ))
              )}
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
      ) : (
        <div className="p-4 text-sm text-muted-foreground">
          카테고리를 선택해주세요.
        </div>
      )}
    </div>
  );
};

// Provider로 감싸기
const PostTreeEditor = () => {
  return (
    <PostTreeProvider>
      <PostTreeEditorContent />
    </PostTreeProvider>
  );
};

export default PostTreeEditor;
