'use client';

import { useEffect, useRef } from 'react';
import { markdownToHtml, generateToc } from '@/utils/markdown';
import { Hash } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';

interface MarkdownPreviewProps {
  markdown: string;
  className?: string;
}

export default function MarkdownPreview({ markdown, className = '' }: MarkdownPreviewProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const toc = generateToc(markdown);

  // コードハイライトの適用
  useEffect(() => {
    if (contentRef.current) {
      const codeBlocks = contentRef.current.querySelectorAll('pre code');
      codeBlocks.forEach((block) => {
        if (block instanceof HTMLElement) {
          Prism.highlightElement(block);
        }
      });
    }
  }, [markdown]);

  const html = markdownToHtml(markdown);

  return (
    <div className={`h-full overflow-y-auto ${className}`}>
      {toc.length > 0 && (
        <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <Hash size={16} className="text-purple-400" />
            <h3 className="font-semibold text-sm text-gray-300">目次</h3>
          </div>
          <nav className="space-y-1">
            {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block text-sm text-gray-400 hover:text-purple-400 transition ${
                  item.level === 1 ? 'pl-0 font-semibold' : item.level === 2 ? 'pl-4' : 'pl-8'
                }`}
              >
                {item.text}
              </a>
            ))}
          </nav>
        </div>
      )}

      <div
        ref={contentRef}
        className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-purple-400 prose-strong:text-white prose-code:text-purple-300 prose-pre:bg-gray-900 prose-blockquote:text-gray-400 prose-blockquote:border-purple-600"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <style jsx global>{`
        .prose pre {
          background: #0d1117 !important;
          border: 1px solid #30363d;
        }
        .prose code {
          background: rgba(139, 92, 246, 0.2);
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-size: 0.9em;
        }
        .prose pre code {
          background: transparent;
          padding: 0;
        }
        .prose img {
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }
        .prose a {
          text-decoration: underline;
        }
        .prose a:hover {
          color: #a855f7;
        }
      `}</style>
    </div>
  );
}

