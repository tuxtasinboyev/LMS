import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  CircularProgress,
  Box
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import axios from "axios";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUser,
  FaMobileAlt
} from "react-icons/fa";

function ContactSection() {
  const [contact, setContact] = useState({ fullName: "", phone: "", message: "" });
  const [modal, setModal] = useState({ open: false, loading: false, success: false, error: "" });

  const sendContact = async (e) => {
    e.preventDefault();
    setModal({ open: true, loading: true, success: false, error: "" });

    try {
      const res = await axios.post("http://18.199.221.227:1709/api/contact", contact);
      if (res.status === 201) {
        setModal({ open: true, loading: false, success: true, error: "" });
      }
    } catch (err) {
      setModal({
        open: true,
        loading: false,
        success: false,
        error: err.response?.data?.message || "Xatolik yuz berdi!"
      });
    } finally {
      setTimeout(() => setModal({ open: false, loading: false, success: false, error: "" }), 3000);
    }
  };

  return (
    <div className="w-full bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Savollaringiz bo’lsa murojaat qiling
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              icon: <FaPhoneAlt className="text-blue-600 text-3xl mx-auto mb-3" />,
              title: "Telefon",
              text: "+998 (97) 866 50 50",
            },
            {
              icon: <FaEnvelope className="text-blue-600 text-3xl mx-auto mb-3" />,
              title: "Elektron Pochta",
              text: "itliveguliston2023@gmail.com",
            },
            {
              icon: <FaMapMarkerAlt className="text-blue-600 text-3xl mx-auto mb-3" />,
              title: "Manzil",
              text: "Sirdaryo vil, Guliston sh, 1-mavze, IT LIVE ACADEMY",
            },
          ].map((item, i) => (
            <div key={i} className="bg-white shadow p-6 rounded-xl text-center hover:shadow-lg transition">
              {item.icon}
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-gray-600 mt-2">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-white shadow rounded-xl p-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-6">
            Murojaatlarni shu yerdan jo'nating!
          </h3>

          <form className="space-y-4" onSubmit={sendContact}>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={contact.fullName}
                onChange={(e) => setContact({ ...contact, fullName: e.target.value })}
                placeholder="F.I.Sh"
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div className="relative">
              <FaMobileAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={contact.phone}
                placeholder="+998"
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <textarea
              placeholder="Matn"
              value={contact.message}
              onChange={(e) => setContact({ ...contact, message: e.target.value })}
              className="w-full p-4 border rounded-md h-28 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            ></textarea>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
            >
              Yuborish
            </button>
          </form>
        </div>
      </div>

      <Dialog
        open={modal.open}
        onClose={() => setModal({ ...modal, open: false })}
        PaperProps={{
          style: {
            borderRadius: 20,
            padding: "20px",
            textAlign: "center",
            minWidth: "300px",
          },
        }}
      >
        <DialogContent>
          {modal.loading ? (
            <>
              <CircularProgress size={70} sx={{ color: "blue" }} />
              <Typography mt={2} fontWeight="bold" fontSize={20}>
                Yuborilmoqda...
              </Typography>
            </>
          ) : modal.success ? (
            <>
              <CheckCircleIcon sx={{ fontSize: 70, color: "green" }} />
              <Typography mt={2} fontWeight="bold" fontSize={20}>
                Muvaffaqiyatli jo'natildi!
              </Typography>
            </>
          ) : (
            <>
              <ErrorIcon sx={{ fontSize: 70, color: "red" }} />
              <Typography mt={2} fontWeight="bold" fontSize={20}>
                hammasini toliq qilib keyin tugmani bosing!!
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ContactSection;
