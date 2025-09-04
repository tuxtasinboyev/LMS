import React, { useEffect, useState } from 'react';
import { useActiveIndexStore } from '../../store/UserStores';
import {
    User,
    Lock,
    Phone,
    Edit3,
    ArrowLeft,
    Camera,
    Save,
    Shield,
    Smartphone
} from 'lucide-react';
import axios from 'axios';
import { usePhoneUpdateStore } from '../../store/UserStores';
import { VerifyPhoneModal } from './VerifyPhone';
import { useNavigate } from 'react-router-dom';

function MentorProfile() {
    const [activeTab, setActiveTab] = useState('info');
    const [phone, setPhone] = useState('');
    const [createdDate, setCreatedDate] = useState('');
    const [newName, setNewName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const { registerData, setOldPhone, setNewPhone } = usePhoneUpdateStore();
    const { oldPhone, newPhone } = registerData;
    const { setActiveIndex, setCurrentView } = useActiveIndexStore();
    const [newAvatar, setNewAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2');
    const [name, setName] = useState('');
    const [isVerifyOpen, setIsVerifyOpen] = useState(false);
    const navigate = useNavigate();

    const getAuthToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return null;
        }
        return token;
    };

    const fetchProfile = async () => {
        const token = getAuthToken();
        if (!token) return;

        try {
            const res = await axios.get('http://18.199.221.227:1709/profiles/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.status === 200) {
                const data = res.data.data.mentorProfile || res.data.data;
                const { fullName, phone, image, createdAt } = data.user || data;
                setName(fullName);
                setPhone(phone);
                setCreatedDate(new Date(createdAt).toLocaleDateString());
                setAvatarPreview(`http://18.199.221.227:1709/uploads/mentors/${image}`);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSaveProfile = async () => {
        const token = getAuthToken();
        if (!token) return;

        try {
            if (newAvatar) {
                const formData = new FormData();
                formData.append('image', newAvatar);

                const updateProfile = await axios.patch(
                    'http://18.199.221.227:1709/profiles/me',
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );

                if (updateProfile.data.data.image) {
                    setAvatarPreview(`http://18.199.221.227:1709/uploads/mentors/${updateProfile.data.data.image}`);
                }
            }

            if (newName) {
                const updatedName = await axios.put(
                    'http://18.199.221.227:1709/users/mentor',
                    { fullName: newName },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setName(updatedName.data.safeUser.fullName);
                setNewName('');
            }

            alert('Profil muvaffaqiyatli yangilandi!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Profilni yangilashda xatolik yuz berdi');
        }
    };

    const handleChangePassword = async () => {
        const token = getAuthToken();
        if (!token) return;

        if (!currentPassword || !newPassword) {
            alert('Iltimos, parollarni to‘ldiring!');
            return;
        }

        try {
            const response = await axios.patch(
                'http://18.199.221.227:1709/profiles/me/reset-password',
                {
                    password: currentPassword,
                    newPassword: newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                alert('Parol muvaffaqiyatli o‘zgartirildi!');
                setCurrentPassword('');
                setNewPassword('');
            }
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            } else if (error.response?.status === 404) {
                alert('Eski parol noto‘g‘ri kiritilgan!');
            } else {
                alert(error.response?.data?.message || 'Xatolik yuz berdi');
            }
        }
    };

    const handleChangePhone = async () => {
        const token = getAuthToken();
        if (!token) return;

        console.log("Telefon yangilash boshlandi:", { oldPhone, newPhone });

        if (!oldPhone || !newPhone) {
            alert("Iltimos, eski va yangi raqamni kiriting!");
            return;
        }

        const phoneRegex = /^\+998\d{9}$/;
        if (!phoneRegex.test(oldPhone) || !phoneRegex.test(newPhone)) {
            alert("Telefon raqam formati noto'g'ri!");
            return;
        }

        try {
            const response = await axios.post(
                'http://18.199.221.227:1709/profiles/updatePhone',
                { oldPhone, newPhone },
                { 
                    headers: { 
                        Authorization: `Bearer ${token}` 
                    } 
                }
            );

            console.log("API javobi:", response.status);

            if (response.status === 201) {
                setIsVerifyOpen(true);
            }
        } catch (error) {
            console.error("Xatolik:", error.response?.data);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
            alert(error.response?.data?.message || "Xatolik yuz berdi");
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const tabConfig = [
        { id: 'info', label: "Shaxsiy ma'lumotlar", icon: <User size={18} /> },
        { id: 'edit-profile', label: "Profilni o'zgartirish", icon: <Edit3 size={18} /> },
        { id: 'change-password', label: "Parolni o'zgartirish", icon: <Lock size={18} /> },
        { id: 'change-phone', label: "Telefonni o'zgartirish", icon: <Phone size={18} /> },
    ];

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            {/* Sidebar */}
            <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 shadow-xl hidden md:block">
                <h2 className="text-3xl font-bold text-white mb-8">Edu<span className="text-blue-500">RA</span></h2>
                {tabConfig.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 py-3 px-4 mt-2 text-left rounded-lg transition-all duration-300 ${activeTab === tab.id
                            ? 'bg-blue-600 shadow-lg'
                            : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
                <button
                    onClick={() => setCurrentView(0)}
                    className="w-full flex items-center gap-3 py-3 px-4 mt-8 text-left bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span>Ortga qaytish</span>
                </button>
            </div>

            {/* Mobile tabs */}
            <div className="w-full bg-gray-800 p-4 flex overflow-x-auto md:hidden">
                <select
                    className="w-full bg-gray-700 text-white p-3 rounded-lg"
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                >
                    {tabConfig.map((tab) => (
                        <option key={tab.id} value={tab.id}>{tab.label}</option>
                    ))}
                </select>
            </div>

            {/* Main content */}
            <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                            {tabConfig.find(tab => tab.id === activeTab)?.label}
                        </h1>
                        <button
                            onClick={() => setActiveIndex(0)}
                            className="md:hidden flex items-center gap-2 text-blue-600 dark:text-blue-400"
                        >
                            <ArrowLeft size={18} />
                            <span>Ortga</span>
                        </button>
                    </div>

                    {activeTab === 'info' && (
                        <div className="space-y-6">
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <img
                                        src={avatarPreview}
                                        alt="Profil rasmi"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                                    />
                                    <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2">
                                        <User className="text-white" size={16} />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-semibold mt-4 text-gray-800 dark:text-white">{name}</h2>
                                <p className="text-blue-500 font-medium">{'mentor'}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl">
                                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Kontakt ma'lumotlari</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Phone size={18} className="text-blue-500" />
                                            <span className="text-gray-600 dark:text-gray-400">{phone}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl">
                                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Hisob ma'lumotlari</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Shield size={18} className="text-green-500" />
                                            <span className="text-gray-600 dark:text-gray-400">Faol hisob</span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Qo'shilgan sana</p>
                                            <p className="text-gray-600 dark:text-gray-400">{createdDate}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'edit-profile' && (
                        <div className="space-y-6">
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <img
                                        src={avatarPreview}
                                        alt="Profil rasmi"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                                    />
                                    <label className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors">
                                        <Camera className="text-white" size={16} />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Rasmni o'zgartirish</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ism Familiya</label>
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <button
                                    onClick={handleSaveProfile}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors"
                                >
                                    <Save size={18} />
                                    <span>O'zgarishlarni saqlash</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'change-password' && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl">
                                <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 flex items-center gap-2">
                                    <Lock size={20} />
                                    Xavfsizlik tavsiyalari
                                </h3>
                                <ul className="mt-3 text-sm text-blue-700 dark:text-blue-300 list-disc list-inside space-y-1">
                                    <li>Kamida 8 ta belgidan iborat parol tanlang</li>
                                    <li>Katta-kichik harflar, raqamlar va belgilardan foydalaning</li>
                                    <li>Oldingi parollaringizni takrorlamang</li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Joriy parol</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Yangi parol</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <button
                                    onClick={handleChangePassword}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors"
                                >
                                    <Lock size={18} />
                                    <span>Parolni yangilash</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'change-phone' && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl">
                                <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 flex items-center gap-2">
                                    <Smartphone size={20} />
                                    Telefon raqamini yangilash
                                </h3>
                                <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                                    Telefon raqamingizni yangilashingiz mumkin. Yangi raqamga tasdiqlash kodi yuboriladi.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Joriy telefon raqam</label>
                                    <input
                                        type="text"
                                        maxLength={13}
                                        value={oldPhone}
                                        onChange={(e) => setOldPhone(e.target.value)}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="+998901234567"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Yangi telefon raqam</label>
                                    <input
                                        type="text"
                                        value={newPhone}
                                        maxLength={13}
                                        onChange={(e) => setNewPhone(e.target.value)}
                                        placeholder="+998901234567"
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <button
                                    onClick={handleChangePhone}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors"
                                >
                                    <Phone size={18} />
                                    <span>Raqamni yangilash</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* VerifyPhoneModal ni chaqirish */}
            <VerifyPhoneModal 
                open={isVerifyOpen} 
                onClose={() => {
                    console.log("Modal yopildi");
                    setIsVerifyOpen(false);
                }} 
            />
            
            {/* Debug uchun modal holati */}
            <div className="fixed top-4 right-4 bg-blue-500 text-white p-2 rounded-md text-sm z-50">
                Modal: {isVerifyOpen ? "OCHIQ" : "YOPIQ"}
            </div>
        </div>
    );
}

export default MentorProfile;