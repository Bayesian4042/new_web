import { useState, useEffect } from 'react';
import {
    FileText,
    Link as LinkIcon,
    Plus,
    Trash2,
    ExternalLink,
    PlusCircle,
    FileUp,
    Files,
    Globe
} from 'lucide-react';
import { TiptapEditor } from '../../components/ui/TiptapEditor';
import { ClinicSelector } from '../../components/ui/ClinicSelector';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface KBFormProps {
    initialData?: {
        id: string;
        name: string;
        content?: string;
        documents?: { name: string; size: string }[];
        links?: string[];
        assignedClinics?: string[];
        assignedCategories?: string[];
    } | null;
    userRole: 'admin' | 'clinic';
    onChange: (data: any) => void;
    onSubmit: () => void;
    onCancel: () => void;
}

export function KnowledgeBaseForm({ initialData, userRole, onChange, onSubmit, onCancel }: KBFormProps) {
    const [name, setName] = useState(initialData?.name || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [documents, setDocuments] = useState<{ name: string; size: string }[]>(initialData?.documents || []);
    const [links, setLinks] = useState<string[]>(initialData?.links || []);
    const [newLink, setNewLink] = useState('');
    const [selectedClinics, setSelectedClinics] = useState<string[]>(initialData?.assignedClinics || []);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialData?.assignedCategories || []);

    useEffect(() => {
        onChange({
            name,
            content,
            documents,
            links,
            assignedClinics: selectedClinics,
            assignedCategories: selectedCategories
        });
    }, [name, content, documents, links, selectedClinics, selectedCategories, onChange]);

    const handleAddLink = () => {
        if (newLink && !links.includes(newLink)) {
            setLinks([...links, newLink]);
            setNewLink('');
        }
    };

    const removeDocument = (index: number) => setDocuments(documents.filter((_, i) => i !== index));
    const removeLink = (index: number) => setLinks(links.filter((_, i) => i !== index));

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newDocs = Array.from(files).map(file => ({
                name: file.name,
                size: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
            }));
            setDocuments([...documents, ...newDocs]);
        }
    };

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
                    <Card noPadding className="flex-1 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400">
                        <div className="space-y-8 p-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Resource Name
                                </label>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Post-Op Recovery Guide"
                                />
                            </div>

                            <div className="flex-1 flex flex-col">
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Content & Summary
                                </label>
                                <div className="min-h-[300px]">
                                    <TiptapEditor
                                        content={content}
                                        onChange={setContent}
                                        placeholder="Describe the content or add key excerpts from the resource..."
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <Files size={16} className="text-indigo-500" />
                                    <h2 className="text-sm font-bold text-gray-900">Attachments & Resources</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Documents Section */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                <FileUp size={14} className="text-orange-500" />
                                                Files
                                            </label>
                                            <span className="text-[10px] font-bold text-gray-400">{documents.length}</span>
                                        </div>

                                        <div className="space-y-2">
                                            {documents.map((doc, index) => (
                                                <div key={index} className="group flex items-center justify-between p-2 bg-gray-50 hover:bg-orange-50/50 rounded-lg border border-transparent hover:border-orange-100 transition-all">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="h-7 w-7 rounded bg-white border border-gray-100 flex items-center justify-center text-orange-600 shrink-0">
                                                            <FileText size={12} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-xs font-medium text-gray-800 truncate">{doc.name}</p>
                                                            <p className="text-[10px] text-gray-400">{doc.size}</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeDocument(index)}
                                                        className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                                    >
                                                        <Trash2 size={12} />
                                                    </Button>
                                                </div>
                                            ))}

                                            <label className="cursor-pointer block">
                                                <div className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group">
                                                    <PlusCircle size={16} className="text-gray-400 group-hover:text-indigo-500" />
                                                    <span className="text-xs font-semibold text-gray-500 group-hover:text-indigo-600">Upload File</span>
                                                </div>
                                                <input type="file" multiple className="sr-only" onChange={handleFileUpload} />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Links Section */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                <Globe size={14} className="text-blue-500" />
                                                Links
                                            </label>
                                            <span className="text-[10px] font-bold text-gray-400">{links.length}</span>
                                        </div>

                                        <div className="space-y-2">
                                            {links.map((link, index) => (
                                                <div key={index} className="group flex items-center justify-between p-2 bg-gray-50 hover:bg-blue-50/50 rounded-lg border border-transparent hover:border-blue-100 transition-all">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="h-7 w-7 rounded bg-white border border-gray-100 flex items-center justify-center text-blue-500 shrink-0">
                                                            <LinkIcon size={12} />
                                                        </div>
                                                        <span className="text-xs text-gray-600 truncate max-w-[150px]">{link}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <a href={link} target="_blank" rel="noreferrer" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                                                            <ExternalLink size={12} />
                                                        </a>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeLink(index)}
                                                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                                        >
                                                            <Trash2 size={12} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="flex gap-2 items-center">
                                                <div className="flex-1">
                                                    <Input
                                                        type="url"
                                                        icon={<LinkIcon size={12} />}
                                                        value={newLink}
                                                        onChange={(e) => setNewLink(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                                                        placeholder="URL..."
                                                        className="text-xs h-9"
                                                    />
                                                </div>
                                                <Button
                                                    onClick={handleAddLink}
                                                    variant="primary"
                                                    className="bg-indigo-600 hover:bg-indigo-700 h-9 w-9 p-0 rounded-lg"
                                                >
                                                    <Plus size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                            {initialData ? 'Save Changes' : 'Create Resource'}
                        </Button>
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400">
                    <ClinicSelector
                        selectedClinics={selectedClinics}
                        onSelectionChange={setSelectedClinics}
                        selectedCategories={selectedCategories}
                        onCategoriesChange={setSelectedCategories}
                        userRole={userRole}
                    />
                </div>
            </div>
        </div>
    );
}
