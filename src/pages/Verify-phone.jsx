import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/UserStores';
import axios from 'axios';

function Verify() {
  const length = 5;
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputsRef = useRef([]);
  const { registerData } = useAuthStore(); // ✅ Ma'lumotni olish

  const navigate = useNavigate();

  const handleChange = (value, index) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < length - 1) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    try {
      const code = otp.join('');

      // 1-Qadam: OTP ni tasdiqlash
      const res = await axios.post(
        'https://edora-backend.onrender.com/verification/verify',
        {
          type: 'register',
          phone: registerData.phone, // ✅ To'g'rilandi
          otp: code
        }
      );

      console.log('Verify response:', res.data);

      if (res.status === 201) {
        // 2-Qadam: Ro‘yxatdan o‘tkazish
        const ress = await axios.post(
          'https://edora-backend.onrender.com/auth/register',
          {
            phone: registerData.phone, // ✅ To'g'rilandi
            password: registerData.password,
            otp: code,
            fullName: registerData.fullName
          }
        );

        console.log('Register response:', ress.data);

        if (ress.status === 201) {
          navigate('/home');
        }
      }
    } catch (error) {
      console.error('Verification error:', error.response?.data || error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Verify Your Account</h1>

        <div className="flex justify-between mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          className="w-full bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition"
        >
          Verify
        </button>

        <p className="mt-4 text-center text-gray-600">
          <Link to="/login" className="text-blue-500">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Verify;
