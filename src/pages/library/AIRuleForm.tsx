<<<<<<< Updated upstream
import React, { useState } from 'react';
=======
import { useState, useEffect } from 'react';
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8 space-y-6">
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
=======
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-4xl mx-auto space-y-6 pb-12 pt-10">
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
>>>>>>> Stashed changes
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
