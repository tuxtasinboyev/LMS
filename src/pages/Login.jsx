import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ phone: '', password: '' });
  const navigate = useNavigate()
  const hanleLogin = async (e) => {
    try {
      e.preventDefault()
      const res = await axios.post('https://edora-backend.onrender.com/auth/login', {
        phone: form.phone,
        password: form.password
      })
      if (res.status === 201) {
        const token = res.data?.tokens.access_token
        if (token) {

          localStorage.setItem('token', token)
        }
        navigate('/home')
      }
    } catch (error) {

    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={hanleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Login to Your Account</h1>

        <input
          type="text"
          placeholder="phone"
          className="w-full mb-4 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.email}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button type='submit' className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition">
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
