import React from 'react';
import Header from '../components/Headers';
import MentorCarousel, { Contact, CoursesSection, MainSec } from '../utils/helper';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReviewCarousel from '../utils/review';
import { Link } from 'react-router-dom';
import Fotter from '../components/Fotter';

function Home() {
  return (
    <div>
      <Header />
      <div className="relative max-w-screen-xl container flex flex-col lg:flex-row items-center justify-between px-6 py-12  mx-auto">
        <div className=" mb-8 lg:mb-0  lg:w-[50%] ">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-red-500">
            Kelajak kasblarini <span className="text-black">biz bilan o'rganing!</span>
          </h1>
          <p className="text-lg text-gray-700 mt-4">
            Dasturlashni arzon va sifatli o'qib, o'z karyerangizni quring.
          </p>
          <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-3xl text-lg hover:bg-blue-500">
            <Link to={'/course'}>Kurslar bilan tanishish</Link>
          </button>
        </div>

        <div className="max-w-[700px] lg:max-w-[600px] w-full lg:w-[50%]">
          <img src="https://itliveacademy.uz/home.png" alt="Computer illustration" className="w-full h-auto" />
        </div>
      </div>
      <CoursesSection />
      <Contact />
      <MainSec />
      <section className='max-w-[1300px] mx-auto mt-10'>
        <div className='text-center mb-10'>
          <h1 className='text-[55px] font-bold mb-[10px]'>Tajribali mentorlar</h1>
          <p className='text-gray-500 text-[20px] mb-[-50px]'>Barcha kurslarimiz tajribali mentorlar tomonidan tayyorlangan</p>
        </div>

        <MentorCarousel />
      </section>
      <section className='max-w-[1300px] mx-auto mt-10'>
        <div className='text-center mb-10'>
          <h1 className='text-[55px] font-bold mb-[10px]'>Izohlar</h1>
          <p className='text-gray-500 text-[20px] mb-[-50px]'>O'quvchilarimiz tomonidan qoldirilgan izohlar</p>

        </div>

        <ReviewCarousel />
      </section>

      <Fotter />
    </div>
  );
}

export default Home;
