import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';

import { useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, id }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose min-h-[200px] p-2 border rounded-b-md bg-white focus:outline-none',
        ...(id ? { id } : {}),
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div>
      {/* Simple Toolbar */}
      <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1"></label>
      <div className="flex gap-3 mb-2 bg-gray-100 p-2 rounded-t-md border border-b-0 shadow-sm">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded font-bold text-lg transition border ${editor?.isActive('bold') ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-gray-800 border-gray-300 hover:bg-indigo-100'}`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded italic text-lg transition border ${editor?.isActive('italic') ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-gray-800 border-gray-300 hover:bg-indigo-100'}`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={`px-3 py-1 rounded underline text-lg transition border ${editor?.isActive('underline') ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-gray-800 border-gray-300 hover:bg-indigo-100'}`}
        >
          U
        </button>
      </div>
      {/* Bubble Menu for inline formatting */}
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex gap-2 bg-white border border-gray-300 rounded shadow-md p-1">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-2 py-1 rounded font-bold text-lg transition border ${editor.isActive('bold') ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-gray-800 border-gray-300 hover:bg-indigo-100'}`}
            title="Bold"
          >
            B
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-2 py-1 rounded italic text-lg transition border ${editor.isActive('italic') ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-gray-800 border-gray-300 hover:bg-indigo-100'}`}
            title="Italic"
          >
            I
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`px-2 py-1 rounded underline text-lg transition border ${editor.isActive('underline') ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-gray-800 border-gray-300 hover:bg-indigo-100'}`}
            title="Underline"
          >
            U
          </button>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} id="content" />
    </div>
  );
}
