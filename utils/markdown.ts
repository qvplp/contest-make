/**
 * Markdown関連のユーティリティ関数
 */

import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Markdownの設定
marked.setOptions({
  breaks: true,
  gfm: true,
});

// カスタムレンダラーを設定
marked.use({
  renderer: {
    code(code: string, language?: string) {
      const lang = language || 'text';
      const escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto"><code class="language-${lang}">${escapedCode}</code></pre>`;
    },
    heading(text: string, level: number) {
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      return `<h${level} id="${id}" class="scroll-mt-20">${text}</h${level}>`;
    },
  },
});

/**
 * MarkdownをHTMLに変換（サニタイズ済み）
 */
export function markdownToHtml(markdown: string): string {
  const html = marked.parse(markdown) as string;
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      's',
      'code',
      'pre',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'blockquote',
      'a',
      'img',
      'hr',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id'],
  });
}

/**
 * Markdownから目次を生成
 */
export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function generateToc(markdown: string): TocItem[] {
  const toc: TocItem[] = [];
  const lines = markdown.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      toc.push({ id, text, level });
    }
  }

  return toc;
}

