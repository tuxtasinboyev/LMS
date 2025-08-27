import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/UserStores';

function Register() {
  const [form, setForm] = useState({ phone: '', password: '', fullName: '' });
  const { setRegisterData } = useAuthStore()

  const navigate = useNavigate()
  const handlerSubmit = async (e) => {
    setRegisterData(form)
    e.preventDefault()
    const res = await axios.post('https://edora-backend.onrender.com/verification', {
      type: 'register',
      phone: "" + form.phone
    })
    console.log(res);

    if (res.status === 201) {
      navigate('/verify')
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handlerSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Create an Account</h1>

        <input
          type="text"
          placeholder="fullName"
          className="w-full mb-4 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <input
          type="text"
          placeholder="phone"
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


        <button type='submit' className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition">
          Register
        </button>

        <p className="mt-4 text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
