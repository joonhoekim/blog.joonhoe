import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
	$getSelection,
	$isRangeSelection,
	FORMAT_TEXT_COMMAND,
	LexicalEditor,
} from "lexical";
import { useCallback, useEffect, useState } from "react";

interface ToolbarPluginProps {
	editor: LexicalEditor;
	activeEditor: LexicalEditor;
	setActiveEditor: (editor: LexicalEditor) => void;
	setIsLinkEditMode: (isLinkEditMode: boolean) => void;
}

export default function ToolbarPlugin({
	editor,
	activeEditor,
	setActiveEditor,
	setIsLinkEditMode,
}: ToolbarPluginProps) {
	const [isBold, setIsBold] = useState(false);
	const [isItalic, setIsItalic] = useState(false);
	const [isUnderline, setIsUnderline] = useState(false);

	const updateToolbar = useCallback(() => {
		const selection = $getSelection();
		if ($isRangeSelection(selection)) {
			setIsBold(selection.hasFormat("bold"));
			setIsItalic(selection.hasFormat("italic"));
			setIsUnderline(selection.hasFormat("underline"));
		}
	}, []);

	useEffect(() => {
		editor.registerUpdateListener(({ editorState }) => {
			editorState.read(() => {
				updateToolbar();
			});
		});
	}, [editor, updateToolbar]);

	return (
		<div className="flex items-center gap-2 p-2 border-b">
			<button
				type="button"
				onClick={() => {
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
				}}
				className={`p-2 rounded hover:bg-gray-100 ${isBold ? "bg-gray-100" : ""}`}
				title="Bold"
			>
				<strong>B</strong>
			</button>
			<button
				type="button"
				onClick={() => {
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
				}}
				className={`p-2 rounded hover:bg-gray-100 ${isItalic ? "bg-gray-100" : ""}`}
				title="Italic"
			>
				<em>I</em>
			</button>
			<button
				type="button"
				onClick={() => {
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
				}}
				className={`p-2 rounded hover:bg-gray-100 ${isUnderline ? "bg-gray-100" : ""}`}
				title="Underline"
			>
				<u>U</u>
			</button>
		</div>
	);
}
