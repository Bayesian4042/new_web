import { useMemo, useState } from 'react';
import { Search, ChevronDown, Download } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Progress } from '../../components/ui/Progress';
import { mockClinics, type Clinic } from '../setup/Clinics';
import {
  BILLING_PLANS,
  calcEstimatedInvoice,
  formatEur,
  getPlanById,
  mockBillingAccounts,
} from './billingData';

type AdminStatus =
  | 'Draft'
  | 'Pending'
  | 'Active'
  | 'Past Due'
  | 'Suspended'
  | 'Cancelled'
  | 'Archived'
  | 'Whitelist';
type PlanType = 'Volume' | 'License' | 'Service' | 'Whitelist';
type SortKey =
  | 'clinicName'
  | 'plan'
  | 'planType'
  | 'monthlyFee'
  | 'patients'
  | 'status'
  | 'nextInvoiceDate'
  | 'lastPaymentDate';

interface RowData {
  clinic: Clinic;
  planName: string;
  planType: PlanType;
  monthlyFee: number;
  patientsUsed: number;
  patientsLimit: number;
  patientUsagePercent: number;
  status: AdminStatus;
  nextInvoiceDate: string | null;
  lastPaymentDate: string | null;
  lastPaymentStatus: 'paid' | 'failed' | 'pending' | null;
  projectedOverage: number;
}

const STATUS_OPTIONS: AdminStatus[] = [
  'Draft',
  'Pending',
  'Active',
  'Past Due',
  'Suspended',
  'Cancelled',
  'Archived',
  'Whitelist',
];

const PLAN_TYPE_OPTIONS: PlanType[] = ['Volume', 'License', 'Service', 'Whitelist'];

const mapBillingStatusToAdminStatus = (billingStatus?: string, whitelistFlag?: boolean): AdminStatus => {
  if (whitelistFlag) return 'Whitelist';
  if (billingStatus === 'draft') return 'Draft';
  if (billingStatus === 'pending' || billingStatus === 'no_plan') return 'Pending';
  if (billingStatus === 'current') return 'Active';
  if (billingStatus === 'payment_failed' || billingStatus === 'past_due') return 'Past Due';
  if (billingStatus === 'suspended') return 'Suspended';
  if (billingStatus === 'cancelled' || billingStatus === 'inactive') return 'Cancelled';
  if (billingStatus === 'archived') return 'Archived';
  return 'Pending';
};

const getPlanType = (planName: string, whitelistFlag?: boolean): PlanType => {
  if (whitelistFlag) return 'Whitelist';
  if (planName.toLowerCase().includes('license')) return 'License';
  if (planName.toLowerCase().includes('service')) return 'Service';
  return 'Volume';
};

const getNextInvoiceDate = (clinicId: string): string | null => {
  const account = mockBillingAccounts[clinicId];
  if (!account) return null;
  const upcoming = account.invoices.find((inv) => inv.status === 'upcoming');
  if (upcoming?.date) return upcoming.date;
  if (account.usage.billingCycleEnd) {
    const dt = new Date(account.usage.billingCycleEnd);
    dt.setDate(dt.getDate() + 1);
    return dt.toISOString().split('T')[0];
  }
  return null;
};

const getLastPayment = (clinicId: string): { date: string | null; status: 'paid' | 'failed' | 'pending' | null } => {
  const account = mockBillingAccounts[clinicId];
  if (!account) return { date: null, status: null };
  const sorted = [...account.invoices]
    .filter((inv) => inv.status !== 'upcoming')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latest = sorted[0];
  return latest ? { date: latest.date, status: latest.status } : { date: null, status: null };
};

const formatDate = (value: string | null) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const statusBadge = (status: AdminStatus) => {
  if (status === 'Draft') return <Badge className="bg-gray-100 text-gray-700 border-transparent">Draft</Badge>;
  if (status === 'Active') return <Badge variant="success">Active</Badge>;
  if (status === 'Pending') return <Badge variant="warning">Pending</Badge>;
  if (status === 'Past Due') return <Badge className="bg-red-100 text-red-700 border-transparent">Past Due</Badge>;
  if (status === 'Whitelist')
    return <Badge className="bg-purple-100 text-purple-700 border-transparent">Whitelist</Badge>;
  if (status === 'Suspended')
    return <Badge className="bg-gray-200 text-gray-700 border-transparent">Suspended</Badge>;
  if (status === 'Archived')
    return <Badge className="bg-slate-100 text-slate-700 border-transparent">Archived</Badge>;
  return <Badge variant="secondary">Cancelled</Badge>;
};

interface AdminBillingOverviewProps {
  onViewClinic: (clinic: Clinic) => void;
}

export function AdminBillingOverview({ onViewClinic }: AdminBillingOverviewProps) {
  const [search, setSearch] = useState('');
  const [statusFilters, setStatusFilters] = useState<AdminStatus[]>([]);
  const [planFilters, setPlanFilters] = useState<string[]>([]);
  const [planTypeFilters, setPlanTypeFilters] = useState<PlanType[]>([]);
  const [dateField, setDateField] = useState<'next_invoice' | 'last_payment'>('next_invoice');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('clinicName');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const rows = useMemo<RowData[]>(() => {
    return mockClinics.map((clinic) => {
      const account = mockBillingAccounts[clinic.id];
      const plan = account?.planId ? getPlanById(account.planId) : undefined;
      const planName = clinic.whitelistFlag ? 'Whitelist' : plan?.name || 'No Plan';
      const planType = getPlanType(planName, clinic.whitelistFlag);
      const monthlyFee = plan?.monthlyFee || 0;
      const patientsUsed = account?.usage.patientsActivatedThisCycle ?? 0;
      const patientsLimit = plan?.patientCreationAllowance ?? 0;
      const patientUsagePercent = patientsLimit > 0 ? Math.min(100, (patientsUsed / patientsLimit) * 100) : 0;
      const status = mapBillingStatusToAdminStatus(clinic.billingStatus, clinic.whitelistFlag);
      const nextInvoiceDate = getNextInvoiceDate(clinic.id);
      const lastPayment = getLastPayment(clinic.id);
      const projectedOverage = account && plan ? Math.max(0, calcEstimatedInvoice(account.usage, plan).total - plan.monthlyFee) : 0;

      return {
        clinic,
        planName,
        planType,
        monthlyFee,
        patientsUsed,
        patientsLimit,
        patientUsagePercent,
        status,
        nextInvoiceDate,
        lastPaymentDate: lastPayment.date,
        lastPaymentStatus: lastPayment.status,
        projectedOverage,
      };
    });
  }, []);

  const filteredRows = useMemo(() => {
    return rows
      .filter((row) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        const billingEmail = mockBillingAccounts[row.clinic.id]?.billingEmail || '';
        return (
          row.clinic.name.toLowerCase().includes(q) ||
          row.clinic.ownerEmail.toLowerCase().includes(q) ||
          billingEmail.toLowerCase().includes(q)
        );
      })
      .filter((row) => (statusFilters.length > 0 ? statusFilters.includes(row.status) : true))
      .filter((row) => (planFilters.length > 0 ? planFilters.includes(row.planName) : true))
      .filter((row) => (planTypeFilters.length > 0 ? planTypeFilters.includes(row.planType) : true))
      .filter((row) => {
        if (!dateFrom && !dateTo) return true;
        const targetDate = dateField === 'next_invoice' ? row.nextInvoiceDate : row.lastPaymentDate;
        if (!targetDate) return false;
        const d = new Date(targetDate).getTime();
        const from = dateFrom ? new Date(dateFrom).getTime() : Number.NEGATIVE_INFINITY;
        const to = dateTo ? new Date(dateTo).getTime() : Number.POSITIVE_INFINITY;
        return d >= from && d <= to;
      });
  }, [rows, search, statusFilters, planFilters, planTypeFilters, dateField, dateFrom, dateTo]);

  const sortedRows = useMemo(() => {
    const toComparable = (row: RowData) => {
      if (sortBy === 'clinicName') return row.clinic.name.toLowerCase();
      if (sortBy === 'plan') return row.planName.toLowerCase();
      if (sortBy === 'planType') return row.planType.toLowerCase();
      if (sortBy === 'monthlyFee') return row.monthlyFee;
      if (sortBy === 'patients') return row.patientUsagePercent;
      if (sortBy === 'status') return row.status.toLowerCase();
      if (sortBy === 'nextInvoiceDate') return row.nextInvoiceDate ? new Date(row.nextInvoiceDate).getTime() : 0;
      return row.lastPaymentDate ? new Date(row.lastPaymentDate).getTime() : 0;
    };

    return [...filteredRows].sort((a, b) => {
      const av = toComparable(a);
      const bv = toComparable(b);
      const result = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === 'asc' ? result : -result;
    });
  }, [filteredRows, sortBy, sortDir]);

  const metrics = useMemo(() => {
    const activePaid = rows.filter((r) => r.status === 'Active' && r.planType !== 'Whitelist');
    const totalActiveSubscriptions = activePaid.length;
    const mrr = activePaid.reduce((sum, r) => sum + r.monthlyFee, 0);
    const projectedOverages = rows.reduce((sum, r) => sum + r.projectedOverage, 0);
    const whitelistAccounts = rows.filter((r) => r.status === 'Whitelist').length;
    const pendingPlanSelections = rows.filter((r) => r.status === 'Pending').length;
    const overdueInvoices = Object.values(mockBillingAccounts).reduce((sum, account) => {
      return sum + account.invoices.filter((inv) => inv.status === 'failed').length;
    }, 0);

    const now = new Date();
    const revenueThisMonth = Object.values(mockBillingAccounts).reduce((sum, account) => {
      const paidThisMonth = account.invoices
        .filter((inv) => {
          if (inv.status !== 'paid') return false;
          const d = new Date(inv.date);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((invSum, inv) => invSum + inv.total, 0);
      return sum + paidThisMonth;
    }, 0);

    return {
      totalActiveSubscriptions,
      mrr,
      projectedOverages,
      whitelistAccounts,
      pendingPlanSelections,
      overdueInvoices,
      revenueThisMonth,
    };
  }, [rows]);

  const toggleFilter = <T,>(value: T, current: T[], set: (next: T[]) => void) => {
    if (current.includes(value)) set(current.filter((v) => v !== value));
    else set([...current, value]);
  };

  const handleSort = (nextSortBy: SortKey) => {
    if (nextSortBy === sortBy) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortBy(nextSortBy);
      setSortDir('asc');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-7 gap-3">
        <MetricCard label="Total Active Subscriptions" value={metrics.totalActiveSubscriptions.toString()} />
        <MetricCard label="MRR" value={formatEur(metrics.mrr)} />
        <MetricCard label="Projected Overages" value={formatEur(metrics.projectedOverages)} />
        <MetricCard label="Whitelist Accounts" value={metrics.whitelistAccounts.toString()} />
        <MetricCard label="Pending Plan Selections" value={metrics.pendingPlanSelections.toString()} />
        <MetricCard label="Overdue Invoices" value={metrics.overdueInvoices.toString()} />
        <MetricCard label="Revenue This Month" value={formatEur(metrics.revenueThisMonth)} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="grid grid-cols-4 gap-3">
          <div className="relative col-span-2">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clinic name or billing email"
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div className="relative">
            <select
              value={dateField}
              onChange={(e) => setDateField(e.target.value as 'next_invoice' | 'last_payment')}
              className="w-full appearance-none px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
            >
              <option value="next_invoice">Next Invoice Date</option>
              <option value="last_payment">Last Payment Date</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
        </div>

        <div className="space-y-3">
          <FilterGroup<AdminStatus>
            label="Status"
            options={STATUS_OPTIONS}
            selected={statusFilters}
            onToggle={(value) => toggleFilter(value, statusFilters, setStatusFilters)}
          />
          <FilterGroup<string>
            label="Plan"
            options={['No Plan', 'Whitelist', ...BILLING_PLANS.map((p) => p.name)]}
            selected={planFilters}
            onToggle={(value) => toggleFilter(value, planFilters, setPlanFilters)}
          />
          <FilterGroup<PlanType>
            label="Plan Type"
            options={PLAN_TYPE_OPTIONS}
            selected={planTypeFilters}
            onToggle={(value) => toggleFilter(value, planTypeFilters, setPlanTypeFilters)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">
            Showing {sortedRows.length} of {rows.length} clinics
          </p>
          <Button variant="outline" size="sm" className="text-xs">
            <Download size={12} className="mr-1.5" />
            Export CSV
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <SortableHeader label="Clinic Name" onClick={() => handleSort('clinicName')} />
                <SortableHeader label="Plan" onClick={() => handleSort('plan')} />
                <SortableHeader label="Plan Type" onClick={() => handleSort('planType')} />
                <SortableHeader label="Monthly Fee" onClick={() => handleSort('monthlyFee')} />
                <SortableHeader label="Patients This Cycle" onClick={() => handleSort('patients')} />
                <SortableHeader label="Status" onClick={() => handleSort('status')} />
                <SortableHeader label="Next Invoice Date" onClick={() => handleSort('nextInvoiceDate')} />
                <SortableHeader label="Last Payment" onClick={() => handleSort('lastPaymentDate')} />
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row) => (
                <tr
                  key={row.clinic.id}
                  className="border-b border-gray-100 hover:bg-gray-50/70 cursor-pointer"
                  onClick={() => onViewClinic(row.clinic)}
                >
                  <td className="px-3 py-3">
                    <p className="text-sm font-semibold text-blue-600">{row.clinic.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{row.clinic.ownerEmail}</p>
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-700">{row.planName}</td>
                  <td className="px-3 py-3 text-sm text-gray-700">{row.planType}</td>
                  <td className="px-3 py-3 text-sm font-semibold text-gray-900">{formatEur(row.monthlyFee)}</td>
                  <td className="px-3 py-3 min-w-[200px]">
                    <div className="space-y-1.5">
                      <div className="text-xs text-gray-600">
                        {row.patientsUsed} / {row.patientsLimit || '—'}
                      </div>
                      <Progress value={row.patientUsagePercent} max={100} variant={row.patientUsagePercent >= 100 ? 'danger' : row.patientUsagePercent >= 80 ? 'warning' : 'success'} />
                    </div>
                  </td>
                  <td className="px-3 py-3">{statusBadge(row.status)}</td>
                  <td className="px-3 py-3 text-sm text-gray-700">{formatDate(row.nextInvoiceDate)}</td>
                  <td className="px-3 py-3 text-sm text-gray-700">
                    <div>{formatDate(row.lastPaymentDate)}</div>
                    {row.lastPaymentStatus && (
                      <span className={`text-xs ${row.lastPaymentStatus === 'failed' ? 'text-red-600' : 'text-gray-500'}`}>
                        {row.lastPaymentStatus === 'paid' ? 'Paid' : row.lastPaymentStatus === 'failed' ? 'Failed' : 'Pending'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3">
      <p className="text-[11px] font-semibold text-gray-500 leading-tight">{label}</p>
      <p className="text-lg font-black text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function SortableHeader({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <th className="px-3 py-2 text-left text-[11px] font-bold text-gray-500 uppercase">
      <button onClick={onClick} className="inline-flex items-center gap-1 hover:text-gray-700 transition-colors">
        {label}
        <ChevronDown size={11} />
      </button>
    </th>
  );
}

function FilterGroup<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: T[];
  selected: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <p className="text-xs font-semibold text-gray-600 min-w-[140px] mt-1">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              onClick={() => onToggle(option)}
              className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                active
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
