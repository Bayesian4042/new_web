import { useEffect, useState } from 'react';
import {
  CreditCard,
  FileText,
  Settings,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  MessageSquare,
  Activity,
  ChevronDown,
  Download,
  RefreshCw,
  Sparkles,
  X,
} from 'lucide-react';
import {
  BillingAccount,
  BillingPlan,
  COUNTRIES,
  calcEstimatedInvoice,
  calcExtraActivePatients,
  calcExtraPatients,
  calcExtraSms,
  daysRemaining,
  daysUntil,
  formatEur,
  getPlanById,
  mockBillingAccounts,
} from './billingData';
import { Progress } from '../../components/ui/Progress';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { SubscribeWizard } from './SubscribeWizard';

// The clinic-facing billing page uses CLN-004 (no plan) as default for demo
const DEFAULT_CLINIC_ID = 'CLN-004';

// ─── Status Badge ─────────────────────────────────────────────────────────────

function BillingStatusBadge({ status }: { status: BillingAccount['billingStatus'] }) {
  if (status === 'current') return <Badge variant="success">Current</Badge>;
  if (status === 'payment_failed')
    return <Badge className="bg-red-100 text-red-700 border-transparent">Payment Failed</Badge>;
  if (status === 'whitelist')
    return <Badge className="bg-purple-100 text-purple-700 border-transparent">Whitelist</Badge>;
  return <Badge variant="secondary">Inactive</Badge>;
}

// ─── Invoice Status Badge ─────────────────────────────────────────────────────

function InvoiceStatusBadge({ status }: { status: string }) {
  if (status === 'paid') return <Badge variant="success">Paid</Badge>;
  if (status === 'failed')
    return <Badge className="bg-red-100 text-red-700 border-transparent">Failed</Badge>;
  if (status === 'upcoming')
    return <Badge className="bg-blue-100 text-blue-700 border-transparent">Upcoming</Badge>;
  return <Badge variant="warning">Pending</Badge>;
}

// ─── Usage Meter ──────────────────────────────────────────────────────────────

function UsageMeter({
  label,
  used,
  limit,
  icon,
  unit = '',
  note,
}: {
  label: string;
  used: number;
  limit: number;
  icon: React.ReactNode;
  unit?: string;
  note?: string;
}) {
  const pct = limit > 0 ? (used / limit) * 100 : 0;
  const isOver = used > limit;
  const isWarning = pct >= 80 && !isOver;
  const variant = isOver ? 'danger' : isWarning ? 'warning' : 'success';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <span className="text-gray-500">{icon}</span>
          {label}
        </div>
        {isOver && (
          <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
            <AlertTriangle size={11} />
            Overage
          </span>
        )}
      </div>

      <Progress value={Math.min(used, limit)} max={limit} variant={variant} />

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          <span className={`font-bold text-sm ${isOver ? 'text-red-600' : 'text-gray-900'}`}>
            {used.toLocaleString()}
          </span>{' '}
          / {limit.toLocaleString()} {unit}
        </span>
        {isOver && (
          <span className="text-red-600 font-medium">+{(used - limit).toLocaleString()} over</span>
        )}
        {!isOver && (
          <span className="text-gray-400">{(limit - used).toLocaleString()} remaining</span>
        )}
      </div>

      {note && <p className="text-xs text-gray-400 italic">{note}</p>}
    </div>
  );
}

// ─── Invoice Row ──────────────────────────────────────────────────────────────

function InvoiceRow({
  invoice,
  showBreakdown,
  onToggle,
}: {
  invoice: ReturnType<typeof mockBillingAccounts>['CLN-001']['invoices'][0];
  showBreakdown: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3 text-sm font-mono text-gray-600">{invoice.invoiceNumber}</td>
        <td className="px-4 py-3 text-sm text-gray-600">
          {new Date(invoice.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </td>
        <td className="px-4 py-3 text-sm text-gray-500">
          {new Date(invoice.periodStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          {' – '}
          {new Date(invoice.periodEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </td>
        <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatEur(invoice.total)}</td>
        <td className="px-4 py-3">
          <InvoiceStatusBadge status={invoice.status} />
        </td>
        <td className="px-4 py-3">
          <button
            onClick={onToggle}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Breakdown
            <ChevronDown
              size={12}
              className={`transition-transform ${showBreakdown ? 'rotate-180' : ''}`}
            />
          </button>
        </td>
      </tr>
      {showBreakdown && (
        <tr className="bg-blue-50/50">
          <td colSpan={6} className="px-4 py-3">
            <div className="grid grid-cols-4 gap-3 text-xs">
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <p className="text-gray-500 uppercase tracking-wide font-medium mb-1">Base Fee</p>
                <p className="text-gray-900 font-bold">{formatEur(invoice.baseFee)}</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <p className="text-gray-500 uppercase tracking-wide font-medium mb-1">Extra Patients</p>
                <p className={`font-bold ${invoice.extraPatientsCharge > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                  {formatEur(invoice.extraPatientsCharge)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <p className="text-gray-500 uppercase tracking-wide font-medium mb-1">Extra SMS</p>
                <p className={`font-bold ${invoice.extraSmsCharge > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                  {formatEur(invoice.extraSmsCharge)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <p className="text-gray-500 uppercase tracking-wide font-medium mb-1">Extra Active Patients</p>
                <p className={`font-bold ${invoice.extraActivePatientsCharge > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                  {formatEur(invoice.extraActivePatientsCharge)}
                </p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ account, plan }: { account: BillingAccount; plan: BillingPlan }) {
  const estimate = calcEstimatedInvoice(account.usage, plan);
  const cycleEnd = account.usage.billingCycleEnd;
  const daysLeft = daysRemaining(cycleEnd);
  const commitmentDays = daysUntil(account.commitmentEndDate);
  const isInCommitment = commitmentDays > 0;

  return (
    <div className="space-y-6">
      {/* Billing status alert (payment failed) */}
      {account.billingStatus === 'payment_failed' && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertTriangle size={18} className="text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-red-700">Payment Failed</p>
            <p className="text-xs text-red-600 mt-0.5">
              Your last payment could not be processed. Please update your payment method to avoid
              service interruption.
            </p>
          </div>
          <Button variant="outline" className="ml-auto shrink-0 text-xs border-red-200 text-red-700 hover:bg-red-100">
            Update Payment
          </Button>
        </div>
      )}

      {/* Top row: Plan card + Cycle card */}
      <div className="grid grid-cols-2 gap-4">
        {/* Current plan */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">Current Plan</p>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-gray-900">{plan.name}</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                {plan.patientCreationAllowance} patients / month
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-indigo-600">{formatEur(plan.monthlyFee)}</p>
              <p className="text-xs text-gray-400">per month</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-3 text-xs text-gray-500">
            <div>
              <p className="font-medium text-gray-700">{plan.patientCreationAllowance}</p>
              <p>Patient allowance</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">{plan.smsAllowance}</p>
              <p>Base SMS</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">{formatEur(plan.extraPatientPrice)}</p>
              <p>Per extra patient</p>
            </div>
          </div>
        </div>

        {/* Billing cycle + commitment */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Billing Cycle</p>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Calendar size={18} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(account.usage.billingCycleStart).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                –{' '}
                {new Date(account.usage.billingCycleEnd).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{daysLeft} days remaining in cycle</p>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div className="flex items-start gap-3">
            <div
              className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                isInCommitment ? 'bg-amber-50' : 'bg-green-50'
              }`}
            >
              {isInCommitment ? (
                <Lock size={18} className="text-amber-600" />
              ) : (
                <CheckCircle2 size={18} className="text-green-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {isInCommitment ? 'Commitment Period Active' : 'Commitment Period Complete'}
              </p>
              {isInCommitment ? (
                <p className="text-xs text-amber-600 mt-0.5">
                  {commitmentDays} days until{' '}
                  {new Date(account.commitmentEndDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              ) : (
                <p className="text-xs text-green-600 mt-0.5">You can cancel at any time</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Usage meters */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
          Usage This Cycle
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <UsageMeter
            label="Patients Activated"
            used={account.usage.patientsActivatedThisCycle}
            limit={plan.patientCreationAllowance}
            icon={<Users size={14} />}
            unit="patients"
            note={`Extra charge: ${formatEur(plan.extraPatientPrice)} per patient over limit`}
          />
          <UsageMeter
            label="SMS Sent"
            used={account.usage.smsSentThisCycle}
            limit={account.usage.smsAllowance}
            icon={<MessageSquare size={14} />}
            unit="SMS"
            note={`Your SMS allowance: ${account.usage.smsAllowance} (base + activations)`}
          />
          <UsageMeter
            label="Active Patients"
            used={account.usage.activePatientsCurrentCount}
            limit={account.usage.activePatientLimit}
            icon={<Activity size={14} />}
            unit="active"
            note={`${formatEur(plan.extraActivePatientPrice)}/month per extra active patient`}
          />
        </div>
      </div>

      {/* Estimated invoice */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
            Estimated Invoice (End of Cycle)
          </h3>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={11} />
            Based on current usage
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Base plan fee ({plan.name})</span>
            <span className="font-medium text-gray-900">{formatEur(estimate.baseFee)}</span>
          </div>
          {estimate.extraPatientsCharge > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-orange-600">
                Extra patients ({calcExtraPatients(account.usage, plan)} × {formatEur(plan.extraPatientPrice)})
              </span>
              <span className="font-medium text-orange-600">
                +{formatEur(estimate.extraPatientsCharge)}
              </span>
            </div>
          )}
          {estimate.extraSmsCharge > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-orange-600">
                Extra SMS ({calcExtraSms(account.usage)} × {formatEur(plan.extraSmsPrice)})
              </span>
              <span className="font-medium text-orange-600">
                +{formatEur(estimate.extraSmsCharge)}
              </span>
            </div>
          )}
          {estimate.extraActivePatientsCharge > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-orange-600">
                Extra active patients ({calcExtraActivePatients(account.usage)} × {formatEur(plan.extraActivePatientPrice)})
              </span>
              <span className="font-medium text-orange-600">
                +{formatEur(estimate.extraActivePatientsCharge)}
              </span>
            </div>
          )}
          <div className="pt-2 mt-2 border-t border-gray-100 flex justify-between">
            <span className="text-sm font-bold text-gray-900">Estimated Total</span>
            <span className="text-lg font-black text-indigo-600">{formatEur(estimate.total)}</span>
          </div>
        </div>
        {estimate.total === estimate.baseFee && (
          <p className="mt-3 text-xs text-green-600 flex items-center gap-1.5">
            <CheckCircle2 size={12} />
            No overages this cycle — you're within all plan limits
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Invoices Tab ─────────────────────────────────────────────────────────────

function InvoicesTab({ account }: { account: BillingAccount }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = [...account.invoices].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sorted.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <FileText size={40} className="text-gray-300 mx-auto mb-3" />
        <p className="text-sm font-medium text-gray-500">No invoices yet</p>
        <p className="text-xs text-gray-400 mt-1">
          Your first invoice will appear here after your first billing cycle.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Invoice History</h3>
        <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors">
          <Download size={13} />
          Export CSV
        </button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">
              Invoice #
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">
              Period
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">
              Amount
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">
              Status
            </th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((inv) => (
            <InvoiceRow
              key={inv.id}
              invoice={inv}
              showBreakdown={expandedId === inv.id}
              onToggle={() => setExpandedId(expandedId === inv.id ? null : inv.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Payment Settings Tab ─────────────────────────────────────────────────────

function PaymentSettingsTab({ account }: { account: BillingAccount }) {
  const [billingEmail, setBillingEmail] = useState(account.billingEmail);
  const [line1, setLine1] = useState(account.billingAddress.line1);
  const [city, setCity] = useState(account.billingAddress.city);
  const [postalCode, setPostalCode] = useState(account.billingAddress.postalCode);
  const [country, setCountry] = useState(account.billingAddress.country);
  const [taxId, setTaxId] = useState(account.taxId || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const cardBrandIcon = (brand: string) => {
    if (brand === 'visa') return '💳';
    if (brand === 'mastercard') return '💳';
    return '💳';
  };

  return (
    <div className="space-y-6">
      {/* Payment method */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">
          Payment Method
        </h3>
        {account.paymentMethod ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-16 rounded-lg bg-gray-900 flex items-center justify-center">
                <span className="text-white text-xs font-bold uppercase">
                  {account.paymentMethod.brand}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {cardBrandIcon(account.paymentMethod.brand)} ···· ···· ····{' '}
                  {account.paymentMethod.last4}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Expires {account.paymentMethod.expMonth}/{account.paymentMethod.expYear}
                </p>
              </div>
            </div>
            <Button variant="outline" className="text-sm">
              <RefreshCw size={13} className="mr-1.5" />
              Update Card
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle size={18} className="text-amber-500" />
              <p className="text-sm text-amber-700">No payment method on file</p>
            </div>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white text-sm">
              <CreditCard size={13} className="mr-1.5" />
              Add Payment Method
            </Button>
          </div>
        )}
      </div>

      {/* Billing details form */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">
          Billing Details
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Billing Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={billingEmail}
              onChange={(e) => setBillingEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="billing@clinic.com"
            />
            <p className="text-xs text-gray-400 mt-1">Invoices and payment receipts will be sent here</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Address Line 1 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">City <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Postal Code</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="10001"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Country <span className="text-red-500">*</span></label>
              <div className="relative">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white cursor-pointer"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Tax ID <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="e.g. DE123456789"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {saved ? (
                <>
                  <CheckCircle2 size={14} className="mr-1.5" />
                  Saved
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
            {saved && (
              <span className="text-sm text-green-600 font-medium">Changes saved successfully</span>
            )}
          </div>
        </div>
      </div>

      {/* Stripe customer info */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Settings size={14} className="text-gray-400" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Stripe Account</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-gray-400 mb-0.5">Customer ID</p>
            <p className="font-mono text-gray-700">
              {account.stripeCustomerId ?? <span className="italic text-gray-400">Not created yet</span>}
            </p>
          </div>
          <div>
            <p className="text-gray-400 mb-0.5">Subscription ID</p>
            <p className="font-mono text-gray-700">
              {account.stripeSubscriptionId ?? <span className="italic text-gray-400">Not created yet</span>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── No Plan Empty State ──────────────────────────────────────────────────────

function NoPlanEmptyState({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Billing</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your subscription, usage and invoices</p>
      </div>

      {/* Hero empty state card */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-10 flex flex-col items-center text-center space-y-5">
        <div className="h-16 w-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg">
          <Sparkles size={28} className="text-white" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900">No active subscription</h2>
          <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
            Choose a plan to activate patient billing, SMS usage tracking, and invoice visibility
            for your clinic.
          </p>
        </div>

        <Button
          onClick={onGetStarted}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 text-sm font-bold shadow-md hover:shadow-lg transition-all"
        >
          Get Started — Choose a Plan
        </Button>

        <p className="text-xs text-gray-400">
          Setup is free · 6-month commitment · No hidden fees
        </p>
      </div>
    </div>
  );
}

function ActivationChoiceModal({
  onClose,
  onMakePayment,
  onChoosePlan,
}: {
  onClose: () => void;
  onMakePayment: () => void;
  onChoosePlan: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-black text-gray-900">Activate Billing</h3>
            <p className="text-sm text-gray-500 mt-1">
              Choose how you want to continue.
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-2">
          <button
            onClick={onMakePayment}
            className="w-full text-left rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 hover:bg-blue-100 transition-colors"
          >
            <p className="text-sm font-bold text-blue-900">Make Payment</p>
            <p className="text-xs text-blue-700 mt-0.5">Go directly to payment and complete activation.</p>
          </button>

          <button
            onClick={onChoosePlan}
            className="w-full text-left rounded-xl border border-gray-200 bg-white px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <p className="text-sm font-bold text-gray-900">Choose Plan</p>
            <p className="text-xs text-gray-600 mt-0.5">Compare plans first, then proceed to payment.</p>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type TabId = 'overview' | 'invoices' | 'payment';

export function BillingOverview() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [showWizard, setShowWizard] = useState(false);
  const [showActivationChoice, setShowActivationChoice] = useState(false);
  const [hasAutoOpenedChoice, setHasAutoOpenedChoice] = useState(false);
  const [wizardInitialStep, setWizardInitialStep] = useState<1 | 3>(1);
  const [account, setAccount] = useState<BillingAccount>(
    () => mockBillingAccounts[DEFAULT_CLINIC_ID]
  );

  const isNoPlan = account.billingStatus === 'no_plan';
  const plan = account.planId ? getPlanById(account.planId) : undefined;

  useEffect(() => {
    if (isNoPlan && !showWizard && !hasAutoOpenedChoice) {
      setShowActivationChoice(true);
      setHasAutoOpenedChoice(true);
    }
  }, [isNoPlan, showWizard, hasAutoOpenedChoice]);

  // Show wizard when clinic clicks "Get Started"
  if (isNoPlan && showWizard) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Billing</h1>
          <p className="text-sm text-gray-500 mt-0.5">Subscribe to activate your clinic</p>
        </div>
        <SubscribeWizard
          clinicId={account.clinicId}
          prefillEmail={account.billingEmail}
          initialStep={wizardInitialStep}
          onComplete={(newAccount) => {
            setAccount(newAccount);
            setShowWizard(false);
          }}
        />
      </div>
    );
  }

  // Show empty state when no plan
  if (isNoPlan) {
    return (
      <>
        <NoPlanEmptyState onGetStarted={() => setShowActivationChoice(true)} />
        {showActivationChoice && (
          <ActivationChoiceModal
            onClose={() => setShowActivationChoice(false)}
            onMakePayment={() => {
              setWizardInitialStep(3);
              setShowActivationChoice(false);
              setShowWizard(true);
            }}
            onChoosePlan={() => {
              setWizardInitialStep(1);
              setShowActivationChoice(false);
              setShowWizard(true);
            }}
          />
        )}
      </>
    );
  }

  // Normal billing view (plan active)
  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Activity size={14} /> },
    { id: 'invoices', label: 'Invoices', icon: <FileText size={14} /> },
    { id: 'payment', label: 'Payment Settings', icon: <CreditCard size={14} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Billing</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your subscription, usage and invoices</p>
        </div>
        <BillingStatusBadge status={account.billingStatus} />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && plan && <OverviewTab account={account} plan={plan} />}
      {activeTab === 'invoices' && <InvoicesTab account={account} />}
      {activeTab === 'payment' && <PaymentSettingsTab account={account} />}
    </div>
  );
}
