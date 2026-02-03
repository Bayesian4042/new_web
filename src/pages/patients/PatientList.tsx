import React, { useState } from 'react';
import {
  Folder,
  Search,
  Building2,
  MoreHorizontal,
  ChevronRight,
  User as UserIcon,
  Phone,
  MessageSquare,
  Zap,
  ArrowLeft,
  Calendar,
  Edit,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export interface Patient {
  id: string;
  name: string;
  condition: string;
  status: 'Active' | 'Warning' | 'Inactive';
  lastActive: string;
  createdOn: string;
  phone?: string;
  clinicName?: string;
  protocol?: { id: string; name: string };
  companion?: { id: string; name: string };
  recentConversations?: {
    id: string;
    date: string;
    lastMessage: string;
    sentiment: 'happy' | 'neutral' | 'anxious' | 'sad';
  }[];
}

const patients: Patient[] = [
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
  initialPatientId?: string | null;
}

export function PatientList({ onNavigateToConversations, userRole, initialPatientId }: PatientListProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(() => {
    if (initialPatientId) {
      return patients.find(p => p.id === initialPatientId) || null;
    }
    return null;
  });
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
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRows(e.target.checked ? patients.map((p) => p.id) : []);
  };

  const renderPatientDetail = (patient: Patient) => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedPatient(null)}
            className="rounded-xl border border-gray-200"
          >
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{patient.name}</h1>
            <p className="text-gray-500 mt-1">User details and overview</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl font-bold text-gray-600 px-6"
            onClick={() => setSelectedPatient(null)}
          >
            Back
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold px-8 flex items-center gap-2">
            <Edit size={16} />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Contact Information</h3>
          <div className="space-y-5">
            <div className="flex items-center gap-4 text-gray-600">
              <div className="h-10 w-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Phone</p>
                <p className="text-sm font-bold text-gray-900">{patient.phone || 'No phone'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="h-10 w-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Next Appointment</p>
                <p className="text-sm font-bold text-gray-900">Feb 20, 2026 11:00 AM</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="h-10 w-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                <Building2 size={18} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Clinic</p>
                <p className="text-sm font-bold text-gray-900">{patient.clinicName || 'Unassigned'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Context */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Context</h3>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <p className="text-sm font-bold text-gray-900">{patient.condition}</p>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Regular checkup patient. Currently monitoring daily vitals and adherence to treatment plan.
            </p>
          </div>
        </div>

        {/* Active Care */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Active Care</h3>
          <div className="space-y-3">
            {patient.protocol ? (
              <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/50">
                    <Zap size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{patient.protocol.name}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Protocol</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            ) : (
              <div className="text-center py-4 border border-dashed border-gray-200 rounded-xl">
                <p className="text-xs text-gray-400">No protocol assigned</p>
              </div>
            )}

            {patient.companion ? (
              <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100/50">
                    <UserIcon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{patient.companion.name}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Companion</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            ) : (
              <div className="text-center py-4 border border-dashed border-gray-200 rounded-xl">
                <p className="text-xs text-gray-400">No companion assigned</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Conversations Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="text-gray-400" size={20} />
            <h3 className="text-lg font-bold text-gray-900">Recent Conversations</h3>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold">
              {patient.recentConversations?.length || 0}
            </span>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {patient.recentConversations && patient.recentConversations.length > 0 ? (
            patient.recentConversations.map((conv, idx) => (
              <div
                key={idx}
                onClick={() => onNavigateToConversations?.(conv.id)}
                className="group flex items-center justify-between p-4 bg-gray-50/30 border border-gray-100 rounded-2xl cursor-pointer hover:bg-white hover:border-blue-100 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${conv.sentiment === 'anxious' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                    conv.sentiment === 'happy' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      'bg-blue-50 text-blue-600 border border-blue-100'
                    }`}>
                    {conv.sentiment === 'anxious' ? <AlertCircle size={20} /> : <MessageSquare size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{conv.lastMessage}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{patient.name}</span>
                      <span className="text-gray-300 text-xs">•</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{conv.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${conv.sentiment === 'happy' ? 'bg-emerald-50 text-emerald-700' :
                    conv.sentiment === 'anxious' ? 'bg-orange-50 text-orange-700' :
                      'bg-blue-50 text-blue-700'
                    }`}>
                    {conv.sentiment.toUpperCase()}
                  </span>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <MessageSquare size={32} className="mx-auto text-gray-200 mb-3" />
              <p className="text-sm text-gray-400 font-medium">No recent conversations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (selectedPatient) {
    return renderPatientDetail(selectedPatient);
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex items-center gap-4 py-2 border-b border-gray-100">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {userRole === 'admin' && (
          <select
            value={selectedClinic}
            onChange={(e) => setSelectedClinic(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Clinics</option>
            {clinics.map(clinic => (
              <option key={clinic} value={clinic as string}>{clinic as string}</option>
            ))}
          </select>
        )}

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Warning">Warning</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
              <tr>
                <th className="p-4 w-4">
                  <input
                    type="checkbox"
                    checked={filteredPatients.length > 0 && selectedRows.length === filteredPatients.length}
                    onChange={toggleAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="p-4">ID</th>
                <th className="p-4">Patient</th>
                <th className="p-4">Condition</th>
                <th className="p-4">Status</th>
                <th className="p-4">Clinic</th>
                <th className="p-4 text-center">Last Active</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(patient.id)}
                      onClick={(e) => toggleRow(patient.id, e)}
                      onChange={() => { }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="text-blue-600 font-bold hover:underline cursor-pointer">{patient.id}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                        <UserIcon size={16} />
                      </div>
                      <div className="font-bold text-gray-900">{patient.name}</div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 font-medium">{patient.condition}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${patient.status === 'Active' ? 'bg-green-50 text-green-700' :
                      patient.status === 'Warning' ? 'bg-orange-50 text-orange-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-gray-50 flex items-center justify-center">
                        <Folder size={12} className="text-gray-400" />
                      </div>
                      <span className="text-xs font-bold text-gray-500">{patient.clinicName || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="text-gray-900 font-bold text-sm leading-none">{patient.lastActive}</div>
                    {patient.recentConversations && patient.recentConversations.length > 0 && (
                      <div className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter mt-1">
                        Conversations: {patient.recentConversations.length}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Action
                      }}
                    >
                      <MoreHorizontal size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPatients.length === 0 && (
            <div className="py-12 text-center">
              <div className="h-12 w-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Search size={20} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900">No patients found</p>
              <p className="text-xs text-gray-500 mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}