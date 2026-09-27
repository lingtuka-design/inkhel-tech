import React, { useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Code,
  Link as LinkIcon,
  Unlink,
  Minus,
  Undo2,
  Redo2,
  Code2,
  Type,
  ImagePlus,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
  const [showRawHtml, setShowRawHtml] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
        link: {
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-accent underline font-medium hover:text-emerald-400',
          },
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: 'rounded-xl max-w-full my-6 border border-slate-200 dark:border-white/10 shadow-sm mx-auto block',
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose-editorial min-h-[420px] p-6 focus:outline-none focus:ring-0 max-w-none text-slate-800 dark:text-[#c9d1d9] leading-relaxed',
      },
    },
  });

  // Upload image from user's device directly into editor content
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'Failed to upload image');
        return;
      }
      editor.chain().focus().setImage({ src: data.url, alt: file.name.replace(/\.[^/.]+$/, '') }).run();
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setIsUploadingImage(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
  };

  // Insert image via URL
  const handleInsertImageUrl = () => {
    if (!editor) return;
    const url = window.prompt('Thlalak link (URL) dah rawh:');
    if (!url || !url.trim()) return;
    editor.chain().focus().setImage({ src: url.trim() }).run();
  };

  // Keep editor content in sync if changed from outside (e.g. loading post)
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL link:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#161b22] overflow-hidden shadow-sm transition-colors">
      {/* Top WYSIWYG Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 sm:p-2.5 bg-slate-50 dark:bg-[#090d13] border-b border-slate-200 dark:border-white/10 select-none">
        
        {/* Headings */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              editor.isActive('paragraph') && !editor.isActive('heading')
                ? 'bg-accent/20 text-accent font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/[0.06]'
            }`}
            title="Regular Paragraph"
          >
            <Type className="w-4 h-4" />
            <span className="hidden sm:inline">P</span>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              editor.isActive('heading', { level: 2 })
                ? 'bg-accent/20 text-accent font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/[0.06]'
            }`}
            title="Heading 2 (Major Section)"
          >
            <Heading2 className="w-4 h-4" />
            <span className="hidden sm:inline">H2</span>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              editor.isActive('heading', { level: 3 })
                ? 'bg-accent/20 text-accent font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/[0.06]'
            }`}
            title="Heading 3 (Subsection)"
          >
            <Heading3 className="w-4 h-4" />
            <span className="hidden sm:inline">H3</span>
          </button>
        </div>

        {/* Inline Formatting (Bold, Italic, Underline, Strike) */}
        <div className="flex items-center gap-0.5 px-2 border-r border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive('bold')
                ? 'bg-accent/20 text-accent font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/[0.06]'
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive('italic')
                ? 'bg-accent/20 text-accent font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/[0.06]'
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive('underline')
                ? 'bg-accent/20 text-accent font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/[0.06]'
            }`}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive('strike')
                ? 'bg-accent/20 text-accent font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/[0.06]'
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>

        {/* Lists & Quotes */}
        <div className="flex items-center gap-0.5 px-2 border-r border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive('bulletList')
                ? 'bg-accent/20 text-accent font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/[0.06]'
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive('orderedList')
                ? 'bg-accent/20 text-accent font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/[0.06]'
            }`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive('blockquote')
                ? 'bg-accent/20 text-accent font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/[0.06]'
            }`}
            title="Editorial Quote"
          >
            <Quote className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/[0.06] transition-colors"
            title="Horizontal Divider Line"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Links & Code */}
        <div className="flex items-center gap-0.5 px-2 border-r border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={setLink}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive('link')
                ? 'bg-accent/20 text-accent font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/[0.06]'
            }`}
            title="Insert Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>

          {editor.isActive('link') && (
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
              title="Remove Link"
            >
              <Unlink className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive('code')
                ? 'bg-accent/20 text-accent font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/[0.06]'
            }`}
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        {/* Media / Pictures in Content */}
        <div className="flex items-center gap-1 px-2 border-r border-slate-200 dark:border-white/10">
          <label
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-white/[0.06] cursor-pointer flex items-center gap-1.5 transition-colors group"
            title="Content karah thlalak zeh rawh (Upload picture from phone/PC)"
          >
            {isUploadingImage ? (
              <Loader2 className="w-4 h-4 animate-spin text-accent" />
            ) : (
              <ImagePlus className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
            )}
            <span className="text-xs font-semibold hidden sm:inline">
              {isUploadingImage ? 'Uploading...' : 'Picture Zeh'}
            </span>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              disabled={isUploadingImage}
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>

          <button
            type="button"
            onClick={handleInsertImageUrl}
            className="p-1.5 sm:px-2 sm:py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/[0.06] flex items-center gap-1 text-xs font-semibold transition-colors"
            title="Thlalak URL hmanga zeh duh tan"
          >
            <ImageIcon className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">URL</span>
          </button>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 px-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* View HTML Code Toggle */}
        <div className="ml-auto pl-2">
          <button
            type="button"
            onClick={() => setShowRawHtml(!showRawHtml)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              showRawHtml
                ? 'bg-accent text-slate-950 font-bold'
                : 'bg-slate-200/60 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
            title="Toggle between WYSIWYG Visual Editor and Raw HTML Code"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{showRawHtml ? 'Visual WYSIWYG' : 'View HTML'}</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      {showRawHtml ? (
        <textarea
          rows={16}
          value={content}
          onChange={(e) => {
            onChange(e.target.value);
            editor.commands.setContent(e.target.value, { emitUpdate: false });
          }}
          className="w-full min-h-[420px] p-6 font-mono text-xs leading-relaxed bg-slate-50 dark:bg-[#090d13] text-slate-900 dark:text-[#f0f6fc] focus:outline-none resize-y"
          placeholder="Edit raw HTML code..."
        />
      ) : (
        <div className="min-h-[420px] bg-white dark:bg-[#161b22] cursor-text" onClick={() => editor.commands.focus()}>
          <EditorContent editor={editor} />
        </div>
      )}

      {/* Footer Helper */}
      <div className="px-5 py-2.5 bg-slate-50/80 dark:bg-[#090d13]/80 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-[#8b949e]">
        <span>
          💡 Select any text to apply <strong>Bold</strong>, <em>Italic</em>, or <u>Underline</u>. Press Enter for a new paragraph.
        </span>
        <span className="font-semibold text-accent">WYSIWYG Rich Text Mode</span>
      </div>
    </div>
  );
};
