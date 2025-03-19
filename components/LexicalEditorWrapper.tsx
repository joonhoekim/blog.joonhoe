import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { ListNode, ListItemNode } from '@lexical/list';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { EditorState } from 'lexical';
import { LexicalEditor } from 'lexical';
import { ToolbarPlugin } from './editor/ToolbarPlugin';
import { useEditorStore } from './editor/editorStore';
import { useCallback, useEffect } from 'react';

const theme = {
  // Add your theme configuration here
  paragraph: 'mb-2',
  heading: {
    h1: 'text-4xl font-bold mb-4',
    h2: 'text-3xl font-bold mb-3',
    h3: 'text-2xl font-bold mb-2',
  },
  list: {
    ul: 'list-disc list-inside',
    ol: 'list-decimal list-inside',
  },
  listitem: 'ml-4',
  code: 'bg-gray-100 rounded px-1 py-0.5 font-mono',
  link: 'text-blue-500 hover:underline',
};

interface LexicalEditorProps {
  onChange?: (editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => void;
  initialContent?: string;
  autosave?: boolean;
}

export default function LexcialEditorWrapper({ 
  onChange, 
  initialContent, 
  autosave = true 
}: LexicalEditorProps) {
  // Zustand 스토어에서 상태와 액션 가져오기
  const { 
    editorState, 
    setEditorState, 
    setEditor, 
    lastSaved,
    saveContent 
  } = useEditorStore();

  // 에디터 설정
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError: (error: Error) => {
      console.error(error);
    },
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, CodeNode, CodeHighlightNode, LinkNode],
    // 저장된 에디터 상태가 있으면 초기 상태로 설정
    editorState: initialContent ?? editorState,
  };

  // 에디터 변경 핸들러
  const handleEditorChange = useCallback(
    (currentEditorState: EditorState, editor: LexicalEditor, tags: Set<string>) => {
      // Zustand 스토어 업데이트
      setEditorState(currentEditorState);
      
      // 자동 저장 활성화된 경우 저장
      if (autosave) {
        saveContent();
      }
      
      // 외부 onChange 콜백이 있으면 호출
      if (onChange) {
        onChange(currentEditorState, editor, tags);
      }
    },
    [onChange, setEditorState, saveContent, autosave]
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container border rounded-lg p-4">
        <ToolbarPlugin />
        {lastSaved && (
          <div className="text-xs text-gray-500 text-right mb-1">
            마지막 저장: {new Date(lastSaved).toLocaleString('ko-KR')}
          </div>
        )}
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="editor-input outline-none min-h-[150px]" />
          }
          placeholder={
            <div className="editor-placeholder text-gray-400">
              Enter some text...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={handleEditorChange} />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ListPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <EditorRefPlugin setEditor={setEditor} />
      </div>
    </LexicalComposer>
  );
}

// 에디터 인스턴스를 저장하기 위한 플러그인
function EditorRefPlugin({ setEditor }: { setEditor: (editor: LexicalEditor) => void }) {
  const [editor] = useLexicalComposerContext();
  
  useEffect(() => {
    setEditor(editor);
  }, [editor, setEditor]);
  
  return null;
}