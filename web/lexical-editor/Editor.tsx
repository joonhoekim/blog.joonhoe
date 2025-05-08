"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { EditorConfig } from "./config/EditorConfig";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import MarkdownPlugin from "./plugins/MarkdownShortcutPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";

export default function Editor() {
	const Placeholder = () => {
		return (
			<div className="absolute top-0 left-0 w-full h-full text-gray-400">
				Start typing...
			</div>
		);
	};

	return (
		<>
			<LexicalComposer initialConfig={EditorConfig}>
				<RichTextPlugin
					contentEditable={<ContentEditable />}
					placeholder={<Placeholder />}
					ErrorBoundary={LexicalErrorBoundary}
				/>
				<HistoryPlugin />
				{/* <MarkdownPlugin /> */}
				{/* <MarkdownShortcutPlugin /> */}
				<AutoFocusPlugin />
			</LexicalComposer>
		</>
	);
}
