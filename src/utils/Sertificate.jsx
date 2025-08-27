import React from 'react';

const Certificates = () => {
    return (

        <div className="container mx-auto py-10">
            <div className="w-full max-w-screen-xl mx-auto px-4 py-10">
                <div className=" mb-12">
                    <h2 className="text-4xl font-semibold text-gray-800">Biz haqiimizda</h2>
                    <p className="mt-4 text-lg text-gray-600">
                        IT LIVE ACADEMY - 08.09.2022 yil tashkil etilgan va hozirgacha faoliyat olib kelmoqda. IT LIVE ACADEMY kompaniyasining asosiy faoliyat turi ikkiga bo'linadi, -Kelajak
                        kasblariga o'qitish -IT sohasida xizmatlarini yetkazib berish dan iborat. Bizning akademiyamiz axborot texnologiyalarining barcha tendensiyalari bilan yaqindan tanishtiradi.
                        Shinam o'quv binosi va zamonaviy texnologiyalarga asoslangan kurslar dasturi bilan yurtimizning eng yirik, xalqaro kompaniyalarida IT karerangizni boshlaysiz.
                    </p>
                </div>
                <h3 className="text-5xl font-semibold  mb-8">Media galereya</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    <img
                        src="https://itliveacademy.uz/img1.png"
                        alt="Rasm 1"
                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                    />

                    <img
                        src="https://itliveacademy.uz/img2.png"
                        alt="Rasm 2"
                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                    />

                    <img
                        src="https://itliveacademy.uz/img3.png"
                        alt="Rasm 3"
                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                    />

                    <img
                        src="https://itliveacademy.uz/img4.png"
                        alt="Rasm 4"
                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                    />

                    <img
                        src="https://itliveacademy.uz/img5.png"
                        alt="Rasm 5"
                        className="w-full h-72 object-cover rounded-lg shadow-lg lg:col-span-2"
                    />
                </div>
            </div>


            <h2 className=" text-4xl font-semibold mb-15 ml-35">Sertifikat va guvohnomalar</h2>
            <div className="flex justify-center gap-8 w-full">
                <div className="w-[400px]   h-[560px] p-8 pt-12 shadow-2xl rounded-2xl">
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIfMHiMu0rfAaIWFIkxezqtrq-AnYAn4wQ0g&s"
                        alt="Sertifikat 1"
                        className="w-full h-auto border-2 border-gray-300 shadow-lg rounded-lg hover:scale-120"
                    />
                </div>
                <div className="w-[400px]  h-[560px] p-8 pt-12 shadow-2xl rounded-2xl">
                    <img
                        src="https://cdn.prod.website-files.com/60a530a795c0ca8a81c5868a/661ff23cf5f40891e7b890f0_1.png"
                        alt="Sertifikat 2"
                        className="w-full h-auto border-2 border-gray-300 shadow-lg rounded-lg hover:scale-120"
                    />
                </div>
                <div className="w-[400px]  h-[560px] p-12 shadow-2xl flex flex-col gap-y-2 rounded-2xl">
                    <img
                        src="https://media.istockphoto.com/id/1753701136/vector/modern-elegant-black-and-yellow-certificate-template-appreciation-for-business-and-education.jpg?s=612x612&w=0&k=20&c=jquAHZ3o5ex31f48JEQy7iMBXJYbUPjeXswVuYhVRj0="
                        alt="Sertifikat 3"
                        className="w-full h-[230px] border-2 border-gray-300 shadow-lg rounded-lg hover:scale-120"
                    />
                    <img
                        src="https://static.vecteezy.com/system/resources/previews/008/089/253/non_2x/certificate-gold-appreciation-achievement-template-award-achievement-clean-creative-certificate-recognition-excellence-certificate-border-completion-template-certificate-design-template-vector.jpg"
                        alt="Sertifikat 3"
                        className="w-full h-[235px] border-2 border-gray-300 shadow-lg rounded-lg hover:scale-120"
                    />
                </div>
            </div>
        </div>
    );
};

export default Certificates;
