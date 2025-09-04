"use client"

import React, { useState, useEffect, useRef } from "react"
import {
    Home,
    GraduationCap,
    MessageSquare,
    LogOut,
    Settings,
    Moon,
    Sun,
    Bell,
    User,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Grid,
} from "lucide-react"
import MentorProfile from "./MentorProfile"
import { useActiveIndexStore, useAuthStoreL } from "../../store/UserStores"
import MentorCategoryWithProvider from "./MentorCategory"
import Comments from "./Comments"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import MentorCourse from "./MentorCourse"

function MentorHome() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [darkMode, setDarkMode] = useState(false)
    const [isNotificationOpen, setIsNotificationOpen] = useState(false)
    const [isSettingsHover, setIsSettingsHover] = useState(false)
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
    const { activeIndex, currentView, setActiveIndex, setCurrentView } = useActiveIndexStore();
    const profileRef = useRef(null)
    const notificationRef = useRef(null)
    const settingsRef = useRef(null)

    // Dark mode management
    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode)
    }, [darkMode])

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileMenuOpen(false)
            }
            if (notificationRef.current && !notificationRef.current.contains(e.target)) {
                setIsNotificationOpen(false)
            }
            if (settingsRef.current && !settingsRef.current.contains(e.target)) {
                setIsSettingsHover(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Close sidebar on mobile
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 768) setIsSidebarOpen(false)
            else setIsSidebarOpen(true)
        }
        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const menuItems = [
        { icon: <Home />, label: "Asosiy" },
        { icon: <GraduationCap />, label: "Kurslar" },
        { icon: <MessageSquare />, label: "Izohlar" },
        { icon: <Grid />, label: "Category" },
        { icon: <LogOut className="text-red-400" />, label: "Chiqish", isLogout: true },
    ]

    const notifications = [
        {
            id: 1,
            text: "Tania sizga xabar yubordi",
            time: "13 daqiqa oldin",
            avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2",
            isUnread: true,
        },
        {
            id: 2,
            text: "Natali sizning emailingizga javob berdi",
            time: "1 soat oldin",
            avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2",
            isUnread: false,
        },
        {
            id: 3,
            text: "Yangi talaba kursga yozildi",
            time: "2 soat oldin",
            avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2",
            isUnread: false,
        },
    ]

    const registerData = useAuthStoreL(state => state.registerData);
    const [userProfile, setUserProfile] = useState({
        fullName: "",
        avatar: "",
        role: ""
    });

    const navigate = useNavigate()
    const [purchasedCourses, setPurchasedCourses] = useState(0);
    const [lengthCourses, setLengthCourses] = useState(0);
    const [countSubmmisionHome, setCountSubmmisionHome] = useState(0);
    const [countQuestions, setCountQuestions] = useState(0);
    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login')
        }

        try {
            const res = await axios.get('http://18.199.221.227:1709/profiles/me', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const user = res.data.data.mentorProfile.user;
            const courses = await axios.get(`http://18.199.221.227:1709/courses?offset=0&limit=8&mentor_id=${user.id}`)
            const totalCourse = courses.data.data.reduce((sum, course) => {
                return sum + (course._count?.purchased || 0);
            }, 0)
            setPurchasedCourses(totalCourse)
            setLengthCourses(courses.data.data.length)

            const submissionHomework = await axios.get('http://18.199.221.227:1709/homework/submission', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setCountSubmmisionHome(submissionHomework.data.count)

            const allnotification = await axios.get(`http://18.199.221.227:1709/questions/by-course-mentorId/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(allnotification.data.data.length);

            setCountQuestions(allnotification.data.data.length)

            setUserProfile({
                fullName: user.fullName,
                avatar: user.image,
                role: user.role
            });
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
            if (error.response?.status === 404) {
                console.warn("Profil topilmadi. Foydalanuvchi login qilmagan bo'lishi mumkin.");
            }
            console.log(error);
        };
    }
    const imgurl = 'http://18.199.221.227:1709/uploads/mentors/'
    useEffect(() => {


        fetchProfile();
    }, []);


    const unreadCount = notifications.filter(n => n.isUnread).length

    const handleLogout = () => {
        localStorage.removeItem('token')
        window.location.href = "/login"
    }

    const handleMenuClick = (index) => {
        setCurrentView(index)
        setActiveIndex(index)
        if (menuItems[index].isLogout) handleLogout()
        if (window.innerWidth < 768) setIsSidebarOpen(false)
    }

    return (
        <div className={`flex h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
            {/* Sidebar overlay for mobile */}
            {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />}

            {/* Sidebar */}
            <aside className={`
                fixed md:relative z-50 bg-[#0d1520] text-white flex flex-col transition-all duration-300 h-full
                ${isSidebarOpen ? "w-64" : "w-0 md:w-20"}
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}>
                <div className="p-4 border-b border-gray-700 flex items-center justify-between min-h-[73px]">
                    <div className={`text-white text-3xl font-extrabold transition-all ${!isSidebarOpen ? "hidden" : ""}`}>
                        Edu<span className="text-blue-500">RA</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-white hover:text-blue-500 border-2 border-white rounded-lg p-1 transition-all hover:border-blue-500"
                    >
                        {!isSidebarOpen ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map(({ icon, label, isLogout }, idx) => {
                        const isActive = idx === activeIndex
                        return (
                            <div
                                key={idx}
                                onClick={() => handleMenuClick(idx)}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all group
                                    ${isSidebarOpen ? "" : "justify-center"}
                                    ${isActive && !isLogout
                                        ? "bg-blue-600 text-white shadow-lg"
                                        : isLogout
                                            ? "text-red-400 hover:bg-red-500/10"
                                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                    }
                                `}
                            >
                                {React.cloneElement(icon, {
                                    className: `w-6 h-6 transition-all ${isActive && !isLogout ? "text-white" : ""}`,
                                })}
                                {isSidebarOpen && <span className="font-medium">{label}</span>}
                                {!isSidebarOpen && (
                                    <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                        {label}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <div className={`text-xs text-gray-400 ${!isSidebarOpen ? "hidden" : ""}`}>© 2025 EduRA Platform</div>
                </div>
            </aside>

            {/* Main */}
            <div className="flex flex-col flex-1 min-w-0">
                {/* Topbar */}
                <header className={`flex items-center justify-between px-4 md:px-6 py-4 border-b backdrop-blur-sm ${darkMode ? "border-gray-700 bg-gray-800/95" : "border-gray-200 bg-white/95"}`}>
                    <div className="flex items-center gap-4">
                        {!isSidebarOpen && (
                            <button onClick={() => setIsSidebarOpen(true)} className={`p-2 rounded-lg transition-colors md:hidden ${darkMode ? "text-white hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`}>
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        )}
                        <div>
                            <h1 className="text-xl md:text-2xl font-semibold">
                                {menuItems[currentView]?.label || (currentView === 100 ? "Mening profilim" : "")}
                            </h1>
                            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Boshqaruv paneli</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="flex items-center gap-3 md:gap-4">
                            {/* Settings */}
                            <div
                                className="relative"
                                ref={settingsRef}
                                onMouseEnter={() => setIsSettingsHover(true)}
                                onMouseLeave={() => setIsSettingsHover(false)}
                            >
                                <button
                                    className={`p-2 rounded-full transition-colors ${darkMode
                                        ? "hover:bg-gray-700 text-gray-300 hover:text-white"
                                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    <Settings className="w-5 h-5" />
                                </button>

                                {isSettingsHover && (
                                    <div
                                        className={`absolute top-12 right-0 px-4 py-3 rounded-xl text-sm font-medium shadow-2xl whitespace-nowrap z-50 transform transition-all duration-300 ease-out ${darkMode
                                            ? "bg-gradient-to-br from-gray-800 to-gray-700 text-white"
                                            : "bg-gradient-to-br from-white to-gray-100 text-gray-900"
                                            } opacity-100 scale-100`}
                                    >
                                        <span className="block text-base font-semibold mb-2">Sozlamalar</span>
                                        <div className="mt-1 px-2 py-1 rounded-lg hover:bg-gray-200 hover:text-white hover:dark:bg-gray-600 cursor-pointer transition-colors flex gap-2 font-extrabold">
                                            <Bell />
                                            <h1>Hozircha settings shulardan iborat</h1>
                                        </div>
                                        <div
                                            className={`absolute top-0 right-4 w-0 h-0 border-l-6 border-r-6 border-b-6 border-transparent ${darkMode ? "border-b-gray-800" : "border-b-white"
                                                } transform -translate-y-full`}
                                        />
                                    </div>
                                )}
                            </div>


                            {/* Dark Mode */}
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`p-2 rounded-full transition-colors ${darkMode ? "hover:bg-gray-700 text-yellow-400" : "hover:bg-gray-100 text-gray-600"
                                    }`}
                            >
                                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            {/* Notifications */}
                            <div className="relative" ref={notificationRef}>
                                <button
                                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                    className={`p-2 rounded-full relative transition-colors ${darkMode
                                        ? "hover:bg-gray-700 text-gray-300 hover:text-white"
                                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    <Bell className="w-5 h-5" />
                                    {countQuestions > 0 && (
                                        <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full min-w-[18px] text-center">
                                            {countQuestions}
                                        </span>
                                    )}
                                </button>

                                {isNotificationOpen && (
                                    <div
                                        className={`absolute right-0 mt-2 w-80 rounded-xl shadow-xl border z-50 overflow-hidden ${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-900 border-gray-200"
                                            }`}
                                    >
                                        <div className={`p-4 font-semibold border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                                            <div className="flex items-center justify-between">
                                                <span>Bildirishnomalar</span>
                                                {countQuestions > 0 && (
                                                    <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded-full">
                                                        {countQuestions} yangi
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className='max-h-80 overflow-y-auto'>
                                            {notifications.map(({ id, text, time, avatar, isUnread }) => (
                                                <div
                                                    key={id}
                                                    className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 hover:text-white dark:hover:bg-gray-700 cursor-pointer transition-colors ${isUnread ? "bg-blue-50 dark:bg-blue-900/20" : ""
                                                        }`}
                                                >
                                                    <img
                                                        src={avatar || "/placeholder.svg"}
                                                        alt="User avatar"
                                                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm ${isUnread ? "font-semibold" : ""}`}>{text}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{time}</p>
                                                    </div>
                                                    {isUnread && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />}
                                                </div>
                                            ))}
                                        </div>
                                        <div className={`p-3 border-t text-center ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                                            <button className="text-sm text-blue-500 hover:text-blue-600 font-medium">
                                                Barchasini ko'rish uchu scrollni pastga torting
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Profile */}
                            <div className="relative" ref={profileRef}>
                                <div className=" profile flex items-center gap-2 md:gap-3 cursor-pointer p-1 rounded-lg  hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
                                    <img src={`${imgurl}${userProfile.avatar}`} alt="Profil rasm" className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-blue-500 object-cover" />
                                    <div className="hidden sm:flex flex-col items-start">
                                        <span className={` profileN font-semibold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>{userProfile.fullName}</span>
                                        <span className="text-xs text-blue-500 font-medium">{userProfile.role}</span>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""} ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                                </div>

                                {isProfileMenuOpen && (
                                    <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl border z-50 overflow-hidden ${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-900 border-gray-200"}`}>
                                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center gap-3">
                                                <img src={`${imgurl}${userProfile.avatar}`} alt="Profil rasm" className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover" />
                                                <div>
                                                    <p className="font-semibold">{userProfile.fullName}</p>
                                                    <p className="text-sm text-blue-500">{userProfile.role}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="py-2">
                                            <button
                                                onClick={() => {
                                                    setCurrentView(100); // MentorProfile
                                                    setIsProfileMenuOpen(false);
                                                }}
                                                className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 hover:text-white dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <User className="w-5 h-5" />
                                                <span>Mening profilim</span>
                                            </button>
                                            <hr className="my-2 border-gray-200 dark:border-gray-700" />
                                            <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                                <LogOut className="w-5 h-5" />
                                                <span>Chiqish</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main content */}
                <main className={`flex-1 p-4 md:p-8 overflow-auto ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
                    <div className="max-w-7xl mx-auto">
                        {currentView === 0 && (
                            <>
                                {/* Statistika va so'nggi faoliyat */}
                                <div className={`rounded-xl p-6 mb-8 ${darkMode
                                    ? "bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-gray-700"
                                    : "bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200"
                                    }`}
                                >
                                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                                        Xush kelibsiz, {userProfile.fullName.split(" ")[0]}! 👋
                                    </h2>
                                    <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                        Bugun ham o'quvchilaringiz bilan ishlashga tayyormisiz?
                                    </p>
                                </div>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    {[
                                        { title: "Jami talabalar", value: `${purchasedCourses}`, icon: <User className="w-6 h-6" />, color: "blue" },
                                        { title: "Faol kurslar", value: `${lengthCourses}`, icon: <GraduationCap className="w-6 h-6" />, color: "green" },
                                        {
                                            title: "Yangi xabarlar",
                                            value: `${countQuestions}`,
                                            icon: <MessageSquare className="w-6 h-6" />,
                                            color: "purple",
                                        },
                                        { title: "Tugatilgan vazifalar", value: `${countSubmmisionHome}`, icon: <Settings className="w-6 h-6" />, color: "orange" },
                                    ].map((stat, index) => (
                                        <div
                                            key={index}
                                            className={`p-6 rounded-xl border transition-all hover:shadow-lg ${darkMode
                                                ? "bg-gray-800 border-gray-700 hover:shadow-gray-900/25"
                                                : "bg-white border-gray-200 hover:shadow-xl"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                                        {stat.title}
                                                    </p>
                                                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                                </div>
                                                <div
                                                    className={`p-3 rounded-lg ${stat.color === "blue"
                                                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                                        : stat.color === "green"
                                                            ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                                                            : stat.color === "purple"
                                                                ? "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                                                                : "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                                                        }`}
                                                >

                                                    {stat.icon}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Recent Activity */}
                                <div
                                    className={`rounded-xl border p-6 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                                        }`}
                                >
                                    <h3 className="text-lg font-semibold mb-4">So'nggi faoliyat</h3>
                                    <div className="space-y-4">
                                        {[
                                            { action: "JavaScript asoslari kursiga yangi modul qo'shildi", time: "2 soat oldin" },
                                            { action: "5 ta yangi talaba ro'yxatdan o'tdi", time: "4 soat oldin" },
                                            { action: "React kursi yakunlandi", time: "5 kun oldin" },
                                        ].map((activity, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 hover:text-white dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                                <div className="flex-1">
                                                    <p className="font-medium">{activity.action}</p>
                                                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{activity.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                        {currentView === 1 && <div>
                            <div>
                                <MentorCourse />
                            </div>
                        </div>}
                        {currentView === 2 && <div>
                            <div>
                                <Comments />
                            </div></div>}
                        {currentView === 3 && <div>
                            <div>
                                <MentorCategoryWithProvider />
                            </div></div>}
                        {currentView === 100 && <MentorProfile />}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default MentorHome   