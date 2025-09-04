import { create } from 'zustand';

const useAuthStore = create((set) => ({
    registerData: {
        fullName: '',
        phone: '',
        password: '',
    },
    setRegisterData: (data) => set({ registerData: data }),
    clearRegisterData: () => set({ registerData: { fullName: '', phone: '', password: '' } }),
}));

export default useAuthStore;

export const useActiveIndexStore = create((set) => ({
    activeIndex: 0,
    currentView: 0, // Yangi maydon qo'shildi
    setActiveIndex: (index) => set({ activeIndex: index }),
    setCurrentView: (view) => set({ currentView: view }), // Yangi funksiya
}))
export const useAuthStoreL = create((set) => ({
    registerData: {
        fullName: '',
        phone: '',
        role: '',
        token: '',
    },
    setRegisterData: (data) => set({ registerData: data }),
    clearRegisterData: () => set({ registerData: { fullName: '', phone: '', password: '', role: '', token: '' } }),
}));

export const usePhoneUpdateStore = create((set) => ({
    registerData: {
        oldPhone: '',
        newPhone: ''
    },
    setOldPhone: (value) =>
        set((state) => ({
            registerData: { ...state.registerData, oldPhone: value }
        })),
    setNewPhone: (value) =>
        set((state) => ({
            registerData: { ...state.registerData, newPhone: value }
        })),
    clearRegisterData: () =>
        set({
            registerData: { oldPhone: '', newPhone: '' }
        }),
}));

