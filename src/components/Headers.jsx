import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
    const location = useLocation();
    const currentPath = location.pathname;

    const linkClasses = (path) =>
        `text-[18px] ${currentPath === path
            ? 'text-blue-500 underline underline-offset-5 decoration-blue-700 decoration-2'
            : 'text-gray-800 hover:text-blue-500'
        }`;

    return (
        <div className="sticky top-0 z-50 bg-white shadow-md">
            <div className="max-w-screen-xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="text-5xl font-bold text-blue-600">
                    <Link to="/home">iTLive</Link>
                </div>

                <div className="flex space-x-8 h-full">
                    <h1 className={linkClasses('/home')}>
                        <Link to="/home">Asosiy</Link>
                    </h1>
                    <h1 className={linkClasses('/course')}>
                        <Link to="/course">Kurslar</Link>
                    </h1>
                    <h1 className={linkClasses('/about')}>
                        <Link to="/about">Biz haqimizda</Link>
                    </h1>
                    <h1 className={linkClasses('/contact')}>
                        <Link to="/contact">Bog'lanish</Link>
                    </h1>
                </div>

                <div className="flex space-x-4 ml-80">
                    <button className="px-4 py-2 bg-gray-100 rounded-[50%] text-lg text-gray-800 hover:bg-gray-200 hover:text-black">
                        ⚙️
                    </button>
                    <button className="px-4 py-3 bg-black text-white rounded-md text-lg hover:bg-gray-800">
                        <Link to="https://examify.uz/">Examify</Link>
                    </button>
                    <button className="px-6 bg-blue-600 font-bold text-white rounded-md text-lg hover:bg-blue-500">
                        <Link to="/login">Kirish</Link>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Header;
