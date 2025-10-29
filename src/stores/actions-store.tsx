// create a zustand store for saving selected action
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ActionFormData } from "@/types/actions";

interface ActionStore {
  selectedAction: ActionFormData;
  setSelectedAction: (action: ActionFormData | null) => void;
  invalidateSelectedAction: () => void;
}

const useActionStore = create<ActionStore>()(
  devtools((set) => ({
    selectedAction: null,
    setSelectedAction: (action) => set({ selectedAction: action }),
    invalidateSelectedAction: () => set({ selectedAction: null }),
  }))
);

export default useActionStore;
