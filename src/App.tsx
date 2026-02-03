import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Companions } from './pages/workspace/Companions';
import { Protocols } from './pages/workspace/Protocols';
import { PatientList } from './pages/patients/PatientList';
import { AIRules } from './pages/library/AIRules';
import { Plans } from './pages/library/Plans';
import { Followups } from './pages/library/Followups';
import { HealthAssistant } from './pages/ai-system/HealthAssistant';
import { Conversations } from './pages/ai-system/Conversations';
import { Settings } from './pages/setup/Settings';
import { Users } from './pages/setup/Users';
import { CompanionForm } from './pages/workspace/CompanionForm';
import { ProtocolForm } from './pages/workspace/ProtocolForm';
import { AIRuleForm } from './pages/library/AIRuleForm';
import { FollowupForm } from './pages/library/FollowupForm';
import { KnowledgeBase } from './pages/library/KnowledgeBase';
import { KnowledgeBaseForm } from './pages/library/KnowledgeBaseForm';
import { Button } from './components/ui/Button';
import { PlanForm } from './pages/library/PlanForm';
export function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [userRole, setUserRole] = useState<'admin' | 'clinic'>('clinic');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCompanionForm, setShowCompanionForm] = useState(false);
  const [editingCompanion, setEditingCompanion] = useState<any>(null);
  const [showProtocolForm, setShowProtocolForm] = useState(false);
  const [editingProtocol, setEditingProtocol] = useState<any>(null);
  const [showAIRuleForm, setShowAIRuleForm] = useState(false);
  const [editingAIRule, setEditingAIRule] = useState<any>(null);
  const [showFollowupForm, setShowFollowupForm] = useState(false);
  const [editingFollowup, setEditingFollowup] = useState<any>(null);
  const [showKBForm, setShowKBForm] = useState(false);
  const [editingKB, setEditingKB] = useState<any>(null);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  const handleAddClick = () => {
    if (activeView === 'companions') {
      setShowCompanionForm(true);
    } else if (activeView === 'protocols') {
      setShowProtocolForm(true);
    } else if (activeView === 'ai-rules') {
      setShowAIRuleForm(true);
    } else if (activeView === 'followups') {
      setShowFollowupForm(true);
    } else if (activeView === 'knowledge-base') {
      setShowKBForm(true);
    } else if (activeView === 'plans') {
      setShowPlanForm(true);
    }
  };
  const renderContent = () => {
    // Show companion form when active
    if (showCompanionForm && activeView === 'companions') {
      return (
        <CompanionForm
          onClose={() => {
            setShowCompanionForm(false);
            setEditingCompanion(null);
          }}
          onSave={() => {
            setShowCompanionForm(false);
            setEditingCompanion(null);
          }}
          initialData={editingCompanion} />
      );
    }

    // Show protocol form when active
    if (showProtocolForm && activeView === 'protocols') {
      return (
        <ProtocolForm
          onClose={() => {
            setShowProtocolForm(false);
            setEditingProtocol(null);
          }}
          onSave={() => {
            setShowProtocolForm(false);
            setEditingProtocol(null);
          }}
          initialData={editingProtocol} />
      );
    }

    // Show AI Rule form when active
    if (showAIRuleForm && activeView === 'ai-rules') {
      return (
        <AIRuleForm
          onClose={() => {
            setShowAIRuleForm(false);
            setEditingAIRule(null);
          }}
          initialData={editingAIRule} />
      );
    }

    // Show Followup form when active
    if (showFollowupForm && activeView === 'followups') {
      return (
        <FollowupForm
          initialData={editingFollowup} />
      );
    }

    // Show Plan form when active
    if (showPlanForm && activeView === 'plans') {
      return (
        <PlanForm
          initialData={editingPlan} />
      );
    }

    if (showKBForm && activeView === 'knowledge-base') {
      return (
        <KnowledgeBaseForm
          initialData={editingKB} />
      );
    }

    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'companions':
        return <Companions
          onEdit={(companion) => {
            setEditingCompanion(companion);
            setShowCompanionForm(true);
          }} />;
      case 'protocols':
        return <Protocols
          onEdit={(protocol) => {
            setEditingProtocol(protocol);
            setShowProtocolForm(true);
          }} />;
      case 'all-patients':
        return <PatientList onNavigateToConversations={() => setActiveView('conversations')} />;
      case 'ai-rules':
        return <AIRules
          onAddRule={() => {
            setEditingAIRule(null);
            setShowAIRuleForm(true);
          }}
          onEditRule={(rule) => {
            setEditingAIRule(rule);
            setShowAIRuleForm(true);
          }} />;
      case 'plans':
        return <Plans
          onAdd={() => setShowPlanForm(true)}
          onEdit={(plan) => {
            setEditingPlan(plan);
            setShowPlanForm(true);
          }} />;
      case 'followups':
        return <Followups
          onAddFollowup={() => {
            setEditingFollowup(null);
            setShowFollowupForm(true);
          }}
          onEditFollowup={(followup) => {
            setEditingFollowup(followup);
            setShowFollowupForm(true);
          }} />;
      case 'knowledge-base':
        return <KnowledgeBase
          onAddItem={() => {
            setEditingKB(null);
            setShowKBForm(true);
          }}
          onEditItem={(item) => {
            setEditingKB(item);
            setShowKBForm(true);
          }} />;
      case 'health-assistant':
        return <HealthAssistant />;
      case 'conversations':
        return <Conversations />;
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
      'health-assistant': {
        title: 'Health Assistant',
        breadcrumb: 'AI System'
      },
      conversations: {
        title: 'Conversations',
        breadcrumb: 'AI System'
      },
      users: {
        title: 'Team Management',
        breadcrumb: 'Setup'
      },
      settings: {
        title: 'Settings',
        breadcrumb: 'Setup'
      }
    };
    return (
      info[activeView] || {
        title: 'Home',
        breadcrumb: 'Overview'
      });

  };
  const pageInfo = getPageInfo();
  // Custom header for form view
  const renderHeader = () => {
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
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50">

              Cancel
            </button>
            {editingCompanion ? (
              <Button
                size="sm"
                className="h-9 px-5 bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow transition-all rounded-lg"
                onClick={() => {
                  setShowCompanionForm(false);
                  setEditingCompanion(null);
                }}>

                Save Changes
              </Button>
            ) : (
              <Button
                size="sm"
                className="h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all rounded-lg"
                onClick={() => {
                  setShowCompanionForm(false);
                  setEditingCompanion(null);
                }}>

                Create Companion
              </Button>
            )}
          </div>
        </header>);

    }

    // Custom header for protocol form view
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

              Cancel
            </button>
            {editingProtocol ? (
              <Button
                size="sm"
                className="h-9 px-5 bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow transition-all rounded-lg"
                onClick={() => {
                  setShowProtocolForm(false);
                  setEditingProtocol(null);
                }}>

                Save Changes
              </Button>
            ) : (
              <Button
                size="sm"
                className="h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all rounded-lg"
                onClick={() => {
                  setShowProtocolForm(false);
                  setEditingProtocol(null);
                }}>

                Create Protocol
              </Button>
            )}
          </div>
        </header>);

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
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            {editingAIRule ? (
              <Button
                size="sm"
                className="h-9 px-5 bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow transition-all rounded-lg"
                onClick={() => {
                  setShowAIRuleForm(false);
                  setEditingAIRule(null);
                }}>
                Save Changes
              </Button>
            ) : (
              <Button
                size="sm"
                className="h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all rounded-lg"
                onClick={() => {
                  setShowAIRuleForm(false);
                  setEditingAIRule(null);
                }}>
                Create AI Rule
              </Button>
            )}
          </div>
        </header>);

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
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            {editingFollowup ? (
              <Button
                size="sm"
                className="h-9 px-5 bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow transition-all rounded-lg"
                onClick={() => {
                  setShowFollowupForm(false);
                  setEditingFollowup(null);
                }}>
                Save Changes
              </Button>
            ) : (
              <Button
                size="sm"
                className="h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all rounded-lg"
                onClick={() => {
                  setShowFollowupForm(false);
                  setEditingFollowup(null);
                }}>
                Create Followup
              </Button>
            )}
          </div>
        </header>);

    }

    // Custom header for KB form
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
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            {editingKB ? (
              <Button
                size="sm"
                className="h-9 px-5 bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow transition-all rounded-lg"
                onClick={() => {
                  setShowKBForm(false);
                  setEditingKB(null);
                }}>
                Save Changes
              </Button>
            ) : (
              <Button
                size="sm"
                className="h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all rounded-lg"
                onClick={() => {
                  setShowKBForm(false);
                  setEditingKB(null);
                }}>
                Add to Library
              </Button>
            )}
          </div>
        </header>);

    }

    // Custom header for Plans form
    if (showPlanForm && activeView === 'plans') {
      return (
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 font-medium">Library</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-500 font-medium">Treatment Plans</span>
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
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            {editingPlan ? (
              <Button
                size="sm"
                className="h-9 px-5 bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow transition-all rounded-lg"
                onClick={() => {
                  setShowPlanForm(false);
                  setEditingPlan(null);
                }}>
                Save Changes
              </Button>
            ) : (
              <Button
                size="sm"
                className="h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all rounded-lg"
                onClick={() => {
                  setShowPlanForm(false);
                  setEditingPlan(null);
                }}>
                Add to Library
              </Button>
            )}
          </div>
        </header>);
    }

    return (
      <Header
        title={pageInfo.title}
        breadcrumb={pageInfo.breadcrumb}
        userRole={userRole}
        setUserRole={setUserRole}
        onAddClick={handleAddClick}
        showAdminToggle={activeView !== 'dashboard'}
        showAddButton={activeView === 'companions' || activeView === 'protocols' || activeView === 'ai-rules' || activeView === 'followups' || activeView === 'knowledge-base' || activeView === 'plans'}
      />);


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
    </div>);

}