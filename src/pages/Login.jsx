import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStoreL } from '../store/UserStores';

function Login() {
  const [form, setForm] = useState({ phone: '', password: '' });
  const navigate = useNavigate();
  const setRegisterData = useAuthStoreL(state => state.setRegisterData);
  const registerData = useAuthStoreL(state => state.registerData);

  useEffect(() => {
    console.log("Register data updated:", registerData);
  }, [registerData]);

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Sending login data:", form);

    try {
      const res = await axios.post('http://18.199.221.227:1709/auth/login', {
        phone: form.phone,
        password: form.password
      });


      if (res.status === 200 || res.status === 201) {
        const token = res.data?.tokens?.access_token;
        if (token) {
          localStorage.setItem('token', token);
        } else {
          console.error("Token not found in response:", res.data);
          return;
        }

        const role = res.data.user.role;

        if (role === 'STUDENT') {
          navigate('/home');
        } else if (role === 'MENTOR') {
          setRegisterData({
            fullName: res.data.user.fullName,
            phone: res.data.user.phone,
            role: res.data.user.role,
            token: token,
          });
          navigate('/mentorHome');
        } else if (role === 'ADMIN') {
          alert('Salom admin janoblari');
        }
      }
    } catch (error) {
      if (error.response) {
        console.error("Login error:", error.response.data);
        alert(error.response.data.message || "Login xatosi!");
      } else {
        console.error("Network error:", error);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Login to Your Account</h1>

        <input
          type="text"
          placeholder="Phone"
          className="w-full mb-4 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition">
          Login
        </button>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account? <Link to="/register" className="text-blue-500">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
