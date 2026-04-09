import { useState } from 'react';
import { CreditCard, Lock, Sparkles, ChevronRight } from 'lucide-react';
import { SubscribeWizard } from './SubscribeWizard';
import { BillingAccount, mockBillingAccounts } from './billingData';

const DEFAULT_CLINIC_ID = 'CLN-001';

interface ClinicBillingPaymentPageProps {
  clinicId?: string;
}

export function ClinicBillingPaymentPage({ clinicId = DEFAULT_CLINIC_ID }: ClinicBillingPaymentPageProps) {
  const [hasStartedSubscription, setHasStartedSubscription] = useState(false);
  const [account, setAccount] = useState<BillingAccount>(
    () => mockBillingAccounts[clinicId] ?? mockBillingAccounts[DEFAULT_CLINIC_ID]
  );

  if (!hasStartedSubscription) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-xl p-8 text-center space-y-6 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-50 to-white -z-10" />
          
          <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center shadow-inner relative">
            <Lock size={28} className="text-indigo-600 z-10" />
            <div className="absolute top-0 right-0 -mr-2 -mt-2">
              <Sparkles size={16} className="text-amber-400" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900">Unlock Clinic Access</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              You need an active subscription to access clinic features, manage patients, and utilize AI tools.
            </p>
          </div>

          <button
            onClick={() => setHasStartedSubscription(true)}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300"
          >
            Start Subscription
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CreditCard size={18} className="text-indigo-600" />
        <div>
          <h1 className="text-xl font-bold text-gray-900">Payment</h1>
          <p className="text-sm text-gray-500 mt-0.5">Complete your billing payment flow</p>
        </div>
      </div>

      <SubscribeWizard
        clinicId={account.clinicId}
        prefillEmail={account.billingEmail}
        initialStep={1}
        onComplete={(newAccount) => setAccount(newAccount)}
      />
    </div>
  );
}
