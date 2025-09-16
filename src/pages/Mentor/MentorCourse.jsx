"use client"

import { useState, useEffect } from "react"
import {
  Sun,
  Moon,
  Plus,
  BookOpen,
  Video,
  FolderOpen,
  Edit3,
  Trash2,
  GraduationCap,
  Users,
  Clock,
  Star,
  Save,
  X,
  AlertCircle,
} from "lucide-react"
import axios from "axios"

const API_BASE_URL = "http://18.199.221.227:1709"

export default function MentorCourse() {
  const [courses, setCourses] = useState([])
  const [sections, setSections] = useState([])
  const [profile, setProfile] = useState(null)
  const [categories, setCategories] = useState([])
  const [token, setToken] = useState(null)

  const [loading, setLoading] = useState({
    courses: false,
    profile: false,
    categories: false,
    saving: false,
  })

  const [darkMode, setDarkMode] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedSection, setSelectedSection] = useState(null)
  const [modal, setModal] = useState({ type: null, editing: null, open: false })
  const [toast, setToast] = useState(null)

  // Form states
  const [courseForm, setCourseForm] = useState({
    name: "",
    about: "",
    price: "",
    level: "BEGINNER",
    categoryId: "",
    banner: null,
  })

  useEffect(() => {
    // Check for token in localStorage
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
    } else {
      // For demo purposes, show a message about missing token
      showToast("Token topilmadi. Iltimos, tizimga kiring.", "error")
    }
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading((prev) => ({ ...prev, profile: true }))

      if (!token) {
        console.log("Token mavjud emas, profile yuklanmaydi")
        return
      }

      const response = await axios.get(`${API_BASE_URL}/profiles/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      console.log("Profile API response:", response.data)
      setProfile(response.data)
    } catch (error) {
      console.error("Profile fetch error:", error)
      if (error.response?.status === 401) {
        showToast("Avtorizatsiya xatoligi. Qaytadan kiring.", "error")
        localStorage.removeItem("token")
        setToken(null)
      } else {
        showToast("Profile ma'lumotlarini yuklashda xatolik", "error")
      }
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }))
    }
  }

  const fetchCourses = async () => {
    try {
      setLoading((prev) => ({ ...prev, courses: true }))

      if (!token) {
        console.log("Token mavjud emas, kurslar yuklanmaydi")
        // Show demo courses instead
        setCourses([
          {
            id: 1,
            title: "Demo Kurs 1",
            instructor: "Demo Mentor",
            image: getRandomDefaultImage(),
            students: 25,
            rating: 4.5,
            duration: "10h",
            about: "Bu demo kurs. Haqiqiy ma'lumotlar uchun tizimga kiring.",
            price: 99,
            level: "BEGINNER",
            sections: [],
            categoryId: 1,
            published: true,
          },
          {
            id: 2,
            title: "Demo Kurs 2",
            instructor: "Demo Mentor",
            image: getRandomDefaultImage(),
            students: 15,
            rating: 4.2,
            duration: "8h",
            about: "Bu ham demo kurs. Haqiqiy ma'lumotlar uchun tizimga kiring.",
            price: 79,
            level: "INTERMEDIATE",
            sections: [],
            categoryId: 2,
            published: true,
          },
        ])
        return
      }

      const response = await axios.get(`${API_BASE_URL}/courses?offset=0&limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      console.log("Courses API response:", response.data)
      const coursesData = response.data.data || response.data || []

      setCourses(
        coursesData.map((item) => ({
          id: item.id,
          title: item.name,
          instructor: item.mentor?.fullName || item.mentor?.user?.fullName || "Noma'lum",
          image: item.banner ? `${API_BASE_URL}/uploads/banner/${item.banner}` : getRandomDefaultImage(),
          students: item._count?.purchased || 0,
          rating: 4.5,
          duration: "10h",
          about: item.about,
          price: item.price,
          level: item.level,
          sections: item.sections || [],
          categoryId: item.categoryId,
          published: item.published,
        })),
      )
    } catch (error) {
      console.error("Courses fetch error:", error)
      if (error.response?.status === 401) {
        showToast("Avtorizatsiya xatoligi. Qaytadan kiring.", "error")
        localStorage.removeItem("token")
        setToken(null)
      } else {
        showToast("Kurslarni yuklashda xatolik", "error")
      }
    } finally {
      setLoading((prev) => ({ ...prev, courses: false }))
    }
  }

  const fetchCategories = async () => {
    try {
      setLoading((prev) => ({ ...prev, categories: true }))

      if (!token) {
        // Show demo categories
        setCategories([
          { id: 1, name: "Dasturlash" },
          { id: 2, name: "Dizayn" },
          { id: 3, name: "Marketing" },
        ])
        return
      }

      const response = await axios.get(`${API_BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setCategories(response.data.data || response.data || [])
    } catch (error) {
      console.error("Categories fetch error:", error)
      // Set demo categories on error
      setCategories([
        { id: 1, name: "Dasturlash" },
        { id: 2, name: "Dizayn" },
        { id: 3, name: "Marketing" },
      ])
    } finally {
      setLoading((prev) => ({ ...prev, categories: false }))
    }
  }

  const saveCourse = async (courseData) => {
    try {
      setLoading((prev) => ({ ...prev, saving: true }))

      if (!token) {
        showToast("Tizimga kirish kerak", "error")
        return
      }

      if (!profile) {
        showToast("Profile ma'lumotlari yuklanmagan", "error")
        return
      }

      // Extract mentorId from different possible profile structures
      let mentorId = null
      if (profile.mentorProfile?.id) {
        mentorId = profile.mentorProfile.id
      } else if (profile.mentorProfile?.user?.id) {
        mentorId = profile.mentorProfile.user.id
      } else if (profile.id) {
        mentorId = profile.id
      } else if (profile.user?.id) {
        mentorId = profile.user.id
      }

      console.log("Extracted mentorId:", mentorId)
      console.log("Profile structure:", profile)

      if (!mentorId) {
        showToast("Mentor ID topilmadi", "error")
        return
      }

      const formData = new FormData()

      formData.append("name", courseData.name)
      formData.append("about", courseData.about)
      formData.append("price", courseData.price)
      formData.append("level", courseData.level)
      formData.append("categoryId", courseData.categoryId)
      formData.append("mentorId", mentorId)

      if (courseData.banner) {
        formData.append("banner", courseData.banner)
      }

      let response
      if (modal.editing) {
        // Update course
        response = await axios.put(`${API_BASE_URL}/courses/${modal.editing.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        showToast("Kurs muvaffaqiyatli yangilandi! ✨")
      } else {
        // Create new course
        response = await axios.post(`${API_BASE_URL}/courses`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        showToast("Yangi kurs qo'shildi! 🎉")
      }

      console.log("Course save response:", response.data)

      // Refresh courses list
      await fetchCourses()
      setModal({ type: null, editing: null, open: false })
      resetCourseForm()
    } catch (error) {
      console.error("Course save error:", error)
      if (error.response?.status === 401) {
        showToast("Avtorizatsiya xatoligi. Qaytadan kiring.", "error")
        localStorage.removeItem("token")
        setToken(null)
      } else {
        showToast("Kursni saqlashda xatolik yuz berdi", "error")
      }
    } finally {
      setLoading((prev) => ({ ...prev, saving: false }))
    }
  }

  const deleteCourse = async (courseId) => {
    try {
      if (!token) {
        showToast("Tizimga kirish kerak", "error")
        return
      }

      await axios.delete(`${API_BASE_URL}/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setCourses((prev) => prev.filter((course) => course.id !== courseId))
      showToast("Kurs o'chirildi", "error")

      if (selectedCourse?.id === courseId) {
        setSelectedCourse(null)
      }
    } catch (error) {
      console.error("Delete course error:", error)
      if (error.response?.status === 401) {
        showToast("Avtorizatsiya xatoligi. Qaytadan kiring.", "error")
        localStorage.removeItem("token")
        setToken(null)
      } else {
        showToast("Kursni o'chirishda xatolik", "error")
      }
    }
  }

  // Utility functions
  const getRandomDefaultImage = () => {
    const images = [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400",
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
    ]
    return images[Math.floor(Math.random() * images.length)]
  }

  const showToast = (msg, type = "success") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const resetCourseForm = () => {
    setCourseForm({
      name: "",
      about: "",
      price: "",
      level: "BEGINNER",
      categoryId: "",
      banner: null,
    })
  }

  const openCourseModal = (course = null) => {
    if (course) {
      setCourseForm({
        name: course.title || "",
        about: course.about || "",
        price: course.price || "",
        level: course.level || "BEGINNER",
        categoryId: course.categoryId || "",
        banner: null,
      })
    } else {
      resetCourseForm()
    }
    setModal({ type: "course", editing: course, open: true })
  }

  useEffect(() => {
    if (token) {
      fetchProfile()
      fetchCourses()
      fetchCategories()
    } else {
      // Load demo data when no token
      fetchCategories() // This will load demo categories
      fetchCourses() // This will load demo courses
    }
  }, [token])

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-slate-900" : "bg-slate-50"}`}>
      {/* Header */}
      <div
        className={`border-b transition-colors ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <GraduationCap className={`h-8 w-8 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
              <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Mentor Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              {!token && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
                  <AlertCircle size={16} />
                  <span>Demo rejim</span>
                </div>
              )}

              {loading.profile && <div className="text-sm text-gray-500">Profile yuklanmoqda...</div>}

              {profile && (
                <div className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                  Salom,{" "}
                  {profile.fullName || profile.user?.fullName || profile.mentorProfile?.user?.fullName || "Mentor"}!
                </div>
              )}

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${darkMode ? "bg-slate-700 text-yellow-400 hover:bg-slate-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {!token && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="text-blue-600" size={20} />
              <div>
                <h3 className="font-medium text-blue-900">Demo Rejim</h3>
                <p className="text-sm text-blue-700">
                  Haqiqiy ma'lumotlar ko'rish uchun tizimga kiring. Hozir demo ma'lumotlar ko'rsatilmoqda.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={`p-6 rounded-xl ${darkMode ? "bg-slate-800" : "bg-white"} shadow-lg`}>
            <div className="flex items-center space-x-3">
              <BookOpen className="text-blue-500" size={24} />
              <div>
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Jami Kurslar</p>
                <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>{courses.length}</p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl ${darkMode ? "bg-slate-800" : "bg-white"} shadow-lg`}>
            <div className="flex items-center space-x-3">
              <Users className="text-green-500" size={24} />
              <div>
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Talabalar</p>
                <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {courses.reduce((sum, course) => sum + (course.students || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl ${darkMode ? "bg-slate-800" : "bg-white"} shadow-lg`}>
            <div className="flex items-center space-x-3">
              <Video className="text-purple-500" size={24} />
              <div>
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Videolar</p>
                <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {sections.reduce((sum, section) => sum + (section.videos?.length || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl ${darkMode ? "bg-slate-800" : "bg-white"} shadow-lg`}>
            <div className="flex items-center space-x-3">
              <Star className="text-yellow-500" size={24} />
              <div>
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>O'rtacha Reyting</p>
                <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {courses.length > 0
                    ? (courses.reduce((sum, course) => sum + (course.rating || 0), 0) / courses.length).toFixed(1)
                    : "0.0"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2
              className={`text-2xl font-bold flex items-center space-x-3 ${darkMode ? "text-white" : "text-slate-900"}`}
            >
              <FolderOpen className="text-blue-500" size={28} />
              <span>Mening Kurslarim</span>
            </h2>

            <button
              onClick={() => openCourseModal()}
              disabled={!token || loading.profile}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${!token || loading.profile
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                }`}
            >
              <Plus size={20} />
              <span>Yangi Kurs</span>
            </button>
          </div>

          {/* Loading State */}
          {loading.courses && (
            <div className="text-center py-8">
              <div className={`text-lg ${darkMode ? "text-white" : "text-slate-900"}`}>Kurslar yuklanmoqda...</div>
            </div>
          )}

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className={`group relative overflow-hidden rounded-2xl backdrop-blur-md border transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer ${darkMode
                    ? "bg-white/10 border-white/20 hover:bg-white/20"
                    : "bg-white/80 border-gray-200 hover:bg-white/90"
                  }`}
                onClick={() => setSelectedCourse(course)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = getRandomDefaultImage()
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        openCourseModal(course)
                      }}
                      disabled={!token}
                      className={`p-2 backdrop-blur-md rounded-full transition-colors ${!token ? "bg-gray-500/20 cursor-not-allowed" : "bg-white/20 hover:bg-white/30"
                        }`}
                    >
                      <Edit3 size={16} className="text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteCourse(course.id)
                      }}
                      disabled={!token}
                      className={`p-2 backdrop-blur-md rounded-full transition-colors ${!token ? "bg-gray-500/20 cursor-not-allowed" : "bg-red-500/20 hover:bg-red-500/30"
                        }`}
                    >
                      <Trash2 size={16} className="text-white" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className={`text-xl font-bold mb-2 line-clamp-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
                    {course.title}
                  </h3>
                  <p
                    className={`text-sm opacity-70 mb-4 line-clamp-2 ${darkMode ? "text-slate-300" : "text-slate-600"}`}
                  >
                    {course.about}
                  </p>

                  <div
                    className={`flex items-center gap-4 text-sm opacity-80 mb-4 ${darkMode ? "text-slate-300" : "text-slate-600"}`}
                  >
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{course.students}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">${course.price}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${course.level === "BEGINNER"
                          ? "bg-green-100 text-green-800"
                          : course.level === "INTERMEDIATE"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {course.level}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course Modal */}
      {modal.open && modal.type === "course" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`w-full max-w-2xl rounded-2xl p-6 ${darkMode ? "bg-slate-800" : "bg-white"} max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                {modal.editing ? "Kursni Tahrirlash" : "Yangi Kurs Qo'shish"}
              </h2>
              <button
                onClick={() => setModal({ type: null, editing: null, open: false })}
                className={`p-2 rounded-lg hover:bg-gray-100 ${darkMode ? "hover:bg-slate-700" : ""}`}
              >
                <X size={20} />
              </button>
            </div>

            {!token && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  Demo rejimda kurs qo'shish mumkin emas. Haqiqiy kurs qo'shish uchun tizimga kiring.
                </p>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (token) {
                  saveCourse(courseForm)
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-white" : "text-slate-700"}`}>
                  Kurs Nomi *
                </label>
                <input
                  type="text"
                  value={courseForm.name}
                  onChange={(e) => setCourseForm((prev) => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"}`}
                  required
                  disabled={!token}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-white" : "text-slate-700"}`}>
                  Tavsif *
                </label>
                <textarea
                  value={courseForm.about}
                  onChange={(e) => setCourseForm((prev) => ({ ...prev, about: e.target.value }))}
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"}`}
                  required
                  disabled={!token}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-white" : "text-slate-700"}`}>
                    Narx ($) *
                  </label>
                  <input
                    type="number"
                    value={courseForm.price}
                    onChange={(e) => setCourseForm((prev) => ({ ...prev, price: e.target.value }))}
                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"}`}
                    required
                    disabled={!token}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-white" : "text-slate-700"}`}>
                    Daraja *
                  </label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm((prev) => ({ ...prev, level: e.target.value }))}
                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"}`}
                    required
                    disabled={!token}
                  >
                    <option value="BEGINNER">Boshlang'ich</option>
                    <option value="INTERMEDIATE">O'rta</option>
                    <option value="ADVANCED">Yuqori</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-white" : "text-slate-700"}`}>
                  Kategoriya
                </label>
                <select
                  value={courseForm.categoryId}
                  onChange={(e) => setCourseForm((prev) => ({ ...prev, categoryId: e.target.value }))}
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"}`}
                  disabled={!token}
                >
                  <option value="">Kategoriya tanlang</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-white" : "text-slate-700"}`}>
                  Banner Rasm
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCourseForm((prev) => ({ ...prev, banner: e.target.files[0] }))}
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"}`}
                  disabled={!token}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading.saving || !token}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-colors ${loading.saving || !token
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                >
                  <Save size={20} />
                  <span>{loading.saving ? "Saqlanmoqda..." : "Saqlash"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModal({ type: null, editing: null, open: false })}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${darkMode
                      ? "bg-slate-700 text-white hover:bg-slate-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all transform ${toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  )
}
