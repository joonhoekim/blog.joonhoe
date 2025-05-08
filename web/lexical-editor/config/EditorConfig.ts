import { EditorTheme } from "./EditorTheme";

function onError(error: Error) {
	console.error(error);
}

export const EditorConfig = {
	namespace: "defaultEditor",
	onError,
	nodes: [],
	theme: EditorTheme,
};

