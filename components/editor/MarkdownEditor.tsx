'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Code, Image, Quote, Minus, Heading1, FileText } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSave?: () => void;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Markdown形式で入力してください...',
  onSave,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [commandPosition, setCommandPosition] = useState({ top: 0, left: 0 });
  const [commandQuery, setCommandQuery] = useState('');

  // ショートカット: Cmd/Ctrl+S で保存
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement> | globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        onSave?.();
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('keydown', handleKeyDown as EventListener);
      return () => {
        textarea.removeEventListener('keydown', handleKeyDown as EventListener);
      };
    }
  }, [onSave]);

  // /コマンドメニュー
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPos);
    const lastLine = textBeforeCursor.split('\n').pop() || '';

    // /コマンドの検出
    if (e.key === '/' && lastLine.trim() === '') {
      e.preventDefault();
      const rect = textarea.getBoundingClientRect();
      const lineHeight = 24;
      const lines = textBeforeCursor.split('\n').length;
      setCommandPosition({
        top: rect.top + lines * lineHeight + 20,
        left: rect.left + 20,
      });
      setShowCommandMenu(true);
      setCommandQuery('');
    } else if (showCommandMenu) {
      if (e.key === 'Escape') {
        setShowCommandMenu(false);
      } else if (e.key === 'Enter' && commandQuery.trim() === '') {
        e.preventDefault();
        insertCommand('heading');
      }
    }
  };

  const commands = [
    { id: 'heading', label: '見出し', icon: Heading1, insert: () => '## 見出し\n\n' },
    { id: 'image', label: '画像', icon: Image, insert: () => '![画像の説明](画像URL)\n' },
    { id: 'quote', label: '引用', icon: Quote, insert: () => '> 引用文\n' },
    { id: 'code', label: 'コード', icon: Code, insert: () => '```\nコード\n```\n' },
    { id: 'divider', label: '区切り線', icon: Minus, insert: () => '---\n' },
    { id: 'section', label: 'セクション', icon: FileText, insert: () => '\n---\n\n' },
  ];

  const insertCommand = (commandId: string) => {
    const command = commands.find((c) => c.id === commandId);
    if (!command) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const textBefore = value.substring(0, cursorPos);
    const textAfter = value.substring(cursorPos);

    // /コマンド行を削除
    const lines = textBefore.split('\n');
    lines.pop(); // /コマンド行を削除
    const newTextBefore = lines.join('\n');

    const insertText = command.insert();
    const newValue = newTextBefore + insertText + textAfter;

    onChange(newValue);
    setShowCommandMenu(false);

    // カーソル位置を調整
    setTimeout(() => {
      const newCursorPos = newTextBefore.length + insertText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(commandQuery.toLowerCase())
  );

  return (
    <div className="relative h-full">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full h-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none font-mono text-sm text-gray-100"
        style={{ minHeight: '400px' }}
      />

      {showCommandMenu && (
        <div
          className="absolute z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden"
          style={{
            top: `${commandPosition.top}px`,
            left: `${commandPosition.left}px`,
            minWidth: '200px',
          }}
        >
          <div className="p-2 border-b border-gray-700">
            <input
              type="text"
              value={commandQuery}
              onChange={(e) => setCommandQuery(e.target.value)}
              placeholder="コマンドを検索..."
              className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              autoFocus
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filteredCommands.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => insertCommand(cmd.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-700 transition text-left"
                >
                  <Icon size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-200">{cmd.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ショートカットヒント */}
      <div className="absolute bottom-2 right-2 text-xs text-gray-500">
        Cmd/Ctrl+S で保存
      </div>
    </div>
  );
}

