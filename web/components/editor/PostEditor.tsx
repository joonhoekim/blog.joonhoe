"use client";

import { useEffect, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { debounce } from "lodash-es";
import { TreeItem } from "../providers/PostTreeProvider";
import { updatePost } from "@/app/actions/post-actions";
import { Button } from "../ui/button";
import { Save } from "lucide-react";

type PostEditorProps = {
  post: TreeItem["originalData"] | null;
  onSaved?: () => void;
};

// 자동 저장 플러그인
function AutoSavePlugin({
  post,
  onSaved,
}: { post: any; onSaved?: () => void }) {
  const [editor] = useLexicalComposerContext();
  const [isSaving, setIsSaving] = useState(false);

  // 변경 사항을 저장하는 디바운스 함수
  const saveContent = debounce(async (editorState: any) => {
    if (!post) return;

    try {
      setIsSaving(true);
      const content = JSON.stringify(editorState);

      await updatePost({
        id: post.id,
        content,
        updatedBy: 1, // 임시 사용자 ID
      });

      if (onSaved) onSaved();
    } catch (error) {
      console.error("포스트 내용 저장 오류:", error);
    } finally {
      setIsSaving(false);
    }
  }, 2000); // 2초 디바운스

  // 에디터 변경 감지
  useEffect(() => {
    if (!editor || !post) return;

    const removeUpdateListener = editor.registerUpdateListener(
      ({ editorState }) => {
        saveContent(editorState.toJSON());
      },
    );

    return () => {
      saveContent.cancel();
      removeUpdateListener();
    };
  }, [editor, post, saveContent]);

  return null;
}

// 편집기 도구 모음 컴포넌트
function EditorToolbar() {
  const [editor] = useLexicalComposerContext();

  const formatHeading = (level: 1 | 2 | 3) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(`h${level}`));
      }
    });
  };

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  };

  const formatItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  };

  return (
    <div className="flex items-center gap-1 p-2 border-b border-border">
      <Button size="sm" variant="outline" onClick={() => formatHeading(1)}>
        H1
      </Button>
      <Button size="sm" variant="outline" onClick={() => formatHeading(2)}>
        H2
      </Button>
      <Button size="sm" variant="outline" onClick={() => formatHeading(3)}>
        H3
      </Button>
      <Button size="sm" variant="outline" onClick={formatParagraph}>
        P
      </Button>
      <Button size="sm" variant="outline" onClick={formatBold}>
        B
      </Button>
      <Button size="sm" variant="outline" onClick={formatItalic}>
        I
      </Button>
    </div>
  );
}

// Lexical 사용을 위한 임포트 추가
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $createHeadingNode,
  FORMAT_TEXT_COMMAND,
  $setBlocksType,
} from "lexical";

// 포스트 에디터 컴포넌트
export default function PostEditor({ post, onSaved }: PostEditorProps) {
  // 초기 에디터 설정
  const initialConfig = {
    namespace: "PostEditor",
    theme: {
      root: "p-4 min-h-[300px] outline-none",
      link: "cursor-pointer text-blue-500 underline",
      text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline",
        strikethrough: "line-through",
      },
    },
    onError: (error: Error) => {
      console.error("Lexical 에디터 오류:", error);
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
    editorState: post?.content,
  };

  const handleSave = async () => {
    if (onSaved) onSaved();
  };

  if (!post) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">편집할 문서를 선택해주세요</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h1 className="text-xl font-semibold">{post.title}</h1>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        <LexicalComposer initialConfig={initialConfig}>
          {/* <EditorToolbar /> */}
          <div className="editor-container">
            <RichTextPlugin
              contentEditable={<ContentEditable className="h-full" />}
              placeholder={
                <div className="editor-placeholder">내용을 입력하세요...</div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ListPlugin />
            <LinkPlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <AutoSavePlugin post={post} onSaved={onSaved} />
          </div>
        </LexicalComposer>
      </div>
    </div>
  );
}
