'use client';

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { EditorTheme } from "./config/EditorTheme"

export default function Editor() {

    const initialConfig = {
        namespace: 'defaultEditor',
        nodes: null,
        onError: (error: Error) => {
            throw error;
        },
        theme: EditorTheme,
    }

    return (
        <>
          <LexicalComposer initialConfig={initialConfig}>

          </LexicalComposer>
        </>
    )
}