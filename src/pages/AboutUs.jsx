import React from 'react'
import Header from '../components/Headers'
import Fotter from '../components/Fotter'
import MentorCarousel from '../utils/helper'
import Certificates from '../utils/Sertificate'

function AboutUs() {
    return (
        <div>
            <Header />
            <Certificates />
            <section className='max-w-[1300px] mx-auto mt-10'>
                <div className='text-center mb-10'>
                    <h1 className='text-[55px] font-bold mb-[10px]'>Tajribali mentorlar</h1>
                    <p className='text-gray-500 text-[20px] mb-[-50px]'>Barcha kurslarimiz tajribali mentorlar tomonidan tayyorlangan</p>
                </div>
                <MentorCarousel />
            </section>
            <Fotter />
        </div >
    )
}

export default AboutUs