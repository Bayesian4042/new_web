import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Companions, Companion } from './pages/workspace/Companions';
import { Protocols, Protocol } from './pages/workspace/Protocols';
import { PatientList } from './pages/patients/PatientList';
import { AIRules, AIRule } from './pages/library/AIRules';
import { Plans, Plan } from './pages/library/Plans';
import { Followups, Followup } from './pages/library/Followups';
import { HealthAssistant } from './pages/ai-system/HealthAssistant';
import { Conversations } from './pages/ai-system/Conversations';
import { ConversationsTable } from './pages/ai-system/ConversationsTable';
import { Settings } from './pages/setup/Settings';
import { Users } from './pages/setup/Users';
import { CompanionForm } from './pages/workspace/CompanionForm';
import { ProtocolForm } from './pages/workspace/ProtocolForm';
import { AIRuleForm } from './pages/library/AIRuleForm';
import { FollowupForm } from './pages/library/FollowupForm';
import { KnowledgeBase, KBItem } from './pages/library/KnowledgeBase';
import { KnowledgeBaseForm } from './pages/library/KnowledgeBaseForm';
import { Button } from './components/ui/Button';
import { PlanForm } from './pages/library/PlanForm';
import { Clinics, mockClinics, Clinic } from './pages/setup/Clinics';
import { ClinicForm } from './pages/setup/ClinicForm';
import { ClinicDetail } from './pages/setup/ClinicDetail';
import { OTCLists, OTCList } from './pages/otc/OTCLists';
import { OTCListForm } from './pages/otc/OTCListForm';

const INITIAL_RULES: AIRule[] = [
  {
    id: 'RULE-0001',
    name: 'Emergency Keyword Detection',
    type: 'Safety',
    status: 'Active',
    triggers: 3,
    lastUpdated: '2d ago',
    createdOn: '02-02-2026 09:00:00',
    content: '<h2>Condition</h2><p>IF patient message contains keywords: <code>["emergency", "suicide", "chest pain", "severe bleeding"]</code></p><h2>Actions</h2><ul><li>Immediately flag conversation as URGENT</li><li>Notify on-call healthcare provider</li><li>Display crisis helpline resources to patient</li><li>Log incident in safety monitoring system</li></ul>'
  },
  {
    id: 'RULE-0002',
    name: 'Medication Reminder Escalation',
    type: 'Adherence',
    status: 'Active',
    triggers: 1,
    lastUpdated: '5d ago',
    createdOn: '28-01-2026 14:30:00',
    content: '<h2>Condition</h2><p>IF patient misses medication reminder for <strong>3 consecutive days</strong></p><h2>Actions</h2><ul><li>Send escalated reminder with importance explanation</li><li>Notify assigned care coordinator</li><li>Offer to schedule medication review appointment</li></ul>'
  },
  {
    id: 'RULE-0003',
    name: 'Abusive Language Filter',
    type: 'Safety',
    status: 'Testing',
    triggers: 0,
    lastUpdated: '1d ago',
    createdOn: '01-02-2026 10:00:00',
    content: '<h2>Condition</h2><p>IF patient uses profanity or abusive language</p><h2>Actions</h2><ul><li>Issue polite warning about communication standards</li><li>Temporarily pause AI response if repeated</li><li>Flag for administrative review</li></ul>'
  },
  {
    id: 'RULE-0004',
    name: 'Follow-up Attendance Check',
    type: 'Engagement',
    status: 'Active',
    triggers: 12,
    lastUpdated: '4h ago',
    createdOn: '20-01-2026 11:30:00',
    content: '<h2>Condition</h2><p>IF patient does not respond to 2 consecutive follow-up messages</p><h2>Actions</h2><ul><li>Trigger manual outbound call task for staff</li><li>Send a "Checking in" SMS</li></ul>'
  }
];

const INITIAL_PLANS: Plan[] = [
  {
    id: 'PLAN-0001',
    name: 'Post-Surgery Recovery',
    category: 'Orthopedics',
    assignedCategories: ['Orthopedics'],
    status: 'Active',
    duration: '6 weeks',
    steps: 12,
    createdOn: '02-02-2026',
    content: '<p>Standard recovery protocol for post-orthopedic surgery.</p>',
    products: [
      { id: '1', name: 'Pain Relief (Ibuprofen)', type: 'Medication', instruction: 'Take 400mg every 6 hours as needed.', timeOfDay: ['M', 'E'], price: '12.50 €' },
      { id: '2', name: 'Physical Therapy Guide', type: 'Digital Resource', instruction: 'Follow exercises twice daily.', timeOfDay: ['M', 'L'], price: '0.00 €' }
    ]
  },
  {
    id: 'PLAN-0002',
    name: 'Diabetes Management',
    category: 'Chronic Care',
    assignedCategories: ['General Medicine'],
    status: 'Active',
    duration: 'Ongoing',
    steps: 8,
    createdOn: '01-02-2026',
    products: []
  }
];

const INITIAL_KB: KBItem[] = [
  {
    id: 'KB-0001',
    name: 'Post-Op Recovery Guide',
    addedOn: '02-02-2026',
    lastUpdated: '2h ago',
    documents: [
      { name: 'Recovery_Basic.pdf', size: '1.2 MB' },
      { name: 'Exercises.pdf', size: '2.4 MB' }
    ],
    links: ['https://med.edu/post-op'],
    content: '<h2>Introduction</h2><p>This guide covers essential recovery steps.</p>'
  },
  {
    id: 'KB-0002',
    name: 'Diabetes Management Protocol',
    addedOn: '01-02-2026',
    lastUpdated: '1d ago',
    links: ['https://clinical-docs.med/diabetes'],
    content: 'Official protocol for type 2 diabetes management at MediCore.'
  }
];

const INITIAL_FOLLOWUPS: Followup[] = [
  {
    id: 'FUP-0001',
    name: 'Post-Op Day 1 Check',
    type: 'Scheduled',
    status: 'Active',
    frequency: 'Daily',
    duration: '7',
    time: '9:00 AM',
    linkedProtocols: 5,
    createdOn: '02-02-2026',
    content: "Hi Sarah! Checking in on your recovery after yesterday's procedure. How is your pain level today?"
  },
  {
    id: 'FUP-0002',
    name: 'Weekly Progress Review',
    type: 'Scheduled',
    status: 'Active',
    frequency: 'Weekly',
    duration: '30',
    time: '10:00 AM',
    linkedProtocols: 12,
    createdOn: '01-02-2026',
    content: "Time for your weekly review! How has your mood and energy been over the past 7 days?"
  }
];

const INITIAL_PROTOCOLS: Protocol[] = [
  {
    id: 'PRT-0001',
    name: 'Post-Op Knee Recovery',
    category: 'Orthopedics',
    status: 'Active',
    enrolled: 45,
    duration: '42',
    createdOn: '02-02-2026',
    aiRules: 'Monitor knee swelling and pain levels daily. Escalate if temperature > 38C or pain > 8/10.',
    followupMessage: 'How is your knee feeling today? Please rate your pain from 1-10.',
    assignedClinics: ['clinic-1', 'clinic-2'],
    assignedPatients: [],
    selectedShortcuts: ['s1', 's2'],
    selectedDocuments: ['d1'],
    selectedPlans: ['p1']
  },
  {
    id: 'PRT-0002',
    name: 'Type 2 Diabetes Management',
    category: 'Chronic Care',
    status: 'Active',
    enrolled: 128,
    duration: 'Ongoing',
    createdOn: '01-02-2026',
    aiRules: 'Monitor daily glucose levels.',
    followupMessage: 'Please log your blood sugar.',
    assignedClinics: ['clinic-1'],
    assignedPatients: [],
    selectedShortcuts: ['s3'],
    selectedDocuments: ['d1', 'd2'],
    selectedPlans: ['p2']
  },
  {
    id: 'PRT-0003',
    name: 'Anxiety CBT Module 1',
    category: 'Mental Health',
    status: 'Review',
    enrolled: 32,
    duration: '4 weeks',
    createdOn: '30-01-2026',
    selectedShortcuts: ['s4', 's5'],
    selectedDocuments: ['d3'],
    selectedPlans: ['p3']
  },
  {
    id: 'PRT-0004',
    name: 'Hypertension Monitoring',
    category: 'Cardiology',
    status: 'Draft',
    enrolled: 0,
    duration: '12 weeks',
    createdOn: '28-01-2026',
    selectedShortcuts: ['s6'],
    selectedDocuments: [],
    selectedPlans: ['p4']
  },
  {
    id: 'PRT-0005',
    name: 'Prenatal Care - Trimester 1',
    category: 'Obstetrics',
    status: 'Active',
    enrolled: 67,
    duration: '12 weeks',
    createdOn: '25-01-2026',
    selectedShortcuts: ['s7'],
    selectedDocuments: [],
    selectedPlans: []
  }
];

const INITIAL_COMPANIONS: Companion[] = [
  {
    id: 'CMP-0001',
    name: 'Recovery Coach',
    role: 'Post-Op Support',
    status: 'Active',
    users: 124,
    createdBy: 'Dr. Sarah Smith',
    createdOn: '02-02-2026'
  },
  {
    id: 'CMP-0002',
    name: 'Medication Reminder',
    role: 'Adherence',
    status: 'Active',
    users: 856,
    createdBy: 'Nurse Johnson',
    createdOn: '01-02-2026'
  },
  {
    id: 'CMP-0003',
    name: 'Anxiety Support',
    role: 'Mental Health',
    status: 'Draft',
    users: 0,
    createdBy: 'Dr. Mike Wilson',
    createdOn: '31-01-2026'
  },
  {
    id: 'CMP-0004',
    name: 'Dietary Assistant',
    role: 'Nutrition',
    status: 'Archived',
    users: 45,
    createdBy: 'Nutritionist Jane',
    createdOn: '28-01-2026'
  },
  {
    id: 'CMP-0005',
    name: 'Symptom Checker',
    role: 'Triage',
    status: 'Active',
    users: 342,
    createdBy: 'Dr. Sarah Smith',
    createdOn: '25-01-2026'
  }
];

const INITIAL_OTC_LISTS: OTCList[] = [
  {
    id: 'OTC-0001',
    name: 'Cold & Flu Bundle',
    productsCount: 5,
    createdOn: '02-02-2026',
    lastUpdated: '2h ago'
  },
  {
    id: 'OTC-0002',
    name: 'Pain Management Kit',
    productsCount: 3,
    createdOn: '01-02-2026',
    lastUpdated: '1d ago'
  },
  {
    id: 'OTC-0003',
    name: 'Allergy Relief Pack',
    productsCount: 4,
    createdOn: '31-01-2026',
    lastUpdated: '3d ago'
  }
];

export function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [userRole, setUserRole] = useState<'admin' | 'clinic'>('admin');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCompanionForm, setShowCompanionForm] = useState(false);
  const [editingCompanion, setEditingCompanion] = useState<any>(null);
  const [showProtocolForm, setShowProtocolForm] = useState(false);
  const [editingProtocol, setEditingProtocol] = useState<any>(null);
  const [showAIRuleForm, setShowAIRuleForm] = useState(false);
  const [editingAIRule, setEditingAIRule] = useState<AIRule | null>(null);
  const [showFollowupForm, setShowFollowupForm] = useState(false);
  const [editingFollowup, setEditingFollowup] = useState<Followup | null>(null);
  const [showKBForm, setShowKBForm] = useState(false);
  const [editingKB, setEditingKB] = useState<KBItem | null>(null);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showClinicForm, setShowClinicForm] = useState(false);
  const [editingClinic, setEditingClinic] = useState<any>(null);
  const [viewingClinic, setViewingClinic] = useState<Clinic | null>(null);
  const [clinics, setClinics] = useState<any[]>(mockClinics);
  const [airuleDraft, setAiruleDraft] = useState<any>(null);
  const [planDraft, setPlanDraft] = useState<any>(null);
  const [followupDraft, setFollowupDraft] = useState<any>(null);
  const [kbDraft, setKbDraft] = useState<any>(null);
  const [companionDraft, setCompanionDraft] = useState<any>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [showOTCListForm, setShowOTCListForm] = useState(false);
  const [editingOTCList, setEditingOTCList] = useState<OTCList | null>(null);
  const [otcListDraft, setOtcListDraft] = useState<any>(null);

  const [rules, setRules] = useState<AIRule[]>(INITIAL_RULES);
  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS);
  const [kbItems, setKbItems] = useState<KBItem[]>(INITIAL_KB);
  const [followups, setFollowups] = useState<Followup[]>(INITIAL_FOLLOWUPS);
  const [companions, setCompanions] = useState<Companion[]>(INITIAL_COMPANIONS);
  const [protocols, setProtocols] = useState<Protocol[]>(INITIAL_PROTOCOLS);
  const [otcLists, setOtcLists] = useState<OTCList[]>(INITIAL_OTC_LISTS);

  const handleClinicSubmit = (data: any) => {
    if (editingClinic && !editingClinic.isCopy) {
      setClinics(prev => prev.map(c => c.id === editingClinic.id ? { ...c, ...data } : c));
    } else {
      const newClinic = {
        ...data,
        id: `CLN-${(clinics.length + 1).toString().padStart(3, '0')}`,
        createdOn: new Date().toISOString().split('T')[0],
        patientCount: 0,
        status: 'Active'
      };
      setClinics(prev => [...prev, newClinic]);
    }
    setShowClinicForm(false);
    setEditingClinic(null);
  };

  const handleClinicDetailSave = (clinicId: string, data: any) => {
    setClinics(prev => prev.map(c => c.id === clinicId ? { ...c, ...data } : c));
    // Update the viewing clinic to reflect changes
    setViewingClinic(prev => prev ? { ...prev, ...data } : null);
  };

  const handleDeleteClinic = (id: string) => {
    setClinics(prev => prev.filter(c => c.id !== id));
  };

  const handleCopyClinic = (clinic: any) => {
    setEditingClinic({ ...clinic, id: undefined, isCopy: true });
    setShowClinicForm(true);
  };

  const handleDeleteAIRule = (id: string) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      setRules(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleCopyAIRule = (rule: AIRule) => {
    setEditingAIRule({ ...rule, id: '', name: `${rule.name} (Copy)` });
    setShowAIRuleForm(true);
  };

  const handleDeletePlan = (id: string) => {
    if (confirm('Are you sure you want to delete this plan?')) {
      setPlans(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleCopyPlan = (plan: Plan) => {
    setEditingPlan({ ...plan, id: '', name: `${plan.name} (Copy)` });
    setShowPlanForm(true);
  };

  const handleDeleteKB = (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      setKbItems(prev => prev.filter(k => k.id !== id));
    }
  };

  const handleCopyKB = (item: KBItem) => {
    setEditingKB({ ...item, id: '', name: `${item.name} (Copy)` });
    setShowKBForm(true);
  };

  const handleDeleteFollowup = (id: string) => {
    if (confirm('Are you sure you want to delete this followup?')) {
      setFollowups(prev => prev.filter(f => f.id !== id));
    }
  };

  const handleCopyFollowup = (followup: Followup) => {
    setEditingFollowup({ ...followup, id: '', name: `${followup.name} (Copy)` });
    setShowFollowupForm(true);
  };

  const handleCopyCompanion = (companion: Companion) => {
    setEditingCompanion({ ...companion, id: '', name: `${companion.name} (Copy)` });
    setShowCompanionForm(true);
  };

  const handleCopyProtocol = (protocol: Protocol) => {
    setEditingProtocol({ ...protocol, id: '', name: `${protocol.name} (Copy)` });
    setShowProtocolForm(true);
  };

  const handleDeleteProtocol = (id: string) => {
    if (confirm('Are you sure you want to delete this protocol?')) {
      setProtocols(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleProtocolSubmit = () => {
    // TODO: Implement actual data persistence for Protocols
    // Currently, ProtocolForm manages its own state and doesn't pass it back.
    // This requires a refactor of ProtocolForm to support onChange or a callback with data.
    console.log('Protocol saved (mock)');
    setShowProtocolForm(false);
    setEditingProtocol(null);
  };

  const handleDeleteCompanion = (id: string) => {
    if (confirm('Are you sure you want to delete this companion?')) {
      setCompanions(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleAIRuleSubmit = () => {
    if (!airuleDraft) return;

    if (editingAIRule && editingAIRule.id) {
      setRules(prev => prev.map(r => r.id === editingAIRule.id ? { ...r, ...airuleDraft } : r));
    } else {
      const newRule: AIRule = {
        ...airuleDraft,
        id: `RULE-${(rules.length + 1).toString().padStart(4, '0')}`,
        triggers: 0,
        lastUpdated: 'Now',
        createdOn: new Date().toISOString().split('T')[0],
        status: 'Active'
      };
      setRules(prev => [newRule, ...prev]);
    }
    setShowAIRuleForm(false);
    setEditingAIRule(null);
    setAiruleDraft(null);
  };

  const handlePlanSubmit = () => {
    if (!planDraft) return;
    const finalData = {
      ...planDraft,
      category: planDraft.assignedCategories?.[0] || 'General'
    };
    if (editingPlan && editingPlan.id) {
      setPlans(prev => prev.map(p => p.id === editingPlan.id ? { ...p, ...finalData } : p));
    } else {
      const newPlan: Plan = {
        ...finalData,
        id: `PLAN-${(plans.length + 1).toString().padStart(4, '0')}`,
        createdOn: new Date().toISOString().split('T')[0],
        status: 'Active',
        steps: finalData.products?.length || 0,
        duration: 'Multiple weeks' // Default
      };
      setPlans(prev => [newPlan, ...prev]);
    }
    setShowPlanForm(false);
    setEditingPlan(null);
    setPlanDraft(null);
  };

  const handleKBSubmit = () => {
    if (!kbDraft) return;
    if (editingKB && editingKB.id) {
      setKbItems(prev => prev.map(k => k.id === editingKB.id ? { ...k, ...kbDraft } : k));
    } else {
      const newItem: KBItem = {
        ...kbDraft,
        id: `KB-${(kbItems.length + 1).toString().padStart(4, '0')}`,
        addedOn: new Date().toISOString().split('T')[0],
        lastUpdated: 'Now'
      };
      setKbItems(prev => [newItem, ...prev]);
    }
    setShowKBForm(false);
    setEditingKB(null);
    setKbDraft(null);
  };

  const handleFollowupSubmit = () => {
    if (!followupDraft) return;
    if (editingFollowup && editingFollowup.id) {
      setFollowups(prev => prev.map(f => f.id === editingFollowup.id ? { ...f, ...followupDraft } : f));
    } else {
      const newFollowup: Followup = {
        ...followupDraft,
        id: `FUP-${(followups.length + 1).toString().padStart(4, '0')}`,
        createdOn: new Date().toISOString().split('T')[0],
        status: 'Active',
        linkedProtocols: 0
      };
      setFollowups(prev => [newFollowup, ...prev]);
    }
    setShowFollowupForm(false);
    setEditingFollowup(null);
    setFollowupDraft(null);
  };

  const handleCompanionSubmit = () => {
    if (!companionDraft) return;
    if (editingCompanion && editingCompanion.id) {
      setCompanions(prev => prev.map(c => c.id === editingCompanion.id ? { ...c, ...companionDraft } : c));
    } else {
      const newCompanion: Companion = {
        ...companionDraft,
        id: `CMP-${(companions.length + 1).toString().padStart(4, '0')}`,
        createdOn: new Date().toISOString().split('T')[0],
        createdBy: 'Super Admin',
        status: 'Active',
        users: 0,
        role: companionDraft.type || 'General Support'
      };
      setCompanions(prev => [newCompanion, ...prev]);
    }
    setShowCompanionForm(false);
    setEditingCompanion(null);
    setCompanionDraft(null);
  };

  const handleOTCListSubmit = () => {
    if (!otcListDraft) return;
    if (editingOTCList && editingOTCList.id) {
      setOtcLists(prev => prev.map(list => list.id === editingOTCList.id ? {
        ...list,
        name: otcListDraft.name,
        productsCount: otcListDraft.products?.length || 0,
        lastUpdated: 'Now'
      } : list));
    } else {
      const newList: OTCList = {
        id: `OTC-${(otcLists.length + 1).toString().padStart(4, '0')}`,
        name: otcListDraft.name,
        productsCount: otcListDraft.products?.length || 0,
        createdOn: new Date().toISOString().split('T')[0],
        lastUpdated: 'Now'
      };
      setOtcLists(prev => [newList, ...prev]);
    }
    setShowOTCListForm(false);
    setEditingOTCList(null);
    setOtcListDraft(null);
  };

  const handleDeleteOTCList = (id: string) => {
    if (confirm('Are you sure you want to delete this OTC list?')) {
      setOtcLists(prev => prev.filter(list => list.id !== id));
    }
  };

  const handleCopyOTCList = (list: OTCList) => {
    setEditingOTCList({ ...list, id: '', name: `${list.name} (Copy)` } as any);
    setShowOTCListForm(true);
  };

  const renderContent = () => {
    // Show companion form when active
    if (showCompanionForm && activeView === 'companions') {
      return (
        <CompanionForm
          onClose={() => {
            setShowCompanionForm(false);
            setEditingCompanion(null);
            setCompanionDraft(null);
          }}
          onChange={setCompanionDraft}
          initialData={editingCompanion}
          userRole={userRole}
        />
      );
    }

    // Show Protocol form when active
    if (showProtocolForm && activeView === 'protocols') {
      return (
        <ProtocolForm
          onClose={() => {
            setShowProtocolForm(false);
            setEditingProtocol(null);
          }}
          onSave={() => {
            console.log('Save protocol triggered - implementation pending refactor');
            setShowProtocolForm(false);
            setEditingProtocol(null);
          }}
          initialData={editingProtocol}
          userRole={userRole}
        />
      );
    }

    // Show AI Rule form when active
    if (showAIRuleForm && activeView === 'ai-rules') {
      return (
        <AIRuleForm
          onChange={setAiruleDraft}
          initialData={editingAIRule}
          userRole={userRole}
        />
      );
    }

    // Show KB form when active
    if (showKBForm && activeView === 'knowledge-base') {
      return (
        <KnowledgeBaseForm
          onChange={setKbDraft}
          initialData={editingKB}
          userRole={userRole}
        />
      );
    }

    // Show Plan form when active
    if (showPlanForm && activeView === 'plans') {
      return (
        <PlanForm
          onChange={setPlanDraft}
          initialData={editingPlan}
          userRole={userRole}
        />
      );
    }

    // Show Followup form when active
    if (showFollowupForm && activeView === 'followups') {
      return (
        <FollowupForm
          onChange={setFollowupDraft}
          initialData={editingFollowup}
          userRole={userRole}
        />
      );
    }

    // Show Clinic form when active
    if (showClinicForm && activeView === 'clinics') {
      return (
        <ClinicForm
          initialData={editingClinic}
          onCancel={() => {
            setShowClinicForm(false);
            setEditingClinic(null);
          }}
          onSubmit={handleClinicSubmit}
        />
      );
    }

    // Show OTC List form when active
    if (showOTCListForm && activeView === 'otc-lists') {
      return (
        <OTCListForm
          onChange={setOtcListDraft}
          initialData={editingOTCList}
        />
      );
    }

    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'companions':
        return <Companions
          onAddCompanion={() => {
            setEditingCompanion(null);
            setShowCompanionForm(true);
          }}
          onEditCompanion={(companion: Companion) => {
            setEditingCompanion(companion);
            setShowCompanionForm(true);
          }}
          onCopyCompanion={handleCopyCompanion}
          onDeleteCompanion={handleDeleteCompanion}
          companions={companions}
        />;
      case 'protocols':
        return <Protocols
          onEdit={(protocol) => {
            setEditingProtocol(protocol);
            setShowProtocolForm(true);
          }}
          onCopy={handleCopyProtocol}
          onDelete={handleDeleteProtocol}
          onAssignPatients={(protocol) => {
            setEditingProtocol(protocol);
            setShowProtocolForm(true);
          }}
          onAdd={() => {
            setEditingProtocol(null);
            setShowProtocolForm(true);
          }}
          protocols={protocols}
          userRole={userRole}
        />;
      case 'all-patients':
        return <PatientList
          onNavigateToConversations={(conversationId) => {
            setSelectedConversationId(conversationId || null);
            setActiveView('conversations');
          }}
          userRole={userRole}
          initialPatientId={selectedPatientId}
        />;
      case 'ai-rules':
        return <AIRules
          onAddRule={() => {
            setEditingAIRule(null);
            setShowAIRuleForm(true);
          }}
          onEditRule={(rule) => {
            setEditingAIRule(rule);
            setShowAIRuleForm(true);
          }}
          onCopyRule={handleCopyAIRule}
          onDeleteRule={handleDeleteAIRule}
          rules={rules}
        />;
      case 'plans':
        return <Plans
          onAdd={() => setShowPlanForm(true)}
          onEdit={(plan) => {
            setEditingPlan(plan);
            setShowPlanForm(true);
          }}
          onCopy={handleCopyPlan}
          onDelete={handleDeletePlan}
          plans={plans}
        />;
      case 'followups':
        return <Followups
          onAddFollowup={() => {
            setEditingFollowup(null);
            setShowFollowupForm(true);
          }}
          onEditFollowup={(followup) => {
            setEditingFollowup(followup);
            setShowFollowupForm(true);
          }}
          onCopyFollowup={handleCopyFollowup}
          onDeleteFollowup={handleDeleteFollowup}
          followups={followups}
        />;
      case 'knowledge-base':
        return <KnowledgeBase
          onAddItem={() => {
            setEditingKB(null);
            setShowKBForm(true);
          }}
          onEditItem={(item) => {
            setEditingKB(item);
            setShowKBForm(true);
          }}
          onCopyItem={handleCopyKB}
          onDeleteItem={handleDeleteKB}
          items={kbItems}
        />;
      case 'otc-lists':
        return <OTCLists
          onAddList={() => {
            setEditingOTCList(null);
            setShowOTCListForm(true);
          }}
          onEditList={(list) => {
            setEditingOTCList(list);
            setShowOTCListForm(true);
          }}
          onCopyList={handleCopyOTCList}
          onDeleteList={handleDeleteOTCList}
          lists={otcLists}
        />;
      case 'health-assistant':
        return <HealthAssistant />;
      case 'conversations':
        return <Conversations
          userRole={userRole}
          initialConversationId={selectedConversationId}
          onConversationChange={() => setSelectedConversationId(null)}
          onNavigateToPatient={(patientId) => {
            setSelectedPatientId(patientId);
            setActiveView('all-patients');
          }}
        />;
      case 'conversations-table':
        return <ConversationsTable
          userRole={userRole}
          onViewConversation={(conv) => {
            setSelectedConversationId(conv.id);
            setActiveView('conversations');
          }}
        />;
      case 'clinics':
        return <Clinics
          clinics={clinics}
          onAddClinic={() => {
            setEditingClinic(null);
            setShowClinicForm(true);
          }}
          onViewClinic={(clinic) => {
            setViewingClinic(clinic);
            setActiveView('clinic-detail');
          }}
          onCopyClinic={handleCopyClinic}
          onDeleteClinic={handleDeleteClinic}
        />;
      case 'clinic-detail':
        if (!viewingClinic) {
          setActiveView('clinics');
          return null;
        }
        return <ClinicDetail
          clinic={viewingClinic}
          onBack={() => {
            setViewingClinic(null);
            setActiveView('clinics');
          }}
          onSave={(data) => handleClinicDetailSave(viewingClinic.id, data)}
        />;
      case 'users':
        return <Users />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
            <h3 className="text-lg font-medium text-gray-600">
              Page Under Construction
            </h3>
            <p className="text-sm mt-1">
              The {activeView} page is coming soon.
            </p>
          </div>);

    }
  };

  const getPageInfo = () => {
    if (showCompanionForm && activeView === 'companions') {
      return {
        title: 'New Companion',
        breadcrumb: 'Workspace / Companions'
      };
    }
    if (showProtocolForm && activeView === 'protocols') {
      return {
        title: 'New Protocol',
        breadcrumb: 'Workspace / Protocols'
      };
    }

    // Add logic for other forms if needed
    if (showAIRuleForm && activeView === 'ai-rules') {
      return {
        title: editingAIRule ? 'Edit AI Rule' : 'New AI Rule',
        breadcrumb: 'Library / AI Rules'
      };
    }

    const info: Record<
      string,
      {
        title: string;
        breadcrumb: string;
      }> =
    {
      dashboard: {
        title: 'Home',
        breadcrumb: 'Overview'
      },
      companions: {
        title: 'Companions',
        breadcrumb: 'Workspace'
      },
      protocols: {
        title: 'Protocols',
        breadcrumb: 'Workspace'
      },
      'all-patients': {
        title: 'All Patients',
        breadcrumb: 'Patient Management'
      },
      'patient-groups': {
        title: 'Patient Groups',
        breadcrumb: 'Patient Management'
      },
      'ai-rules': {
        title: 'AI Rules',
        breadcrumb: 'Library'
      },
      plans: {
        title: 'Plans',
        breadcrumb: 'Library'
      },
      followups: {
        title: 'Followups',
        breadcrumb: 'Library'
      },
      'knowledge-base': {
        title: 'Knowledge Base',
        breadcrumb: 'Library'
      },
      'otc-lists': {
        title: 'OTC Lists',
        breadcrumb: 'OTC'
      },
      'health-assistant': {
        title: 'Health Assistant',
        breadcrumb: 'AI System'
      },
      conversations: {
        title: userRole === 'admin' ? 'All Conversations (Cards)' : 'Conversations (Cards)',
        breadcrumb: 'AI System'
      },
      'conversations-table': {
        title: userRole === 'admin' ? 'All Conversations (Table)' : 'Conversations (Table)',
        breadcrumb: 'AI System'
      },
      users: {
        title: 'Team Management',
        breadcrumb: 'Setup'
      },
      settings: {
        title: 'Settings',
        breadcrumb: 'Setup'
      },
      clinics: {
        title: 'Clinics',
        breadcrumb: 'Setup'
      },
      'clinic-detail': {
        title: viewingClinic?.name || 'Clinic Details',
        breadcrumb: 'Setup / Clinics'
      }
    };
    return (
      info[activeView] || {
        title: 'Home',
        breadcrumb: 'Overview'
      });

  };

  const pageInfo = getPageInfo();

  // Custom header for form view - this is now handled by getPageInfo mostly,
  // but if we need custom actions in the header (like Save/Cancel buttons), we might need logic here.
  // However, looking at the previous code, duplicate header rendering was a source of confusion.
  // The layout below uses <Header /> which should be sufficient for the title/breadcrumb.
  // The actual specific form actions (Save/Cancel) are often inside the form components themselves,
  // OR they were in the transient header blocks that I've seen in the diff.

  // Wait, the "Stashed" code had explicit headers for CompanionForm, AIRuleForm etc.
  // This implies the standard <Header> component isn't used when forms are open?
  // Or that the forms need specific action buttons in the header area.

  // Let's implement the specific headers if a form is active.
  const renderHeader = () => {
    // Custom header for Companions form
    if (showCompanionForm && activeView === 'companions') {
      return (
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 font-medium">Workspace</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-500 font-medium">Companions</span>
            <span className="text-gray-300">/</span>
            {editingCompanion ? (
              <>
                <span className="text-gray-500 font-medium">{editingCompanion.name}</span>
                <span className="text-gray-300">/</span>
                <span className="font-semibold text-gray-900">Edit</span>
              </>
            ) : (
              <span className="font-semibold text-gray-900">New Companion</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowCompanionForm(false);
                setEditingCompanion(null);
                setCompanionDraft(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            {editingCompanion ? (
              <Button
                size="sm"
                className="h-9 px-5 bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow transition-all rounded-lg"
                onClick={handleCompanionSubmit}>
                Save Changes
              </Button>
            ) : (
              <Button
                size="sm"
                className="h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all rounded-lg"
                onClick={handleCompanionSubmit}>
                Create Companion
              </Button>
            )}
          </div>
        </header>
      );
    }

    // Custom header for AI Rule form
    if (showAIRuleForm && activeView === 'ai-rules') {
      return (
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 font-medium">Library</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-500 font-medium">AI Rules</span>
            <span className="text-gray-300">/</span>
            {editingAIRule ? (
              <>
                <span className="text-gray-500 font-medium">{editingAIRule.name}</span>
                <span className="text-gray-300">/</span>
                <span className="font-semibold text-gray-900">Edit</span>
              </>
            ) : (
              <span className="font-semibold text-gray-900">New AI Rule</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowAIRuleForm(false);
                setEditingAIRule(null);
                setAiruleDraft(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            {editingAIRule ? (
              <Button
                size="sm"
                className="h-9 px-5 bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow transition-all rounded-lg"
                onClick={handleAIRuleSubmit}>
                Save Changes
              </Button>
            ) : (
              <Button
                size="sm"
                className="h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all rounded-lg"
                onClick={handleAIRuleSubmit}>
                Create AI Rule
              </Button>
            )}
          </div>
        </header>);
    }

    // Custom header for Protocol form
    if (showProtocolForm && activeView === 'protocols') {
      return (
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 font-medium">Workspace</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-500 font-medium">Protocols</span>
            <span className="text-gray-300">/</span>
            {editingProtocol ? (
              <>
                <span className="text-gray-500 font-medium">{editingProtocol.name}</span>
                <span className="text-gray-300">/</span>
                <span className="font-semibold text-gray-900">Edit</span>
              </>
            ) : (
              <span className="font-semibold text-gray-900">New Protocol</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowProtocolForm(false);
                setEditingProtocol(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50">
              {userRole === 'admin' ? 'Cancel' : 'Exit'}
            </button>
            {userRole === 'admin' && (
              editingProtocol ? (
                <Button
                  size="sm"
                  className="h-9 px-5 bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow transition-all rounded-lg"
                  onClick={handleProtocolSubmit}>
                  Save Changes
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all rounded-lg"
                  onClick={handleProtocolSubmit}>
                  Create Protocol
                </Button>
              )
            )}
          </div>
        </header>
      );
    }

    // Custom header for Plan form
    if (showPlanForm && activeView === 'plans') {
      return (
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 font-medium">Library</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-500 font-medium">Plans</span>
            <span className="text-gray-300">/</span>
            {editingPlan ? (
              <>
                <span className="text-gray-500 font-medium">{editingPlan.name}</span>
                <span className="text-gray-300">/</span>
                <span className="font-semibold text-gray-900">Edit</span>
              </>
            ) : (
              <span className="font-semibold text-gray-900">New Plan</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowPlanForm(false);
                setEditingPlan(null);
                setPlanDraft(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            {editingPlan ? (
              <Button
                size="sm"
                className="h-9 px-5 bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow transition-all rounded-lg"
                onClick={handlePlanSubmit}>
                Save Changes
              </Button>
            ) : (
              <Button
                size="sm"
                className="h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all rounded-lg"
                onClick={handlePlanSubmit}>
                Create Plan
              </Button>
            )}
          </div>
        </header>
      );
    }

    // Custom header for Followup form
    if (showFollowupForm && activeView === 'followups') {
      return (
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 font-medium">Library</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-500 font-medium">Followups</span>
            <span className="text-gray-300">/</span>
            {editingFollowup ? (
              <>
                <span className="text-gray-500 font-medium">{editingFollowup.name}</span>
                <span className="text-gray-300">/</span>
                <span className="font-semibold text-gray-900">Edit</span>
              </>
            ) : (
              <span className="font-semibold text-gray-900">New Followup</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowFollowupForm(false);
                setEditingFollowup(null);
                setFollowupDraft(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            {editingFollowup ? (
              <Button
                size="sm"
                className="h-9 px-5 bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow transition-all rounded-lg"
                onClick={handleFollowupSubmit}>
                Save Changes
              </Button>
            ) : (
              <Button
                size="sm"
                className="h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all rounded-lg"
                onClick={handleFollowupSubmit}>
                Create Followup
              </Button>
            )}
          </div>
        </header>
      );
    }

    // Custom header for Knowledge Base form
    if (showKBForm && activeView === 'knowledge-base') {
      return (
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 font-medium">Library</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-500 font-medium">Knowledge Base</span>
            <span className="text-gray-300">/</span>
            {editingKB ? (
              <>
                <span className="text-gray-500 font-medium">{editingKB.name}</span>
                <span className="text-gray-300">/</span>
                <span className="font-semibold text-gray-900">Edit</span>
              </>
            ) : (
              <span className="font-semibold text-gray-900">New Resource</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowKBForm(false);
                setEditingKB(null);
                setKbDraft(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            {editingKB ? (
              <Button
                size="sm"
                className="h-9 px-5 bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow transition-all rounded-lg"
                onClick={handleKBSubmit}>
                Save Changes
              </Button>
            ) : (
              <Button
                size="sm"
                className="h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all rounded-lg"
                onClick={handleKBSubmit}>
                Add to Library
              </Button>
            )}
          </div>
        </header>
      );
    }

    // Custom header for OTC List form
    if (showOTCListForm && activeView === 'otc-lists') {
      return (
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 font-medium">OTC</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-500 font-medium">OTC Lists</span>
            <span className="text-gray-300">/</span>
            {editingOTCList ? (
              <>
                <span className="text-gray-500 font-medium">{editingOTCList.name}</span>
                <span className="text-gray-300">/</span>
                <span className="font-semibold text-gray-900">Edit</span>
              </>
            ) : (
              <span className="font-semibold text-gray-900">New OTC List</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowOTCListForm(false);
                setEditingOTCList(null);
                setOtcListDraft(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            {editingOTCList ? (
              <Button
                size="sm"
                className="h-9 px-5 bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow transition-all rounded-lg"
                onClick={handleOTCListSubmit}>
                Save Changes
              </Button>
            ) : (
              <Button
                size="sm"
                className="h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all rounded-lg"
                onClick={handleOTCListSubmit}>
                Create OTC List
              </Button>
            )}
          </div>
        </header>
      );
    }

    // Default Header
    return (
      <Header
        title={pageInfo.title}
        breadcrumb={pageInfo.breadcrumb}
        userRole={userRole}
        setUserRole={setUserRole}
        showAdminToggle={activeView !== 'dashboard'}
      />
    );
  };

  return (
    <div className="flex h-screen bg-white font-sans text-gray-900 antialiased">
      {/* Sidebar Navigation - Always visible */}
      <Sidebar
        activeView={activeView}
        setActiveView={(view) => {
          setActiveView(view);
          setShowCompanionForm(false); // Close form when navigating
          setEditingCompanion(null);
          setShowProtocolForm(false);
          setEditingProtocol(null);
        }}
        userRole={userRole}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        language={language}
        setLanguage={setLanguage} />


      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${sidebarCollapsed ? 'ml-16' : 'ml-56'}`}>

        {renderHeader()}

        <main
          className={`flex-1 min-h-0 bg-white ${showCompanionForm || showProtocolForm ? 'overflow-hidden' : 'overflow-y-auto p-6'}`}>

          <div className={showCompanionForm || showProtocolForm ? 'h-full' : 'max-w-screen-3xl mx-auto'}>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}