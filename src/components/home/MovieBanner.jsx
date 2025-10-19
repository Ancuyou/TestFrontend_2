import React, { useState, useEffect } from "react";
import { Star, Play, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Banner = ({ movies = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const navigate = useNavigate();

  const safeMovies = Array.isArray(movies) ? movies : [];

  // Auto slide 4s
  useEffect(() => {
    if (!isAutoPlay || safeMovies.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % safeMovies.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlay, currentIndex, safeMovies.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + safeMovies.length) % safeMovies.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 6000);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % safeMovies.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 6000);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 6000);
  };

  const movie = safeMovies[currentIndex];
  if (!movie) return null;

  const handleBooking = () => {
    navigate(`/booking/${movie.maPhim || movie.id}`);
  };

  const handleTrailer = () => {
    const url = movie.trailerURL || movie.trailerurl || movie.trailerUrl;
    if (url) window.open(url, "_blank");
    else alert("Phim này chưa có trailer.");
  };

  return (
    <section className="banner position-relative text-white">
      {/* Background */}
      <div
        className="banner-bg"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.75)), url(${movie.hinhAnh})`,
        }}
      />

      {/* Content */}
      <div className="banner-content container">
        <span className="badge bg-danger mb-3 px-3 py-2 rounded-pill fw-semibold">
          ĐANG CHIẾU
        </span>
        <h1 className="fw-bold display-5 mb-3">{movie.tenPhim}</h1>

        <div className="banner-info d-flex flex-wrap align-items-center gap-3 mb-3 text-light">
          <span className="d-flex align-items-center">
            <Star size={16} fill="#ffd700" stroke="#ffd700" className="me-1" />
            {movie.rating || "9.0"}
          </span>
          <span className="d-flex align-items-center">
            <Clock size={16} className="me-1" />
            {movie.thoiLuong || 120} phút
          </span>
          <span>{movie.nam || new Date().getFullYear()}</span>
          <span>{movie.theLoai || ""}</span>
        </div>

        <p className="lead text-light mb-4" style={{ maxWidth: 600 }}>
          {movie.moTa?.length > 180
            ? movie.moTa.slice(0, 180) + "..."
            : movie.moTa || "Mô tả phim đang được cập nhật."}
        </p>

        <div className="d-flex gap-3">
          <button
            className="btn btn-danger btn-lg d-flex align-items-center gap-2"
            onClick={handleBooking}
          >
            <Play size={18} fill="white" />
            Đặt vé ngay
          </button>
          <button
            className="btn btn-outline-light btn-lg"
            onClick={handleTrailer}
          >
            Xem trailer
          </button>
        </div>
      </div>

      {/* Navigation arrows */}
      <button className="nav-arrow left" onClick={handlePrev}>
        <ChevronLeft size={28} />
      </button>
      <button className="nav-arrow right" onClick={handleNext}>
        <ChevronRight size={28} />
      </button>

      {/* Indicators */}
      <div className="indicators">
        {safeMovies.map((_, idx) => (
          <button
            key={idx}
            className={`indicator ${idx === currentIndex ? "active" : ""}`}
            onClick={() => goToSlide(idx)}
          />
        ))}
      </div>

      <style>{`
        .banner {
          height: 500px;
          overflow: hidden;
          position: relative;
        }
        .banner-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: background-image 1s ease-in-out;
          z-index: 0;
        }
        .banner-content {
          position: relative;
          z-index: 2;
          top: 50%;
          transform: translateY(-50%);
        }
        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0,0,0,0.4);
          border: none;
          color: white;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .nav-arrow:hover {
          background: rgba(0,0,0,0.7);
        }
        .nav-arrow.left { left: 20px; }
        .nav-arrow.right { right: 20px; }

        .indicators {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 3;
        }
        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
          border: none;
          cursor: pointer;
        }
        .indicator.active {
          background: #ff4b2b;
        }
      `}</style>
    </section>
  );
};

export default Banner;
