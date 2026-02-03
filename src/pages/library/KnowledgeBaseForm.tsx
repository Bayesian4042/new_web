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
}

export function KnowledgeBaseForm({ initialData, userRole, onChange }: KBFormProps) {
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
        <div className="bg-gray-50/50 min-h-full">
            <div className="max-w-4xl mx-auto space-y-8 pb-12">
                {/* 1. Basic Information Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-8 space-y-6">
                        <div>
                            <label className="block text-[15px] font-semibold text-gray-900 mb-2.5">
                                Resource Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Post-Op Recovery Guide"
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-[15px] text-gray-700 placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-[15px] font-semibold text-gray-900 mb-2.5">
                                Content & Summary
                            </label>
                            <TiptapEditor
                                content={content}
                                onChange={setContent}
                                placeholder="Describe the content or add key excerpts from the resource..."
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Attachments & Resources Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-8 py-5 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Files size={18} className="text-indigo-500" />
                            <h2 className="text-[16px] font-bold text-gray-900">Attachments & External Resources</h2>
                        </div>
                        <p className="text-xs text-gray-400">Files and links are optional</p>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                            {/* Documents Column */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 lowercase tracking-tight">
                                        <FileUp size={16} className="text-orange-500" />
                                        Clinical Documents
                                    </label>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{documents.length}/10 Files</span>
                                </div>

                                <div className="space-y-2.5">
                                    {documents.map((doc, index) => (
                                        <div key={index} className="group flex items-center justify-between p-3 bg-gray-50 hover:bg-orange-50/50 rounded-xl border border-transparent hover:border-orange-100 transition-all">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="h-8 w-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-orange-600 shrink-0">
                                                    <FileText size={14} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-gray-800 truncate leading-tight">{doc.name}</p>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">{doc.size}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeDocument(index)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}

                                    <label className="cursor-pointer block relative">
                                        <div className="flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-200 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group">
                                            <PlusCircle size={18} className="text-gray-400 group-hover:text-indigo-500" />
                                            <span className="text-sm font-bold text-gray-500 group-hover:text-indigo-600">Add Clinical Document</span>
                                        </div>
                                        <input type="file" multiple className="sr-only" onChange={handleFileUpload} />
                                    </label>
                                </div>
                            </div>

                            {/* Links Column */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 lowercase tracking-tight">
                                        <Globe size={16} className="text-blue-500" />
                                        Reference Links
                                    </label>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{links.length} Added</span>
                                </div>

                                <div className="space-y-2.5">
                                    {links.map((link, index) => (
                                        <div key={index} className="group flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50/50 rounded-xl border border-transparent hover:border-blue-100 transition-all">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="h-8 w-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-blue-500 shrink-0">
                                                    <LinkIcon size={14} />
                                                </div>
                                                <span className="text-xs text-gray-600 truncate text-pretty">{link}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <a href={link} target="_blank" rel="noreferrer" className="p-1 text-gray-400 hover:text-blue-600">
                                                    <ExternalLink size={14} />
                                                </a>
                                                <button onClick={() => removeLink(index)} className="p-1 text-gray-400 hover:text-red-500">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="flex gap-2 pt-2">
                                        <div className="relative flex-1">
                                            <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="url"
                                                value={newLink}
                                                onChange={(e) => setNewLink(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                                                placeholder="Paste reference URL..."
                                                className="w-full pl-9 pr-3 py-3 bg-white border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl transition-all text-xs"
                                            />
                                        </div>
                                        <button
                                            onClick={handleAddLink}
                                            className="px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Clinic Selector - Only for Super Admin */}
                <ClinicSelector
                    selectedClinics={selectedClinics}
                    onSelectionChange={setSelectedClinics}
                    selectedCategories={selectedCategories}
                    onCategoriesChange={setSelectedCategories}
                    userRole={userRole}
                />
            </div>
        </div>
    );
}
