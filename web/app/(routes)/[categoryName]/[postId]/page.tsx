"use client";

import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { getPostById } from "@/data/posts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, PencilIcon, Save, Tag, X } from "lucide-react";
import { useVSCodeLayout } from "@/components/layout/VSCodeLayoutContext";
import { useState } from "react";

export default function PostPage() {
  const params = useParams();
  const postId = params.postId as string;
  const post = getPostById(postId);
  const { isEditMode } = useVSCodeLayout();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedTags, setEditedTags] = useState<string[]>([]);

  if (!post) {
    return (
      <div className="p-4 bg-background text-foreground h-full overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="p-4 bg-muted/80 rounded border border-border">
            <h1 className="text-2xl font-semibold mb-4">Post Not Found</h1>
            <p className="mb-4">The requested post could not be found.</p>
            <Button asChild variant="secondary" size="sm">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" /> Return to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Format the category name for display
  const formattedCategory = post.category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedTitle(post.title);
    setEditedContent(post.content);
    setEditedTags(post.tags);
  };

  const handleSaveClick = () => {
    // 실제 애플리케이션에서는 여기서 API 호출 등을 통해 데이터를 저장
    console.log("포스트 저장:", {
      id: post.id,
      title: editedTitle,
      content: editedContent,
      tags: editedTags,
    });
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  return (
    <div className="p-4 bg-background text-foreground h-full overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="mb-4 hover:bg-accent">
            <Link href={`/${post.category}`}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Category
            </Link>
          </Button>

          {isEditing ? (
            <div>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="text-3xl font-semibold mb-2 w-full bg-background border border-input rounded px-3 py-2"
                placeholder="Post title"
              />

              <div className="flex justify-between mt-4 mb-4">
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSaveClick}
                    className="flex items-center space-x-1">
                    <Save size={16} />
                    <span>Save</span>
                  </Button>
                  <Button variant="outline" onClick={handleCancelClick}>
                    <X size={16} className="mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>

              <Separator className="mb-6" />

              <div className="bg-muted/80 p-5 rounded border border-border">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full h-64 bg-background border border-input rounded px-3 py-2 mb-4"
                  placeholder="Post content"
                />

                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editedTags.join(", ")}
                    onChange={(e) =>
                      setEditedTags(
                        e.target.value.split(",").map((tag) => tag.trim()),
                      )
                    }
                    className="w-full bg-background border border-input rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-semibold mb-2">{post.title}</h1>
                {isEditMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditClick}
                    className="flex items-center space-x-1 ml-4">
                    <PencilIcon size={16} />
                    <span>Edit Post</span>
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  <Link href={`/${post.category}`}>
                    <span className="text-primary hover:underline">
                      {formattedCategory}
                    </span>
                  </Link>
                </div>
              </div>

              <Separator className="mb-6" />

              <div className="bg-muted/80 p-5 rounded border border-border">
                <p className="leading-relaxed mb-6">{post.content}</p>

                <div className="mt-8">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-muted text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
