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
  AlertCircle,
  Plus,
  X,
  Clock,
  MapPin,
  Trash2,
  Check
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface Appointment {
  id: string;
  date: string;
  time: string;
  type: string;
  doctor: string;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

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
  appointments?: Appointment[];
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
    appointments: [
      { id: 'APT-001', date: 'Feb 20, 2026', time: '11:00 AM', type: 'Follow-up', doctor: 'Dr. Smith', location: 'Room 204', status: 'upcoming' },
      { id: 'APT-002', date: 'Mar 05, 2026', time: '2:30 PM', type: 'Blood Test', doctor: 'Dr. Johnson', location: 'Lab 1', status: 'upcoming' },
      { id: 'APT-003', date: 'Jan 15, 2026', time: '10:00 AM', type: 'Checkup', doctor: 'Dr. Smith', location: 'Room 204', status: 'completed' },
    ],
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
    appointments: [
      { id: 'APT-004', date: 'Feb 18, 2026', time: '9:00 AM', type: 'BP Monitoring', doctor: 'Dr. Lee', location: 'Room 105', status: 'upcoming' },
    ],
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
    appointments: [
      { id: 'APT-005', date: 'Feb 22, 2026', time: '3:00 PM', type: 'Therapy Session', doctor: 'Dr. Parker', location: 'Room 302', status: 'upcoming' },
    ],
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
    appointments: [],
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
    appointments: [
      { id: 'APT-006', date: 'Feb 25, 2026', time: '10:30 AM', type: 'Physical Therapy', doctor: 'Dr. Adams', location: 'Therapy Room', status: 'upcoming' },
      { id: 'APT-007', date: 'Jan 20, 2026', time: '11:00 AM', type: 'X-Ray', doctor: 'Dr. Adams', location: 'Radiology', status: 'completed' },
    ],
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
  
  // Appointment modal state
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    date: '',
    time: '',
    type: '',
    doctor: '',
    location: ''
  });

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

  const openEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setAppointmentForm({
      date: appointment.date,
      time: appointment.time,
      type: appointment.type,
      doctor: appointment.doctor,
      location: appointment.location
    });
    setShowAppointmentModal(true);
  };

  const openNewAppointment = () => {
    setEditingAppointment(null);
    setAppointmentForm({
      date: '',
      time: '',
      type: '',
      doctor: '',
      location: ''
    });
    setShowAppointmentModal(true);
  };

  const handleSaveAppointment = () => {
    // In real app, this would save to backend
    console.log('Saving appointment:', appointmentForm, editingAppointment);
    setShowAppointmentModal(false);
    setEditingAppointment(null);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    // In real app, this would update backend
    console.log('Cancelling appointment:', appointmentId);
  };

  const renderAppointmentModal = () => {
    if (!showAppointmentModal) return null;
    
    return (
      <>
        <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowAppointmentModal(false)} />
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {editingAppointment ? 'Edit Appointment' : 'New Appointment'}
              </h2>
              <p className="text-sm text-gray-500">
                {editingAppointment ? 'Update appointment details' : 'Schedule a new appointment'}
              </p>
            </div>
            <button
              onClick={() => setShowAppointmentModal(false)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="text"
                value={appointmentForm.date}
                onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})}
                placeholder="Feb 20, 2026"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="text"
                value={appointmentForm.time}
                onChange={(e) => setAppointmentForm({...appointmentForm, time: e.target.value})}
                placeholder="11:00 AM"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <input
                type="text"
                value={appointmentForm.type}
                onChange={(e) => setAppointmentForm({...appointmentForm, type: e.target.value})}
                placeholder="Follow-up, Checkup, etc."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
              <input
                type="text"
                value={appointmentForm.doctor}
                onChange={(e) => setAppointmentForm({...appointmentForm, doctor: e.target.value})}
                placeholder="Dr. Smith"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={appointmentForm.location}
                onChange={(e) => setAppointmentForm({...appointmentForm, location: e.target.value})}
                placeholder="Room 204"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            {editingAppointment && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleCancelAppointment(editingAppointment.id);
                  setShowAppointmentModal(false);
                }}
                className="text-red-600 border-red-200 hover:bg-red-50">
                <Trash2 size={14} className="mr-1" />
                Cancel Appointment
              </Button>
            )}
            <div className={`flex items-center gap-2 ${!editingAppointment ? 'ml-auto' : ''}`}>
              <Button variant="outline" size="sm" onClick={() => setShowAppointmentModal(false)}>
                Close
              </Button>
              <Button size="sm" onClick={handleSaveAppointment}>
                <Check size={14} className="mr-1" />
                {editingAppointment ? 'Update' : 'Schedule'}
              </Button>
            </div>
          </div>
        </div>
      </>
    );
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Active Care */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Active Care</h3>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <Plus size={12} />
              Add
            </button>
          </div>
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
              <div className="flex flex-col items-center justify-center py-4 border border-dashed border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-colors group cursor-pointer">
                <Zap size={20} className="text-gray-300 mb-2 group-hover:text-blue-500 transition-colors" />
                <p className="text-xs text-gray-400 mb-2">No protocol assigned</p>
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <Plus size={12} />
                  Assign Protocol
                </button>
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
              <div className="flex flex-col items-center justify-center py-4 border border-dashed border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50/30 transition-colors group cursor-pointer">
                <UserIcon size={20} className="text-gray-300 mb-2 group-hover:text-purple-500 transition-colors" />
                <p className="text-xs text-gray-400 mb-2">No companion assigned</p>
                <button className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                  <Plus size={12} />
                  Assign Companion
                </button>
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