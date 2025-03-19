import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { EditorState, LexicalEditor } from 'lexical';

interface EditorStore {
  // 현재 에디터 상태
  editorState: EditorState | null;
  
  // 에디터 인스턴스
  editor: LexicalEditor | null;
  
  // 마지막 저장 시간
  lastSaved: Date | null;
  
  // 액션
  setEditorState: (editorState: EditorState) => void;
  setEditor: (editor: LexicalEditor) => void;
  clearEditor: () => void;
  saveContent: () => void;
}

// JSON 문자열로 변환 가능한 형태로 EditorState 직렬화
const serializeEditorState = (editorState: EditorState | null) => {
  if (!editorState) return null;
  return editorState.toJSON();
};

// 커스텀 스토리지 객체 정의
type EditorStoreState = Omit<EditorStore, 'setEditorState' | 'setEditor' | 'clearEditor' | 'saveContent'>;

// 커스텀 persist 설정
const persistOptions: PersistOptions<EditorStore, EditorStoreState> = {
  name: 'editor-storage',
  // 커스텀 직렬화/역직렬화 로직
  serialize: (state) => {
    return JSON.stringify({
      editorState: serializeEditorState(state.editorState),
      editor: undefined, // editor 인스턴스는 저장 불가능
      lastSaved: state.lastSaved?.toISOString() || null,
    });
  },
  // state에서 필요한 것만 가져오고 editor는 런타임에 설정
  deserialize: (storedState) => {
    const parsed = JSON.parse(storedState);
    return {
      editorState: parsed.editorState,
      editor: null, // 런타임에 새로 설정해야 함
      lastSaved: parsed.lastSaved ? new Date(parsed.lastSaved) : null,
    };
  },
};

// 직렬화된 상태를 EditorState로 복원하는 로직은 
// 에디터 인스턴스가 필요하므로 스토어에서 직접 처리하지 않음

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      editorState: null,
      editor: null,
      lastSaved: null,

      setEditorState: (editorState) => set({ editorState }),
      
      setEditor: (editor) => set({ editor }),
      
      clearEditor: () => set({ editorState: null }),
      
      saveContent: () => set({ lastSaved: new Date() }),
    }),
    persistOptions
  )
); 