import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  isExpertMode: boolean;
  toggleExpertMode: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      isExpertMode: false,
      toggleExpertMode: () => set((state) => ({ isExpertMode: !state.isExpertMode })),
    }),
    { name: 'lunc-terminal-settings' }
  )
);