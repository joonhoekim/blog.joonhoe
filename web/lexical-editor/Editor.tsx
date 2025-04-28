"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { EditorTheme } from "./config/EditorTheme";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import DragDropPaste from "@/lexical/packages/lexical-playground/src/plugins/DragDropPastePlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import ComponentPickerMenuPlugin from "@/lexical/packages/lexical-playground/src/plugins/ComponentPickerPlugin";
import AutoEmbedPlugin from "@/lexical/packages/lexical-playground/src/plugins/AutoEmbedPlugin";
import NewMentionsPlugin from "@/lexical/packages/lexical-playground/src/plugins/MentionsPlugin";
import CommentPlugin from "@/lexical/packages/lexical-playground/src/plugins/CommentPlugin";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import CodeHighlightPlugin from "@/lexical/packages/lexical-playground/src/plugins/CodeHighlightPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import YouTubePlugin from "@/lexical/packages/lexical-playground/src/plugins/YouTubePlugin";
import FigmaPlugin from "@/lexical/packages/lexical-playground/src/plugins/FigmaPlugin";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import EquationsPlugin from "@/lexical/packages/lexical-playground/src/plugins/EquationsPlugin";
import ExcalidrawPlugin from "@/lexical/packages/lexical-playground/src/plugins/ExcalidrawPlugin";
import CollapsiblePlugin from "@/lexical/packages/lexical-playground/src/plugins/CollapsiblePlugin";
import PageBreakPlugin from "@/lexical/packages/lexical-playground/src/plugins/PageBreakPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";

export default function Editor() {
    
    // 툴바를 에디터에 연결하기 위해 필요
    // const isEditable = useLexicalEditable();
    // const [editor] = useLexicalComposerContext();

    const initialConfig = {
        namespace: "defaultEditor",
        nodes: null,
        onError: (error: Error) => {
            throw error;
        },
        theme: EditorTheme,
    };

    return (
        <>
            <LexicalComposer initialConfig={initialConfig}>
                <DragDropPaste />
                <AutoFocusPlugin />
                <ComponentPickerMenuPlugin />
                <AutoEmbedPlugin />
                <NewMentionsPlugin />
                <CommentPlugin />
                <MarkdownShortcutPlugin />
                <CodeHighlightPlugin />
                <ListPlugin />
                <YouTubePlugin />
                <FigmaPlugin />
                <ClickableLinkPlugin />
                <EquationsPlugin />
                <ExcalidrawPlugin />
                <CollapsiblePlugin />
                <PageBreakPlugin />
                <HistoryPlugin />
            </LexicalComposer>
        </>
    );
}
