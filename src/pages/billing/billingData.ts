// ─── Types ───────────────────────────────────────────────────────────────────

export interface BillingPlan {
  id: string;
  name: string;
  patientCreationAllowance: number;
  monthlyFee: number; // EUR
  smsAllowance: number; // = patientCreationAllowance × 5
  extraPatientPrice: number; // EUR per extra patient
  extraSmsPrice: number; // EUR per extra SMS
  extraActivePatientPrice: number; // EUR per extra active patient (constant: 0.10)
  isTbdXL?: boolean; // flag XL overage prices as TBD
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string; // ISO date
  periodStart: string;
  periodEnd: string;
  baseFee: number;
  extraPatientsCharge: number;
  extraSmsCharge: number;
  extraActivePatientsCharge: number;
  total: number;
  status: 'paid' | 'failed' | 'pending' | 'upcoming';
}

export interface UsageData {
  patientsActivatedThisCycle: number;
  smsAllowance: number; // current (base + dynamic additions from overages)
  smsSentThisCycle: number;
  activePatientsCurrentCount: number;
  activePatientLimit: number;
  billingCycleStart: string; // ISO date
  billingCycleEnd: string; // ISO date
}

export interface PaymentMethod {
  brand: string; // 'visa' | 'mastercard' | 'amex'
  last4: string;
  expMonth: number;
  expYear: number;
  stripePaymentMethodId: string;
}

export interface BillingAccount {
  clinicId: string;
  planId: string;
  whitelistFlag: boolean;
  billingStatus: 'current' | 'payment_failed' | 'whitelist' | 'inactive';
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  billingEmail: string;
  billingAddress: {
    line1: string;
    city: string;
    postalCode: string;
    country: string; // ISO-2 country code
  };
  taxId: string | null;
  commitmentEndDate: string; // ISO date
  paymentMethod: PaymentMethod | null;
  usage: UsageData;
  invoices: Invoice[];
  pendingPlanChange: string | null; // planId of the plan taking effect next cycle
}

// ─── Plan Tiers ──────────────────────────────────────────────────────────────

export const BILLING_PLANS: BillingPlan[] = [
  {
    id: 'lite',
    name: 'Lite',
    patientCreationAllowance: 20,
    monthlyFee: 60,
    smsAllowance: 100,
    extraPatientPrice: 5.0,
    extraSmsPrice: 0.55,
    extraActivePatientPrice: 0.1,
  },
  {
    id: 'starter',
    name: 'Starter',
    patientCreationAllowance: 50,
    monthlyFee: 150,
    smsAllowance: 250,
    extraPatientPrice: 4.5,
    extraSmsPrice: 0.5,
    extraActivePatientPrice: 0.1,
  },
  {
    id: 'growth',
    name: 'Growth',
    patientCreationAllowance: 100,
    monthlyFee: 300,
    smsAllowance: 500,
    extraPatientPrice: 4.0,
    extraSmsPrice: 0.45,
    extraActivePatientPrice: 0.1,
  },
  {
    id: 'clinic',
    name: 'Clinic',
    patientCreationAllowance: 250,
    monthlyFee: 750,
    smsAllowance: 1250,
    extraPatientPrice: 3.5,
    extraSmsPrice: 0.4,
    extraActivePatientPrice: 0.1,
  },
  {
    id: 'scale',
    name: 'Scale',
    patientCreationAllowance: 500,
    monthlyFee: 1500,
    smsAllowance: 2500,
    extraPatientPrice: 3.0,
    extraSmsPrice: 0.35,
    extraActivePatientPrice: 0.1,
  },
  {
    id: 'xl',
    name: 'XL',
    patientCreationAllowance: 1000,
    monthlyFee: 3000,
    smsAllowance: 5000,
    extraPatientPrice: 2.5, // TBD — assumed from pricing trend
    extraSmsPrice: 0.3, // TBD — assumed from pricing trend
    extraActivePatientPrice: 0.1,
    isTbdXL: true,
  },
];

export function getPlanById(id: string): BillingPlan | undefined {
  return BILLING_PLANS.find((p) => p.id === id);
}

// ─── Overage helpers ─────────────────────────────────────────────────────────

export function calcExtraPatients(usage: UsageData, plan: BillingPlan): number {
  return Math.max(0, usage.patientsActivatedThisCycle - plan.patientCreationAllowance);
}

export function calcExtraSms(usage: UsageData): number {
  return Math.max(0, usage.smsSentThisCycle - usage.smsAllowance);
}

export function calcExtraActivePatients(usage: UsageData): number {
  return Math.max(0, usage.activePatientsCurrentCount - usage.activePatientLimit);
}

export function calcEstimatedInvoice(usage: UsageData, plan: BillingPlan): {
  baseFee: number;
  extraPatientsCharge: number;
  extraSmsCharge: number;
  extraActivePatientsCharge: number;
  total: number;
} {
  const extraPatients = calcExtraPatients(usage, plan);
  const extraSms = calcExtraSms(usage);
  const extraActive = calcExtraActivePatients(usage);

  const extraPatientsCharge = extraPatients * plan.extraPatientPrice;
  const extraSmsCharge = extraSms * plan.extraSmsPrice;
  const extraActivePatientsCharge = extraActive * plan.extraActivePatientPrice;

  return {
    baseFee: plan.monthlyFee,
    extraPatientsCharge,
    extraSmsCharge,
    extraActivePatientsCharge,
    total: plan.monthlyFee + extraPatientsCharge + extraSmsCharge + extraActivePatientsCharge,
  };
}

// ─── Mock Invoices ────────────────────────────────────────────────────────────

const starterInvoices: Invoice[] = [
  {
    id: 'inv-s-001',
    invoiceNumber: 'INV-2025-1001',
    date: '2025-10-01',
    periodStart: '2025-10-01',
    periodEnd: '2025-10-31',
    baseFee: 150,
    extraPatientsCharge: 0,
    extraSmsCharge: 0,
    extraActivePatientsCharge: 0,
    total: 150,
    status: 'paid',
  },
  {
    id: 'inv-s-002',
    invoiceNumber: 'INV-2025-1015',
    date: '2025-11-01',
    periodStart: '2025-11-01',
    periodEnd: '2025-11-30',
    baseFee: 150,
    extraPatientsCharge: 0,
    extraSmsCharge: 5.5,
    extraActivePatientsCharge: 0,
    total: 155.5,
    status: 'paid',
  },
  {
    id: 'inv-s-003',
    invoiceNumber: 'INV-2025-1031',
    date: '2025-12-01',
    periodStart: '2025-12-01',
    periodEnd: '2025-12-31',
    baseFee: 150,
    extraPatientsCharge: 0,
    extraSmsCharge: 0,
    extraActivePatientsCharge: 1.0,
    total: 151.0,
    status: 'paid',
  },
  {
    id: 'inv-s-004',
    invoiceNumber: 'INV-2026-1047',
    date: '2026-01-01',
    periodStart: '2026-01-01',
    periodEnd: '2026-01-31',
    baseFee: 150,
    extraPatientsCharge: 0,
    extraSmsCharge: 0,
    extraActivePatientsCharge: 0,
    total: 150,
    status: 'paid',
  },
  {
    id: 'inv-s-005',
    invoiceNumber: 'INV-2026-1063',
    date: '2026-02-01',
    periodStart: '2026-02-01',
    periodEnd: '2026-02-28',
    baseFee: 150,
    extraPatientsCharge: 0,
    extraSmsCharge: 0,
    extraActivePatientsCharge: 0,
    total: 150,
    status: 'paid',
  },
  {
    id: 'inv-s-006',
    invoiceNumber: 'INV-2026-1081',
    date: '2026-03-01',
    periodStart: '2026-03-01',
    periodEnd: '2026-03-31',
    baseFee: 150,
    extraPatientsCharge: 0,
    extraSmsCharge: 0,
    extraActivePatientsCharge: 0,
    total: 150,
    status: 'upcoming',
  },
];

const growthInvoices: Invoice[] = [
  {
    id: 'inv-g-001',
    invoiceNumber: 'INV-2025-2001',
    date: '2025-10-01',
    periodStart: '2025-10-01',
    periodEnd: '2025-10-31',
    baseFee: 300,
    extraPatientsCharge: 0,
    extraSmsCharge: 0,
    extraActivePatientsCharge: 0,
    total: 300,
    status: 'paid',
  },
  {
    id: 'inv-g-002',
    invoiceNumber: 'INV-2025-2017',
    date: '2025-11-01',
    periodStart: '2025-11-01',
    periodEnd: '2025-11-30',
    baseFee: 300,
    extraPatientsCharge: 40.0,
    extraSmsCharge: 13.5,
    extraActivePatientsCharge: 1.5,
    total: 355.0,
    status: 'paid',
  },
  {
    id: 'inv-g-003',
    invoiceNumber: 'INV-2025-2033',
    date: '2025-12-01',
    periodStart: '2025-12-01',
    periodEnd: '2025-12-31',
    baseFee: 300,
    extraPatientsCharge: 56.0,
    extraSmsCharge: 22.5,
    extraActivePatientsCharge: 2.0,
    total: 380.5,
    status: 'paid',
  },
  {
    id: 'inv-g-004',
    invoiceNumber: 'INV-2026-2049',
    date: '2026-01-01',
    periodStart: '2026-01-01',
    periodEnd: '2026-01-31',
    baseFee: 300,
    extraPatientsCharge: 0,
    extraSmsCharge: 0,
    extraActivePatientsCharge: 0,
    total: 300,
    status: 'failed',
  },
  {
    id: 'inv-g-005',
    invoiceNumber: 'INV-2026-2065',
    date: '2026-02-01',
    periodStart: '2026-02-01',
    periodEnd: '2026-02-28',
    baseFee: 300,
    extraPatientsCharge: 80.0,
    extraSmsCharge: 31.5,
    extraActivePatientsCharge: 3.0,
    total: 414.5,
    status: 'paid',
  },
  {
    id: 'inv-g-006',
    invoiceNumber: 'INV-2026-2083',
    date: '2026-03-01',
    periodStart: '2026-03-01',
    periodEnd: '2026-03-31',
    baseFee: 300,
    extraPatientsCharge: 0,
    extraSmsCharge: 0,
    extraActivePatientsCharge: 0,
    total: 300,
    status: 'upcoming',
  },
];

// ─── Mock Billing Accounts ────────────────────────────────────────────────────

export const mockBillingAccounts: Record<string, BillingAccount> = {
  'CLN-001': {
    clinicId: 'CLN-001',
    planId: 'starter',
    whitelistFlag: false,
    billingStatus: 'current',
    stripeCustomerId: 'cus_mock_001',
    stripeSubscriptionId: 'sub_mock_001',
    billingEmail: 'billing@mainclinic.com',
    billingAddress: {
      line1: '123 Main Street',
      city: 'New York',
      postalCode: '10001',
      country: 'US',
    },
    taxId: null,
    commitmentEndDate: '2026-07-15',
    paymentMethod: {
      brand: 'visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2027,
      stripePaymentMethodId: 'pm_mock_001',
    },
    usage: {
      patientsActivatedThisCycle: 35,
      smsAllowance: 250,
      smsSentThisCycle: 180,
      activePatientsCurrentCount: 42,
      activePatientLimit: 50,
      billingCycleStart: '2026-03-01',
      billingCycleEnd: '2026-03-31',
    },
    invoices: starterInvoices,
    pendingPlanChange: null,
  },

  'CLN-002': {
    clinicId: 'CLN-002',
    planId: 'growth',
    whitelistFlag: false,
    billingStatus: 'payment_failed',
    stripeCustomerId: 'cus_mock_002',
    stripeSubscriptionId: 'sub_mock_002',
    billingEmail: 'finance@northwing.com',
    billingAddress: {
      line1: '456 North Ave',
      city: 'Los Angeles',
      postalCode: '90001',
      country: 'US',
    },
    taxId: 'US-123456789',
    commitmentEndDate: '2026-07-20',
    paymentMethod: {
      brand: 'mastercard',
      last4: '5555',
      expMonth: 8,
      expYear: 2026,
      stripePaymentMethodId: 'pm_mock_002',
    },
    usage: {
      patientsActivatedThisCycle: 128, // over allowance of 100 → 28 extra
      smsAllowance: 640, // 500 base + 28 extra patients × 5
      smsSentThisCycle: 710, // 70 over → extra SMS
      activePatientsCurrentCount: 115, // 15 over limit of 100
      activePatientLimit: 100,
      billingCycleStart: '2026-03-01',
      billingCycleEnd: '2026-03-31',
    },
    invoices: growthInvoices,
    pendingPlanChange: 'clinic',
  },

  'CLN-003': {
    clinicId: 'CLN-003',
    planId: 'lite',
    whitelistFlag: true,
    billingStatus: 'whitelist',
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    billingEmail: 'demo@westmedical.com',
    billingAddress: {
      line1: '789 West Blvd',
      city: 'Chicago',
      postalCode: '60601',
      country: 'US',
    },
    taxId: null,
    commitmentEndDate: '2026-09-10',
    paymentMethod: null,
    usage: {
      patientsActivatedThisCycle: 8,
      smsAllowance: 100,
      smsSentThisCycle: 34,
      activePatientsCurrentCount: 8,
      activePatientLimit: 20,
      billingCycleStart: '2026-03-01',
      billingCycleEnd: '2026-03-31',
    },
    invoices: [],
    pendingPlanChange: null,
  },
};

// ─── Country list (abbreviated) ───────────────────────────────────────────────

export const COUNTRIES = [
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BR', name: 'Brazil' },
  { code: 'CA', name: 'Canada' },
  { code: 'CN', name: 'China' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'IN', name: 'India' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'MX', name: 'Mexico' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'PT', name: 'Portugal' },
  { code: 'ES', name: 'Spain' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
];

export function formatEur(amount: number): string {
  return `€${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date('2026-03-24'); // prototype "today"
  return Math.max(0, Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
}

export function daysRemaining(cycleEnd: string): number {
  return daysUntil(cycleEnd);
}
