// bayaan-portal/src/store/slices/ui.slice
import type {StateCreator} from 'zustand';
import type {GlobalActions, GlobalState} from '@/store/types';

export interface UIState {
    theme: 'light' | 'dark';
    sidebarCollapsed: boolean;
}

export interface UIActions {
    setTheme: (theme: 'light' | 'dark') => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
}

export type UISlice = UIState & UIActions;

const initialUIState: UIState = {
    theme: 'light',
    sidebarCollapsed: false,
};

export const createUISlice: StateCreator<
    GlobalState & GlobalActions,
    [],
    [],
    UISlice
> = (set) => ({
    ...initialUIState,

    setTheme: (theme) => set({theme}),
    setSidebarCollapsed: (sidebarCollapsed) => set({sidebarCollapsed}),
});