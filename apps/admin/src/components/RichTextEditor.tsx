import { useEffect, useRef } from 'react';
import 'quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, id }: RichTextEditorProps) {
  const quillRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<unknown>(null); // Use 'unknown' to avoid 'any'

  useEffect(() => {
    let isMounted = true;
    let Quill: any;
    (async () => {
      if (quillRef.current && !editorInstance.current) {
        Quill = (await import('quill')).default ?? (await import('quill'));
        if (!isMounted) return;
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
        (editorInstance.current as any).on('text-change', () => {
          onChange((editorInstance.current as any).root.innerHTML);
        });
      }
      // Set initial value
      if (editorInstance.current && value !== (editorInstance.current as any).root.innerHTML) {
        (editorInstance.current as any).root.innerHTML = value || '';
      }
    })();
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quillRef, value]);

  return (
    <div>
      <div ref={quillRef} id={id} style={{ minHeight: 200, background: 'white', borderRadius: 6 }} />
    </div>
  );
}
