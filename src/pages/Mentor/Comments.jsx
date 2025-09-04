import React, { useEffect, useState } from 'react';
import { MessageSquare, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

function Comments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const commentsPerPage = 5;
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        'http://18.199.221.227:1709/rating/all-list-latest'
      );
      setComments(response.data.data);
    } catch (error) {
      console.log("xatolik", error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchComments();
  }, []);

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < rating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300 dark:text-gray-500'
          }
        />
      ));
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const imgUrl = 'http://18.199.221.227:1709/uploads/image/'
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
      {/* Sarlavha */}
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="text-blue-500" size={24} />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Talabalarning Izohlari
        </h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
          {comments.length} izoh
        </span>
      </div>

      {/* Izohlar */}
      <div className="space-y-4 mb-6">
        {loading ? (
          <p className="text-center text-gray-500">Yuklanmoqda...</p>
        ) : currentComments.length === 0 ? (
          <p className="text-center text-gray-500">
            Izohlar topilmadi
          </p>
        ) : (
          currentComments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-start gap-4">
                <img
                  src={comment.user?.image ? `${imgUrl}${comment.user?.image}` : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY2H9tG1sejHjy2FqhSkj_NN7oDxsUL1zJJw&s'}
                  alt={comment.user?.fullName || 'Foydalanuvchi'}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {comment.user?.fullName || 'No name'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">{renderStars(comment.rate)}</div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-200 mb-3">
                    {comment.comment}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginatsiya */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Ko'rsatilmoqda{' '}
            <span className="font-semibold">{indexOfFirstComment + 1}</span>-
            <span className="font-semibold">
              {Math.min(indexOfLastComment, comments.length)}
            </span>{' '}
            dan <span className="font-semibold">{comments.length}</span> ta izoh
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
            >
              <ChevronLeft size={20} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`w-8 h-8 rounded-lg text-sm ${currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg ${currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Comments;
