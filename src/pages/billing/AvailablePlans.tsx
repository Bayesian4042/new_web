import { Users, MessageSquare, Zap, Star } from 'lucide-react';
import { BILLING_PLANS, LICENSE_PLANS, BillingPlan, formatEur } from './billingData';

function PlanCard({
  plan,
}: {
  plan: BillingPlan;
}) {
  const isRecommended = plan.id === 'starter';

  return (
    <div
      className={`relative w-full text-left rounded-xl border-2 p-5 transition-all ${
        isRecommended
          ? 'border-indigo-600 bg-indigo-50/60 shadow-sm'
          : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/20'
      }`}
    >
      {isRecommended && (
        <span className="absolute -top-2.5 left-4 flex items-center gap-1 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full z-10">
          <Star size={9} fill="white" />
          Recommended
        </span>
      )}

      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-lg font-black text-gray-900">{plan.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{plan.patientCreationAllowance} patients / mo</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-indigo-700">{formatEur(plan.monthlyFee)}</p>
          <p className="text-[10px] text-gray-400">/month</p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-indigo-400 shrink-0" />
          <span>{plan.patientCreationAllowance} patient activations / cycle</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare size={14} className="text-indigo-400 shrink-0" />
          <span>{plan.smsAllowance === -1 ? 'Unlimited' : plan.smsAllowance} SMS included</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-indigo-400 shrink-0" />
          <span>
            {formatEur(plan.extraPatientPrice)} per patient if limit exceeded
            {plan.isTbdXL && <span className="text-amber-500 ml-1">(TBD)</span>}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-indigo-400 shrink-0" />
          <span>
            {plan.extraSmsPrice === 0 ? 'N/A' : `${formatEur(plan.extraSmsPrice)} per SMS if limit exceeded`}
          </span>
        </div>
      </div>
    </div>
  );
}

export function AvailablePlans() {
  return (
    <div className="space-y-12 max-w-5xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Volume Tiers (Public Plans)</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review the available billing plans and their tier limits. This page is visible only to Super Admins.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {BILLING_PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="pt-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">License & Service Plans</h2>
          <p className="text-sm text-gray-500 mt-1">
            Special plans assigned directly by Gema administrators. Not displayed to regular clinics.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {LICENSE_PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </div>
  );
}
