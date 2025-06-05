import { useEffect, useRef } from 'react';
// @ts-ignore
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, id }: RichTextEditorProps) {
  const quillRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<Quill | null>(null);

  useEffect(() => {
    if (quillRef.current && !editorInstance.current) {
      editorInstance.current = new Quill(quillRef.current, {
        theme: 'snow',
        placeholder: placeholder || 'Write your content...',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
          ],
        },
      });
      editorInstance.current.on('text-change', () => {
        onChange(editorInstance.current!.root.innerHTML);
      });
    }
    // Set initial value
    if (editorInstance.current && value !== editorInstance.current.root.innerHTML) {
      editorInstance.current.root.innerHTML = value || '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quillRef, value]);

  return (
    <div>
      <div ref={quillRef} id={id} style={{ minHeight: 200, background: 'white', borderRadius: 6 }} />
    </div>
  );
}
