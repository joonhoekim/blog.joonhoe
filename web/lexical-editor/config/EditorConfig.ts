import { EditorTheme } from "./EditorTheme";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";

function onError(error: Error) {
	console.error(error);
}

export const EditorConfig = {
	namespace: "defaultEditor",
	onError,
	nodes: [
		HeadingNode,
		QuoteNode,
		ListItemNode,
		ListNode,
		CodeNode,
		CodeHighlightNode,
		AutoLinkNode,
		LinkNode,
	],
	theme: EditorTheme,
	editable: true,
};

