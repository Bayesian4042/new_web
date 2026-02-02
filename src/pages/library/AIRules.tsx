import React, { useState } from 'react';
import {
  Filter,
  X,
  ArrowUpDown,
  MessageSquare,
  Heart,
  BrainCircuit,
  Plus } from
'lucide-react';
import { Button } from '../../components/ui/Button';

interface AIRule {
  id: string;
  name: string;
  type: 'Safety' | 'Adherence' | 'Engagement';
  status: 'Active' | 'Testing' | 'Disabled';
  triggers: number;
  lastUpdated: string;
  createdOn: string;
  content?: string;
}

interface AIRulesProps {
  onAddRule: () => void;
  onEditRule: (rule: AIRule) => void;
}

const rules: AIRule[] = [
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
  name: 'Positive Reinforcement',
  type: 'Engagement',
  status: 'Testing',
  triggers: 2,
  lastUpdated: '1w ago',
  createdOn: '20-01-2026 11:15:00',
  content: '<h2>Condition</h2><p>IF patient completes <strong>3+ daily check-ins</strong> in a week</p><h2>Actions</h2><ul><li>Send encouraging message acknowledging progress</li><li>Update progress streak counter</li><li>Offer optional wellness tip or resource</li></ul>'
},
{
  id: 'RULE-0004',
  name: 'Pain Level Alert',
  type: 'Safety',
  status: 'Active',
  triggers: 1,
  lastUpdated: '3d ago',
  createdOn: '15-01-2026 16:45:00',
  content: '<h2>Condition</h2><p>IF patient reports pain level <strong>&gt;= 8 out of 10</strong></p><h2>Actions</h2><ul><li>Ask follow-up questions about pain characteristics</li><li>Suggest immediate pain management strategies</li><li>Flag for clinical review within 2 hours</li><li>Document in patient health record</li></ul>'
},
{
  id: 'RULE-0005',
  name: 'Appointment Reminder',
  type: 'Adherence',
  status: 'Disabled',
  triggers: 2,
  lastUpdated: '2w ago',
  createdOn: '10-01-2026 10:00:00',
  content: '<h2>Condition</h2><p>IF appointment scheduled within next <strong>24 hours</strong></p><h2>Actions</h2><ul><li>Send reminder notification 1 day before</li><li>Send reminder notification 2 hours before</li><li>Include appointment details and preparation instructions</li></ul>'
}];

export function AIRules({ onAddRule, onEditRule }: AIRulesProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filterActive, setFilterActive] = useState(false);
  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
    prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };
  const toggleAll = () => {
    setSelectedRows((prev) =>
    prev.length === rules.length ? [] : rules.map((r) => r.id)
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
        
        <Button
          onClick={onAddRule}
          size="sm"
          className="bg-gray-900 hover:bg-gray-800 text-white">
          <Plus size={16} />
          Add AI Rule
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="w-10 py-3 px-3">
                <input
                  type="checkbox"
                  checked={selectedRows.length === rules.length}
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
                Type
              </th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">
                Triggers
              </th>
              <th className="py-3 px-3 text-right text-sm font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) =>
            <tr
              key={rule.id}
              onClick={() => onEditRule(rule)}
              className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group cursor-pointer">

                <td className="py-3 px-3">
                  <input
                  type="checkbox"
                  checked={selectedRows.includes(rule.id)}
                  onChange={() => toggleRow(rule.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500" />

                </td>
                <td className="py-3 px-3">
                  <span className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                    {rule.id}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-gray-100 flex items-center justify-center">
                      <BrainCircuit size={14} className="text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-900">{rule.name}</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${rule.type === 'Safety' ? 'bg-red-50 text-red-700' : rule.type === 'Adherence' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>

                    {rule.type}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${rule.status === 'Active' ? 'bg-green-50 text-green-700' : rule.status === 'Testing' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>

                    {rule.status}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-sm text-gray-600">{rule.triggers}</span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center justify-end gap-3 text-gray-400">
                    <span className="text-xs text-gray-400">
                      {rule.lastUpdated}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs hover:text-gray-600">
                        <MessageSquare size={14} />
                        <span>0</span>
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-red-500">
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