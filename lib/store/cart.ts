import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
  options?: Record<string, string>;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string, options?: Record<string, string>) => void;
  updateQuantity: (id: string, quantity: number, options?: Record<string, string>) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const getItemKey = (id: string, options?: Record<string, string>) => {
  if (!options || Object.keys(options).length === 0) return id;
  const optionsKey = Object.entries(options)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join("|");
  return `${id}|${optionsKey}`;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) => {
        const key = getItemKey(item.id, item.options);
        const existing = get().items.find(
          (i) => getItemKey(i.id, i.options) === key
        );

        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              getItemKey(i.id, i.options) === key
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          }));
        } else {
          set((state) => ({
            items: [...state.items, { ...item, quantity }],
          }));
        }
      },
      removeItem: (id, options) => {
        const key = getItemKey(id, options);
        set((state) => ({
          items: state.items.filter((i) => getItemKey(i.id, i.options) !== key),
        }));
      },
      updateQuantity: (id, quantity, options) => {
        if (quantity <= 0) {
          get().removeItem(id, options);
          return;
        }
        const key = getItemKey(id, options);
        set((state) => ({
          items: state.items.map((i) =>
            getItemKey(i.id, i.options) === key ? { ...i, quantity } : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "floral-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

