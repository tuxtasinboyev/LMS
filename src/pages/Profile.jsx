import React from 'react';
import { Link } from 'react-router-dom';

function Profile() {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center">
                <h1 className="text-2xl font-bold mb-4">Welcome to Your Profile</h1>
                <p className="text-gray-600 mb-6">Manage your account details and courses.</p>

                <Link to="/login" className="block bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition mb-2">
                    Go to Login
                </Link>
                <Link to="/register" className="block bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition">
                    Go to Register
                </Link>
            </div>
        </div>
    );
}

export default Profile;
