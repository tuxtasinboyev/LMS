import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { FaStar } from "react-icons/fa";
import axios from "axios";

function ReviewCarousel() {
  const [reviews, setReviews] = useState([]);
  const defaultImage = "https://itliveacademy.uz/user.png";
  const imgUrl = "https://edora-backend.onrender.com/uploads/images/";

  async function fetchRating() {
    try {
      const res = await axios.get(
        "https://edora-backend.onrender.com/rating/all-list-latest"
      );
      console.log(res.data.data);

      setReviews(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }

  useEffect(() => {
    fetchRating();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="max-w-[1300px] mx-auto py-14 px-4">
      <h2 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
        Izohlar
      </h2>
      <p className="text-center text-gray-500 mb-10 text-lg">
        O‘quvchilarimiz tomonidan qoldirilgan so‘nggi izohlar
      </p>

      <Slider {...settings}>
        {reviews.map((review) => (
          <div key={review.id} className="px-3">
            <div className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-2xl p-6 h-[250px] flex flex-col justify-between hover:scale-105 transition-transform duration-300">
              <p className="text-5xl text-purple-500 opacity-50">“</p>
              <p className="text-lg font-medium text-gray-700 mb-4 line-clamp-3">
                {review.comment}
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <img
                  src={
                    review.user?.image
                      ? `${imgUrl}${review.user.image}`
                      : defaultImage
                  }
                  alt=''
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-400 shadow-sm"
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    {review.user?.fullName}
                  </p>

                  <div className="flex items-center gap-1 text-yellow-500 text-sm">
                    {[...Array(review.rate)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                    <span className="text-gray-400 text-xs ml-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 italic">
                    {review.course?.name} o‘quvchisi
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}

export default ReviewCarousel;
