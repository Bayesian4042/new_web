import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Sparkles, Users, MessageSquare, X, Mail, Phone, Shield } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Progress } from '../../components/ui/Progress';
import {
  BillingAccount,
  BillingPlan,
  calcEstimatedInvoice,
  calcExtraActivePatients,
  calcExtraPatients,
  calcExtraSms,
  formatEur,
  getPlanById,
  mockBillingAccounts,
} from './billingData';
import { SubscribeWizard } from './SubscribeWizard';

const DEFAULT_CLINIC_ID = 'CLN-001';

function BillingStatusBadge({ status }: { status: BillingAccount['billingStatus'] }) {
  if (status === 'current') return <Badge variant="success">Active</Badge>;
  if (status === 'payment_failed' || status === 'past_due')
    return <Badge className="bg-red-100 text-red-700 border-transparent">Past Due</Badge>;
  if (status === 'suspended')
    return <Badge className="bg-gray-200 text-gray-700 border-transparent">Suspended</Badge>;
  if (status === 'whitelist')
    return <Badge className="bg-purple-100 text-purple-700 border-transparent">Whitelist</Badge>;
  return <Badge variant="warning">Pending</Badge>;
}

function UsageMeter({
  label,
  used,
  limit,
  icon,
  unit,
}: {
  label: string;
  used: number;
  limit: number;
  icon: ReactNode;
  unit: string;
}) {
  const percentage = limit > 0 ? (used / limit) * 100 : 0;
  const isOver = used > limit;
  const isWarning = percentage >= 80 && !isOver;
  const variant = isOver ? 'danger' : isWarning ? 'warning' : 'success';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          {icon}
          {label}
        </p>
        {isOver && (
          <p className="text-xs font-bold text-red-600 flex items-center gap-1">
            <AlertTriangle size={12} />
            Overage
          </p>
        )}
      </div>
      <Progress value={Math.min(used, limit)} max={limit} variant={variant} />
      <div className="flex items-center justify-between text-xs">
        <p className="text-gray-500">
          <span className={`font-semibold ${isOver ? 'text-red-600' : 'text-gray-800'}`}>
            {used.toLocaleString()}
          </span>{' '}
          / {limit.toLocaleString()} {unit}
        </p>
        <p className={isOver ? 'text-red-500 font-medium' : 'text-gray-400'}>
          {isOver ? `+${(used - limit).toLocaleString()} over` : `${(limit - used).toLocaleString()} left`}
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
            <p className="text-sm text-gray-500 mt-1">Choose how you want to continue.</p>
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

function NoPlanState({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Billing</h1>
        <p className="text-sm text-gray-500 mt-0.5">Select a plan to activate usage billing</p>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-10 flex flex-col items-center text-center space-y-5">
        <div className="h-16 w-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg">
          <Sparkles size={28} className="text-white" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900">No active subscription</h2>
          <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
            Choose a plan to activate patient billing and usage tracking.
          </p>
        </div>
        <Button
          onClick={onGetStarted}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 text-sm font-bold"
        >
          Get Started — Choose a Plan
        </Button>
      </div>
    </div>
  );
}

function ContactAdminCard() {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
        <Shield size={15} className="text-blue-500" />
        Contact Admin Support
      </h3>

      <p className="text-sm text-gray-600">
        Need help with plan changes, cancellation, or billing questions? Contact GEMA Admin support.
      </p>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Mail size={14} className="text-gray-500" />
          <a href="mailto:billing@gema.ai" className="text-blue-600 hover:text-blue-700 font-medium">
            billing@gema.ai
          </a>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Phone size={14} className="text-gray-500" />
          <a href="tel:+1-415-555-0137" className="text-blue-600 hover:text-blue-700 font-medium">
            +1 (415) 555-0137
          </a>
        </div>
      </div>
    </section>
  );
}

function UsagePanel({ account, plan }: { account: BillingAccount; plan: BillingPlan }) {
  const estimate = useMemo(() => calcEstimatedInvoice(account.usage, plan), [account.usage, plan]);
  const extraPatients = calcExtraPatients(account.usage, plan);
  const extraSms = calcExtraSms(account.usage);
  const extraActive = calcExtraActivePatients(account.usage);
  const overageTotal =
    estimate.extraPatientsCharge + estimate.extraSmsCharge + estimate.extraActivePatientsCharge;
  const hasOverage = overageTotal > 0;

  return (
    <div className="space-y-5">
      <section className={`${hasOverage ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'} border rounded-xl p-4 space-y-3`}>
        <p className={`text-sm font-bold flex items-center gap-1.5 ${hasOverage ? 'text-orange-800' : 'text-green-800'}`}>
          <AlertTriangle size={14} />
          Overage Summary
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className={`bg-white border rounded-lg p-3 ${extraPatients > 0 ? 'border-orange-200' : 'border-gray-200'}`}>
            <p className={`text-[11px] uppercase tracking-wide font-semibold ${extraPatients > 0 ? 'text-orange-600' : 'text-gray-500'}`}>Extra Patients</p>
            <p className={`text-sm font-bold mt-1 ${extraPatients > 0 ? 'text-orange-900' : 'text-gray-800'}`}>{extraPatients}</p>
            <p className={`text-xs mt-0.5 ${extraPatients > 0 ? 'text-orange-700' : 'text-gray-500'}`}>{formatEur(estimate.extraPatientsCharge)}</p>
          </div>
          <div className={`bg-white border rounded-lg p-3 ${extraSms > 0 ? 'border-orange-200' : 'border-gray-200'}`}>
            <p className={`text-[11px] uppercase tracking-wide font-semibold ${extraSms > 0 ? 'text-orange-600' : 'text-gray-500'}`}>Extra SMS</p>
            <p className={`text-sm font-bold mt-1 ${extraSms > 0 ? 'text-orange-900' : 'text-gray-800'}`}>{extraSms}</p>
            <p className={`text-xs mt-0.5 ${extraSms > 0 ? 'text-orange-700' : 'text-gray-500'}`}>{formatEur(estimate.extraSmsCharge)}</p>
          </div>
          <div className={`bg-white border rounded-lg p-3 ${extraActive > 0 ? 'border-orange-200' : 'border-gray-200'}`}>
            <p className={`text-[11px] uppercase tracking-wide font-semibold ${extraActive > 0 ? 'text-orange-600' : 'text-gray-500'}`}>Extra Active</p>
            <p className={`text-sm font-bold mt-1 ${extraActive > 0 ? 'text-orange-900' : 'text-gray-800'}`}>{extraActive}</p>
            <p className={`text-xs mt-0.5 ${extraActive > 0 ? 'text-orange-700' : 'text-gray-500'}`}>{formatEur(estimate.extraActivePatientsCharge)}</p>
          </div>
        </div>
        <p className={`text-sm font-bold ${hasOverage ? 'text-orange-900' : 'text-green-800'}`}>
          Current overage charges: {formatEur(overageTotal)}
        </p>
      </section>

      <div className="grid grid-cols-3 gap-4">
        <UsageMeter
          label="Patients Activated"
          used={account.usage.patientsActivatedThisCycle}
          limit={plan.patientCreationAllowance}
          icon={<Users size={14} />}
          unit="patients"
        />
        <UsageMeter
          label="SMS Sent"
          used={account.usage.smsSentThisCycle}
          limit={account.usage.smsAllowance}
          icon={<MessageSquare size={14} />}
          unit="SMS"
        />
        <UsageMeter
          label="Active Patients"
          used={account.usage.activePatientsCurrentCount}
          limit={account.usage.activePatientLimit}
          icon={<Activity size={14} />}
          unit="active"
        />
      </div>

      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Estimated Invoice</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Base fee</span>
            <span className="font-medium text-gray-700">{formatEur(estimate.baseFee)}</span>
          </div>
          {estimate.extraPatientsCharge > 0 && (
            <div className="flex justify-between">
              <span className="text-orange-600">Extra patients ({extraPatients})</span>
              <span className="font-medium text-orange-600">+{formatEur(estimate.extraPatientsCharge)}</span>
            </div>
          )}
          {estimate.extraSmsCharge > 0 && (
            <div className="flex justify-between">
              <span className="text-orange-600">Extra SMS ({extraSms})</span>
              <span className="font-medium text-orange-600">+{formatEur(estimate.extraSmsCharge)}</span>
            </div>
          )}
          {estimate.extraActivePatientsCharge > 0 && (
            <div className="flex justify-between">
              <span className="text-orange-600">Extra active patients ({extraActive})</span>
              <span className="font-medium text-orange-600">+{formatEur(estimate.extraActivePatientsCharge)}</span>
            </div>
          )}
          <div className="pt-2 mt-2 border-t border-gray-100 flex justify-between">
            <span className="font-bold text-gray-900">Estimated Total</span>
            <span className="text-lg font-black text-indigo-600">{formatEur(estimate.total)}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

interface ClinicBillingDashboardProps {
  clinicId?: string;
}

export function ClinicBillingDashboard({ clinicId = DEFAULT_CLINIC_ID }: ClinicBillingDashboardProps) {
  const [showWizard, setShowWizard] = useState(false);
  const [showActivationChoice, setShowActivationChoice] = useState(false);
  const [hasAutoOpenedChoice, setHasAutoOpenedChoice] = useState(false);
  const [wizardInitialStep, setWizardInitialStep] = useState<1 | 2>(1);
  const [account, setAccount] = useState<BillingAccount>(
    () => mockBillingAccounts[clinicId] ?? mockBillingAccounts[DEFAULT_CLINIC_ID]
  );

  const plan = account.planId ? getPlanById(account.planId) : undefined;
  const isNoPlan = account.billingStatus === 'no_plan' || account.billingStatus === 'pending' || account.billingStatus === 'draft';

  useEffect(() => {
    if (isNoPlan && !showWizard && !hasAutoOpenedChoice) {
      setShowActivationChoice(true);
      setHasAutoOpenedChoice(true);
    }
  }, [isNoPlan, showWizard, hasAutoOpenedChoice]);

  if (showWizard) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Billing</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isNoPlan ? 'Subscribe to activate your clinic' : 'Update plan and payment details'}
          </p>
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

  if (isNoPlan) {
    return (
      <>
        <NoPlanState onGetStarted={() => setShowActivationChoice(true)} />
        <ContactAdminCard />
        {showActivationChoice && (
          <ActivationChoiceModal
            onClose={() => setShowActivationChoice(false)}
            onMakePayment={() => {
              setWizardInitialStep(2);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Billing Usage</h1>
          <p className="text-sm text-gray-500 mt-0.5">Usage and projected billing for your current cycle</p>
        </div>
        <BillingStatusBadge status={account.billingStatus} />
      </div>

      {account.billingStatus === 'payment_failed' || account.billingStatus === 'past_due' ? (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertTriangle size={18} className="text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-red-700">Payment attention required</p>
            <p className="text-xs text-red-600 mt-0.5">
              Your latest invoice is unpaid. Please contact Gema support to update billing details.
            </p>
          </div>
        </div>
      ) : null}

      {plan ? (
        <>
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Current Plan</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{plan.name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {plan.patientCreationAllowance} patients · {plan.smsAllowance} SMS · Active cap {account.usage.activePatientLimit}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-indigo-600">{formatEur(plan.monthlyFee)}</p>
                <p className="text-xs text-gray-400">per month</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
              Cycle:{' '}
              {new Date(account.usage.billingCycleStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              {' - '}
              {new Date(account.usage.billingCycleEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </section>
          <UsagePanel account={account} plan={plan} />
        </>
      ) : (
        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-700 font-medium">No active plan data available yet.</p>
        </section>
      )}

      {account.whitelistFlag ? (
        <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-xl p-4">
          <CheckCircle2 size={16} className="text-purple-600" />
          <p className="text-sm text-purple-700">
            This clinic is on whitelist mode. Usage is tracked, but invoices are not generated.
          </p>
        </div>
      ) : null}

      <ContactAdminCard />

      {showActivationChoice && (
        <ActivationChoiceModal
          onClose={() => setShowActivationChoice(false)}
          onMakePayment={() => {
            setWizardInitialStep(2);
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
    </div>
  );
}
