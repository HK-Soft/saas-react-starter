// src/store/slices/notifications.slice
import type {StateCreator} from 'zustand';
import type {Notification, GlobalState, GlobalActions} from '@/store/types';

export interface NotificationState {
    notifications: Notification[];
}

export interface NotificationActions {
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
}

export type NotificationSlice = NotificationState & NotificationActions;

const initialNotificationState: NotificationState = {
    notifications: [],
};

export const createNotificationSlice: StateCreator<
    GlobalState & GlobalActions,
    [],
    [],
    NotificationSlice
> = (set) => ({
    ...initialNotificationState,

    addNotification: (notification) => {
        const newNotification: Notification = {
            ...notification,
            id: crypto.randomUUID(),
            timestamp: new Date(),
        };

        set((state) => ({
            notifications: [...state.notifications, newNotification]
        }));

        // Auto-remove notifications after 5 seconds (except error notifications)
        if (notification.type !== 'error') {
            setTimeout(() => {
                set((state) => ({
                    notifications: state.notifications.filter(n => n.id !== newNotification.id)
                }));
            }, 5000);
        }
    },

    removeNotification: (id) => {
        set((state) => ({
            notifications: state.notifications.filter(n => n.id !== id)
        }));
    },

    clearNotifications: () => set({notifications: []}),
});