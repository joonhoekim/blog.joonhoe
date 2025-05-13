"use client";

import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { getPostsByCategory } from "@/data/posts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useVSCodeLayout } from "@/components/layout/VSCodeLayoutContext";
import { PencilIcon, Save } from "lucide-react";
import { useState } from "react";

export default function CategoryPage() {
  const params = useParams();
  const categoryName = params.categoryName as string;
  const { isEditMode } = useVSCodeLayout();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  // Format the category name for display
  const formattedCategoryName = categoryName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Get posts for this category
  const posts = getPostsByCategory(categoryName);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedTitle(formattedCategoryName);
    setEditedDescription(""); // 실제 애플리케이션에서는 카테고리 설명을 가져와야 함
  };

  const handleSaveClick = () => {
    // 실제 애플리케이션에서는 여기서 API 호출 등을 통해 데이터를 저장
    console.log("카테고리 저장:", {
      name: editedTitle,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  return (
    <div className="p-4 bg-background text-foreground h-full overflow-auto">
      <div className="max-w-4xl mx-auto">
        {isEditing ? (
          <div className="mb-6">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-2xl font-semibold mb-2 w-full bg-background border border-input rounded px-3 py-2"
              placeholder="카테고리 이름"
            />
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full h-24 bg-background border border-input rounded px-3 py-2 mb-4"
              placeholder="카테고리 설명을 입력하세요"
            />
            <div className="flex space-x-2">
              <Button
                onClick={handleSaveClick}
                className="flex items-center space-x-1">
                <Save size={16} />
                <span>저장</span>
              </Button>
              <Button variant="outline" onClick={handleCancelClick}>
                취소
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">{formattedCategoryName}</h1>
            {isEditMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditClick}
                className="flex items-center space-x-1">
                <PencilIcon size={16} />
                <span>카테고리 편집</span>
              </Button>
            )}
          </div>
        )}
        <Separator className="mb-6" />

        {posts.length === 0 ? (
          <div className="p-4 bg-muted/80 rounded border border-border">
            <p>No posts found in this category.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link href={`/${categoryName}/${post.id}`} key={post.id}>
                <div className="p-4 bg-muted/80 rounded border border-border hover:border-border/60 transition-colors cursor-pointer">
                  <h2 className="text-xl mb-2">{post.title}</h2>
                  <p className="text-muted-foreground mb-2">{post.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-muted text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {post.date}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
