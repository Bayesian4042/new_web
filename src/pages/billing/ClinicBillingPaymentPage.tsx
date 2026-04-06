import { useState } from 'react';
import { CreditCard, X } from 'lucide-react';
import { SubscribeWizard } from './SubscribeWizard';
import { BillingAccount, mockBillingAccounts } from './billingData';
import { Button } from '../../components/ui/Button';

const DEFAULT_CLINIC_ID = 'CLN-001';

interface ClinicBillingPaymentPageProps {
  clinicId?: string;
}

function PaymentFlowChoiceModal({
  onMakePayment,
  onChoosePlan,
}: {
  onMakePayment: () => void;
  onChoosePlan: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-black text-gray-900">Payment Flow</h3>
            <p className="text-sm text-gray-500 mt-1">Choose how you want to continue.</p>
          </div>
          <div className="h-8 w-8 rounded-lg text-gray-300 flex items-center justify-center">
            <X size={16} />
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={onMakePayment}
            className="w-full text-left rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 hover:bg-blue-100 transition-colors"
          >
            <p className="text-sm font-bold text-blue-900">Make Payment</p>
            <p className="text-xs text-blue-700 mt-0.5">Go directly to the payment step.</p>
          </button>

          <button
            onClick={onChoosePlan}
            className="w-full text-left rounded-xl border border-gray-200 bg-white px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <p className="text-sm font-bold text-gray-900">Choose Plan</p>
            <p className="text-xs text-gray-600 mt-0.5">First select a plan card, then continue to payment.</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export function ClinicBillingPaymentPage({ clinicId = DEFAULT_CLINIC_ID }: ClinicBillingPaymentPageProps) {
  const [showChoiceModal, setShowChoiceModal] = useState(true);
  const [initialStep, setInitialStep] = useState<1 | 3>(3);
  const [wizardVersion, setWizardVersion] = useState(0);
  const [account, setAccount] = useState<BillingAccount>(
    () => mockBillingAccounts[clinicId] ?? mockBillingAccounts[DEFAULT_CLINIC_ID]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CreditCard size={18} className="text-indigo-600" />
        <div>
          <h1 className="text-xl font-bold text-gray-900">Payment</h1>
          <p className="text-sm text-gray-500 mt-0.5">Complete your billing payment flow</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto text-xs"
          onClick={() => setShowChoiceModal(true)}
        >
          Change Flow
        </Button>
      </div>

      <SubscribeWizard
        key={`${initialStep}-${wizardVersion}`}
        clinicId={account.clinicId}
        prefillEmail={account.billingEmail}
        initialStep={initialStep}
        onComplete={(newAccount) => setAccount(newAccount)}
      />

      {showChoiceModal && (
        <PaymentFlowChoiceModal
          onMakePayment={() => {
            setInitialStep(3);
            setWizardVersion((v) => v + 1);
            setShowChoiceModal(false);
          }}
          onChoosePlan={() => {
            setInitialStep(1);
            setWizardVersion((v) => v + 1);
            setShowChoiceModal(false);
          }}
        />
      )}
    </div>
  );
}
