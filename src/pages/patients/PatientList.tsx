import React, { useState } from 'react';
import {
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  MessageSquare,
  Heart,
  RefreshCw,
<<<<<<< Updated upstream
  ChevronDown,
  List,
  Plus } from
'lucide-react';
=======
  Phone,
  ExternalLink,
  FileText,
  User,
  ChevronLeft,
  Calendar,
  Edit,
  Folder,
  Search,
  Building2
} from 'lucide-react';
>>>>>>> Stashed changes
import { Button } from '../../components/ui/Button';
interface Patient {
  id: string;
  name: string;
  condition: string;
  status: 'Active' | 'Warning' | 'Inactive';
  lastActive: string;
  createdOn: string;
<<<<<<< Updated upstream
=======
  phone: string;
  clinicName?: string;
  protocol?: {
    id: string;
    name: string;
  };
  companion?: {
    id: string;
    name: string;
  };
  recentConversations: {
    id: string;
    date: string;
    lastMessage: string;
    sentiment?: 'happy' | 'sad' | 'angry' | 'neutral' | 'anxious';
  }[];
>>>>>>> Stashed changes
}
const patients: Patient[] = [
<<<<<<< Updated upstream
{
  id: 'PAT-0001',
  name: 'Sarah Johnson',
  condition: 'Diabetes T2',
  status: 'Active',
  lastActive: '2h ago',
  createdOn: '02-02-2026 13:01:39'
},
{
  id: 'PAT-0002',
  name: 'Michael Chen',
  condition: 'Hypertension',
  status: 'Warning',
  lastActive: '1d ago',
  createdOn: '01-02-2026 09:15:22'
},
{
  id: 'PAT-0003',
  name: 'Emma Wilson',
  condition: 'Anxiety',
  status: 'Active',
  lastActive: '5m ago',
  createdOn: '31-01-2026 14:30:00'
},
{
  id: 'PAT-0004',
  name: 'James Rodriguez',
  condition: 'Post-Op Knee',
  status: 'Inactive',
  lastActive: '3d ago',
  createdOn: '28-01-2026 11:45:10'
},
{
  id: 'PAT-0005',
  name: 'Linda Taylor',
  condition: 'Arthritis',
  status: 'Active',
  lastActive: '4h ago',
  createdOn: '25-01-2026 16:20:55'
}];

export function PatientList() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filterActive, setFilterActive] = useState(false);
  const toggleRow = (id: string) => {
=======
  {
    id: 'PAT-0001',
    name: 'Sarah Johnson',
    condition: 'Diabetes T2',
    status: 'Active',
    lastActive: '2h ago',
    createdOn: '02-02-2026 13:01:39',
    phone: '+1 (555) 123-4567',
    clinicName: 'Main Clinic',
    protocol: { id: 'PRT-01', name: 'Standard Diabetes Care' },
    companion: { id: 'CMP-01', name: 'Sarah\'s Daily Assistant' },
    recentConversations: [
      { id: '2', date: 'Today, 10:30 AM', lastMessage: 'Blood sugar level checked.', sentiment: 'happy' },
      { id: '2', date: 'Yesterday, 4:15 PM', lastMessage: 'Meal plan updated.', sentiment: 'neutral' }
    ]
  },
  {
    id: 'PAT-0002',
    name: 'Michael Chen',
    condition: 'Hypertension',
    status: 'Warning',
    lastActive: '1d ago',
    createdOn: '01-02-2026 09:15:22',
    phone: '+1 (555) 987-6543',
    clinicName: 'North Wing',
    protocol: { id: 'PRT-02', name: 'Hypertension Protocol V2' },
    recentConversations: [
      { id: '1', date: '1d ago', lastMessage: 'High blood pressure alert.', sentiment: 'anxious' }
    ]
  },
  {
    id: 'PAT-0003',
    name: 'Emma Wilson',
    condition: 'Anxiety',
    status: 'Active',
    lastActive: '5m ago',
    createdOn: '31-01-2026 14:30:00',
    phone: '+1 (555) 456-7890',
    companion: { id: 'CMP-02', name: 'Anxiety Support AI' },
    recentConversations: [
      { id: 'CONV-04', date: '5m ago', lastMessage: 'Beginning guided breathing.', sentiment: 'sad' }
    ]
  },
  {
    id: 'PAT-0004',
    name: 'James Rodriguez',
    condition: 'Post-Op Knee',
    status: 'Inactive',
    lastActive: '3d ago',
    createdOn: '28-01-2026 11:45:10',
    phone: '+1 (555) 234-5678',
    recentConversations: []
  },
  {
    id: 'PAT-0005',
    name: 'Linda Taylor',
    condition: 'Arthritis',
    status: 'Active',
    lastActive: '4h ago',
    createdOn: '25-01-2026 16:20:55',
    phone: '+1 (555) 345-6789',
    protocol: { id: 'PRT-03', name: 'Joint Mobility Plan' },
    recentConversations: [
      { id: 'CONV-05', date: '4h ago', lastMessage: 'Daily steps goal achieved.', sentiment: 'happy' }
    ]
  }
];

interface PatientListProps {
  onNavigateToConversations?: (conversationId?: string) => void;
  userRole: 'admin' | 'clinic';
}

export function PatientList({ onNavigateToConversations, userRole }: PatientListProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filterActive, setFilterActive] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClinic, setSelectedClinic] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // get unique clinics
  const clinics = Array.from(new Set(patients.map(p => p.clinicName).filter(Boolean)));

  const filteredPatients = patients.filter(patient => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      patient.name.toLowerCase().includes(query) ||
      patient.id.toLowerCase().includes(query) ||
      (patient.clinicName && patient.clinicName.toLowerCase().includes(query))
    );
    const matchesClinic = selectedClinic === 'all' || patient.clinicName === selectedClinic;
    const matchesStatus = selectedStatus === 'all' || patient.status === selectedStatus;

    return matchesSearch && matchesClinic && matchesStatus;
  });

  const toggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
>>>>>>> Stashed changes
    setSelectedRows((prev) =>
    prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };
  const toggleAll = () => {
    setSelectedRows((prev) =>
    prev.length === patients.length ? [] : patients.map((p) => p.id)
    );
  };
  return (
    <div className="space-y-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {filterActive ?
          <button
            onClick={() => setFilterActive(false)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md border border-gray-200">

              <Filter size={14} />
              Filter
              <X size={14} className="text-gray-400 hover:text-gray-600" />
            </button> :

          <button
            onClick={() => setFilterActive(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md border border-gray-200">

<<<<<<< Updated upstream
=======
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{selectedPatient.name}</h1>
            <p className="text-sm text-gray-500 mt-1">User details and overview</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setSelectedPatient(null)}
              variant="outline"
              className="bg-white text-gray-900 font-medium h-9 px-3 text-sm shadow-sm"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 h-9 px-3 text-sm">
              <Edit size={14} className="mr-1" />
              Edit
            </Button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Contact Information */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">Contact Information</h3>
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 flex-shrink-0">
                  <Phone size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Phone</p>
                  <p className="text-sm font-semibold text-gray-900 leading-none">{selectedPatient.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 flex-shrink-0">
                  <Calendar size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Next Appointment</p>
                  <p className="text-sm font-semibold text-gray-900 leading-none">Feb 20, 2026 11:00 AM</p>
                </div>
              </div>

              {/* Clinic Information - Show for Admin or if patient has clinic */}
              {(userRole === 'admin' || selectedPatient.clinicName) && selectedPatient.clinicName && (
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 flex-shrink-0">
                    <Building2 size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Clinic</p>
                    <p className="text-sm font-semibold text-gray-900 leading-none">{selectedPatient.clinicName}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Context */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">Context</h3>
            <div className="flex-1">
              <div className="flex items-start gap-2 mb-2">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                <p className="text-sm text-gray-700 font-medium">{selectedPatient.condition}</p>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed pl-3.5 border-l-2 border-gray-100">
                Regular checkup patient. Currently monitoring daily vitals and adherence to treatment plan.
              </p>
            </div>
          </div>

          {/* Active Care */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">Active Care</h3>
            <div className="space-y-3 flex-1">
              {/* Protocol */}
              {selectedPatient.protocol ? (
                <div className="flex items-center justify-between group p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100/50">
                      <FileText size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{selectedPatient.protocol.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium">Protocol</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600">
                    <ExternalLink size={18} />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 rounded-lg border border-dashed border-gray-200 text-gray-400">
                  <FileText size={14} />
                  <span className="text-xs">No protocol assigned</span>
                </div>
              )}

              {/* Companion */}
              {selectedPatient.companion ? (
                <div className="flex items-center justify-between group p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/50">
                      <User size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{selectedPatient.companion.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium">Companion</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600">
                    <ExternalLink size={18} />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 rounded-lg border border-dashed border-gray-200 text-gray-400">
                  <User size={14} />
                  <span className="text-xs">No companion assigned</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conversations */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Recent Conversations</h3>
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-bold">{selectedPatient.recentConversations.length}</span>
          </div>

          <div className="space-y-1">
            {selectedPatient.recentConversations.length > 0 ? (
              selectedPatient.recentConversations.map((conv) => (
                <div
                  key={conv.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50/80 rounded-lg transition-colors cursor-pointer group border border-transparent hover:border-gray-100"
                  onClick={() => {
                    // Navigate to conversations page and open this specific conversation
                    if (onNavigateToConversations) {
                      onNavigateToConversations(conv.id);
                    }
                  }}
                >
                  <div className="flex items-center gap-4">
                    {conv.sentiment ? (
                      <span className={`w-28 px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-center border ${conv.sentiment === 'anxious' || conv.sentiment === 'angry' ? 'bg-red-50 text-red-700 border-red-100' :
                        conv.sentiment === 'happy' ? 'bg-green-50 text-green-700 border-green-100' :
                          'bg-gray-50 text-gray-600 border-gray-100'
                        }`}>
                        {conv.sentiment === 'anxious' || conv.sentiment === 'angry' ? 'Needs Attention' : sentimentConfig[conv.sentiment].label}
                      </span>
                    ) : (
                      <div className="w-28" />
                    )}

                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {conv.lastMessage}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {selectedPatient.name} • {conv.date}
                      </p>
                    </div>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronLeft size={16} className="text-gray-400 rotate-180" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border border-dashed border-gray-100 rounded-xl">
                <p className="text-sm text-gray-400">No conversations recorded yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    ) : (
      <div className="space-y-0 relative">
        {/* Toolbar */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder={userRole === 'admin' ? "Search patient or clinic..." : "Search patient..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64 transition-all"
              />
            </div>
            <div className="w-px h-6 bg-gray-200 mx-2" />
            <button
              onClick={() => setFilterActive(!filterActive)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-sm rounded-md border transition-all ${filterActive ? 'bg-blue-50 border-blue-200 text-blue-600' : 'text-gray-600 hover:bg-gray-50 border-gray-200'}`}>
>>>>>>> Stashed changes
              <Filter size={14} />
              Filter
            </button>
          }

          <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md border border-gray-200">
            <ArrowUpDown size={14} />
            Created On
          </button>
        </div>
<<<<<<< Updated upstream
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="w-10 py-3 px-3">
                <input
                  type="checkbox"
                  checked={selectedRows.length === patients.length}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500" />

              </th>
              <th className="py-3 px-3 text-left">
                <button className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                  ID
                  <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">
                Condition
              </th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">
                Name
              </th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="py-3 px-3 text-right text-sm font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) =>
            <tr
              key={patient.id}
              className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group">

                <td className="py-3 px-3">
                  <input
                  type="checkbox"
                  checked={selectedRows.includes(patient.id)}
                  onChange={() => toggleRow(patient.id)}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500" />

                </td>
                <td className="py-3 px-3">
                  <span className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                    {patient.id}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-sm text-gray-600">
                    {patient.condition}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-sm text-gray-900">{patient.name}</span>
                </td>
                <td className="py-3 px-3">
                  <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${patient.status === 'Active' ? 'bg-green-50 text-green-700' : patient.status === 'Warning' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>

                    {patient.status}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center justify-end gap-3 text-gray-400">
                    <span className="text-xs text-gray-400">
                      {patient.lastActive}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="flex items-center gap-1 text-xs hover:text-gray-600">
                        <MessageSquare size={14} />
                        <span>0</span>
                      </button>
                      <button className="hover:text-red-500">
                        <Heart size={14} />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Empty state hint */}
      {patients.length === 0 &&
      <div className="py-12 text-center text-gray-400">
          <p className="text-sm">No patients found</p>
        </div>
      }
    </div>);

=======

        {/* Filter Panel */}
        {filterActive && (
          <div className="bg-white border-b border-gray-200 p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-4">
              {/* Clinic Filter */}
              {userRole === 'admin' && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Filter by Clinic
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      value={selectedClinic}
                      onChange={(e) => setSelectedClinic(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                      <option value="all">All Clinics</option>
                      {clinics.map((clinic, idx) => (
                        <option key={idx} value={clinic}>{clinic}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Status Filter */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Filter by Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  <option value="all">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Warning">Warning</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Showing <span className="font-bold text-gray-900">{filteredPatients.length}</span> of <span className="font-bold text-gray-900">{patients.length}</span> patients
              </p>
              <button
                onClick={() => {
                  setSelectedClinic('all');
                  setSelectedStatus('all');
                  setSearchQuery('');
                }}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )
        }

        {/* Table */}
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="w-10 py-3 px-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === patients.length && patients.length > 0}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="py-3 px-3 text-left">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">ID</span>
                </th>
                <th className="py-3 px-3 text-left">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Patient Name</span>
                </th>
                {userRole === 'admin' && (
                  <th className="py-3 px-3 text-left">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Clinic</span>
                  </th>
                )}
                <th className="py-3 px-3 text-left">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Condition</span>
                </th>
                <th className="py-3 px-3 text-left">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</span>
                </th>
                <th className="py-3 px-3 text-right">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Last Active</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className="hover:bg-gray-50/50 transition-all cursor-pointer group">
                  <td className="py-3 px-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(patient.id)}
                      onChange={(e) => toggleRow(patient.id, e as any)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-sm font-bold text-blue-600 font-mono tracking-tight">
                      {patient.id}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.name}`}
                        className="h-8 w-8 rounded-full bg-gray-100"
                        alt=""
                      />
                      <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                        {patient.name}
                      </span>
                    </div>
                  </td>
                  {userRole === 'admin' && (
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Folder size={14} className="text-gray-400" />
                        <span className="text-sm font-medium">{patient.clinicName || 'Unassigned'}</span>
                      </div>
                    </td>
                  )}
                  <td className="py-3 px-3">
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {patient.condition}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${patient.status === 'Active' ? 'bg-green-100 text-green-700' :
                      patient.status === 'Warning' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="py-4 px-3 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-medium text-gray-600">{patient.lastActive}</span>
                      <span className="text-[10px] text-gray-400">Conversations: {patient.recentConversations.length}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state hint */}
        {
          patients.length === 0 && (
            <div className="py-24 text-center">
              <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <RefreshCw size={24} className="text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-900">No patients found</p>
              <p className="text-xs text-gray-500 mt-1">Try adjusting your filters or search terms</p>
            </div>
          )
        }
      </div >
    )
  );
>>>>>>> Stashed changes
}