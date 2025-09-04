import React, { useState } from "react";
import Header from "../components/Headers";
import Fotter from "../components/Fotter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  TrendingUp, 
  Star, 
  Play, 
  ChevronDown, 
  X,
  BookOpen,
  Users,
  Award
} from "lucide-react";

const course = {
  title: "PHP LARAVEL",
  description:
    "Bu kursda siz PHP dasturlash tili va Laravel frameworkini mukammal darajada o'rganasiz. Web dasturlash sohasida chuqur bilim olib, zamonaviy web ilovalar yaratishni o'rganasiz.",
  duration: "20 soat 56 daqiqa",
  level: "ADVANCED",
  price: 399000,
  rating: 4.5,
  students: 1247,
  topics: [
    {
      title: "Kirish",
      duration: "45 daqiqa",
      videos: [
        { title: "Dars 1: Kursga kirish", duration: "12:30", url: "https://www.w3schools.com/html/mov_bbb.mp4" }
      ]
    },
    {
      title: "HTML CSS asoslari. GIT & GITHUB",
      duration: "2 soat 30 daqiqa",
      videos: [
        { title: "Dars 2: HTML asoslari", duration: "45:20", url: "https://www.w3schools.com/html/movie.mp4" },
        { title: "Dars 3: CSS asoslari", duration: "38:15", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
        { title: "Dars 4: GIT va GitHub", duration: "52:10", url: "https://www.w3schools.com/html/mov_bbb.mp4" }
      ]
    }
  ]
};

function CoursesAdd() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [watchedVideos, setWatchedVideos] = useState([]);

  const toggleTopic = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
    setSelectedVideo(null);
  };

  const handleVideoEnd = (topicIndex, videoIndex) => {
    const key = `${topicIndex}-${videoIndex}`;
    if (!watchedVideos.includes(key)) setWatchedVideos([...watchedVideos, key]);

    // Keyingi videoga o'tish
    let nextTopic = topicIndex;
    let nextVideo = videoIndex + 1;

    if (nextVideo >= course.topics[topicIndex].videos.length) {
      nextTopic += 1;
      nextVideo = 0;
    }

    if (nextTopic < course.topics.length && course.topics[nextTopic].videos.length > 0) {
      setSelectedVideo(course.topics[nextTopic].videos[nextVideo]);
      setActiveIndex(nextTopic);
    } else {
      setSelectedVideo(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="text-white"
            >
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <Award className="h-4 w-4 mr-2" />
                {course.level} DARAJA
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {course.title}
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                {course.description}
              </p>
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span className="font-medium">{course.students} talaba</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 fill-current text-yellow-400" />
                  <span className="font-medium">{course.rating} reyting</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300"
                >
                  Kursni boshlash
                </motion.button>
                <div className="text-2xl font-bold">
                  {course.price.toLocaleString()} UZS
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-3 gap-8">
        {/* Course Topics */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <div className="flex items-center space-x-3 text-white">
                <BookOpen className="h-6 w-6" />
                <h2 className="text-2xl font-bold">Kurs mavzulari</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {course.topics.map((topic, index) => (
                <motion.div key={index} className="border border-gray-200 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => toggleTopic(index)}
                    className="w-full text-left px-6 py-4 font-semibold text-gray-800 bg-gradient-to-r from-gray-50 to-white hover:from-indigo-50 hover:to-purple-50 flex justify-between items-center group"
                  >
                    <div>
                      <div className="text-lg">{topic.title}</div>
                      <div className="text-sm text-gray-500 mt-1">{topic.duration}</div>
                    </div>
                    <motion.div
                      animate={{ rotate: activeIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-indigo-600 group-hover:text-purple-600"
                    >
                      <ChevronDown className="h-5 w-5" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {activeIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 p-6 space-y-3 bg-gray-50"
                      >
                        {topic.videos.length > 0 ? topic.videos.map((video, vIndex) => {
                          const key = `${index}-${vIndex}`;
                          const isWatched = watchedVideos.includes(key);
                          return (
                            <motion.div
                              key={vIndex}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => setSelectedVideo({ ...video, topicIndex: index, videoIndex: vIndex })}
                              className={`bg-white p-4 rounded-xl cursor-pointer flex justify-between items-center shadow-sm hover:shadow-md transition-all duration-300 ${isWatched ? "bg-green-50" : ""}`}
                            >
                              <div className="flex items-center space-x-3">
                                <Play className="h-4 w-4 text-indigo-600" />
                                <div>
                                  <div className="font-medium text-gray-800">{video.title}</div>
                                  <div className="text-sm text-gray-500">{video.duration}</div>
                                </div>
                              </div>
                              {isWatched && <span className="text-green-600 font-bold">✓</span>}
                            </motion.div>
                          );
                        }) : (
                          <p className="text-center text-gray-500 py-6">Bu mavzu uchun video mavjud emas</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6"
          >
            <h3 className="text-xl font-bold mb-6 text-gray-800">Kurs statistikasi</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Davomiyligi</span>
                </div>
                <span className="font-bold text-blue-600">{course.duration}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Daraja</span>
                </div>
                <span className="font-bold text-green-600">{course.level}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium">Reyting</span>
                </div>
                <span className="font-bold text-yellow-600">{course.rating}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Talabalar</span>
                </div>
                <span className="font-bold text-purple-600">{course.students}</span>
              </div>
            </div>
          </motion.div>

          {/* Price Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-xl text-white p-6"
          >
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{course.price.toLocaleString()} UZS</div>
              <div className="text-indigo-200 mb-6">Bir martalik to'lov</div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all duration-300 mb-4"
              >
                Kursni sotib olish
              </motion.button>
              <div className="text-sm text-indigo-200">
                • Barcha videolarga kirish<br/>
                • Sertifikat<br/>
                • Umrbod yangilanishlar
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <div className="flex justify-between items-center text-white">
                  <h3 className="text-xl font-bold">{selectedVideo.title}</h3>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <video
                  controls
                  className="w-full rounded-xl shadow-lg"
                  key={selectedVideo.url}
                  onEnded={() => handleVideoEnd(selectedVideo.topicIndex, selectedVideo.videoIndex)}
                >
                  <source src={selectedVideo.url} type="video/mp4" />
                  Browser video formatini qo‘llab-quvvatlamaydi.
                </video>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Fotter />
    </div>
  );
}

export default CoursesAdd;
