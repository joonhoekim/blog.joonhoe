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
  getAllCategories,
  getRootPosts,
  getChildPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  togglePostFolder,
  selectPost,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  getRecentPosts,
} from "@/app/actions/post-actions";

// 트리 아이템 타입 정의 (카테고리와 포스트)
export type TreeItem = {
  id: string;
  name: string;
  isFolder: boolean;
  children?: TreeItem[];
  level: number;
  isOpen?: boolean;
  isSelected?: boolean;

  // 원본 데이터 저장
  originalData: any;
  type: "category" | "post";
  parentId?: number | null;
  categoryId?: number;
};

// 임시 사용자 ID (실제로는 인증 시스템에서 가져와야 함)
const MOCK_USER_ID = 1;

// Context 타입 정의
type PostTreeContextType = {
  categories: { id: number; name: string; slug: string }[];
  selectedCategory: number | null;
  items: TreeItem[];
  loading: boolean;
  error: string | null;
  recentItems: TreeItem[];
  favoriteItems: TreeItem[];
  selectedItemId: string | null;

  // 액션 함수들
  setSelectedCategory: (id: number) => void;
  createFolder: (data: {
    title: string;
    parentId?: number;
    categoryId: number;
  }) => Promise<any>;
  createDocument: (data: {
    title: string;
    content?: string;
    parentId?: number;
    categoryId: number;
  }) => Promise<any>;
  updateItem: (id: string, data: any) => Promise<any>;
  deleteItem: (id: string) => Promise<any>;
  toggleFolder: (id: string) => Promise<any>;
  selectItem: (id: string) => Promise<any>;
  addToFavorites: (id: string) => Promise<any>;
  removeFromFavorites: (id: string) => Promise<any>;
  refreshData: () => Promise<void>;
};

// Context 생성
const PostTreeContext = createContext<PostTreeContextType | undefined>(
  undefined,
);

// 공급자 컴포넌트
export const PostTreeProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [items, setItems] = useState<TreeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentItems, setRecentItems] = useState<TreeItem[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<TreeItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const router = useRouter();

  // DB 포스트를 TreeItem으로 변환하는 헬퍼 함수
  const mapPostToTreeItem = (
    post: any,
    level: number = 0,
    children: TreeItem[] = [],
  ): TreeItem => {
    const hasChildren = children.length > 0;

    return {
      id: `post-${post.id}`,
      name: post.title,
      isFolder: hasChildren, // 하위 항목이 있으면 폴더로 취급
      level,
      isOpen: post.isOpen,
      isSelected: post.isSelected,
      children: hasChildren ? children : undefined,
      originalData: post,
      type: "post",
      parentId: post.parentId,
      categoryId: post.categoryId,
    };
  };

  // 초기 데이터 로딩
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 카테고리 로딩
      const categoriesResult = await getAllCategories();
      if (!categoriesResult.success) {
        throw new Error(
          categoriesResult.error || "카테고리를 불러오는데 실패했습니다",
        );
      }
      setCategories(categoriesResult.data || []);

      // 선택된 카테고리가 있는 경우에만 트리 로딩
      if (selectedCategory) {
        await loadCategoryTree(selectedCategory);
      } else if (categoriesResult.data && categoriesResult.data.length > 0) {
        // 카테고리가 있고 선택된 것이 없으면 첫 번째 카테고리 선택
        setSelectedCategory(categoriesResult.data[0].id);
        await loadCategoryTree(categoriesResult.data[0].id);
      } else {
        setItems([]);
      }

      // 즐겨찾기 항목 로딩
      const favoritesResult = await getFavorites(MOCK_USER_ID);
      if (favoritesResult.success && favoritesResult.data) {
        setFavoriteItems(
          favoritesResult.data.map((post) => mapPostToTreeItem(post, 0)),
        );
      }

      // 최근 항목 로딩
      const recentResult = await getRecentPosts(MOCK_USER_ID);
      if (recentResult.success && recentResult.data) {
        setRecentItems(
          recentResult.data.map((post) => mapPostToTreeItem(post, 0)),
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다",
      );
      console.error("데이터 로딩 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  // 특정 카테고리의 포스트 트리 로딩
  const loadCategoryTree = async (categoryId: number) => {
    try {
      // 루트 포스트 가져오기
      const rootPostsResult = await getRootPosts(categoryId);
      if (!rootPostsResult.success) {
        throw new Error(
          rootPostsResult.error || "루트 포스트를 불러오는데 실패했습니다",
        );
      }

      // 각 루트 포스트에 대해 재귀적으로 하위 포스트 로딩
      const treeItems: TreeItem[] = [];

      for (const rootPost of rootPostsResult.data || []) {
        // 하위 포스트 로딩 (열린 상태인 경우만)
        let children: TreeItem[] = [];
        if (rootPost.isOpen) {
          children = await loadChildPosts(rootPost.id, 1);
        }

        treeItems.push(mapPostToTreeItem(rootPost, 0, children));
      }

      setItems(treeItems);
    } catch (err) {
      console.error("카테고리 트리 로딩 오류:", err);
      throw err;
    }
  };

  // 하위 포스트 재귀적 로딩 (최대 3단계 깊이만 미리 로딩)
  const loadChildPosts = async (
    parentId: number,
    level: number,
  ): Promise<TreeItem[]> => {
    if (level > 3) return []; // 최대 깊이 제한

    try {
      const childPostsResult = await getChildPosts(parentId);
      if (!childPostsResult.success || !childPostsResult.data) {
        return [];
      }

      const childItems: TreeItem[] = [];

      for (const childPost of childPostsResult.data) {
        let children: TreeItem[] = [];
        if (childPost.isOpen) {
          children = await loadChildPosts(childPost.id, level + 1);
        }

        childItems.push(mapPostToTreeItem(childPost, level, children));
      }

      return childItems;
    } catch (err) {
      console.error("하위 포스트 로딩 오류:", err);
      return [];
    }
  };

  // 데이터 새로고침
  const refreshData = async () => {
    await loadData();
    router.refresh();
  };

  // 카테고리 변경 시 해당 카테고리의 포스트 트리 로딩
  useEffect(() => {
    if (selectedCategory) {
      loadCategoryTree(selectedCategory).catch((err) =>
        setError(err instanceof Error ? err.message : "트리 로딩 오류"),
      );
    }
  }, [selectedCategory]);

  // 초기 로딩
  useEffect(() => {
    loadData();
  }, []);

  // 새 포스트 폴더 생성 (부모 하위에 또는 루트에)
  const createFolder = async (data: {
    title: string;
    parentId?: number;
    categoryId: number;
  }) => {
    try {
      setError(null);

      // 포스트로 생성하되, 폴더 용도로 사용
      const result = await createPost({
        title: data.title,
        slug: `${data.title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`, // 고유 슬러그 생성
        categoryId: data.categoryId,
        parentId: data.parentId,
        isOpen: false,
        content: "", // 폴더는 내용 없음
        createdBy: MOCK_USER_ID,
        updatedBy: MOCK_USER_ID,
      });

      if (!result.success) {
        throw new Error(result.error || "폴더 생성 실패");
      }

      await refreshData();
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다",
      );
      console.error("폴더 생성 오류:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "알 수 없는 오류",
      };
    }
  };

  // 새 포스트 문서 생성
  const createDocument = async (data: {
    title: string;
    content?: string;
    parentId?: number;
    categoryId: number;
  }) => {
    try {
      setError(null);

      const result = await createPost({
        title: data.title,
        slug: `${data.title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`, // 고유 슬러그 생성
        categoryId: data.categoryId,
        parentId: data.parentId,
        content: data.content || "", // Lexical Editor의 비어있는 초기 상태 (JSON string)
        createdBy: MOCK_USER_ID,
        updatedBy: MOCK_USER_ID,
      });

      if (!result.success) {
        throw new Error(result.error || "문서 생성 실패");
      }

      await refreshData();
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다",
      );
      console.error("문서 생성 오류:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "알 수 없는 오류",
      };
    }
  };

  // 포스트 항목 업데이트
  const updateItem = async (id: string, data: any) => {
    try {
      setError(null);

      // ID에서 실제 포스트 ID 추출 ("post-123" -> 123)
      const postId = parseInt(id.replace("post-", ""));
      if (isNaN(postId)) {
        throw new Error("잘못된 ID 형식");
      }

      // 업데이트 데이터에 ID와 업데이터 정보 추가
      const updateData = {
        ...data,
        id: postId,
        updatedBy: MOCK_USER_ID,
      };

      const result = await updatePost(updateData);

      if (!result.success) {
        throw new Error(result.error || "업데이트 실패");
      }

      await refreshData();
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다",
      );
      console.error("항목 업데이트 오류:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "알 수 없는 오류",
      };
    }
  };

  // 항목 삭제
  const deleteItem = async (id: string) => {
    try {
      setError(null);

      // ID에서 실제 포스트 ID 추출
      const postId = parseInt(id.replace("post-", ""));
      if (isNaN(postId)) {
        throw new Error("잘못된 ID 형식");
      }

      const result = await deletePost(postId);

      if (!result.success) {
        throw new Error(result.error || "삭제 실패");
      }

      await refreshData();
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다",
      );
      console.error("항목 삭제 오류:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "알 수 없는 오류",
      };
    }
  };

  // 폴더 열기/닫기 상태 토글
  const toggleFolder = async (id: string) => {
    try {
      setError(null);

      // ID에서 실제 포스트 ID 추출
      const postId = parseInt(id.replace("post-", ""));
      if (isNaN(postId)) {
        throw new Error("잘못된 ID 형식");
      }

      const result = await togglePostFolder(postId);

      if (!result.success) {
        throw new Error(result.error || "폴더 토글 실패");
      }

      await refreshData();
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다",
      );
      console.error("폴더 토글 오류:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "알 수 없는 오류",
      };
    }
  };

  // 항목 선택
  const selectItem = async (id: string) => {
    try {
      setError(null);

      // 선택 상태 업데이트
      setSelectedItemId(id);

      // ID에서 실제 포스트 ID 추출
      const postId = parseInt(id.replace("post-", ""));
      if (isNaN(postId)) {
        throw new Error("잘못된 ID 형식");
      }

      const result = await selectPost(postId, MOCK_USER_ID);

      if (!result.success) {
        throw new Error(result.error || "항목 선택 실패");
      }

      await refreshData();
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다",
      );
      console.error("항목 선택 오류:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "알 수 없는 오류",
      };
    }
  };

  // 즐겨찾기에 추가
  const addItemToFavorites = async (id: string) => {
    try {
      setError(null);

      // ID에서 실제 포스트 ID 추출
      const postId = parseInt(id.replace("post-", ""));
      if (isNaN(postId)) {
        throw new Error("잘못된 ID 형식");
      }

      const result = await addToFavorites(postId, MOCK_USER_ID);

      if (!result.success) {
        throw new Error(result.error || "즐겨찾기 추가 실패");
      }

      await refreshData();
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다",
      );
      console.error("즐겨찾기 추가 오류:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "알 수 없는 오류",
      };
    }
  };

  // 즐겨찾기에서 제거
  const removeItemFromFavorites = async (id: string) => {
    try {
      setError(null);

      // ID에서 실제 포스트 ID 추출
      const postId = parseInt(id.replace("post-", ""));
      if (isNaN(postId)) {
        throw new Error("잘못된 ID 형식");
      }

      const result = await removeFromFavorites(postId, MOCK_USER_ID);

      if (!result.success) {
        throw new Error(result.error || "즐겨찾기 제거 실패");
      }

      await refreshData();
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다",
      );
      console.error("즐겨찾기 제거 오류:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "알 수 없는 오류",
      };
    }
  };

  // Context 값
  const contextValue: PostTreeContextType = {
    categories,
    selectedCategory,
    items,
    loading,
    error,
    recentItems,
    favoriteItems,
    selectedItemId,
    setSelectedCategory,
    createFolder,
    createDocument,
    updateItem,
    deleteItem,
    toggleFolder,
    selectItem,
    addToFavorites: addItemToFavorites,
    removeFromFavorites: removeItemFromFavorites,
    refreshData,
  };

  return (
    <PostTreeContext.Provider value={contextValue}>
      {children}
    </PostTreeContext.Provider>
  );
};

// 커스텀 훅
export const usePostTree = () => {
  const context = useContext(PostTreeContext);

  if (context === undefined) {
    throw new Error("usePostTree는 PostTreeProvider 내에서 사용해야 합니다");
  }

  return context;
};
