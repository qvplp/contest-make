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
// 型定義との齟齬を避けるため any ベースでカスタムレンダラーを登録
marked.use({
  renderer: {
    code(this: any, code: any, language?: string) {
      const lang = language || 'text';

      // code が string 以外（オブジェクトなど）の場合にも安全に扱う
      let codeStr: string;
      if (typeof code === 'string') {
        codeStr = code;
      } else if (Array.isArray(code)) {
        codeStr = code.join('\n');
      } else if (code && typeof code.text === 'string') {
        codeStr = code.text;
      } else if (code && typeof code.raw === 'string') {
        codeStr = code.raw;
      } else {
        codeStr = String(code ?? '');
      }

      const escapedCode = codeStr.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto"><code class="language-${lang}">${escapedCode}</code></pre>`;
    },
    heading(this: any, text: any, level: number) {
      let textStr: string;
      if (typeof text === 'string') {
        textStr = text;
      } else if (Array.isArray(text)) {
        textStr = text.join(' ');
      } else if (text && typeof text.text === 'string') {
        textStr = text.text;
      } else {
        textStr = String(text ?? '');
      }

      const id = textStr
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      return `<h${level} id="${id}" class="scroll-mt-20">${textStr}</h${level}>`;
    },
  } as any,
});

/**
 * MarkdownをHTMLに変換（サニタイズ済み）
 */
export function markdownToHtml(markdown: string): string {
  // Blockエディタ由来のエスケープ（\#, \*, \_ など）を軽く正規化してからパースする
  const normalized = markdown
    .replace(/\r\n/g, '\n')
    .replace(/\\([#*_`])/g, '$1');

  const html = marked.parse(normalized) as string;
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

