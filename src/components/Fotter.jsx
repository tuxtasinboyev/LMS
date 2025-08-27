import React from 'react'
import { Link } from 'react-router-dom'

function Fotter() {
    return (
        <div> <section className='max-w-[1300px] mx-auto mt-10'>
            <div className='text-center mb-10'>
                <div className='flex justify-center'>
                    <img src={'https://itliveacademy.uz/logo-dark.svg'} alt="" />
                </div>
                <h1 className='mt-[15px] mb-[10px] text-[27px] font-bold'>Biz bilan muvaffaqiyatga erishing</h1>
                <p className=' mb-[10px] text-[21px] text-gray-500 font-bold'>Barcha kurslarimiz tajribali mentorlar tomonidan tayyorlangan</p>

                <div className='flex justify-center gap-5'>
                    <a href="https://youtube.com/shorts/yOFGIwt3yvQ?si=hidbF6QyiScxf18a"><button className='border cursor-pointer w-[170px] flex h-[50px] justify-center items-center gap-3 rounded-[10px]'><span><img className='w-[15px]' src={'https://www.shutterstock.com/image-vector/play-button-vector-icon-260nw-765928261.jpg'} alt="" /></span>Intro video</button>
                    </a>
                    <button className='w-[130px] cursor-pointer h-[50px] rounded-[10px] bg-blue-500 text-white font-bold border'>
                        <Link to="/contact">Bo'glanish</Link>
                    </button>
                </div>
            </div>
        </section>

            <section className='max-w-[1300px] mx-auto mt-15'>
                <div>
                    <hr className=' bg-gray-500 ' />
                </div>
                <div className='flex justify-between mt-[20px]'>
                    <h1 className='text-gray-500'>© ITLIVE 2024. Barcha huquqlar himoyalangan</h1>
                    <p className='text-gray-500'>Xavfsizlik</p>
                </div>
            </section>
        </div>
    )
}

export default Fotter