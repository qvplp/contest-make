/**
 * 外部リンク関連のユーティリティ関数
 */

import { ExternalLinkType } from '@/modules/contest/domain/Contest';

/**
 * YouTube URLのバリデーション
 * 対応形式:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 */
export function isValidYouTubeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // YouTubeのドメインチェック
    const youtubeDomains = [
      'www.youtube.com',
      'youtube.com',
      'youtu.be',
      'm.youtube.com',
      'youtube-nocookie.com',
    ];
    
    if (!youtubeDomains.some(domain => hostname === domain || hostname.endsWith(`.${domain}`))) {
      return false;
    }
    
    // youtu.be形式
    if (hostname === 'youtu.be' || hostname.endsWith('.youtu.be')) {
      const pathname = urlObj.pathname;
      return pathname.length > 1; // /VIDEO_ID の形式
    }
    
    // 通常のYouTube URL
    if (urlObj.pathname === '/watch' && urlObj.searchParams.has('v')) {
      return true;
    }
    
    // 埋め込み形式
    if (urlObj.pathname.startsWith('/embed/')) {
      return true;
    }
    
    return false;
  } catch {
    return false;
  }
}

/**
 * YouTube URLから動画IDを抽出
 */
export function extractYouTubeVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // youtu.be形式
    if (hostname === 'youtu.be' || hostname.endsWith('.youtu.be')) {
      const pathname = urlObj.pathname;
      const videoId = pathname.slice(1).split('?')[0];
      return videoId || null;
    }
    
    // 通常のYouTube URL
    if (urlObj.searchParams.has('v')) {
      return urlObj.searchParams.get('v');
    }
    
    // 埋め込み形式
    const embedMatch = urlObj.pathname.match(/^\/embed\/([^/?]+)/);
    if (embedMatch) {
      return embedMatch[1];
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * 外部リンクの種類を判定
 */
export function detectExternalLinkType(url: string): ExternalLinkType | null {
  if (isValidYouTubeUrl(url)) {
    return 'youtube';
  }
  
  // 将来的に他のプラットフォームを追加可能
  // if (isValidVimeoUrl(url)) {
  //   return 'vimeo';
  // }
  // if (isValidNicoVideoUrl(url)) {
  //   return 'nicovideo';
  // }
  
  return null;
}

/**
 * 外部リンクのバリデーション
 */
export function validateExternalLink(
  url: string,
  allowedTypes: ExternalLinkType[]
): { valid: boolean; type: ExternalLinkType | null; error?: string } {
  if (!url.trim()) {
    return { valid: false, type: null, error: 'URLを入力してください' };
  }
  
  const detectedType = detectExternalLinkType(url);
  
  if (!detectedType) {
    return { valid: false, type: null, error: 'サポートされていないURL形式です' };
  }
  
  if (!allowedTypes.includes(detectedType)) {
    return { valid: false, type: detectedType, error: 'このコンテストでは許可されていないリンク形式です' };
  }
  
  return { valid: true, type: detectedType };
}



