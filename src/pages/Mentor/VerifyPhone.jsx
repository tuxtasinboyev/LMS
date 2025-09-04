import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePhoneUpdateStore } from '../../store/UserStores';

export function VerifyPhoneModal({ open, onClose }) {
    const length = 5;
    const [otp, setOtp] = useState(Array(length).fill(""));
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const inputsRef = useRef([]);
    const { registerData } = usePhoneUpdateStore();
    const navigate = useNavigate();

    // Debug uchun
    useEffect(() => {
        console.log("VerifyPhoneModal holati:", open);
    }, [open]);

    const getAuthToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return null;
        }
        return token;
    };

    const handleChange = (value, index) => {
        if (/^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            setError('');

            if (value && index < length - 1) {
                inputsRef.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handleVerify = async () => {
        const token = getAuthToken();
        if (!token) return;

        const code = otp.join("");
        if (code.length !== length) {
            setError('Iltimos, barcha raqamlarni to‘ldiring');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(
                "http://18.199.221.227:1709/profiles/confirmPhoneUpdate",
                {
                    phone: registerData.newPhone,
                    otp: code,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.status === 201) {
                setVerified(true);
                setTimeout(() => {
                    setVerified(false);
                    onClose();
                }, 1500);
            }
        } catch (error) {
            console.error("Verification error:", error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                setError(error.response?.data?.message || 'Tasdiqlashda xatolik yuz berdi');
            }
        } finally {
            setLoading(false);
        }
    };

    // Agar modal ochiq bo'lmasa, hech narsa ko'rsatma
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999] p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md relative">
                {verified ? (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Telefon raqamingiz muvaffaqiyatli yangilandi!
                        </h3>
                        <p className="text-gray-600">Avtomatik yopiladi...</p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-center mb-6">
                            Telefon raqamni tasdiqlash
                        </h2>

                        <div className="flex justify-between mb-4">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    ref={(el) => (inputsRef.current[index] = el)}
                                    onChange={(e) => handleChange(e.target.value, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="w-12 h-12 text-center text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    disabled={loading}
                                />
                            ))}
                        </div>

                        {error && (
                            <div className="text-red-500 text-center mb-4">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleVerify}
                            disabled={loading}
                            className={`w-full py-3 rounded-xl text-white transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                        >
                            {loading ? 'Tasdiqlanmoqda...' : 'Tasdiqlash'}
                        </button>

                        <p className="mt-4 text-center text-gray-600">
                            Kod kelmadimi? <span className="text-blue-500 cursor-pointer">Qayta yuborish</span>
                        </p>

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}