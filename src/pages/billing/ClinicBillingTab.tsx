import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  Lock,
  MessageSquare,
  Send,
  Shield,
  TrendingUp,
  Users,
  Activity,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  BILLING_PLANS,
  BillingAccount,
  BillingPlan,
  calcEstimatedInvoice,
  calcExtraActivePatients,
  calcExtraPatients,
  calcExtraSms,
  daysUntil,
  formatEur,
  getPlanById,
  mockBillingAccounts,
} from './billingData';
import { Progress } from '../../components/ui/Progress';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function BillingStatusBadge({ status }: { status: BillingAccount['billingStatus'] }) {
  if (status === 'current') return <Badge variant="success">Active</Badge>;
  if (status === 'draft') return <Badge className="bg-slate-100 text-slate-700 border-transparent">Draft</Badge>;
  if (status === 'no_plan' || status === 'pending')
    return <Badge variant="warning">Pending</Badge>;
  if (status === 'payment_failed' || status === 'past_due')
    return <Badge className="bg-red-100 text-red-700 border-transparent">Past Due</Badge>;
  if (status === 'suspended')
    return <Badge className="bg-gray-200 text-gray-700 border-transparent">Suspended</Badge>;
  if (status === 'archived')
    return <Badge className="bg-slate-200 text-slate-700 border-transparent">Archived</Badge>;
  if (status === 'cancelled' || status === 'inactive')
    return <Badge variant="secondary">Cancelled</Badge>;
  if (status === 'whitelist')
    return <Badge className="bg-purple-100 text-purple-700 border-transparent">Whitelist</Badge>;
  if (status === 'payment_failed')
    return <Badge className="bg-red-100 text-red-700 border-transparent">Payment Failed</Badge>;
  return <Badge variant="secondary">Inactive</Badge>;
}

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
}: {
  label: string;
  used: number;
  limit: number;
  icon: React.ReactNode;
  unit?: string;
}) {
  const pct = limit > 0 ? (used / limit) * 100 : 0;
  const isOver = used > limit;
  const isWarning = pct >= 80 && !isOver;
  const variant = isOver ? 'danger' : isWarning ? 'warning' : 'success';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1.5 font-medium text-gray-700">
          {icon}
          {label}
        </span>
        {isOver && (
          <span className="text-red-600 font-bold flex items-center gap-0.5">
            <AlertTriangle size={10} />
            Overage
          </span>
        )}
      </div>
      <Progress value={Math.min(used, limit)} max={limit} variant={variant} />
      <div className="flex justify-between text-xs text-gray-400">
        <span>
          <span className={`font-semibold ${isOver ? 'text-red-600' : 'text-gray-700'}`}>{used.toLocaleString()}</span>
          {' / '}{limit.toLocaleString()} {unit}
        </span>
        {isOver ? (
          <span className="text-red-500 font-medium">+{(used - limit).toLocaleString()} over</span>
        ) : (
          <span>{(limit - used).toLocaleString()} left</span>
        )}
      </div>
    </div>
  );
}

// ─── Plan Change Card ─────────────────────────────────────────────────────────

function PlanManagementCard({
  account,
  onUpdate,
}: {
  account: BillingAccount;
  onUpdate: (update: Partial<BillingAccount>) => void;
}) {
  const currentPlan = account.planId ? getPlanById(account.planId) : undefined;
  const [selectedPlanId, setSelectedPlanId] = useState(account.planId || BILLING_PLANS[0].id);
  const [applied, setApplied] = useState(false);
  const selectedPlan = getPlanById(selectedPlanId);
  const hasChange = selectedPlanId !== account.planId;

  const isUpgrade = !!(selectedPlan && currentPlan &&
    selectedPlan.patientCreationAllowance > currentPlan.patientCreationAllowance);
  const isDowngrade = !!(selectedPlan && currentPlan &&
    selectedPlan.patientCreationAllowance < currentPlan.patientCreationAllowance);

  const handleApply = () => {
    onUpdate({
      planId: selectedPlanId,
      pendingPlanChange: selectedPlanId,
      billingStatus: account.billingStatus === 'no_plan' || account.billingStatus === 'draft' ? 'current' : account.billingStatus,
    });
    setApplied(true);
    setTimeout(() => setApplied(false), 2500);
  };

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
          <TrendingUp size={15} className="text-indigo-500" />
          Subscription Plan
        </h3>
        <BillingStatusBadge status={account.billingStatus} />
      </div>

      {/* Current plan */}
      <div className="flex items-center justify-between bg-indigo-50 rounded-xl p-4 border border-indigo-100">
        <div>
          <p className="text-xs text-indigo-500 font-medium uppercase tracking-wide mb-0.5">Active Plan</p>
          {currentPlan ? (
            <>
              <p className="text-xl font-black text-indigo-900">{currentPlan.name}</p>
              <p className="text-xs text-indigo-600 mt-0.5">
                {currentPlan.patientCreationAllowance} patients · {currentPlan.smsAllowance} SMS / month
              </p>
            </>
          ) : (
            <p className="text-lg font-black text-indigo-900">No Plan Assigned</p>
          )}
        </div>
        <p className="text-2xl font-black text-indigo-700">
          {formatEur(currentPlan?.monthlyFee || 0)}
          <span className="text-sm font-normal text-indigo-400">/mo</span>
        </p>
      </div>

      {account.pendingPlanChange && account.pendingPlanChange !== account.planId && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
          <Clock size={13} className="shrink-0" />
          Plan change to <strong>{getPlanById(account.pendingPlanChange)?.name}</strong> is scheduled for the next billing cycle.
        </div>
      )}

      {/* Plan selector */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Change Plan</p>
        <div className="relative">
          <select
            value={selectedPlanId}
            onChange={(e) => { setSelectedPlanId(e.target.value); setApplied(false); }}
            className="w-full appearance-none px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white cursor-pointer transition-all"
          >
            {BILLING_PLANS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {formatEur(p.monthlyFee)}/mo ({p.patientCreationAllowance} patients)
                {p.isTbdXL ? ' ⚠️ XL overage prices TBD' : ''}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Comparison when a different plan is selected */}
      {hasChange && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Plan Comparison</p>
          <div className="grid grid-cols-3 gap-3 text-xs">
            {[
              { label: 'Monthly Fee', current: formatEur(currentPlan?.monthlyFee || 0), next: formatEur(selectedPlan?.monthlyFee || 0) },
              { label: 'Patient Allowance', current: `${currentPlan?.patientCreationAllowance || 0}`, next: `${selectedPlan?.patientCreationAllowance || 0}` },
              { label: 'SMS Allowance', current: `${currentPlan?.smsAllowance || 0}`, next: `${selectedPlan?.smsAllowance || 0}` },
            ].map((row) => (
              <div key={row.label} className="bg-white rounded-lg p-3 border border-gray-100">
                <p className="text-gray-400 uppercase tracking-wide font-medium mb-1">{row.label}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500 line-through">{row.current}</span>
                  <ArrowRight size={10} className="text-gray-400" />
                  <span className={`font-bold ${isUpgrade ? 'text-green-600' : isDowngrade ? 'text-orange-600' : 'text-gray-700'}`}>
                    {row.next}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {isDowngrade && (
            <div className="flex items-start gap-2 bg-orange-50 border border-orange-200 rounded-lg p-3 text-xs text-orange-700">
              <AlertTriangle size={13} className="shrink-0 mt-0.5" />
              Downgrading will reduce patient and SMS allowances. Ensure usage is within the new plan limits before the next cycle.
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Info size={12} />
            Plan changes take effect at the start of the next billing cycle. No proration is applied.
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleApply}
          disabled={!hasChange || applied}
          className={`text-sm ${hasChange && !applied ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'opacity-40 cursor-not-allowed bg-gray-200 text-gray-500'}`}
        >
          {applied ? (
            <><CheckCircle2 size={14} className="mr-1.5" />Scheduled</>
          ) : (
            'Apply at Next Cycle'
          )}
        </Button>
        {applied && (
          <span className="text-xs text-green-600 font-medium">Change scheduled for next billing cycle</span>
        )}
      </div>
    </section>
  );
}

// ─── Whitelist Toggle ─────────────────────────────────────────────────────────

function WhitelistCard({
  account,
  onUpdate,
}: {
  account: BillingAccount;
  onUpdate: (update: Partial<BillingAccount>) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const isWhitelisted = account.whitelistFlag;

  const handleToggle = () => {
    if (!isWhitelisted) {
      // Enabling whitelist: show confirmation
      setConfirming(true);
    } else {
      // Disabling whitelist: switch back to billable
      onUpdate({
        whitelistFlag: false,
        billingStatus: 'current',
      });
    }
  };

  const handleConfirmWhitelist = () => {
    onUpdate({
      whitelistFlag: true,
      billingStatus: 'whitelist',
    });
    setConfirming(false);
  };

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
        <Shield size={15} className="text-purple-500" />
        Whitelist Status
      </h3>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-gray-900">
            {isWhitelisted ? 'This account is whitelisted (non-billable)' : 'This account is billable'}
          </p>
          <p className="text-xs text-gray-500">
            {isWhitelisted
              ? 'No invoices are generated. Stripe billing is disabled. Usage is still tracked internally.'
              : 'Account is billed monthly. Disable to mark as demo, internal, or partner account.'}
          </p>
        </div>
        {/* Toggle switch */}
        <button
          onClick={handleToggle}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
            isWhitelisted ? 'bg-purple-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
              isWhitelisted ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {isWhitelisted && (
        <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-lg p-3 text-xs text-purple-700">
          <Shield size={12} />
          Billing disabled. Stripe Customer and Subscription will not be created.
        </div>
      )}

      {confirming && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
          <div className="flex items-start gap-2">
            <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-800">Disable billing for this account?</p>
              <p className="text-xs text-amber-700 mt-1">
                This will cancel the Stripe subscription and stop all invoicing. Usage data will
                continue to be tracked. This is intended for demo, internal, or partner accounts.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleConfirmWhitelist}
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm"
            >
              Confirm — Disable Billing
            </Button>
            <Button variant="outline" onClick={() => setConfirming(false)} className="text-sm">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── Commitment Card ──────────────────────────────────────────────────────────

function CommitmentCard({ account }: { account: BillingAccount }) {
  const [showCancelFlow, setShowCancelFlow] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelConfirmText, setCancelConfirmText] = useState('');
  const commitmentDays = daysUntil(account.commitmentEndDate);
  const inCommitment = commitmentDays > 0;

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
        <Lock size={15} className="text-gray-500" />
        Commitment Period
      </h3>

      <div className="flex items-center gap-4">
        <div
          className={`h-12 w-12 rounded-xl flex items-center justify-center ${
            inCommitment ? 'bg-amber-50' : 'bg-green-50'
          }`}
        >
          {inCommitment ? (
            <Lock size={20} className="text-amber-600" />
          ) : (
            <CheckCircle2 size={20} className="text-green-600" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {inCommitment
              ? `${commitmentDays} days remaining`
              : 'Minimum commitment complete'}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {inCommitment
              ? `Commitment ends ${new Date(account.commitmentEndDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
              : 'Account can be cancelled without penalty'}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <Button
          variant="outline"
          onClick={() => setShowCancelFlow(true)}
          className="text-sm text-red-600 border-red-200 hover:bg-red-50"
        >
          Cancel Subscription
        </Button>
      </div>

      {showCancelFlow && (
        <div
          className={`rounded-xl border p-4 space-y-3 ${
            inCommitment
              ? 'bg-red-50 border-red-200'
              : 'bg-orange-50 border-orange-200'
          }`}
        >
          {inCommitment ? (
            <>
              <div className="flex items-start gap-2">
                <AlertTriangle size={15} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-800">Cannot cancel during commitment period</p>
                  <p className="text-xs text-red-700 mt-1">
                    This account has a 6-month minimum commitment ending on{' '}
                    {new Date(account.commitmentEndDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    . Early cancellation policy (block vs. penalty) is pending business decision.
                  </p>
                  <p className="text-xs text-red-500 mt-1 italic">
                    ⚠️ [AMBIGUITY] Early cancellation penalty/block not yet defined — needs product decision.
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setShowCancelFlow(false)} className="text-sm border-red-200 text-red-700">
                Dismiss
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-orange-800">Confirm cancellation?</p>
              <p className="text-xs text-orange-700">
                This will cancel the Stripe subscription at the end of the current billing period. Usage data will be retained.
              </p>
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-orange-800">
                  Cancellation Reason
                </label>
                <div className="relative">
                  <select
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full appearance-none px-3 py-2 border border-orange-200 rounded-lg bg-white text-sm text-gray-700"
                  >
                    <option value="">Select reason</option>
                    <option value="too_expensive">Too expensive</option>
                    <option value="switching_competitor">Switching to competitor</option>
                    <option value="closing_clinic">Closing clinic</option>
                    <option value="feature_gaps">Feature gaps</option>
                    <option value="low_usage">Low usage</option>
                    <option value="other">Other</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-orange-800">
                  Type <span className="font-black">CANCEL</span> to confirm
                </label>
                <input
                  type="text"
                  value={cancelConfirmText}
                  onChange={(e) => setCancelConfirmText(e.target.value)}
                  placeholder="CANCEL"
                  className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={!cancelReason || cancelConfirmText.trim() !== 'CANCEL'}
                >
                  Confirm Cancellation
                </Button>
                <Button variant="outline" onClick={() => setShowCancelFlow(false)} className="text-sm">
                  Keep Subscription
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}

// ─── Usage Summary Section ────────────────────────────────────────────────────

function UsageSummaryCard({ account, plan }: { account: BillingAccount; plan: BillingPlan }) {
  const estimate = calcEstimatedInvoice(account.usage, plan);
  const extraPatients = calcExtraPatients(account.usage, plan);
  const extraSms = calcExtraSms(account.usage);
  const extraActive = calcExtraActivePatients(account.usage);
  const hasOverages = extraPatients > 0 || extraSms > 0 || extraActive > 0;

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
          <Activity size={15} className="text-blue-500" />
          Current Cycle Usage
        </h3>
        <span className="text-xs text-gray-400">
          {new Date(account.usage.billingCycleStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          {' – '}
          {new Date(account.usage.billingCycleEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      <div className="space-y-4">
        <UsageMeter
          label="Patients Activated"
          used={account.usage.patientsActivatedThisCycle}
          limit={plan.patientCreationAllowance}
          icon={<Users size={12} />}
          unit="patients"
        />
        <UsageMeter
          label="SMS Sent"
          used={account.usage.smsSentThisCycle}
          limit={account.usage.smsAllowance}
          icon={<MessageSquare size={12} />}
          unit="SMS"
        />
        <UsageMeter
          label="Active Patients"
          used={account.usage.activePatientsCurrentCount}
          limit={account.usage.activePatientLimit}
          icon={<Activity size={12} />}
          unit="active"
        />
      </div>

      {/* Estimated invoice */}
      <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
          Estimated Invoice
        </p>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Base fee</span>
            <span className="text-gray-700 font-medium">{formatEur(estimate.baseFee)}</span>
          </div>
          {estimate.extraPatientsCharge > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-orange-600">Extra patients ({extraPatients})</span>
              <span className="text-orange-600 font-medium">+{formatEur(estimate.extraPatientsCharge)}</span>
            </div>
          )}
          {estimate.extraSmsCharge > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-orange-600">Extra SMS ({extraSms})</span>
              <span className="text-orange-600 font-medium">+{formatEur(estimate.extraSmsCharge)}</span>
            </div>
          )}
          {estimate.extraActivePatientsCharge > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-orange-600">Extra active patients ({extraActive})</span>
              <span className="text-orange-600 font-medium">+{formatEur(estimate.extraActivePatientsCharge)}</span>
            </div>
          )}
          <div className="pt-2 mt-1 border-t border-gray-200 flex justify-between">
            <span className="text-xs font-bold text-gray-700">Estimated Total</span>
            <span className={`text-sm font-black ${hasOverages ? 'text-orange-600' : 'text-gray-900'}`}>
              {formatEur(estimate.total)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PaymentFailureCard({
  account,
  onUpdate,
}: {
  account: BillingAccount;
  onUpdate: (update: Partial<BillingAccount>) => void;
}) {
  if (!(account.billingStatus === 'payment_failed' || account.billingStatus === 'past_due' || account.billingStatus === 'suspended')) {
    return null;
  }

  return (
    <section className="bg-red-50 border border-red-200 rounded-xl p-5 space-y-3">
      <div className="flex items-start gap-2">
        <AlertTriangle size={16} className="text-red-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-bold text-red-800">Payment Attention Required</p>
          <p className="text-xs text-red-700 mt-1">
            Latest invoice is unpaid. Admin can send a payment update link and move account state after contact.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white text-xs">
          <Send size={12} className="mr-1.5" />
          Send Payment Update Link
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs border-red-200 text-red-700"
          onClick={() => onUpdate({ billingStatus: 'current' })}
        >
          Mark Resolved
        </Button>
      </div>
    </section>
  );
}

// ─── Invoice History ──────────────────────────────────────────────────────────

function InvoiceHistoryCard({ account }: { account: BillingAccount }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = [...account.invoices].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sorted.length === 0) {
    return (
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Invoice History</h3>
        <p className="text-sm text-gray-400 italic">No invoices — whitelist accounts do not generate invoices.</p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Invoice History</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs">
            <Send size={12} className="mr-1.5" />
            Send Invoice
          </Button>
          <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors">
            <Download size={12} />
            Export
          </button>
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-500 uppercase">Invoice #</th>
            <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-500 uppercase">Period</th>
            <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-500 uppercase">Amount</th>
            <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
            <th className="px-4 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((inv) => (
            <>
              <tr
                key={inv.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2.5 text-xs font-mono text-gray-600">{inv.invoiceNumber}</td>
                <td className="px-4 py-2.5 text-xs text-gray-500">
                  {new Date(inv.periodStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {' – '}
                  {new Date(inv.periodEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-4 py-2.5 text-sm font-semibold text-gray-900">{formatEur(inv.total)}</td>
                <td className="px-4 py-2.5"><InvoiceStatusBadge status={inv.status} /></td>
                <td className="px-4 py-2.5">
                  <button
                    onClick={() => setExpandedId(expandedId === inv.id ? null : inv.id)}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                  >
                    Details
                    <ChevronDown size={11} className={`transition-transform ${expandedId === inv.id ? 'rotate-180' : ''}`} />
                  </button>
                </td>
              </tr>
              {expandedId === inv.id && (
                <tr key={`${inv.id}-detail`} className="bg-blue-50/40">
                  <td colSpan={5} className="px-4 py-3">
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      {[
                        { label: 'Base Fee', value: formatEur(inv.baseFee), accent: false },
                        { label: 'Extra Patients', value: formatEur(inv.extraPatientsCharge), accent: inv.extraPatientsCharge > 0 },
                        { label: 'Extra SMS', value: formatEur(inv.extraSmsCharge), accent: inv.extraSmsCharge > 0 },
                        { label: 'Extra Active Patients', value: formatEur(inv.extraActivePatientsCharge), accent: inv.extraActivePatientsCharge > 0 },
                      ].map((item) => (
                        <div key={item.label} className="bg-white rounded-lg p-2.5 border border-blue-100">
                          <p className="text-gray-400 uppercase tracking-wide font-medium mb-1 text-[10px]">{item.label}</p>
                          <p className={`font-bold ${item.accent ? 'text-orange-600' : 'text-gray-400'}`}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </section>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

interface ClinicBillingTabProps {
  clinicId: string;
}

export function ClinicBillingTab({ clinicId }: ClinicBillingTabProps) {
  const [account, setAccount] = useState<BillingAccount>(
    () => mockBillingAccounts[clinicId] ?? mockBillingAccounts['CLN-001']
  );

  const plan = account.planId ? getPlanById(account.planId) : undefined;

  const handleUpdate = (update: Partial<BillingAccount>) => {
    setAccount((prev) => ({ ...prev, ...update }));
  };

  if (account.whitelistFlag) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-xl p-4">
          <Shield size={18} className="text-purple-500 shrink-0" />
        <div>
          <p className="text-sm font-bold text-purple-800">Whitelist Account — Billing Disabled</p>
            <p className="text-xs text-purple-600 mt-0.5">
              This account does not generate invoices or Stripe charges. Usage is tracked internally only.
            </p>
          </div>
        </div>
        <WhitelistCard account={account} onUpdate={handleUpdate} />
        {plan ? (
          <UsageSummaryCard account={account} plan={plan} />
        ) : (
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm font-semibold text-gray-700">No plan assigned yet. Usage metrics will appear once billing is active.</p>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PaymentFailureCard account={account} onUpdate={handleUpdate} />
      <PlanManagementCard account={account} onUpdate={handleUpdate} />
      <WhitelistCard account={account} onUpdate={handleUpdate} />
      {plan ? (
        <UsageSummaryCard account={account} plan={plan} />
      ) : (
        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700">No plan assigned yet. Usage metrics will appear once billing is active.</p>
        </section>
      )}
      <InvoiceHistoryCard account={account} />
      <CommitmentCard account={account} />
    </div>
  );
}
