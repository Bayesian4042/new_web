import { create } from 'zustand';
import type { OTCList } from '../pages/otc/OTCLists';
import { AVAILABLE_OTC_PRODUCTS, PRODUCT_COLORS, type OTCProduct } from '../pages/otc/OTCListForm';

const seedOtcProducts = (ids: string[]): OTCProduct[] =>
  ids
    .map((id, index) => {
      const base = AVAILABLE_OTC_PRODUCTS.find((p) => p.id === id);
      if (!base) return null;

      const defaultColor = PRODUCT_COLORS[index % PRODUCT_COLORS.length];

      return {
        ...base,
        instruction: base.instruction || '',
        timeOfDay: base.timeOfDay || [],
        // if backend already provides a color, keep it; otherwise use our default
        color: base.color || defaultColor,
      } as OTCProduct;
    })
    .filter((p): p is OTCProduct => Boolean(p));

const INITIAL_OTC_LISTS: OTCList[] = [
  {
    id: 'OTC-0001',
    name: 'Cold & Flu Bundle',
    productsCount: 5,
    createdOn: '02-02-2026',
    lastUpdated: '2h ago',
    products: seedOtcProducts(['otc1', 'otc2', 'otc3', 'otc9', 'otc10']),
  },
  {
    id: 'OTC-0002',
    name: 'Pain Management Kit',
    productsCount: 3,
    createdOn: '01-02-2026',
    lastUpdated: '1d ago',
    products: seedOtcProducts(['otc1', 'otc2', 'otc3']),
  },
  {
    id: 'OTC-0003',
    name: 'Allergy Relief Pack',
    productsCount: 4,
    createdOn: '31-01-2026',
    lastUpdated: '3d ago',
    products: seedOtcProducts(['otc4', 'otc5', 'otc6', 'otc13']),
  },
];

interface OTCStore {
  otcLists: OTCList[];
  setOtcLists: (updater: (prev: OTCList[]) => OTCList[]) => void;
}

export const useOTCStore = create<OTCStore>((set) => ({
  otcLists: INITIAL_OTC_LISTS,
  setOtcLists: (updater) =>
    set((state) => ({
      otcLists: updater(state.otcLists),
    })),
}));

