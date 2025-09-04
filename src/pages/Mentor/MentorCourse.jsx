  "use client"

  import { useState, useRef } from "react"
  import axios from "axios"
  import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
  import {
    Sun,
    Moon,
    Plus,
    BookOpen,
    Video,
    FolderOpen,
    Edit3,
    Trash2,
    Upload,
    X,
    GraduationCap,
    Users,
    Clock,
    Star,
    TrendingUp,
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    ArrowLeft,
  } from "lucide-react"

  const API_BASE_URL = "http://18.199.221.227:1709"
  const IMG_BASE_URL = "http://18.199.221.227:1709/uploads/banner/"
  const VIDEO_BASE_URL = "http://18.199.221.227:1709/uploads/introVideo/"

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken") || ""
    }
    return ""
  }

  // Default images from internet
  const DEFAULT_COURSE_IMAGES = [
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=250&fit=crop",
  ]

  const getRandomDefaultImage = () => {
    return DEFAULT_COURSE_IMAGES[Math.floor(Math.random() * DEFAULT_COURSE_IMAGES.length)]
  }

  export default function MentorCourse() {
    const queryClient = useQueryClient()

    const [darkMode, setDarkMode] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [selectedSection, setSelectedSection] = useState(null)
    const [modal, setModal] = useState({ type: null, editing: null, open: false })
    const [toast, setToast] = useState(null)
    const [videoPlayer, setVideoPlayer] = useState({ open: false, video: null })
    const [imageViewer, setImageViewer] = useState({ open: false, image: null, title: "" })
    const [uploadedFiles, setUploadedFiles] = useState({})
    const [sectionForm, setSectionForm] = useState({ id: null, title: "" })
    const [showSectionModal, setShowSectionModal] = useState(false)

    const {
      data: courses = [],
      isLoading,
      error,
      refetch: refetchCourses,
    } = useQuery({
      queryKey: ["courses"],
      queryFn: async () => {
        const response = await axios.get(`${API_BASE_URL}/courses?offset=0&limit=50`)
        return response.data.data.map((course) => ({
          id: course.id,
          title: course.name,
          instructor: course.mentor?.fullName || "Unknown",
          image: course.banner ? `${IMG_BASE_URL}${course.banner}` : getRandomDefaultImage(),
          students: course.studentsCount || 0,
          rating: course.rating || 0,
          duration: course.duration || "0h 0m",
          about: course.about || "",
          price: course.price || 0,
          level: course.level || "BEGINNER",
          sections: [],
        }))
      },
      staleTime: 5 * 60 * 1000,
      retry: 1,
    })

    const { data: sections = [], refetch: refetchSections } = useQuery({
      queryKey: ["sections", selectedCourse?.id],
      queryFn: async () => {
        const token = getAuthToken()
        const response = await axios.get(`${API_BASE_URL}/lessons-group/mine-all/${selectedCourse.id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        return response.data.map((section) => ({
          id: section.id,
          title: section.name,
          videos:
            section.lessons?.map((lesson) => ({
              id: lesson.id,
              title: lesson.name,
              url: lesson.videoUrl || "/placeholder-video.mp4",
              duration: lesson.duration || "0:00",
            })) || [],
        }))
      },
      enabled: !!selectedCourse?.id,
      staleTime: 2 * 60 * 1000,
    })

    const { data: ratings = [] } = useQuery({
      queryKey: ["ratings"],
      queryFn: async () => {
        const response = await axios.get(`${API_BASE_URL}/rating/all-list-latest`)
        return response.data
      },
      staleTime: 10 * 60 * 1000,
    })

    const createCourseMutation = useMutation({
      mutationFn: async (formData) => {
        const token = getAuthToken()
        const response = await axios.post(`${API_BASE_URL}/courses`, formData, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            "Content-Type": "multipart/form-data",
          },
        })
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["courses"] })
        showToast("Yangi kurs qo'shildi! 🎉")
        setModal({ type: null, editing: null, open: false })
      },
      onError: (err) => {
        console.log("[v0] Error creating course:", err)
        showToast("Kursni saqlashda xatolik yuz berdi", "error")
      },
    })

    const updateCourseMutation = useMutation({
      mutationFn: async ({ id, formData }) => {
        const token = getAuthToken()
        const response = await axios.put(`${API_BASE_URL}/courses/${id}`, formData, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            "Content-Type": "multipart/form-data",
          },
        })
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["courses"] })
        showToast("Kurs muvaffaqiyatli yangilandi! ✨")
        setModal({ type: null, editing: null, open: false })
      },
      onError: (err) => {
        console.log("[v0] Error updating course:", err)
        showToast("Kursni yangilashda xatolik yuz berdi", "error")
      },
    })

    const deleteCourseMutation = useMutation({
      mutationFn: async (id) => {
        const token = getAuthToken()
        const response = await axios.delete(`${API_BASE_URL}/courses/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["courses"] })
        showToast("Kurs o'chirildi", "error")
        if (selectedCourse) setSelectedCourse(null)
      },
      onError: (err) => {
        console.log("[v0] Error deleting course:", err)
        showToast("Kursni o'chirishda xatolik", "error")
      },
    })

    const createSectionMutation = useMutation({
      mutationFn: async (sectionData) => {
        const token = getAuthToken()
        const response = await axios.post(`${API_BASE_URL}/lessons-group`, sectionData, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["sections", selectedCourse?.id] })
        showToast("Yangi bo'lim qo'shildi! 📚")
        setShowSectionModal(false)
        setSectionForm({ id: null, title: "" })
      },
      onError: (err) => {
        console.log("[v0] Error creating section:", err)
        showToast("Bo'limni saqlashda xatolik", "error")
      },
    })

    const updateSectionMutation = useMutation({
      mutationFn: async ({ id, sectionData }) => {
        const token = getAuthToken()
        const response = await axios.patch(`${API_BASE_URL}/lessons-group/${id}`, sectionData, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["sections", selectedCourse?.id] })
        showToast("Bo'lim yangilandi! ✨")
        setShowSectionModal(false)
        setSectionForm({ id: null, title: "" })
      },
      onError: (err) => {
        console.log("[v0] Error updating section:", err)
        showToast("Bo'limni yangilashda xatolik", "error")
      },
    })

    const deleteSectionMutation = useMutation({
      mutationFn: async (id) => {
        const token = getAuthToken()
        const response = await axios.delete(`${API_BASE_URL}/lessons-group/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["sections", selectedCourse?.id] })
        showToast("Bo'lim o'chirildi", "error")
        if (selectedSection) setSelectedSection(null)
      },
      onError: (err) => {
        console.log("[v0] Error deleting section:", err)
        showToast("Bo'limni o'chirishda xatolik", "error")
      },
    })

    const showToast = (msg, type = "success") => {
      setToast({ msg, type })
      setTimeout(() => setToast(null), 3000)
    }

    const handleSaveCourse = async (data) => {
      const formData = new FormData()
      formData.append("name", data.title)
      formData.append("about", data.about || "")
      formData.append("price", data.price || 0)
      formData.append("level", data.level || "BEGINNER")
      formData.append("published", data.published || true)
      formData.append("categoryId", data.categoryId || 1)
      formData.append("mentorId", data.mentorId || 1)

      if (data.bannerFile) {
        formData.append("banner", data.bannerFile)
      }
      if (data.introVideoFile) {
        formData.append("introVideo", data.introVideoFile)
      }

      if (modal.editing) {
        updateCourseMutation.mutate({ id: modal.editing.id, formData })
      } else {
        createCourseMutation.mutate(formData)
      }
    }

    const handleDeleteCourse = (id) => {
      deleteCourseMutation.mutate(id)
    }

    const handleSaveSection = () => {
      if (!sectionForm.title.trim()) {
        showToast("Bo'lim nomini kiriting", "error")
        return
      }

      const sectionData = {
        name: sectionForm.title,
        courseId: selectedCourse.id,
      }

      if (sectionForm.id) {
        updateSectionMutation.mutate({ id: sectionForm.id, sectionData })
      } else {
        createSectionMutation.mutate(sectionData)
      }
    }

    const handleDeleteSection = (sectionId) => {
      deleteSectionMutation.mutate(sectionId)
    }

    const handleSaveVideo = async (data) => {
      try {
        const token = getAuthToken()
        const videoData = {
          title: data.title,
          videoUrl: data.url,
          duration: data.duration,
          lessonGroupId: selectedSection.id,
        }

        if (modal.editing) {
          await axios.patch(`${API_BASE_URL}/lessons/${modal.editing.id}`, videoData, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          })
          showToast("Video yangilandi ✨")
        } else {
          await axios.post(`${API_BASE_URL}/lessons`, videoData, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          })
          showToast("Yangi video qo'shildi! 🎥")
        }

        refetchSections()
        setModal({ type: null, editing: null, open: false })
      } catch (err) {
        console.log("[v0] Error saving video:", err)
        showToast("Videoni saqlashda xatolik", "error")
      }
    }

    const handleDeleteVideo = async (videoId) => {
      try {
        const token = getAuthToken()
        await axios.delete(`${API_BASE_URL}/lessons/${videoId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        refetchSections()
        showToast("Video o'chirildi", "error")
      } catch (err) {
        console.log("[v0] Error deleting video:", err)
        showToast("Videoni o'chirishda xatolik", "error")
      }
    }

    const openVideoPlayer = (video) => {
      setVideoPlayer({ open: true, video })
    }

    const closeVideoPlayer = () => {
      setVideoPlayer({ open: false, video: null })
    }

    const openImageViewer = (image, title) => {
      setImageViewer({ open: true, image, title })
    }

    const closeImageViewer = () => {
      setImageViewer({ open: false, image: null, title: "" })
    }

    const handleFileUpload = (file, type = "video") => {
      if (file) {
        const fileUrl = URL.createObjectURL(file)
        const fileId = Date.now()
        setUploadedFiles((prev) => ({
          ...prev,
          [fileId]: { url: fileUrl, name: file.name, type, file },
        }))
        return { url: fileUrl, name: file.name, id: fileId }
      }
      return null
    }

    const handleCourseSelect = async (course) => {
      setSelectedCourse(course)
      setSelectedSection(null)
      refetchSections()
    }

    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Kurslar yuklanmoqda...</p>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">API ga ulanishda xatolik yuz berdi</p>
            <button
              onClick={() => refetchCourses()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Qayta urinish
            </button>
          </div>
        </div>
      )
    }

    return (
      <div
        className={`min-h-screen transition-all duration-500 ${
          darkMode
            ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
            : "bg-gradient-to-br from-slate-50 via-white to-slate-100"
        }`}
      >
        {/* Header */}
        <div
          className={` top-0 z-40 backdrop-blur-xl border-b transition-all duration-300 ${
            darkMode ? "bg-slate-900/80 border-slate-700/50" : "bg-white/80 border-slate-200/50"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                  <GraduationCap className="text-white" size={28} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Mentor Dashboard
                  </h1>
                  <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                    Kurslaringizni boshqaring va rivojlantiring
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div
                  className={`px-4 py-2 rounded-xl ${
                    darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <span className="text-sm font-medium">{courses.length} ta kurs</span>
                </div>

                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                    darkMode
                      ? "bg-slate-800 hover:bg-slate-700 text-yellow-400"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard
              icon={<BookOpen className="text-blue-500" size={24} />}
              title="Jami Kurslar"
              value={courses.length}
              darkMode={darkMode}
            />
            <StatsCard
              icon={<Users className="text-green-500" size={24} />}
              title="Talabalar"
              value={courses.reduce((sum, course) => sum + (course.students || 0), 0)}
              darkMode={darkMode}
            />
            <StatsCard
              icon={<Video className="text-purple-500" size={24} />}
              title="Videolar"
              value={sections.reduce((sum, section) => sum + section.videos.length, 0)}
              darkMode={darkMode}
            />
            <StatsCard
              icon={<Star className="text-yellow-500" size={24} />}
              title="O'rtacha Reyting"
              value={
                courses.length > 0
                  ? (courses.reduce((sum, course) => sum + (course.rating || 0), 0) / courses.length).toFixed(1)
                  : "0.0"
              }
              darkMode={darkMode}
            />
          </div>

          {/* Courses Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center space-x-3">
                <FolderOpen className="text-blue-500" size={28} />
                <span>Mening Kurslarim</span>
              </h2>

              <button
                onClick={() => setModal({ type: "course", editing: null, open: true })}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Plus size={20} />
                <span className="font-medium">Yangi Kurs</span>
              </button>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className={`group relative overflow-hidden rounded-2xl backdrop-blur-md border transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer ${
                    darkMode
                      ? "bg-white/10 border-white/20 hover:bg-white/20"
                      : "bg-white/80 border-gray-200 hover:bg-white/90"
                  }`}
                  onClick={() => handleCourseSelect(course)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = getRandomDefaultImage()
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        openImageViewer(course.image, course.title)
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setModal({ type: "course", editing: course, open: true })
                        }}
                        className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
                      >
                        <Edit3 size={16} className="text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteCourse(course.id)
                        }}
                        className="p-2 bg-red-500/20 backdrop-blur-md rounded-full hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 size={16} className="text-white" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-sm opacity-70 mb-4 line-clamp-2">{course.about}</p>

                    <div className="flex items-center gap-4 text-sm opacity-80 mb-4">
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
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          course.level === "BEGINNER"
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

          {/* Sections */}
          {selectedCourse && (
            <div
              className={`rounded-2xl p-6 transition-all duration-300 ${
                darkMode ? "bg-slate-800/50 border border-slate-700/50" : "bg-white border border-slate-200/50"
              } backdrop-blur-sm shadow-xl`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center space-x-3">
                  <FolderOpen className="text-green-500" size={24} />
                  <span>{selectedCourse.title} - Bo'limlar</span>
                </h2>

                <button
                  onClick={() => setModal({ type: "section", editing: null, open: true })}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:scale-105"
                >
                  <Plus size={18} />
                  <span>Bo'lim Qo'shish</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.map((section) => (
                  <ModernSectionCard
                    key={section.id}
                    section={section}
                    onEdit={() => setModal({ type: "section", editing: section, open: true })}
                    onDelete={() => handleDeleteSection(section.id)}
                    onSelect={() => setSelectedSection(section)}
                    isSelected={selectedSection?.id === section.id}
                    darkMode={darkMode}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Videos */}
          {selectedSection && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setSelectedSection(null)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                      darkMode
                        ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    <ArrowLeft size={18} />
                    <span>Orqaga</span>
                  </button>
                  <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>
                    {selectedSection.title} - Videolar
                  </h2>
                </div>

                <button
                  onClick={() => setModal({ type: "video", editing: null, open: true })}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-lg hover:from-purple-600 hover:to-violet-700 transition-all duration-300 hover:scale-105"
                >
                  <Plus size={18} />
                  <span>Video Qo'shish</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedSection.videos.map((video) => (
                  <ModernVideoCard
                    key={video.id}
                    video={video}
                    darkMode={darkMode}
                    onPlay={() => openVideoPlayer(video)}
                    onEdit={() => setModal({ type: "video", editing: video, open: true })}
                    onDelete={() => handleDeleteVideo(video.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Toast */}
        {toast && <ModernToast msg={toast.msg} type={toast.type} darkMode={darkMode} />}

        {/* Modals */}
        {modal.open && (
          <ModernModal onClose={() => setModal({ type: null, editing: null, open: false })} darkMode={darkMode}>
            {modal.type === "course" && (
              <ModernCourseForm
                initialData={modal.editing}
                onSave={handleSaveCourse}
                onCancel={() => setModal({ type: null, editing: null, open: false })}
                darkMode={darkMode}
              />
            )}
            {modal.type === "section" && (
              <ModernSectionForm
                initialData={modal.editing}
                onSave={handleSaveSection}
                onCancel={() => setModal({ type: null, editing: null, open: false })}
                darkMode={darkMode}
              />
            )}
            {modal.type === "video" && (
              <ModernVideoForm
                initialData={modal.editing}
                onSave={handleSaveVideo}
                onCancel={() => setModal({ type: null, editing: null, open: false })}
                darkMode={darkMode}
              />
            )}
          </ModernModal>
        )}

        {/* Video Player Modal */}
        {videoPlayer.open && (
          <VideoPlayerModal
            video={videoPlayer.video}
            onClose={closeVideoPlayer}
            darkMode={darkMode}
            showToast={showToast}
          />
        )}

        {/* Image Viewer Modal */}
        {imageViewer.open && (
          <ImageViewerModal
            image={imageViewer.image}
            title={imageViewer.title}
            onClose={closeImageViewer}
            darkMode={darkMode}
          />
        )}
      </div>
    )
  }

  const StatsCard = ({ icon, title, value, darkMode }) => (
    <div
      className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer ${
        darkMode
          ? "bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/70"
          : "bg-white border border-slate-200/50 hover:shadow-lg"
      } backdrop-blur-sm`}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-xl ${darkMode ? "bg-slate-700/50" : "bg-slate-50"}`}>{icon}</div>
        <div>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  )

  const ModernSectionCard = ({ section, onEdit, onDelete, onSelect, isSelected, darkMode }) => (
    <div
      className={`p-4 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer ${
        isSelected
          ? "ring-2 ring-green-500 shadow-lg"
          : darkMode
            ? "bg-slate-700/50 hover:bg-slate-700/70"
            : "bg-slate-50 hover:bg-slate-100"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold flex items-center space-x-2">
          <FolderOpen size={18} className="text-green-500" />
          <span>{section.title}</span>
        </h4>

        <div className="flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-lg transition-colors"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-1">
          <Video size={14} className="text-purple-500" />
          <span>{section.videos?.length || 0} video</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
          className="text-green-500 hover:text-green-600 transition-colors"
        >
          Ko'rish →
        </button>
      </div>
    </div>
  )

  const ModernVideoCard = ({ video, darkMode, onPlay, onEdit, onDelete }) => (
    <div
      className={`group p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
        darkMode ? "bg-slate-700/50 hover:bg-slate-700/70" : "bg-slate-50 hover:bg-slate-100"
      }`}
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <Video size={18} className="text-purple-500" />
        </div>

        <div className="flex-1">
          <h5 className="font-medium">{video.title}</h5>
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <Clock size={12} />
            <span>{video.duration || "0:00"}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {video.url && (
          <div className="relative">
            <video src={video.url} className="w-full h-32 object-cover rounded-lg" poster="/video-thumbnail.png" />
            <button
              onClick={onPlay}
              className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/70 transition-colors rounded-lg group"
            >
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full group-hover:scale-110 transition-transform">
                <Play size={24} className="text-white ml-1" />
              </div>
            </button>
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={onPlay}
            className="flex-1 p-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 rounded-lg transition-colors flex items-center justify-center space-x-1"
          >
            <Play size={14} />
            <span className="text-sm">Ko'rish</span>
          </button>
          <button
            onClick={onEdit}
            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-lg transition-colors"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )

  const VideoPlayerModal = ({ video, onClose, darkMode, showToast }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const videoRef = useRef(null)

    const togglePlay = () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause()
        } else {
          videoRef.current.play()
        }
        setIsPlaying(!isPlaying)
      }
    }

    const toggleMute = () => {
      if (videoRef.current) {
        videoRef.current.muted = !isMuted
        setIsMuted(!isMuted)
      }
    }

    const toggleFullscreen = () => {
      if (videoRef.current) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen()
        }
      }
    }

    const handleTimeUpdate = () => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime)
      }
    }

    const handleLoadedMetadata = () => {
      if (videoRef.current) {
        setDuration(videoRef.current.duration)
      }
    }

    const handleSeek = (e) => {
      if (videoRef.current) {
        const rect = e.currentTarget.getBoundingClientRect()
        const pos = (e.clientX - rect.left) / rect.width
        videoRef.current.currentTime = pos * duration
      }
    }

    const formatTime = (time) => {
      const minutes = Math.floor(time / 60)
      const seconds = Math.floor(time % 60)
      return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

        <div className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center justify-between">
              <h3 className="text-white text-lg font-semibold">{video.title}</h3>
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <X size={24} className="text-white" />
              </button>
            </div>
          </div>

          <div className="relative aspect-video bg-black">
            <video
              ref={videoRef}
              src={video.url}
              className="w-full h-full object-contain"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onError={(e) => {
                console.log("[v0] Video loading error:", e.target.error)
                showToast("Video yuklanmadi", "error")
              }}
              onClick={togglePlay}
            />

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="w-full h-2 bg-white/20 rounded-full mb-4 cursor-pointer" onClick={handleSeek}>
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-150"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={togglePlay}
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                  >
                    {isPlaying ? (
                      <Pause size={24} className="text-white" />
                    ) : (
                      <Play size={24} className="text-white ml-1" />
                    )}
                  </button>

                  <button onClick={toggleMute} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                    {isMuted ? (
                      <VolumeX size={20} className="text-white" />
                    ) : (
                      <Volume2 size={20} className="text-white" />
                    )}
                  </button>

                  <span className="text-white text-sm font-medium">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <button onClick={toggleFullscreen} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <Maximize size={20} className="text-white" />
                </button>
              </div>
            </div>

            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={togglePlay}
                  className="p-6 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110"
                >
                  <Play size={48} className="text-white ml-2" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const ImageViewerModal = ({ image, title, onClose, darkMode }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div
        className={`relative max-w-4xl max-h-[90vh] ${
          darkMode ? "bg-slate-900" : "bg-white"
        } rounded-2xl overflow-hidden shadow-2xl`}
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-4">
          <img
            src={image || getRandomDefaultImage()}
            alt={title}
            className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
            onError={(e) => {
              e.target.src = getRandomDefaultImage()
            }}
          />
        </div>
      </div>
    </div>
  )

  const ModernToast = ({ msg, type, darkMode }) => (
    <div
      className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-2xl backdrop-blur-sm transition-all duration-300 ${
        type === "error" ? "bg-red-500/90 text-white" : "bg-green-500/90 text-white"
      }`}
    >
      <div className="flex items-center space-x-2">
        {type === "error" ? <X size={18} /> : <TrendingUp size={18} />}
        <span className="font-medium">{msg}</span>
      </div>
    </div>
  )

  const ModernModal = ({ children, onClose, darkMode }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />

      <div
        className={`relative w-full max-w-md transform transition-all duration-300 ${
          darkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
        } rounded-2xl shadow-2xl backdrop-blur-sm`}
      >
        {children}
      </div>
    </div>
  )

  const ModernCourseForm = ({ onSave, onCancel, initialData, darkMode }) => {
    const [form, setForm] = useState(
      initialData || {
        title: "",
        instructor: "",
        image: "",
        students: 0,
        rating: 5.0,
        duration: "0 soat",
        about: "",
        price: 0,
        level: "BEGINNER",
      },
    )

    const handleFile = (e) => {
      const f = e.target.files[0]
      if (f) {
        setForm({ ...form, image: URL.createObjectURL(f), bannerFile: f })
      }
    }

    return (
      <div className="p-6 space-y-6">
        <h2 className="text-xl font-bold">{initialData ? "Kursni Tahrirlash" : "Yangi Kurs Qo'shish"}</h2>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
              Kurs Nomi
            </label>
            <input
              type="text"
              placeholder="Masalan: React Asoslari"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={`w-full p-3 rounded-xl border transition-colors ${
                darkMode
                  ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500"
                  : "bg-white border-slate-300 focus:border-blue-500"
              } focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
              Tavsif
            </label>
            <textarea
              placeholder="Kurs haqida qisqacha ma'lumot"
              value={form.about}
              onChange={(e) => setForm({ ...form, about: e.target.value })}
              rows={3}
              className={`w-full p-3 rounded-xl border transition-colors ${
                darkMode
                  ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500"
                  : "bg-white border-slate-300 focus:border-blue-500"
              } focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                Narx ($)
              </label>
              <input
                type="number"
                placeholder="299"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className={`w-full p-3 rounded-xl border transition-colors ${
                  darkMode
                    ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500"
                    : "bg-white border-slate-300 focus:border-blue-500"
                } focus:ring-2 focus:ring-blue-500/20`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                Daraja
              </label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className={`w-full p-3 rounded-xl border transition-colors ${
                  darkMode
                    ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500"
                    : "bg-white border-slate-300 focus:border-blue-500"
                } focus:ring-2 focus:ring-blue-500/20`}
              >
                <option value="BEGINNER">Boshlang'ich</option>
                <option value="INTERMEDIATE">O'rta</option>
                <option value="ADVANCED">Yuqori</option>
              </select>
            </div>
          </div>

          {form.image ? (
            <div className="relative">
              <img
                src={form.image || "/placeholder.svg"}
                alt="Kurs rasmi"
                className="w-full h-32 object-cover rounded-xl"
                onError={(e) => {
                  e.target.src = getRandomDefaultImage()
                }}
              />
              <button
                onClick={() => setForm({ ...form, image: "", bannerFile: null })}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                darkMode
                  ? "border-slate-600 hover:border-slate-500 bg-slate-700/50"
                  : "border-slate-300 hover:border-slate-400 bg-slate-50"
              }`}
            >
              <Upload size={24} className="text-slate-400 mb-2" />
              <p className="text-sm text-slate-500">Rasm yuklash</p>
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
          )}
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            onClick={onCancel}
            className={`flex-1 py-3 rounded-xl transition-colors ${
              darkMode
                ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            Bekor Qilish
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50"
            disabled={!form.title}
          >
            Saqlash
          </button>
        </div>
      </div>
    )
  }

  const ModernSectionForm = ({ onSave, onCancel, initialData, darkMode }) => {
    const [form, setForm] = useState(initialData || { title: "" })

    return (
      <div className="p-6 space-y-6">
        <h2 className="text-xl font-bold">{initialData ? "Bo'limni Tahrirlash" : "Yangi Bo'lim Qo'shish"}</h2>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
            Bo'lim Nomi
          </label>
          <input
            type="text"
            placeholder="Masalan: Kirish"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={`w-full p-3 rounded-xl border transition-colors ${
              darkMode
                ? "bg-slate-700 border-slate-600 text-white focus:border-green-500"
                : "bg-white border-slate-300 focus:border-green-500"
            } focus:ring-2 focus:ring-green-500/20`}
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            onClick={onCancel}
            className={`flex-1 py-3 rounded-xl transition-colors ${
              darkMode
                ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            Bekor Qilish
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50"
            disabled={!form.title}
          >
            Saqlash
          </button>
        </div>
      </div>
    )
  }

  const ModernVideoForm = ({ onSave, onCancel, initialData, darkMode }) => {
    const [form, setForm] = useState(initialData || { title: "", url: "", duration: "0:00" })
    const [selectedFile, setSelectedFile] = useState(null)
    const [isLoadingDuration, setIsLoadingDuration] = useState(false)

    const handleFileChange = (e) => {
      const file = e.target.files[0]
      if (file && file.type.startsWith("video/")) {
        setSelectedFile(file)
        setIsLoadingDuration(true)
        const fileUrl = URL.createObjectURL(file)
        setForm({ ...form, url: fileUrl, duration: "Yuklanmoqda..." })

        const video = document.createElement("video")
        video.src = fileUrl

        video.onloadedmetadata = () => {
          const minutes = Math.floor(video.duration / 60)
          const seconds = Math.floor(video.duration % 60)
          setForm((prev) => ({
            ...prev,
            duration: `${minutes}:${seconds.toString().padStart(2, "0")}`,
          }))
          setIsLoadingDuration(false)
          video.remove()
        }

        video.onerror = (e) => {
          console.log("[v0] Video duration extraction error:", e)
          setForm((prev) => ({ ...prev, duration: "0:00" }))
          setIsLoadingDuration(false)
          video.remove()
        }
      }
    }

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{initialData ? "Videoni Tahrirlash" : "Yangi Video Qo'shish"}</h2>
          <button
            onClick={onCancel}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-600"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
              Video Nomi
            </label>
            <input
              type="text"
              placeholder="Masalan: React nima?"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={`w-full p-3 rounded-xl border transition-colors ${
                darkMode
                  ? "bg-slate-700 border-slate-600 text-white focus:border-purple-500"
                  : "bg-white border-slate-300 focus:border-purple-500"
              } focus:ring-2 focus:ring-purple-500/20`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
              Video Fayl
            </label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 transition-colors ${
                darkMode
                  ? "border-slate-600 hover:border-purple-500 bg-slate-700/50"
                  : "border-slate-300 hover:border-purple-500 bg-slate-50"
              }`}
            >
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center">
                <Upload className={`mx-auto h-12 w-12 ${darkMode ? "text-slate-400" : "text-slate-500"}`} />
                <p className={`mt-2 text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                  {selectedFile ? selectedFile.name : "Video faylni tanlang yoki shu yerga tashlang"}
                </p>
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  MP4, WebM, AVI formatlarini qo'llab-quvvatlaydi
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
              Davomiyligi
            </label>
            <input
              type="text"
              placeholder="Avtomatik aniqlanadi"
              value={form.duration}
              readOnly
              className={`w-full p-3 rounded-xl border transition-colors cursor-not-allowed ${
                darkMode ? "bg-slate-800 border-slate-600 text-slate-400" : "bg-slate-100 border-slate-300 text-slate-600"
              } ${isLoadingDuration ? "animate-pulse" : ""}`}
            />
            <p className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Video yuklanganda davomiyligi avtomatik aniqlanadi
            </p>
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            onClick={onCancel}
            className={`flex-1 py-3 rounded-xl transition-colors ${
              darkMode
                ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            Bekor Qilish
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl hover:from-purple-600 hover:to-violet-700 transition-all duration-300 disabled:opacity-50"
            disabled={!form.title || (!selectedFile && !form.url)}
          >
            Saqlash
          </button>
        </div>
      </div>
    )
  }
