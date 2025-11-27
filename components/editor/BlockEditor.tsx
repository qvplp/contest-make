'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { BlockNoteEditor } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';

interface BlockEditorProps {
  initialContent?: string;
  onChange?: (markdown: string) => void;
  editable?: boolean;
  placeholder?: string;
}

export default function BlockEditor({
  initialContent = '',
  onChange,
  editable = true,
  placeholder = '/ を入力してブロックを追加...',
}: BlockEditorProps) {
  const [isClient, setIsClient] = useState(false);
  const [editor, setEditor] = useState<any | null>(null);
  const hasInitializedFromMarkdown = useRef(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // エディタの初期化（1回だけ）
  useEffect(() => {
    if (!isClient) return;

    const createEditor = async () => {
      const newEditor = BlockNoteEditor.create({
        placeholders: editable ? undefined : {},
      });

      setEditor(newEditor);
    };

    createEditor();
  }, [isClient, editable]);

  // 初回だけ initialContent からブロックを復元
  useEffect(() => {
    if (!editor || hasInitializedFromMarkdown.current) return;
    if (!initialContent) {
      hasInitializedFromMarkdown.current = true;
      return;
    }

    const applyInitialContent = async () => {
      try {
        const blocks = await editor.tryParseMarkdownToBlocks(initialContent);
        if (blocks && blocks.length > 0) {
          editor.replaceBlocks(editor.document, blocks);
        }
      } catch (error) {
        console.error('Failed to parse markdown:', error);
      } finally {
        hasInitializedFromMarkdown.current = true;
      }
    };

    applyInitialContent();
  }, [editor, initialContent]);

  // コンテンツ変更時にマークダウンを出力（編集モードのみ）
  const handleChange = useCallback(async () => {
    if (!editor || !onChange || !editable) return;
    try {
      const markdown = await editor.blocksToMarkdownLossy(editor.document);
      onChange(markdown);
    } catch (error) {
      console.error('Failed to convert to markdown:', error);
    }
  }, [editor, onChange, editable]);

  if (!isClient || !editor) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 min-h-[300px] animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div className={`block-editor-wrapper ${!editable ? 'read-only' : ''}`}>
      <BlockNoteView
        editor={editor}
        onChange={editable ? handleChange : undefined}
        editable={editable}
        theme="dark"
      />

      <style jsx global>{`
        .block-editor-wrapper {
          --bn-colors-editor-background: #1f2937;
          --bn-colors-editor-text: #f3f4f6;
          --bn-colors-menu-background: #374151;
          --bn-colors-menu-text: #f3f4f6;
          --bn-colors-tooltip-background: #4b5563;
          --bn-colors-tooltip-text: #f3f4f6;
          --bn-colors-hovered-background: #374151;
          --bn-colors-selected-background: #4b5563;
          --bn-colors-disabled-background: #1f2937;
          --bn-colors-disabled-text: #6b7280;
          --bn-colors-shadow: rgba(0, 0, 0, 0.3);
          --bn-colors-border: #4b5563;
          --bn-colors-side-menu: #9ca3af;
          --bn-colors-highlights-gray-background: #374151;
          --bn-colors-highlights-gray-text: #d1d5db;
        }

        .block-editor-wrapper .bn-editor {
          min-height: 300px;
          padding: 1rem;
          background: #1f2937;
          border-radius: 0.5rem;
          border: 1px solid #374151;
        }

        .block-editor-wrapper:not(.read-only) .bn-editor:focus-within {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
        }

        .block-editor-wrapper.read-only .bn-editor {
          border: none;
          background: transparent;
          padding: 0;
        }

        .block-editor-wrapper.read-only .bn-side-menu,
        .block-editor-wrapper.read-only .bn-drag-handle,
        .block-editor-wrapper.read-only .bn-add-block-button {
          display: none !important;
        }

        .block-editor-wrapper [data-content-editable-leaf] {
          caret-color: #a78bfa;
        }

        .block-editor-wrapper .bn-block-content {
          font-size: 1.125rem;
          line-height: 1.875;
          color: #e5e7eb;
        }

        .block-editor-wrapper [data-level='1'] .bn-inline-content {
          font-size: 2rem !important;
          font-weight: 700 !important;
          color: #f9fafb !important;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .block-editor-wrapper [data-level='2'] .bn-inline-content {
          font-size: 1.5rem !important;
          font-weight: 700 !important;
          color: #f9fafb !important;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .block-editor-wrapper [data-level='3'] .bn-inline-content {
          font-size: 1.25rem !important;
          font-weight: 600 !important;
          color: #f3f4f6 !important;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }

        .block-editor-wrapper [data-content-type='paragraph'] .bn-inline-content {
          margin-bottom: 0.5rem;
        }

        .block-editor-wrapper strong,
        .block-editor-wrapper [data-text-bold='true'] {
          font-weight: 700 !important;
          color: #f9fafb !important;
        }

        .block-editor-wrapper em,
        .block-editor-wrapper [data-text-italic='true'] {
          font-style: italic !important;
        }

        .block-editor-wrapper [data-text-strike='true'] {
          text-decoration: line-through !important;
        }

        .block-editor-wrapper [data-text-underline='true'] {
          text-decoration: underline !important;
        }

        .block-editor-wrapper [data-content-type='bulletListItem'],
        .block-editor-wrapper [data-content-type='numberedListItem'] {
          margin-left: 1.5rem;
        }

        .block-editor-wrapper [data-content-type='quote'] {
          border-left: 4px solid #8b5cf6;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #9ca3af;
          font-style: italic;
          background: rgba(139, 92, 246, 0.05);
          padding: 1rem 1rem 1rem 1.5rem;
          border-radius: 0 0.5rem 0.5rem 0;
        }

        .block-editor-wrapper [data-content-type='codeBlock'] {
          background: #111827 !important;
          border: 1px solid #374151;
          border-radius: 0.5rem;
          padding: 1rem;
          margin: 1rem 0;
        }

        .block-editor-wrapper [data-content-type='codeBlock'] code {
          font-family: 'Fira Code', 'Monaco', 'Consolas', monospace !important;
          font-size: 0.875rem !important;
          color: #e5e7eb !important;
        }

        .block-editor-wrapper code {
          background: #374151;
          color: #fbbf24;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
          font-size: 0.875em;
        }

        .block-editor-wrapper a {
          color: #a78bfa;
          text-decoration: underline;
        }

        .block-editor-wrapper a:hover {
          color: #c4b5fd;
        }

        .block-editor-wrapper hr {
          border: none;
          border-top: 1px solid #374151;
          margin: 1.5rem 0;
        }

        .block-editor-wrapper img {
          max-width: 100%;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }

        .block-editor-wrapper table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }

        .block-editor-wrapper th,
        .block-editor-wrapper td {
          border: 1px solid #374151;
          padding: 0.5rem 0.75rem;
          text-align: left;
        }

        .block-editor-wrapper th {
          background: #1f2937;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}


