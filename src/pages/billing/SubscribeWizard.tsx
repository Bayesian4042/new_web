import { useState } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  CreditCard,
  Users,
  MessageSquare,
  Star,
  Lock,
  Calendar,
  Zap,
  Info,
  ChevronDown,
} from 'lucide-react';
import {
  BILLING_PLANS,
  BillingAccount,
  BillingPlan,
  COUNTRIES,
  formatEur,
  mockBillingAccounts,
} from './billingData';
import { Button } from '../../components/ui/Button';

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 'success';

interface WizardState {
  selectedPlanId: string;
  billingEmail: string;
  line1: string;
  city: string;
  postalCode: string;
  country: string;
  taxId: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
}

interface SubscribeWizardProps {
  clinicId: string;
  prefillEmail?: string;
  onComplete: (account: BillingAccount) => void;
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: Step }) {
  const steps = [
    { n: 1, label: 'Choose Plan' },
    { n: 2, label: 'Billing Details' },
    { n: 3, label: 'Payment' },
  ];

  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => {
        const done = typeof current === 'number' && current > s.n;
        const active = current === s.n;
        return (
          <div key={s.n} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  done
                    ? 'bg-indigo-600 text-white'
                    : active
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {done ? <CheckCircle2 size={14} /> : s.n}
              </div>
              <span
                className={`text-xs mt-1.5 font-medium whitespace-nowrap ${
                  active ? 'text-indigo-600' : done ? 'text-gray-600' : 'text-gray-400'
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-px w-16 mx-2 mb-5 transition-colors ${
                  done ? 'bg-indigo-400' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1: Choose Plan ──────────────────────────────────────────────────────

const RECOMMENDED_PLAN = 'starter';

function PlanCard({
  plan,
  selected,
  onSelect,
}: {
  plan: BillingPlan;
  selected: boolean;
  onSelect: () => void;
}) {
  const isRecommended = plan.id === RECOMMENDED_PLAN;

  return (
    <button
      onClick={onSelect}
      className={`relative w-full text-left rounded-xl border-2 p-4 transition-all ${
        selected
          ? 'border-indigo-600 bg-indigo-50/60 shadow-sm'
          : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/20'
      }`}
    >
      {isRecommended && (
        <span className="absolute -top-2.5 left-4 flex items-center gap-1 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
          <Star size={9} fill="white" />
          Recommended
        </span>
      )}

      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-base font-black text-gray-900">{plan.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{plan.patientCreationAllowance} patients / mo</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-black text-indigo-700">{formatEur(plan.monthlyFee)}</p>
          <p className="text-[10px] text-gray-400">/month</p>
        </div>
      </div>

      <div className="space-y-1.5 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <Users size={11} className="text-indigo-400 shrink-0" />
          <span>{plan.patientCreationAllowance} patient activations / cycle</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare size={11} className="text-indigo-400 shrink-0" />
          <span>{plan.smsAllowance} SMS included</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap size={11} className="text-indigo-400 shrink-0" />
          <span>
            {formatEur(plan.extraPatientPrice)} / extra patient
            {plan.isTbdXL && <span className="text-amber-500 ml-1">(TBD)</span>}
          </span>
        </div>
      </div>

      {selected && (
        <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center">
          <CheckCircle2 size={12} className="text-white" />
        </div>
      )}
    </button>
  );
}

function Step1ChoosePlan({
  selectedPlanId,
  onSelect,
  onNext,
}: {
  selectedPlanId: string;
  onSelect: (id: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Choose your plan</h2>
        <p className="text-sm text-gray-500 mt-1">
          All plans include a 6-month minimum commitment. Setup is free.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {BILLING_PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            selected={selectedPlanId === plan.id}
            onSelect={() => onSelect(plan.id)}
          />
        ))}
      </div>

      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
        <Info size={13} className="shrink-0" />
        Usage beyond your plan allowances (patients, SMS, active patients) is billed at per-unit
        overage rates at the end of each cycle.
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={onNext}
          disabled={!selectedPlanId}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
        >
          Continue
          <ChevronRight size={15} className="ml-1.5" />
        </Button>
      </div>
    </div>
  );
}

// ─── Step 2: Billing Details ──────────────────────────────────────────────────

function Step2BillingDetails({
  state,
  onChange,
  onNext,
  onBack,
}: {
  state: WizardState;
  onChange: (patch: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const plan = BILLING_PLANS.find((p) => p.id === state.selectedPlanId)!;
  const canContinue = state.billingEmail && state.line1 && state.city && state.country;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Billing details</h2>
        <p className="text-sm text-gray-500 mt-1">
          This information will appear on your invoices.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Form */}
        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Billing Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={state.billingEmail}
              onChange={(e) => onChange({ billingEmail: e.target.value })}
              placeholder="billing@yourclinic.com"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            <p className="text-xs text-gray-400 mt-1">Invoices and receipts will be sent here</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={state.line1}
              onChange={(e) => onChange({ line1: e.target.value })}
              placeholder="123 Clinic Street"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">City <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={state.city}
                onChange={(e) => onChange({ city: e.target.value })}
                placeholder="City"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Postal Code</label>
              <input
                type="text"
                value={state.postalCode}
                onChange={(e) => onChange({ postalCode: e.target.value })}
                placeholder="10001"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Country <span className="text-red-500">*</span></label>
              <div className="relative">
                <select
                  value={state.country}
                  onChange={(e) => onChange({ country: e.target.value })}
                  className="w-full appearance-none px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white cursor-pointer transition-all"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
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
              value={state.taxId}
              onChange={(e) => onChange({ taxId: e.target.value })}
              placeholder="e.g. DE123456789"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Order summary */}
        <div className="w-64 shrink-0">
          <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-4 space-y-4 sticky top-0">
            <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide">Order Summary</p>
            <div>
              <p className="text-lg font-black text-indigo-900">{plan.name} Plan</p>
              <p className="text-2xl font-black text-indigo-700 mt-1">
                {formatEur(plan.monthlyFee)}
                <span className="text-sm font-normal text-indigo-400">/mo</span>
              </p>
            </div>
            <div className="space-y-2 text-xs text-indigo-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-indigo-500" />
                {plan.patientCreationAllowance} patient activations
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-indigo-500" />
                {plan.smsAllowance} SMS included
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-indigo-500" />
                Usage-based overages billed monthly
              </div>
            </div>
            <div className="border-t border-indigo-200 pt-3 flex items-start gap-2 text-xs text-indigo-600">
              <Lock size={11} className="shrink-0 mt-0.5" />
              6-month minimum commitment. No setup fee.
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-600">
        <Lock size={13} className="text-gray-400 shrink-0" />
        By continuing you agree to a <strong className="text-gray-800">6-month minimum commitment</strong> starting
        today. Early cancellation policy is subject to platform terms.
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft size={14} className="mr-1.5" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!canContinue}
          className={`px-6 ${canContinue ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'opacity-40 cursor-not-allowed bg-gray-200 text-gray-500'}`}
        >
          Continue
          <ChevronRight size={15} className="ml-1.5" />
        </Button>
      </div>
    </div>
  );
}

// ─── Card number formatter ────────────────────────────────────────────────────

function formatCardNumber(val: string) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
  return digits;
}

function detectBrand(val: string): string | null {
  const n = val.replace(/\s/g, '');
  if (n.startsWith('4')) return 'visa';
  if (n.startsWith('5')) return 'mastercard';
  if (n.startsWith('3')) return 'amex';
  return null;
}

// ─── Step 3: Payment Method ───────────────────────────────────────────────────

function Step3Payment({
  state,
  onChange,
  onSubmit,
  onBack,
  loading,
}: {
  state: WizardState;
  onChange: (patch: Partial<WizardState>) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
}) {
  const plan = BILLING_PLANS.find((p) => p.id === state.selectedPlanId)!;
  const brand = detectBrand(state.cardNumber);

  // Commitment end date = 6 months from today
  const commitmentEnd = new Date('2026-03-24');
  commitmentEnd.setMonth(commitmentEnd.getMonth() + 6);

  const canSubmit =
    state.cardNumber.replace(/\s/g, '').length === 16 &&
    state.cardExpiry.length >= 4 &&
    state.cardCvc.length >= 3 &&
    state.cardName.trim().length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Payment method</h2>
        <p className="text-sm text-gray-500 mt-1">
          Your card will be charged {formatEur(plan.monthlyFee)} on the 1st of each month.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Card form */}
        <div className="flex-1 space-y-4">
          {/* Card number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Card Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={state.cardNumber}
                onChange={(e) => onChange({ cardNumber: formatCardNumber(e.target.value) })}
                placeholder="1234 5678 9012 3456"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all pr-14"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {brand === 'visa' && (
                  <span className="text-[10px] font-black bg-blue-700 text-white px-1.5 py-0.5 rounded">VISA</span>
                )}
                {brand === 'mastercard' && (
                  <span className="text-[10px] font-black bg-red-600 text-white px-1.5 py-0.5 rounded">MC</span>
                )}
                {brand === 'amex' && (
                  <span className="text-[10px] font-black bg-green-700 text-white px-1.5 py-0.5 rounded">AMEX</span>
                )}
                {!brand && <CreditCard size={16} className="text-gray-300" />}
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Cardholder Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={state.cardName}
              onChange={(e) => onChange({ cardName: e.target.value })}
              placeholder="Dr. Jane Smith"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Expiry + CVC */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Expiry <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={state.cardExpiry}
                onChange={(e) => onChange({ cardExpiry: formatExpiry(e.target.value) })}
                placeholder="MM / YY"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                CVC <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={state.cardCvc}
                onChange={(e) => onChange({ cardCvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                placeholder="123"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-lg p-3 border border-gray-100">
            <Lock size={11} className="shrink-0" />
            This is a prototype. No real payment data is collected or transmitted.
          </div>
        </div>

        {/* Summary sidebar */}
        <div className="w-64 shrink-0 space-y-3">
          <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-4 space-y-3">
            <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide">Order Summary</p>
            <div>
              <p className="text-base font-black text-indigo-900">{plan.name} Plan</p>
              <p className="text-2xl font-black text-indigo-700">
                {formatEur(plan.monthlyFee)}
                <span className="text-sm font-normal text-indigo-400">/mo</span>
              </p>
            </div>
            <div className="border-t border-indigo-200 pt-3 space-y-2 text-xs text-indigo-700">
              <div className="flex items-center justify-between">
                <span className="text-indigo-500">First charge</span>
                <span className="font-semibold">Today</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-indigo-500">Next charge</span>
                <span className="font-semibold">Apr 1, 2026</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-3 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={12} className="text-amber-500 shrink-0" />
              <span>
                Commitment until{' '}
                <strong className="text-gray-800">
                  {commitmentEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Lock size={12} className="text-gray-400 shrink-0" />
              <span>Cancel any time after commitment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack} disabled={loading}>
          <ArrowLeft size={14} className="mr-1.5" />
          Back
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!canSubmit || loading}
          className={`px-8 text-sm font-bold ${
            canSubmit && !loading
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'opacity-40 cursor-not-allowed bg-gray-200 text-gray-500'
          }`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Processing...
            </span>
          ) : (
            <>
              <Lock size={13} className="mr-1.5" />
              Subscribe Now — {formatEur(plan.monthlyFee)}/mo
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────

function SuccessScreen({
  plan,
  onDone,
}: {
  plan: BillingPlan;
  onDone: () => void;
}) {
  const commitmentEnd = new Date('2026-03-24');
  commitmentEnd.setMonth(commitmentEnd.getMonth() + 6);

  return (
    <div className="flex flex-col items-center text-center py-8 space-y-6">
      {/* Animated checkmark */}
      <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center ring-8 ring-green-50">
        <CheckCircle2 size={40} className="text-green-500" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-black text-gray-900">You're subscribed!</h2>
        <p className="text-gray-500 text-sm max-w-sm">
          Welcome to the <strong className="text-gray-800">{plan.name} plan</strong>. Your account is now
          active and ready to use.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-lg">
        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 text-left">
          <p className="text-xs text-indigo-500 font-medium uppercase tracking-wide mb-1">Plan</p>
          <p className="text-base font-black text-indigo-900">{plan.name}</p>
          <p className="text-xs text-indigo-600">{formatEur(plan.monthlyFee)}/month</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-100 text-left">
          <p className="text-xs text-green-500 font-medium uppercase tracking-wide mb-1">Next Invoice</p>
          <p className="text-base font-black text-green-900">Apr 1, 2026</p>
          <p className="text-xs text-green-600">Billed monthly</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-left">
          <p className="text-xs text-amber-500 font-medium uppercase tracking-wide mb-1">Commitment</p>
          <p className="text-base font-black text-amber-900">
            {commitmentEnd.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </p>
          <p className="text-xs text-amber-600">6-month minimum</p>
        </div>
      </div>

      {/* What's included */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 w-full max-w-lg text-left">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">What's included</p>
        <div className="space-y-2">
          {[
            `${plan.patientCreationAllowance} patient activations per cycle`,
            `${plan.smsAllowance} SMS messages included`,
            `${formatEur(plan.extraPatientPrice)} per extra patient`,
            `${formatEur(plan.extraSmsPrice)} per extra SMS`,
            `${formatEur(plan.extraActivePatientPrice)} per extra active patient`,
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle2 size={13} className="text-green-500 shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={onDone}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 text-sm font-bold"
      >
        Go to Billing Overview
        <ChevronRight size={15} className="ml-1.5" />
      </Button>
    </div>
  );
}

// ─── Main Wizard Component ────────────────────────────────────────────────────

export function SubscribeWizard({ clinicId, prefillEmail = '', onComplete }: SubscribeWizardProps) {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [wizardState, setWizardState] = useState<WizardState>({
    selectedPlanId: RECOMMENDED_PLAN,
    billingEmail: prefillEmail,
    line1: '',
    city: '',
    postalCode: '',
    country: 'US',
    taxId: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
  });

  const patch = (update: Partial<WizardState>) =>
    setWizardState((prev) => ({ ...prev, ...update }));

  const selectedPlan = BILLING_PLANS.find((p) => p.id === wizardState.selectedPlanId)!;

  const handleSubmit = () => {
    setLoading(true);
    // Simulate async processing
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 1800);
  };

  const handleDone = () => {
    // Build a fully-activated BillingAccount from wizard data
    const commitmentEnd = new Date('2026-03-24');
    commitmentEnd.setMonth(commitmentEnd.getMonth() + 6);

    const [expMonthStr, expYearStr] = wizardState.cardExpiry.replace(/\s/g, '').split('/');
    const brand = detectBrand(wizardState.cardNumber) ?? 'visa';

    const newAccount: BillingAccount = {
      ...mockBillingAccounts[clinicId],
      planId: wizardState.selectedPlanId,
      billingStatus: 'current',
      stripeCustomerId: `cus_mock_${clinicId.toLowerCase()}`,
      stripeSubscriptionId: `sub_mock_${clinicId.toLowerCase()}`,
      billingEmail: wizardState.billingEmail,
      billingAddress: {
        line1: wizardState.line1,
        city: wizardState.city,
        postalCode: wizardState.postalCode,
        country: wizardState.country,
      },
      taxId: wizardState.taxId || null,
      commitmentEndDate: commitmentEnd.toISOString().split('T')[0],
      paymentMethod: {
        brand,
        last4: wizardState.cardNumber.replace(/\s/g, '').slice(-4),
        expMonth: parseInt(expMonthStr ?? '12', 10),
        expYear: parseInt(`20${(expYearStr ?? '27').slice(-2)}`, 10),
        stripePaymentMethodId: `pm_mock_new`,
      },
      usage: {
        patientsActivatedThisCycle: 0,
        smsAllowance: selectedPlan.smsAllowance,
        smsSentThisCycle: 0,
        activePatientsCurrentCount: 0,
        activePatientLimit: selectedPlan.patientCreationAllowance,
        billingCycleStart: '2026-03-24',
        billingCycleEnd: '2026-03-31',
      },
      invoices: [],
      pendingPlanChange: null,
    };

    onComplete(newAccount);
  };

  return (
    <div className="max-w-4xl">
      <StepIndicator current={step} />

      {step === 1 && (
        <Step1ChoosePlan
          selectedPlanId={wizardState.selectedPlanId}
          onSelect={(id) => patch({ selectedPlanId: id })}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <Step2BillingDetails
          state={wizardState}
          onChange={patch}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <Step3Payment
          state={wizardState}
          onChange={patch}
          onSubmit={handleSubmit}
          onBack={() => setStep(2)}
          loading={loading}
        />
      )}
      {step === 'success' && (
        <SuccessScreen plan={selectedPlan} onDone={handleDone} />
      )}
    </div>
  );
}
