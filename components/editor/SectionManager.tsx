'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Section, generateSectionId } from '@/utils/draftManager';
import MarkdownEditor from './MarkdownEditor';
import MarkdownPreview from './MarkdownPreview';

interface SectionManagerProps {
  sections: Section[];
  onSectionsChange: (sections: Section[]) => void;
  onSave?: () => void;
}

function SortableSectionItem({
  section,
  isExpanded,
  onToggleExpand,
  onUpdate,
  onDelete,
  onDuplicate,
  onSave,
}: {
  section: Section;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (section: Section) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onSave?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      {/* セクションヘッダー */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-700 bg-gray-800/30">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300 transition"
        >
          <GripVertical size={20} />
        </button>

        <input
          type="text"
          value={section.title}
          onChange={(e) => onUpdate({ ...section, title: e.target.value })}
          placeholder="セクションタイトル"
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

        <button
          onClick={() => onUpdate({ ...section, is_published: !section.is_published })}
          className={`p-2 rounded-lg transition ${
            section.is_published
              ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
              : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
          }`}
          title={section.is_published ? '公開中' : '非公開'}
        >
          {section.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>

        <button
          onClick={onDuplicate}
          className="p-2 rounded-lg bg-gray-700 text-gray-400 hover:bg-gray-600 transition"
          title="複製"
        >
          <Copy size={16} />
        </button>

        <button
          onClick={onDelete}
          className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition"
          title="削除"
        >
          <Trash2 size={16} />
        </button>

        <button
          onClick={onToggleExpand}
          className="p-2 rounded-lg bg-gray-700 text-gray-400 hover:bg-gray-600 transition"
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* セクションコンテンツ */}
      {isExpanded && (
        <div className="p-4">
          <MarkdownEditor
            value={section.body_md}
            onChange={(value) => onUpdate({ ...section, body_md: value })}
            placeholder="セクションの内容をMarkdown形式で入力..."
            onSave={onSave}
          />
        </div>
      )}
    </div>
  );
}

export default function SectionManager({
  sections,
  onSectionsChange,
  onSave,
}: SectionManagerProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleExpand = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const addSection = () => {
    const newSection: Section = {
      id: generateSectionId(),
      title: '新しいセクション',
      body_md: '',
      is_published: false,
      order: sections.length,
    };
    onSectionsChange([...sections, newSection]);
    setExpandedSections((prev) => new Set([...prev, newSection.id]));
  };

  const updateSection = (updatedSection: Section) => {
    onSectionsChange(
      sections.map((s) => (s.id === updatedSection.id ? updatedSection : s))
    );
  };

  const deleteSection = (sectionId: string) => {
    if (confirm('このセクションを削除しますか？')) {
      onSectionsChange(sections.filter((s) => s.id !== sectionId));
      setExpandedSections((prev) => {
        const next = new Set(prev);
        next.delete(sectionId);
        return next;
      });
    }
  };

  const duplicateSection = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (section) {
      const newSection: Section = {
        ...section,
        id: generateSectionId(),
        title: `${section.title} (コピー)`,
        order: sections.length,
      };
      onSectionsChange([...sections, newSection]);
      setExpandedSections((prev) => new Set([...prev, newSection.id]));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);

      const newSections = arrayMove(sections, oldIndex, newIndex).map((s, index) => ({
        ...s,
        order: index,
      }));

      onSectionsChange(newSections);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">セクション ({sections.length})</h3>
        <button
          onClick={addSection}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
        >
          <Plus size={18} />
          セクションを追加
        </button>
      </div>

      {sections.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700 border-dashed">
          <p className="text-gray-400 mb-4">セクションがありません</p>
          <button
            onClick={addSection}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
          >
            最初のセクションを作成
          </button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {sections.map((section) => (
                <SortableSectionItem
                  key={section.id}
                  section={section}
                  isExpanded={expandedSections.has(section.id)}
                  onToggleExpand={() => toggleExpand(section.id)}
                  onUpdate={updateSection}
                  onDelete={() => deleteSection(section.id)}
                  onDuplicate={() => duplicateSection(section.id)}
                  onSave={onSave}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

