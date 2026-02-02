import React, { useState } from 'react';
import {
  Filter,
  X,
  ArrowUpDown,
  MessageSquare,
  Heart,
  FileText } from
'lucide-react';
interface Protocol {
  id: string;
  name: string;
  category: string;
  status: 'Active' | 'Review' | 'Draft';
  enrolled: number;
  duration: string;
  createdOn: string;
}
const protocols: Protocol[] = [
{
  id: 'PRT-0001',
  name: 'Post-Op Knee Recovery',
  category: 'Orthopedics',
  status: 'Active',
  enrolled: 45,
  duration: '6 weeks',
  createdOn: '02-02-2026 08:00:00'
},
{
  id: 'PRT-0002',
  name: 'Type 2 Diabetes Management',
  category: 'Chronic Care',
  status: 'Active',
  enrolled: 128,
  duration: 'Ongoing',
  createdOn: '01-02-2026 12:30:22'
},
{
  id: 'PRT-0003',
  name: 'Anxiety CBT Module 1',
  category: 'Mental Health',
  status: 'Review',
  enrolled: 32,
  duration: '4 weeks',
  createdOn: '30-01-2026 15:45:00'
},
{
  id: 'PRT-0004',
  name: 'Hypertension Monitoring',
  category: 'Cardiology',
  status: 'Draft',
  enrolled: 0,
  duration: '12 weeks',
  createdOn: '28-01-2026 10:15:10'
},
{
  id: 'PRT-0005',
  name: 'Prenatal Care - Trimester 1',
  category: 'Obstetrics',
  status: 'Active',
  enrolled: 67,
  duration: '12 weeks',
  createdOn: '25-01-2026 09:00:55'
}];

export function Protocols() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filterActive, setFilterActive] = useState(false);
  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
    prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };
  const toggleAll = () => {
    setSelectedRows((prev) =>
    prev.length === protocols.length ? [] : protocols.map((p) => p.id)
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
                  checked={selectedRows.length === protocols.length}
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
                Name
              </th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">
                Category
              </th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">
                Enrolled
              </th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">
                Duration
              </th>
              <th className="py-3 px-3 text-right text-sm font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody>
            {protocols.map((protocol) =>
            <tr
              key={protocol.id}
              className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group">

                <td className="py-3 px-3">
                  <input
                  type="checkbox"
                  checked={selectedRows.includes(protocol.id)}
                  onChange={() => toggleRow(protocol.id)}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500" />

                </td>
                <td className="py-3 px-3">
                  <span className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                    {protocol.id}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-gray-100 flex items-center justify-center">
                      <FileText size={14} className="text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-900">
                      {protocol.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className="text-sm text-gray-600">
                    {protocol.category}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${protocol.status === 'Active' ? 'bg-green-50 text-green-700' : protocol.status === 'Review' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>

                    {protocol.status}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-sm text-gray-600">
                    {protocol.enrolled}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-sm text-gray-600">
                    {protocol.duration}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center justify-end gap-3 text-gray-400">
                    <span className="text-xs text-gray-400">
                      {protocol.createdOn}
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
    </div>);

}