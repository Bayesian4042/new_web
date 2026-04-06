import { useMemo } from 'react';
import { Zap, Search } from 'lucide-react';

type SourceItem = {
  id: string;
  name: string;
  selectedShortcuts?: string[];
};

interface ShortcutIntentsProps {
  companions: SourceItem[];
  patientCompanions: SourceItem[];
  protocols: SourceItem[];
}

const SHORTCUT_LABELS: Record<string, string> = {
  s1: 'Check Symptoms',
  s2: 'Medication Reminder',
  s3: 'Schedule Appointment',
  s4: 'Emergency Escalation',
  s5: 'Pain Assessment',
  s6: 'Diet Tracking',
  s7: 'Exercise Log',
  s8: 'Mood Check',
};

export function ShortcutIntents({
  companions,
  patientCompanions,
  protocols,
}: ShortcutIntentsProps) {
  const rows = useMemo(() => {
    const allSources = [
      ...companions.map((c) => ({ ...c, source: 'Companion' })),
      ...patientCompanions.map((c) => ({ ...c, source: 'Patient Companion' })),
      ...protocols.map((p) => ({ ...p, source: 'Protocol' })),
    ];

    const usageMap = new Map<
      string,
      { id: string; label: string; usage: number; linkedTo: Set<string>; sourceTypes: Set<string> }
    >();

    allSources.forEach((item) => {
      (item.selectedShortcuts || []).forEach((shortcutId) => {
        const existing = usageMap.get(shortcutId) || {
          id: shortcutId,
          label: SHORTCUT_LABELS[shortcutId] || shortcutId,
          usage: 0,
          linkedTo: new Set<string>(),
          sourceTypes: new Set<string>(),
        };
        existing.usage += 1;
        existing.linkedTo.add(item.name || item.id);
        existing.sourceTypes.add(item.source);
        usageMap.set(shortcutId, existing);
      });
    });

    return Array.from(usageMap.values())
      .sort((a, b) => b.usage - a.usage)
      .map((r) => ({
        ...r,
        linkedCount: r.linkedTo.size,
      }));
  }, [companions, patientCompanions, protocols]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Shortcut Intents</h1>
          <p className="text-gray-500 mt-1">Intent shortcuts currently used by companions and protocols</p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Search size={15} />
          <span className="font-medium">Total shortcuts in use:</span>
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
          {rows.length}
        </span>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {rows.length === 0 ? (
          <div className="py-20 text-center">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <Zap size={20} className="text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-500">No shortcut intents in use yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Add intent shortcuts inside Companion or Protocol forms to see them here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/40">
                  <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Intent
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Linked Items
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                          <Zap size={13} className="text-indigo-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{row.label}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-blue-600">{row.id}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-50 text-green-700 text-xs font-bold">
                        {row.usage}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {row.linkedCount} linked item{row.linkedCount !== 1 ? 's' : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
