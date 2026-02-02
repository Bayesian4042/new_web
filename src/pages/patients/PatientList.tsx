import React, { useState } from 'react';
import {
  Filter,
  X,
  ArrowUpDown,
  MoreHorizontal,
  MessageSquare,
  Heart,
  RefreshCw,
  ChevronDown,
  List,
  Plus } from
'lucide-react';
import { Button } from '../../components/ui/Button';
interface Patient {
  id: string;
  name: string;
  condition: string;
  status: 'Active' | 'Warning' | 'Inactive';
  lastActive: string;
  createdOn: string;
}
const patients: Patient[] = [
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

              <Filter size={14} />
              Filter
            </button>
          }

          <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md border border-gray-200">
            <ArrowUpDown size={14} />
            Created On
          </button>
        </div>
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

}