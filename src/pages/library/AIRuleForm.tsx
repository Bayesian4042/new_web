import { useState, useEffect } from 'react';
import { TiptapEditor } from '../../components/ui/TiptapEditor';
import { ClinicSelector } from '../../components/ui/ClinicSelector';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';

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
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-full">
            <div className="space-y-8">
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
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
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
