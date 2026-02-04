import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  Building2,
  Bell,
  BookOpen,
  Store,
  Plus,
  Trash2,
  Globe,
  Smartphone,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Circle,
  MessageSquare,
  ChevronDown
} from 'lucide-react';

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)' },
];

export function Settings() {
  const [activeTab, setActiveTab] = useState('general');

  // General State
  const [timezone, setTimezone] = useState('America/New_York');

  // Integrations State
  const [ecommerceMode, setEcommerceMode] = useState('planstore');

  // Communications State
  const [notificationMode, setNotificationMode] = useState('both');
  const [reminders, setReminders] = useState({
    dayBefore: true,
    twoDaysBefore: true,
    threeDaysBefore: false,
    weekBefore: true
  });
  const [appointmentTemplate, setAppointmentTemplate] = useState(
    "Hi {patient_name},\n\nThis is a friendly reminder about your upcoming appointment:\n\n📅 Date: {appointment_date}\n🕐 Time: {appointment_time}\n📍 Location: {clinic_name}\n\nPlease arrive 10 minutes early to complete any necessary paperwork.\n\nIf you need to reschedule, please call us at {clinic_phone}.\n\nSee you soon!"
  );

  // Knowledge Base State
  const [sources, setSources] = useState({
    pubmed: true,
    mayo: true,
    cochrane: false,
    medline: false,
    cdc: false
  });
  const [customSources, setCustomSources] = useState([
    { id: 1, name: 'Clinic Protocols', url: 'https://clinic.com/protocols' }
  ]);

  const tabs = [
    { id: 'general', label: 'General', icon: <Building2 size={18} /> },
    { id: 'communications', label: 'Communications', icon: <Bell size={18} /> },
    { id: 'knowledge', label: 'Knowledge Base', icon: <BookOpen size={18} /> },
    { id: 'integrations', label: 'Integrations', icon: <Store size={18} /> }
  ];

  const renderIntegrations = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="text-blue-600" size={20} />
          E-commerce Connection
        </CardTitle>
        <CardDescription>
          Connect to an e-commerce store for product selection in Shopping variables
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Option 1: ThePlanStore */}
        <div
          onClick={() => setEcommerceMode('planstore')}
          className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${ecommerceMode === 'planstore' ? 'border-blue-600 bg-blue-50/30' : 'border-gray-200 hover:border-gray-300'}`}>
          <div className={`mt-0.5 ${ecommerceMode === 'planstore' ? 'text-blue-600' : 'text-gray-400'}`}>
            {ecommerceMode === 'planstore' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">ThePlanStore</span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full uppercase tracking-wide">Recommended</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Pre-configured product catalog with health supplements and wellness products</p>
          </div>
        </div>

        {/* Option 2: Shopify */}
        <div
          onClick={() => setEcommerceMode('shopify')}
          className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${ecommerceMode === 'shopify' ? 'border-blue-600 bg-blue-50/30' : 'border-gray-200 hover:border-gray-300'}`}>
          <div className={`mt-0.5 ${ecommerceMode === 'shopify' ? 'text-blue-600' : 'text-gray-400'}`}>
            {ecommerceMode === 'shopify' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">Connect Shopify Store</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Use your own Shopify store's product catalog</p>
          </div>
        </div>

        {/* Option 3: None */}
        <div
          onClick={() => setEcommerceMode('none')}
          className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${ecommerceMode === 'none' ? 'border-blue-600 bg-blue-50/30' : 'border-gray-200 hover:border-gray-300'}`}>
          <div className={`mt-0.5 ${ecommerceMode === 'none' ? 'text-blue-600' : 'text-gray-400'}`}>
             {ecommerceMode === 'none' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">No e-commerce</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Disable product selection (you can still add manual links)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCommunications = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="text-orange-600" size={20} />
            Notification Mode
          </CardTitle>
          <CardDescription>
            Choose how to deliver notifications for reminders and follow-ups
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
             <div onClick={() => setNotificationMode('app')} className="flex items-center gap-3 cursor-pointer group">
               <div className={`text-orange-600 ${notificationMode === 'app' ? 'opacity-100' : 'opacity-40 group-hover:opacity-60'}`}>
                 {notificationMode === 'app' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
               </div>
               <div>
                 <p className="text-sm font-medium text-gray-900">App Only</p>
                 <p className="text-xs text-gray-500">Push notifications via the app</p>
               </div>
             </div>
             <div onClick={() => setNotificationMode('sms')} className="flex items-center gap-3 cursor-pointer group">
               <div className={`text-orange-600 ${notificationMode === 'sms' ? 'opacity-100' : 'opacity-40 group-hover:opacity-60'}`}>
                 {notificationMode === 'sms' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
               </div>
               <div>
                 <p className="text-sm font-medium text-gray-900">SMS Only</p>
                 <p className="text-xs text-gray-500">Text messages to user's phone</p>
               </div>
             </div>
             <div onClick={() => setNotificationMode('both')} className="flex items-center gap-3 cursor-pointer group">
               <div className={`text-orange-600 ${notificationMode === 'both' ? 'opacity-100' : 'opacity-40 group-hover:opacity-60'}`}>
                 {notificationMode === 'both' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
               </div>
               <div>
                 <p className="text-sm font-medium text-gray-900">Both</p>
                 <p className="text-xs text-gray-500">App notifications and SMS</p>
               </div>
             </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="text-indigo-600" size={20} />
            Appointment Reminders
          </CardTitle>
          <CardDescription>
            Select when to send reminders before appointments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {[
              { key: 'dayBefore', label: '1 day before', sub: '24 hours prior' },
              { key: 'twoDaysBefore', label: '48 hours before', sub: '2 days prior' },
              { key: 'threeDaysBefore', label: '72 hours before', sub: '3 days prior' },
              { key: 'weekBefore', label: '1 week before', sub: '7 days prior' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.sub}</p>
                </div>
                <button
                  onClick={() => setReminders(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof reminders] }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${reminders[item.key as keyof typeof reminders] ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${reminders[item.key as keyof typeof reminders] ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>

          {/* Message Template Section */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="text-indigo-600" size={18} />
              <h4 className="text-sm font-semibold text-gray-900">Message Template</h4>
            </div>
            <textarea
              value={appointmentTemplate}
              onChange={(e) => setAppointmentTemplate(e.target.value)}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-mono resize-none"
              placeholder="Enter your appointment reminder message..."
            />
            <div className="mt-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
              <p className="text-xs font-medium text-indigo-900 mb-2">Available placeholders:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  '{patient_name}',
                  '{appointment_date}',
                  '{appointment_time}',
                  '{clinic_name}',
                  '{clinic_phone}',
                  '{doctor_name}'
                ].map(placeholder => (
                  <code key={placeholder} className="px-2 py-1 bg-white border border-indigo-200 rounded text-xs text-indigo-700">
                    {placeholder}
                  </code>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderKnowledgeBase = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="text-teal-600" size={20} />
            Fallback Sources
          </CardTitle>
          <CardDescription>
            External sources the AI can reference when it cannot find an answer in the companion's variables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Suggested Medical Sources</h4>
            <div className="space-y-3">
              {[
                { key: 'pubmed', label: 'PubMed', sub: 'Biomedical literature from MEDLINE and life science journals' },
                { key: 'mayo', label: 'Mayo Clinic', sub: 'Patient care and health information from Mayo Clinic' },
                { key: 'cochrane', label: 'Cochrane Library', sub: 'High-quality evidence for healthcare decision-making' },
                { key: 'medline', label: 'MedlinePlus', sub: 'Health information from the National Library of Medicine' },
                { key: 'cdc', label: 'CDC', sub: 'Centers for Disease Control and Prevention resources' },
              ].map(source => (
                 <div
                   key={source.key}
                   onClick={() => setSources(prev => ({ ...prev, [source.key]: !prev[source.key as keyof typeof sources] }))}
                   className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                   <div className={`flex items-center justify-center h-5 w-5 rounded border ${sources[source.key as keyof typeof sources] ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white border-gray-300'}`}>
                      {sources[source.key as keyof typeof sources] && <CheckCircle2 size={14} />}
                   </div>
                   <div>
                     <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-gray-900">{source.label}</span>
                        <ExternalLink size={12} className="text-gray-400" />
                     </div>
                     <p className="text-xs text-gray-500">{source.sub}</p>
                   </div>
                 </div>
              ))}
            </div>
          </div>

          <div>
             <h4 className="text-sm font-medium text-gray-900 mb-3">Custom Sources</h4>
             <div className="space-y-3">
                {customSources.map(source => (
                  <div key={source.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50/50">
                     <div>
                       <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-gray-900">{source.name}</span>
                       </div>
                       <p className="text-xs text-gray-500">{source.url}</p>
                     </div>
                     <button className="text-gray-400 hover:text-red-500 transition-colors">
                       <Trash2 size={16} />
                     </button>
                  </div>
                ))}
                
                <div className="flex gap-2">
                   <Input placeholder="Source name" className="flex-1" />
                   <Input placeholder="URL (e.g., example.com)" className="flex-[2]" />
                   <Button size="icon" className="shrink-0 bg-gray-900 text-white">
                      <Plus size={18} />
                   </Button>
                </div>
                <p className="text-xs text-gray-500">Add custom websites or documentation URLs for the AI to reference</p>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderGeneral = () => (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="text-purple-600" size={20} />
            Clinic Information
          </CardTitle>
          <CardDescription>
            Information the AI assistant can reference about your clinic
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name</label>
                <Input placeholder="e.g. MediCore Wellness" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <Input placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <div className="relative">
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm cursor-pointer bg-white"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Default timezone for scheduling messages and appointments</p>
              </div>
           </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="text-pink-600" size={20} />
            Branding
          </CardTitle>
          <CardDescription>
             Customize the AI assistant's appearance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">AI Assistant Halo Image URL</label>
             <Input placeholder="https://example.com/halo.png" />
             <p className="text-xs text-gray-500 mt-1">Image displayed around the AI avatar</p>
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Logo URL</label>
             <Input placeholder="https://example.com/logo.png" />
             <p className="text-xs text-gray-500 mt-1">Your clinic's logo for the chat interface</p>
           </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 mt-1">
          Configure notifications, reminders, sources, and branding
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {activeTab === 'general' && renderGeneral()}
        {activeTab === 'communications' && renderCommunications()}
        {activeTab === 'knowledge' && renderKnowledgeBase()}
        {activeTab === 'integrations' && renderIntegrations()}
      </div>
      
      {/* Save Action */}
      <div className="flex justify-end pt-6 border-t border-gray-100">
         <Button>Save Changes</Button>
      </div>
    </div>
  );
}
