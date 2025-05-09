"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { EditorConfig } from "./config/EditorConfig";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useState } from "react";
import type { LinkMatcher } from "@lexical/link";

const URL_MATCHER: LinkMatcher = (text) => {
	const urlPattern = /(https?:\/\/[^\s]+)/g;
	const match = urlPattern.exec(text);
	return match
		? {
				index: match.index,
				length: match[0].length,
				text: match[0],
				url: match[0],
			}
		: null;
};

function ToolbarPluginWrapper() {
	const [editor] = useLexicalComposerContext();
	const [activeEditor, setActiveEditor] = useState(editor);
	const [isLinkEditMode, setIsLinkEditMode] = useState(false);

	return (
		<ToolbarPlugin
			editor={editor}
			activeEditor={activeEditor}
			setActiveEditor={setActiveEditor}
			setIsLinkEditMode={setIsLinkEditMode}
		/>
	);
}

export default function Editor() {
	const Placeholder = () => {
		return (
			<div className="absolute top-0 left-0 w-full h-full text-gray-400 pointer-events-none">
				Start typing... (Markdown supported)
			</div>
		);
	};

	return (
		<div className="relative w-full max-w-4xl mx-auto">
			<LexicalComposer initialConfig={EditorConfig}>
				<div className="border rounded-lg shadow-sm">
					<ToolbarPluginWrapper />
					<div className="relative min-h-[200px] p-4">
						<RichTextPlugin
							contentEditable={
								<ContentEditable className="outline-none min-h-[150px]" />
							}
							placeholder={<Placeholder />}
							ErrorBoundary={LexicalErrorBoundary}
						/>
						<HistoryPlugin />
						<MarkdownShortcutPlugin transformers={TRANSFORMERS} />
						<AutoFocusPlugin />
						<ListPlugin />
						<LinkPlugin />
						<AutoLinkPlugin matchers={[URL_MATCHER]} />
					</div>
				</div>
			</LexicalComposer>
		</div>
	);
}
