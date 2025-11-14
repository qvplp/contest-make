'use client';

import { useState } from 'react';
import { X, Clock, RotateCcw } from 'lucide-react';
import { DraftHistory, restoreDraftVersion } from '@/utils/draftManager';

interface DraftHistoryModalProps {
  articleId: string;
  histories: DraftHistory[];
  isOpen: boolean;
  onClose: () => void;
  onRestore: (version: number) => void;
}

export default function DraftHistoryModal({
  articleId,
  histories,
  isOpen,
  onClose,
  onRestore,
}: DraftHistoryModalProps) {
  if (!isOpen) return null;

  const handleRestore = (version: number) => {
    if (confirm(`バージョン ${version} を復元しますか？現在の内容は上書きされます。`)) {
      onRestore(version);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-gray-700">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Clock size={24} />
            下書き履歴
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* 履歴リスト */}
        <div className="overflow-y-auto max-h-[60vh] p-6">
          {histories.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>履歴がありません</p>
            </div>
          ) : (
            <div className="space-y-3">
              {histories.map((history) => (
                <div
                  key={history.version}
                  className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-purple-600 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-purple-400">
                          バージョン {history.version}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(history.timestamp).toLocaleString('ja-JP')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mb-1">{history.title}</p>
                      <p className="text-xs text-gray-500">
                        セクション数: {history.sectionsCount}
                      </p>
                      {history.diffSummary && (
                        <p className="text-xs text-gray-500 mt-1">{history.diffSummary}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRestore(history.version)}
                      className="ml-4 p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition flex items-center gap-2"
                      title="このバージョンを復元"
                    >
                      <RotateCcw size={16} />
                      <span className="text-sm">復元</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

