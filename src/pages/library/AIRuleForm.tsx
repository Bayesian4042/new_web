import { useState } from 'react';
import { TiptapEditor } from '../../components/ui/TiptapEditor';

interface AIRuleFormProps {
  initialData?: {
    id: string;
    name: string;
    content: string;
  } | null;
  onClose: () => void;
}

export function AIRuleForm({ initialData, onClose }: AIRuleFormProps) {
  const [title, setTitle] = useState(initialData?.name || '');
  const [content, setContent] = useState(initialData?.content || '');

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Title Field */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                Rule Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Emergency Keyword Detection"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        {/* Tiptap Editor */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                Rule Content
              </label>
              <TiptapEditor
                content={content}
                onChange={setContent}
                placeholder="Describe the AI rule logic, conditions, and actions..."
              />
              <p className="mt-2 text-xs text-gray-500">
                Define the conditions and actions for this AI rule
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
