import { FC } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback } from 'react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Quote,
  Undo,
  Redo,
  Link,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  $createParagraphNode,
  $getRoot,
  ElementNode,
  TextNode,
} from 'lexical';
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  HeadingTagType
} from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $createCodeNode } from '@lexical/code';
import { useEditorStore } from './editorStore';
import { useState, useEffect } from 'react';

export const ToolbarPlugin: FC = () => {
  const [editor] = useLexicalComposerContext();
  const { saveContent } = useEditorStore();

  // 현재 선택된 포맷 상태 관리
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isQuote, setIsQuote] = useState(false);
  const [isH1, setIsH1] = useState(false);
  const [isH2, setIsH2] = useState(false);
  const [isH3, setIsH3] = useState(false);
  const [isBulletList, setIsBulletList] = useState(false);
  const [isNumberedList, setIsNumberedList] = useState(false);

  // 선택 변경시 포맷 상태 업데이트
  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor]);

  // 주어진 노드의 부모 노드 중에서 특정 조건을 만족하는 노드를 찾는 함수
  const findMatchingParent = <T extends ElementNode>(
    node: ElementNode | TextNode,
    predicate: (node: ElementNode) => boolean
  ): T | null => {
    let parent = node.getParent();
    while (parent !== null) {
      if (predicate(parent)) {
        return parent as T;
      }
      parent = parent.getParent();
    }
    return null;
  };

  const updateToolbar = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      // 현재 포맷 상태 확인
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));

      // 현재 블록 타입 확인
      const anchorNode = selection.anchor.getNode();

      // 헤딩 확인 - 부모 노드 찾기
      const headingNode = findMatchingParent<ElementNode>(
        anchorNode,
        (node) => $isHeadingNode(node)
      );

      setIsH1(!!headingNode && headingNode.getTag() === 'h1');
      setIsH2(!!headingNode && headingNode.getTag() === 'h2');
      setIsH3(!!headingNode && headingNode.getTag() === 'h3');

      // 코드 블록 확인
      const codeNode = findMatchingParent<ElementNode>(
        anchorNode,
        (node) => node.getType() === 'code'
      );
      setIsCode(!!codeNode);

      // 인용구 확인
      const quoteNode = findMatchingParent<ElementNode>(
        anchorNode,
        (node) => node.getType() === 'quote'
      );
      setIsQuote(!!quoteNode);

      // 리스트 확인
      const listNode = findMatchingParent<ListNode>(
        anchorNode,
        (node) => $isListNode(node)
      );

      if (listNode) {
        const listType = listNode.getListType();
        setIsBulletList(listType === 'bullet');
        setIsNumberedList(listType === 'number');
      } else {
        setIsBulletList(false);
        setIsNumberedList(false);
      }
    });
  }, [editor]);

  const formatBold = useCallback(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  }, [editor]);

  const formatItalic = useCallback(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  }, [editor]);

  const formatUnorderedList = useCallback(() => {
    if (isBulletList) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    }
  }, [editor, isBulletList]);

  const formatOrderedList = useCallback(() => {
    if (isNumberedList) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  }, [editor, isNumberedList]);

  const formatHeading = useCallback((headingSize: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  }, [editor]);

  const formatCode = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createCodeNode());
      }
    });
  }, [editor]);

  const formatQuote = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  }, [editor]);

  const undo = useCallback(() => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  }, [editor]);

  const redo = useCallback(() => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  }, [editor]);

  const save = useCallback(() => {
    saveContent();
  }, [saveContent]);

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 pb-2 mb-2">
        <ToolbarButton tooltip="Bold" onClick={formatBold} isActive={isBold}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton tooltip="Italic" onClick={formatItalic} isActive={isItalic}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-[1px] h-6 bg-gray-200 mx-1" />
        <ToolbarButton tooltip="Bullet List" onClick={formatUnorderedList} isActive={isBulletList}>
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton tooltip="Numbered List" onClick={formatOrderedList} isActive={isNumberedList}>
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-[1px] h-6 bg-gray-200 mx-1" />
        <ToolbarButton tooltip="Heading 1" onClick={() => formatHeading('h1')} isActive={isH1}>
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton tooltip="Heading 2" onClick={() => formatHeading('h2')} isActive={isH2}>
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton tooltip="Heading 3" onClick={() => formatHeading('h3')} isActive={isH3}>
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-[1px] h-6 bg-gray-200 mx-1" />
        <ToolbarButton tooltip="Code" onClick={formatCode} isActive={isCode}>
          <Code className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton tooltip="Quote" onClick={formatQuote} isActive={isQuote}>
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-[1px] h-6 bg-gray-200 mx-1" />
        <ToolbarButton tooltip="Undo" onClick={undo}>
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton tooltip="Redo" onClick={redo}>
          <Redo className="h-4 w-4" />
        </ToolbarButton>
        <div className="flex-grow"></div>
        <ToolbarButton tooltip="저장" onClick={save}>
          <Save className="h-4 w-4" />
        </ToolbarButton>
      </div>
    </TooltipProvider>
  );
};

interface ToolbarButtonProps {
  tooltip: string;
  onClick: () => void;
  children: React.ReactNode;
  isActive?: boolean;
}

const ToolbarButton: FC<ToolbarButtonProps> = ({
  tooltip,
  onClick,
  children,
  isActive = false
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle
          size="sm"
          variant="outline"
          onClick={onClick}
          pressed={isActive}
          className="h-8 w-8 p-0 data-[state=on]:bg-slate-100"
        >
          {children}
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};