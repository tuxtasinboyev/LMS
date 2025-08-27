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
