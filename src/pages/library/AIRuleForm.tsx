import { useState, useEffect } from 'react';
import { TiptapEditor } from '../../components/ui/TiptapEditor';
import { ClinicSelector } from '../../components/ui/ClinicSelector';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface AIRuleFormProps {
  initialData?: {
    id: string;
    name: string;
    content?: string;
    assignedClinics?: string[];
  } | null;
  userRole: 'admin' | 'clinic';
  onChange: (data: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function AIRuleForm({ initialData, userRole, onChange, onSubmit, onCancel }: AIRuleFormProps) {
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
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
          <Card noPadding className="flex-1 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400">
            <div className="space-y-8 p-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Rule Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Emergency Escalation Protocol"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Rule Content
                </label>
                <div className="min-h-[400px]">
                  <TiptapEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Describe the AI rule logic, conditions, and actions..."
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Define the conditions and actions for this AI rule
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons - Fixed at Bottom */}
          <div className="flex items-center justify-end gap-3 bg-white border-t border-gray-200 py-3 px-6 rounded-lg shadow-sm">
            <Button
              onClick={onCancel}
              variant="outline"
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6"
            >
              {initialData ? 'Save Changes' : 'Create Rule'}
            </Button>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400">
          <ClinicSelector
            selectedClinics={selectedClinics}
            onSelectionChange={setSelectedClinics}
            userRole={userRole}
          />
        </div>
      </div>
    </div>
  );
}
