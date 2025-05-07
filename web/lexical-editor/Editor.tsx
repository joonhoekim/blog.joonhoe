'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { EditorTheme } from './config/EditorTheme';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';

export default function Editor() {
  // 툴바를 에디터에 연결하기 위해 필요
  // const isEditable = useLexicalEditable();
  // const [editor] = useLexicalComposerContext();

  const initialConfig = {
    namespace: 'defaultEditor',
    onError: (error: Error) => {
      throw error;
    },
    theme: EditorTheme,
  };

  return (
    <>
      <LexicalComposer initialConfig={initialConfig}>
        <AutoFocusPlugin />

        <MarkdownShortcutPlugin />

        <ListPlugin />

        <ClickableLinkPlugin />

        <HistoryPlugin />
      </LexicalComposer>
    </>
  );
}
