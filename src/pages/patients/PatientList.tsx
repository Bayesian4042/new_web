import React, { useState } from 'react';
import {
  Filter,
  ArrowUpDown,
  RefreshCw,
  ChevronLeft,
  Calendar,
  Edit,
  Folder,
  Search,
  Building2,
  MoreHorizontal
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
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRows(e.target.checked ? patients.map((p) => p.id) : []);
  };

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
                <th className="p-4">Patient</th>
                <th className="p-4">Condition</th>
                <th className="p-4">Status</th>
                <th className="p-4">Clinic</th>
                <th className="p-4">Last Active</th>
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
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-gray-900">{patient.name}</div>
                      <div className="text-xs text-gray-500">{patient.id}</div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{patient.condition}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${patient.status === 'Active' ? 'bg-green-50 text-green-700' :
                        patient.status === 'Warning' ? 'bg-orange-50 text-orange-700' :
                          'bg-gray-100 text-gray-600'
                      }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Building2 size={14} className="text-gray-400" />
                      {patient.clinicName || '-'}
                    </div>
                  </td>
                  <td className="p-4 text-gray-500">{patient.lastActive}</td>
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