import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import BookingProcess from '../components/booking/BookingProcess';
import movieService from '../services/movieService';
import { useToast } from '../components/common/Toast';

const BookingPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showError } = useToast();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('📍 BookingPage useEffect - movieId:', movieId);
    console.log('📍 Current URL:', window.location.pathname);
    
    if (movieId) {
      fetchMovieInfo();
    } else {
      console.log('❌ No movieId found in URL. Expected format: /booking/{movieId}');
      console.log('💡 Redirecting to home page to select a movie');
      // If no movieId, redirect to home or show movie selection
      navigate('/', { replace: true });
    }
  }, [movieId, navigate]);

  const fetchMovieInfo = async () => {
    setLoading(true);
    try {
      console.log('🎬 Fetching movie info for ID:', movieId);
      const result = await movieService.getMovieById(movieId);
      if (result.success) {
        console.log('✅ Movie info loaded:', result.data.tenPhim);
        setMovie(result.data);
      } else {
        console.error('❌ Failed to load movie:', result.message);
        showError(result.message);
        navigate('/');
      }
    } catch (error) {
      console.error('❌ Error fetching movie info:', error);
      showError('Không thể tải thông tin phim. Vui lòng thử lại.');
      navigate('/');
    }
    setLoading(false);
  };

  // Show error if no movieId in URL
  if (!movieId) {
    return (
      <div className="booking-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="text-center py-5">
                <div className="alert alert-warning">
                  <i className="bi bi-exclamation-triangle fs-1 text-warning mb-3"></i>
                  <h4>URL không hợp lệ</h4>
                  <p className="mb-3">
                    Để đặt vé, bạn cần chọn phim cụ thể.<br/>
                    URL đúng: <code>/booking/movieId</code>
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/')}
                  >
                    <i className="bi bi-house me-2"></i>
                    Về trang chủ chọn phim
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="booking-page">
        <div className="container-fluid">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}></div>
              <h5>Đang tải thông tin đặt vé...</h5>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="booking-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="text-center py-5">
                <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '4rem' }}></i>
                <h3 className="mt-3">Không tìm thấy phim</h3>
                <p className="text-muted">
                  Phim bạn đang tìm có thể đã ngừng chiếu hoặc không tồn tại.
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/')}
                >
                  <i className="bi bi-house me-2"></i>
                  Về trang chủ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      {/* Page Header */}
      <div className="bg-primary text-white py-4 mb-4">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-8">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-2" style={{ backgroundColor: 'transparent' }}>
                  <li className="breadcrumb-item">
                    <a 
                      href="/" 
                      className="text-white text-decoration-none"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/');
                      }}
                    >
                      <i className="bi bi-house me-1"></i>
                      Trang chủ
                    </a>
                  </li>
                  <li className="breadcrumb-item active text-white" aria-current="page">
                    Đặt vé
                  </li>
                </ol>
              </nav>
              <h2 className="mb-0">
                <i className="bi bi-ticket-perforated me-2"></i>
                Đặt vé xem phim
              </h2>
              <p className="mb-0 opacity-75">
                Chọn suất chiếu, ghế ngồi và hoàn tất thanh toán
              </p>
            </div>
            <div className="col-md-4 text-end">
              <div className="d-flex align-items-center justify-content-end">
                <img 
                  src={movie.hinhAnh || '/images/default-movie.jpg'}
                  alt={movie.tenPhim}
                  className="rounded me-3"
                  style={{ width: '60px', height: '80px', objectFit: 'cover' }}
                />
                <div>
                  <h6 className="mb-1">{movie.tenPhim}</h6>
                  <small className="opacity-75">
                    {movie.theLoai?.tenTheLoai} • {movie.thoiLuong} phút
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-fluid">
        <BookingProcess movieId={movieId} />
      </div>

      {/* Footer Notice */}
      <div className="bg-light mt-5 py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h6 className="text-primary">
                <i className="bi bi-shield-check me-2"></i>
                Bảo mật
              </h6>
              <p className="text-muted small">
                Thông tin của bạn được bảo vệ bằng mã hóa SSL 128-bit
              </p>
            </div>
            <div className="col-md-4">
              <h6 className="text-primary">
                <i className="bi bi-clock me-2"></i>
                Thời gian giữ ghế
              </h6>
              <p className="text-muted small">
                Ghế được giữ trong 10 phút kể từ khi chọn
              </p>
            </div>
            <div className="col-md-4">
              <h6 className="text-primary">
                <i className="bi bi-headset me-2"></i>
                Hỗ trợ 24/7
              </h6>
              <p className="text-muted small">
                Liên hệ 1900-xxxx để được hỗ trợ
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .booking-page {
          min-height: calc(100vh - 120px);
          background-color: #f8f9fa;
        }

        .breadcrumb-item + .breadcrumb-item::before {
          color: rgba(255, 255, 255, 0.5);
        }

        .breadcrumb-item.active {
          color: rgba(255, 255, 255, 0.8) !important;
        }

        .booking-page .container-fluid {
          max-width: 1400px;
        }

        @media (max-width: 768px) {
          .booking-page .col-md-4.text-end {
            text-align: left !important;
            margin-top: 1rem;
          }
          
          .booking-page .d-flex.justify-content-end {
            justify-content: flex-start !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingPage;