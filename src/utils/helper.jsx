import axios from 'axios';
import { Link } from 'react-router-dom';
import { Box, Typography, IconButton, Stack } from '@mui/material';
import { ArrowForward, ArrowBack } from '@mui/icons-material';
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { FaTelegramPlane, FaInstagram, FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";

async function fetchCourses() {
  try {
    const res = await axios.get('https://edora-backend.onrender.com/courses?offset=0&limit=8');
    console.log(res.data);

    return res.data.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
}

async function fetchCategories() {
  try {
    const res = await axios.get('https://edora-backend.onrender.com/course-category/getAll');
    return res.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

export function CoursesSections() {
  const imgUrl = 'https://edora-backend.onrender.com/uploads/banner/'
  const imgUrl2 = 'https://edora-backend.onrender.com/uploads/mentors/'

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [visibleCoursesCount, setVisibleCoursesCount] = useState(2);

  useEffect(() => {
    const loadData = async () => {
      const courses = await fetchCourses();
      if (courses) {
        setAllCourses(courses);
      }

      const category = await fetchCategories();
      console.log(category);

      if (category) {
        setCategories(category);
      }
    };

    loadData();
  }, []);

  const categoryHandler = (id) => {
    setSelectedCategory(id);
  }

  const filteredCourses = selectedCategory
    ? allCourses.filter((course) => {
      const category = categories.find((category) => category.id === selectedCategory);
      return category && course.categoryId === category.id;
    })
    : allCourses;

  const visibleCourses = filteredCourses.slice(0, visibleCoursesCount);

  const handleSeeMore = () => {
    setVisibleCoursesCount(visibleCoursesCount + 3);
  };

  return (
    <div className='w-full bg-gradient-to-r from-blue-50 via-white to-white'>
      <div className="max-w-screen-xl mx-auto mt-16">
        <div className="flex flex-wrap justify-center mx-auto">
          <h2 className="text-6xl font-semibold mb-6 w-full ">Kurslar</h2>
          <div className="flex flex-wrap justify-around w-full mt-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => categoryHandler(category.id)}
                className={`px-6 py-3 rounded-lg text-lg border-blue-500 border-2 text-blue-500 
                                    ${selectedCategory === category.id ? 'bg-blue-600 text-white' : 'bg-white text-black hover:bg-blue-600 hover:text-white'}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {visibleCourses.length > 0 ? (
            visibleCourses.map((course) => (
              <div key={course.id} className="bg-white p-6 rounded-lg shadow-lg">
                <img
                  src={`${imgUrl}${course.banner}`}
                  alt={course.name}
                  className="w-full h-40 object-cover mb-4 rounded-lg"
                />


                <div className='flex items-center gap-3'>
                  <div className=' w-[50px] h-[50px] border-2rounded-[50%]'> <img src={`${imgUrl2}${course.mentor.image}`} alt="" className='w-full h-full rounded-[50%] bg-cover bg-center ' /></div>
                  <h1 className='text-xl font-semibold'>{course.mentor.fullName}</h1>
                </div> <br />
                <h3 className="text-xl font-semibold">{course.name}</h3>
                <p className="text-gray-600 mt-2">{course.about}</p>
                <div className="mt-4">
                  <span className="text-lg font-bold">{course.price} UZS</span>
                  <span className="text-sm text-gray-500 line-through ml-2">
                    {parseInt(course.price) + (parseInt(course.price) * course.discount) / 100} UZS
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">O'qituvchi: <span className='text-[17px] text-black'> {course.mentor.fullName}</span></p>
                <div className="mt-4 flex justify-between items-center">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500">
                    Kursga qo'shish
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-xl text-gray-500 mt-4">No courses available in this category</p>
          )}
        </div>
        {filteredCourses.length > visibleCoursesCount && (
          <div className="text-center mt-6">
            <button
              onClick={handleSeeMore}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition"
            >
              Ko'proq ko'rish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


export function CoursesSection() {
  const imgUrl = 'https://edora-backend.onrender.com/uploads/banner/'
  const imgUrl2 = 'https://edora-backend.onrender.com/uploads/mentors/'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [visibleCoursesCount, setVisibleCoursesCount] = useState(2);

  useEffect(() => {
    const loadData = async () => {
      const courses = await fetchCourses();
      if (courses) {
        setAllCourses(courses);
      }

      const category = await fetchCategories();
      console.log(category);

      if (category) {
        setCategories(category);
      }
    };

    loadData();
  }, []);

  const categoryHandler = (id) => {
    setSelectedCategory(id);
  }

  const filteredCourses = selectedCategory
    ? allCourses.filter((course) => {
      const category = categories.find((category) => category.id === selectedCategory);
      return category && course.categoryId === category.id;
    })
    : allCourses;

  const visibleCourses = filteredCourses.slice(0, visibleCoursesCount);


  const handleSeeMore = () => {
    setVisibleCoursesCount(visibleCoursesCount + 3);
  };

  return (
    <div className='w-full bg-gradient-to-r from-blue-50 via-white to-white'>
      <div className="max-w-screen-xl mx-auto mt-16">
        <div className="flex flex-wrap justify-center mx-auto">
          <h2 className="text-6xl font-semibold mb-6 w-full text-center">Ommabop kurslar</h2>
          <p className='text-center text-[18px] text-gray-500'>
            Kasbga yo'naltirilgan amaliy mashg'ulotlar yordamida tez va samarali ravishda mutaxassislar safiga qo'shiling. Har bir mashg'ulot <br />
            sohaning yetakchi mutaxassislari tomonidan eng zamonaviy o'quv dasturi asosida tayyorlangan.
          </p>
          <div className="flex flex-wrap justify-around w-full mt-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => categoryHandler(category.id)}
                className={`px-6 py-3 rounded-lg text-lg border-blue-500 border-2 text-blue-500 
                                    ${selectedCategory === category.id ? 'bg-blue-600 text-white' : 'bg-white text-black hover:bg-blue-600 hover:text-white'}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {visibleCourses.length > 0 ? (
            visibleCourses.map((course) => (
              <div key={course.id} className="bg-white p-6 rounded-lg shadow-lg">
                <img
                  src={`${imgUrl}${course.banner}`}
                  alt={course.name}
                  className="w-full h-40 object-cover mb-4 rounded-lg"
                />


                <div className='flex items-center gap-3'>
                  <div className=' w-[50px] h-[50px] border-2rounded-[50%]'> <img src={`${imgUrl2}${course.mentor.image}`} alt="" className='w-full h-full rounded-[50%] bg-cover bg-center ' /></div>
                  <h1 className='text-xl font-semibold'>{course.mentor.fullName}</h1>
                </div> <br />
                <h3 className="text-xl font-semibold">{course.name}</h3>
                <p className="text-gray-600 mt-2">{course.about}</p>
                <div className="mt-4">
                  <span className="text-lg font-bold">{course.price} UZS</span>
                  <span className="text-sm text-gray-500 line-through ml-2">
                    {parseInt(course.price) + (parseInt(course.price) * course.discount) / 100} UZS
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">O'qituvchi: <span className='text-[17px] text-black'> {course.mentor.fullName}</span></p>
                <div className="mt-4 flex justify-between items-center">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500">
                    Kursga qo'shish
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-xl text-gray-500 mt-4">No courses available in this category</p>
          )}
        </div>
        {filteredCourses.length > visibleCoursesCount && (
          <div className="text-center mt-6">
            <button
              onClick={handleSeeMore}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition"
            >
              Ko'proq ko'rish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


export function Contact() {
  return (
    <section className="py-16 px-4 max-w-full ">
      <div className=" mb-12 ml-75">
        <h1 className="text-6xl font-bold text-foreground mb-8">Bizga qo'shiling</h1>
        <p className="text-muted-foreground text-lg">
          Bizning safimizga nafaqat o'rganuvchi balki yetarlicha tajribangiz bo'lsa mentor sifatida ham{" "}
          <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">qo'shilishingiz</span> mumkin.
        </p>
      </div>

      <div className="flex justify-around gap-12">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-xs w-full">
          <h2 className="text-2xl font-semibold text-foreground mb-4">O'quvchimisiz?</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Agarda o'quvchi bo'lsangiz bizning xalqaro darajadagi tajribali mentorlarimizga shogird bo'ling
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition">
            <Link to={'/login'}>Boshlash</Link>
          </button>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-xl max-w-xs w-full">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Mentormisiz?</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Bizning mualliflar jamoamizga qo'shilib, o'z tajribangizni boshqalar bilan oson va qulay platforma orqali ulashing
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition">
            <a href="@omadbek_tuxtasinboyev_1709">Boshlash</a>
          </button>
        </div>
      </div>
    </section>

  );
}

export function MainSec() {
  return (
    <div className="bg-blue-600 flex items-center justify-around px-10 py-16">
      <div className="max-w-[5555px] ml-25 text-white">
        <h1 className="text-6xl font-bold mb-4">
          Istalgan nuqtadan onlayn <br /> o‘qish imkoniyati
        </h1>
        <p className="mb-6 text-lg">
          Biz sizga bu imkoniyatni taqdim qilamiz
        </p>
        <button className="bg-white text-black font-semibold px-6 py-3 rounded-2xl hover:shadow-2xl shadow hover:bg-gray-100 transition">
          <Link to={'/login'}>Ro‘yxatdan o‘tish</Link>
        </button>
      </div>

      <div>
        <img
          src="https://itliveacademy.uz/3d-img.webp"
          alt="AI Brain"
          className="w-75 h-auto"
        />
      </div>
    </div>
  );
}


async function fetchMentors() {
  try {
    const res = await axios.get("https://edora-backend.onrender.com/users/mentors");
    return res.data?.data || [];
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return [];
  }
}

function MentorCarousel() {
  const [allmentors, setAllmentors] = useState([]);
  const imgBaseUrl = "https://edora-backend.onrender.com/uploads/mentors/";
  const sliderRef = useRef();
  const [direction, setDirection] = useState("forward");
  const slidesToShow = 4;

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  useEffect(() => {
    const loadDatas = async () => {
      const mentors = await fetchMentors();
      setAllmentors(mentors);
    };
    loadDatas();
  }, []);

  useEffect(() => {
    if (allmentors.length === 0) return;

    const interval = setInterval(() => {
      if (!sliderRef.current) return;

      const slick = sliderRef.current;
      const currentSlide = slick.innerSlider?.state?.currentSlide || 0;
      const maxSlide = allmentors.length - slidesToShow;

      if (direction === "forward") {
        slick.slickNext();
        if (currentSlide >= maxSlide) setDirection("backward");
      } else {
        slick.slickPrev();
        if (currentSlide <= 0) setDirection("forward");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [direction, allmentors]);

  return (
    <section className="max-w-[1200px] mx-auto py-10">
      <Slider ref={sliderRef} {...settings}>
        {allmentors.map((mentor, idx) => (
          <div key={idx} className="p-4">
            <div className="relative group overflow-hidden shadow-lg rounded-xl">
              <img
                src={ `${imgBaseUrl}${mentor.image}`
                }
                alt={mentor.fullName}
                className="w-full h-[380px] object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full h-[140px] bg-gradient-to-t from-black via-black/70 to-transparent text-white p-4 transform translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-in-out">
                <h3 className="text-lg font-bold">{mentor.fullName}</h3>
                <p className="text-sm text-gray-300 mb-2">
                  {mentor.mentorProfile?.about || ""}
                </p>
                <div className="flex items-center gap-3 text-white text-xl">
                  {mentor.mentorProfile?.telegram && (
                    <a href={mentor.mentorProfile.telegram} target="_blank" rel="noreferrer">
                      <FaTelegramPlane />
                    </a>
                  )}
                  {mentor.mentorProfile?.instagram && (
                    <a href={mentor.mentorProfile.instagram} target="_blank" rel="noreferrer">
                      <FaInstagram />
                    </a>
                  )}
                  {mentor.mentorProfile?.facebook && (
                    <a href={mentor.mentorProfile.facebook} target="_blank" rel="noreferrer">
                      <FaFacebook />
                    </a>
                  )}
                  {mentor.mentorProfile?.github && (
                    <a href={mentor.mentorProfile.github} target="_blank" rel="noreferrer">
                      <FaGithub />
                    </a>
                  )}
                  {mentor.mentorProfile?.linkedin && (
                    <a href={mentor.mentorProfile.linkedin} target="_blank" rel="noreferrer">
                      <FaLinkedin />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}

export default MentorCarousel;
