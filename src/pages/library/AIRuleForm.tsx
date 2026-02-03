import { useState, useEffect } from 'react';
import { TiptapEditor } from '../../components/ui/TiptapEditor';
import { ClinicSelector } from '../../components/ui/ClinicSelector';

interface AIRuleFormProps {
  initialData?: {
    id: string;
    name: string;
    content?: string;
    assignedClinics?: string[];
  } | null;
  userRole: 'admin' | 'clinic';
  onChange: (data: any) => void;
}

export function AIRuleForm({ initialData, userRole, onChange }: AIRuleFormProps) {
  const [title, setTitle] = useState(initialData?.name || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [selectedClinics, setSelectedClinics] = useState<string[]>(initialData?.assignedClinics || []);

  // Use useEffect to propagate changes to parent
  useEffect(() => {
    onChange({
      name: title,
      content,
      assignedClinics: selectedClinics,
      type: 'Safety' // Defaulting for now
    });
  }, [title, content, selectedClinics, onChange]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 gap-8">
        {/* Main Details Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Rule Details</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Rule Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                placeholder="e.g. Emergency Escalation Protocol"
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

        {/* Clinic Selector - Only for Super Admin */}
        <ClinicSelector
          selectedClinics={selectedClinics}
          onSelectionChange={setSelectedClinics}
          userRole={userRole}
        />
      </div>
    </div>
  );
}
