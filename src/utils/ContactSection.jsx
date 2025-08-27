import axios from "axios";
import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaUser, FaMobileAlt } from "react-icons/fa";

function ContactSection() {
    const [contact, setContact] = useState({ fullName: '', phone: '', message: '' })

    const sendContact = async (e) => {
        e.preventDefault()
        const res = await axios.post('https://edora-backend.onrender.com/api/contact', {
            fullName: contact.fullName,
            phone: contact.phone,
            message: contact.message
        })
        if (res.status === 201) {
            alert('Tez orada adminlarimiz sizga bog\'lanishadi')
        }
    }
    return (
        <div className="w-full bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Savollaringiz bo’lsa murojaat qiling
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white shadow p-6 rounded-md text-center">
                        <FaPhoneAlt className="text-blue-600 text-3xl mx-auto mb-3" />
                        <h3 className="font-semibold text-lg">Telefon</h3>
                        <p className="text-gray-600 mt-2">+998 (97) 866 50 50</p>
                    </div>

                    <div className="bg-white shadow p-6 rounded-md text-center">
                        <FaEnvelope className="text-blue-600 text-3xl mx-auto mb-3" />
                        <h3 className="font-semibold text-lg">Elektron Pochta</h3>
                        <p className="text-gray-600 mt-2">itliveguliston2023@gmail.com</p>
                    </div>

                    <div className="bg-white shadow p-6 rounded-md text-center">
                        <FaMapMarkerAlt className="text-blue-600 text-3xl mx-auto mb-3" />
                        <h3 className="font-semibold text-lg">Manzil</h3>
                        <p className="text-gray-600 mt-2">
                            Sirdaryo vil, Guliston sh, 1-mavze, IT LIVE ACADEMY
                        </p>
                    </div>
                </div>

                <div className="bg-white shadow rounded-md p-8 max-w-2xl mx-auto">
                    <h3 className="text-2xl font-bold text-center mb-6">
                        Murojaatlarni shu yerdan jo'nating!
                    </h3>

                    <form className="space-y-4">
                        <div className="relative">
                            <FaUser className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                onChange={(index) => setContact({ ...contact, fullName: index.target.value })}
                                placeholder="F.I.Sh"
                                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                        </div>

                        <div className="relative">
                            <FaMobileAlt className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="+998"
                                onChange={(index) => setContact({ ...contact, phone: index.target.value })}
                                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                        </div>

                        <textarea
                            placeholder="Matn"
                            onChange={(index) => setContact({ ...contact, message: index.target.value })}
                            className="w-full p-4 border rounded-md h-28 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        ></textarea>

                        <button onClick={sendContact} className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
                            Yuborish
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ContactSection;
