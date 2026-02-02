import React, { useState } from 'react';
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
import { CompanionForm } from './pages/workspace/CompanionForm';
import { AIRuleForm } from './pages/library/AIRuleForm';
import { Button } from './components/ui/Button';
export function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [userRole, setUserRole] = useState<'admin' | 'clinic'>('clinic');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCompanionForm, setShowCompanionForm] = useState(false);
  const [editingCompanion, setEditingCompanion] = useState<any>(null);
  const [showAIRuleForm, setShowAIRuleForm] = useState(false);
  const [editingAIRule, setEditingAIRule] = useState<any>(null);
  
  const handleAddClick = () => {
    if (activeView === 'companions') {
      setShowCompanionForm(true);
    } else if (activeView === 'ai-rules') {
      setShowAIRuleForm(true);
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
        return <Protocols />;
      case 'all-patients':
        return <PatientList />;
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
        return <Plans />;
      case 'followups':
        return <Followups />;
      case 'health-assistant':
        return <HealthAssistant />;
      case 'conversations':
        return <Conversations />;
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
    
    return (
      <Header
        title={pageInfo.title}
        breadcrumb={pageInfo.breadcrumb}
        userRole={userRole}
        setUserRole={setUserRole}
        onAddClick={handleAddClick}
        showAdminToggle={activeView !== 'dashboard'}
        showAddButton={activeView === 'companions' || activeView === 'ai-rules'}
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
        }}
        userRole={userRole}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed} />


      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${sidebarCollapsed ? 'ml-16' : 'ml-56'}`}>

        {renderHeader()}

        <main
          className={`flex-1 min-h-0 bg-white ${showCompanionForm ? 'overflow-hidden' : 'overflow-y-auto p-6'}`}>

          <div className={showCompanionForm ? 'h-full' : 'max-w-screen-3xl mx-auto'}>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>);

}