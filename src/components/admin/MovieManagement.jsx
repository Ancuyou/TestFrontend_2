import React, { useState, useEffect } from 'react';
import movieService from '../../services/movieService';
import categoryService from '../../services/categoryService';
import { useNavigate } from 'react-router-dom';
import {Calendar, Film, Plus} from "lucide-react";
import {useToast} from "../common/Toast.jsx";


const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
    const {showSuccess, showError} = useToast();
    const [formData, setFormData] = useState({
    tenPhim: '',
    moTa: '',
    daoDien: '',
    dienVien: '',
    thoiLuong: '',
    ngayKhoiChieu: '',
    hinhAnh: '',
    trailerURL: '',
    tuoi: '',
    trangThai: 'Sắp chiếu',
    theLoai: []
  });
  const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
      if (searchTerm.trim() === '') {
          fetchMovies(currentPage);
      }
      else {
            console.log(currentPage);
            searchMovies(searchTerm, currentPage);
      }
  }, [currentPage]);

  const fetchCategories = async () => {
    const result = await categoryService.getAllCategories();
    console.log(result);
    if (result.success) setCategories(result.data);
  };

  const fetchMovies = async (page = 1) => {
    try {
      setLoading(true);
      const result = await movieService.getMoviesPaginated(page);
      if (result.success) {
        const { currentMovies, totalPages, currentPage } = result.data;
        setMovies(currentMovies);
        setTotalPages(totalPages);
        setCurrentPage(currentPage);
      } else {
        setMovies([]);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (error) {
        showError(error.message);
      setMovies([]);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  const searchMovies = async (page = 1, keyword) => {
      try {
          setLoading(true);
          const result = await movieService.searchMovies(page, keyword);
          if (result.success) {
              const { currentMovies, totalPages, currentPage } = result.data;
              showSuccess(result.message);
              setMovies(currentMovies);
              setTotalPages(totalPages);
              setCurrentPage(currentPage);
          } else {
              setMovies([]);
              setTotalPages(1);
              setCurrentPage(1);
          }
      } catch (error) {
          showError(error.message);
          setMovies([]);
          setTotalPages(1);
          setCurrentPage(1);
      } finally {
          setLoading(false);
      }
  }

  const openModal = (type, movie = null) => {
    setModalType(type);
    setSelectedMovie(movie);
    if (type === 'edit' && movie) {
      setFormData({
        tenPhim: movie.tenPhim || '',
        moTa: movie.moTa || '',
        daoDien: movie.daoDien || '',
        dienVien: movie.dienVien || '',
        thoiLuong: movie.thoiLuong || '',
        ngayKhoiChieu: movie.ngayKhoiChieu ? movie.ngayKhoiChieu.split('T')[0] : '',
        hinhAnh: movie.hinhAnh || '',
        trailerURL: movie.trailerURL || '',
        tuoi: movie.tuoi || '',
        trangThai: movie.trangThai || '',
        theLoai: movie.listTheLoai ? movie.listTheLoai.map(tl => tl.maTheLoai) : []
      });
    } else if (type === 'add') {
      setFormData({
        tenPhim: '',
        moTa: '',
        daoDien: '',
        dienVien: '',
        thoiLuong: '',
        ngayKhoiChieu: '',
        hinhAnh: '',
        trailerURL: '',
        tuoi: '',
        trangThai: 'Sắp chiếu',
        theLoai: []
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedMovie(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Chuyển mảng id thể loại sang mảng tên thể loại
    const theLoaiNames = categories
      .filter(cat => formData.theLoai.includes(cat.maTheLoai))
      .map(cat => cat.tenTheLoai);
    const submitData = { ...formData, theLoai: theLoaiNames };
    try {
      if (modalType === 'add') {
        const result = await movieService.createMovie(submitData);
        if (result.success) {
          alert('Thêm phim thành công!');
          fetchMovies();
          closeModal();
        } else {
          alert('Lỗi: ' + result.message);
        }
      } else if (modalType === 'edit') {
        const result = await movieService.updateMovie(selectedMovie.maPhim, submitData);
        if (result.success) {
          alert('Cập nhật phim thành công!');
          fetchMovies();
          closeModal();
        } else {
          alert('Lỗi: ' + result.message);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Có lỗi xảy ra');
    }
  };

  const handleDelete = async (movieId) => {
    if (window.confirm('Bạn có chắc muốn xóa phim này?')) {
      try {
        const result = await movieService.deleteMovie(movieId);
        if (result.success) {
          alert('Xóa phim thành công!');
          fetchMovies();
        } else {
          alert('Lỗi: ' + result.message);
        }
      } catch (error) {
        console.error('Error deleting movie:', error);
        alert('Có lỗi xảy ra');
      }
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const currentMovies = movies;

  const handleSearchInput = (e) => {
    if (e.key === 'Enter' || e.key === 'Spacebar') {
        searchMovies(searchTerm);
      console.log('Searching for:', searchTerm);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      {/* Header */}
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                        <div className="bg-primary text-white p-3 rounded">
                            <Film size={32}/>
                        </div>
                        <div>
                            <h1 className="mb-0 h3">Quản Lý Phim</h1>
                            <p className="text-muted mb-0">Hệ thống quản lý rạp chiếu phim</p>
                        </div>
                    </div>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => openModal('add', null)}
                    >
                        <Plus size={20} className="me-2" style={{verticalAlign: 'middle'}}/>
                        Thêm Phim
                    </button>
                </div>
            </div>
        </div>

      {/* Search */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm phim, đạo diễn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchInput}
            />
          </div>
        </div>
      </div>

      {/* Movies Panel/Grid - Card view, hình ảnh nằm trong panel, shadow bao quanh card */}
      <div className="row g-4">
        {currentMovies?.length > 0 ? (
          currentMovies.map((movie) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={movie.maPhim}
                 onClick={() => navigate(`/admin/film/${movie.maPhim}`)}
                 style={{ cursor: 'pointer' }}
            >
              <div className="card h-100 shadow rounded-4 border-0 d-flex flex-column"
                   style={{
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
                   onMouseEnter={(e) => {
                       e.currentTarget.style.transform = 'scale(1.04)';
                       e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.2)';
                   }}
                   onMouseLeave={(e) => {
                       e.currentTarget.style.transform = 'scale(1)';
                       e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
                   }}>
                <div className="card-body d-flex flex-column align-items-center p-3">
                  <div className="mb-3 w-100 d-flex justify-content-center">
                      {/* Nút Xóa phim */}
                      <button
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                          onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(movie.maPhim);
                          }}
                      >
                          <i className="bi bi-trash"></i>
                      </button>
                    <img
                      src={movie.hinhAnh || '/images/no_image.jpg'}
                      alt={movie.tenPhim}
                      className="rounded-3"
                      style={{ width: '100%', maxWidth: '240px', height: '240px', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
                      onError={(e) => { e.target.src = '/images/no_image.jpg'; }}
                    />
                  </div>
                  <h5 className="card-title fw-bold mb-1 text-center">
                      {movie.tenPhim}</h5>
                    <div className="mb-2 text-center">
                    <span className={`badge ${
                        movie.trangThai === 'Đang chiếu' ? 'bg-success' :
                            movie.trangThai === 'Sắp chiếu' ? 'bg-warning' :
                                'bg-secondary'
                    }`}>
                      {movie.trangThai}
                    </span>
                    </div>
                    <div className="d-flex align-items-center gap-4">
                        <div className="mb-1 text-center" style={{fontSize: '0.95em'}}>
                            <i className="bi bi-clock"
                               style={{color: '#0d6efd', fontSize: '1.2rem', marginRight: '6px'}}></i>
                            {formatDuration(movie.thoiLuong)}</div>
                        <div className="mb-1 text-center" style={{fontSize: '0.95em'}}>
                            <i className="bi bi-calendar-event"
                               style={{color: '#0d6efd', fontSize: '1.2rem', marginRight: '6px'}}></i>
                            {formatDate(movie.ngayKhoiChieu)}
                        </div>
                    </div>
                    <div className="mb-1 text-muted text-center" style={{ fontSize: '0.95em' }}>Đạo diễn: {movie.daoDien}</div>
                    <div className="mb-1 text-center" style={{ fontSize: '0.95em' }}>Thể loại: {movie.listTheLoai ? movie.listTheLoai.map(tl => tl.tenTheLoai).join(', ') : 'N/A'}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <i className="bi bi-film display-1 text-muted"></i>
            <p className="text-muted mt-2">Không tìm thấy phim nào.</p>
          </div>
        )}
      </div>

      {/* Pagination giữ nguyên */}
      {totalPages && totalPages > 1 && (
        <div className="card-footer bg-white mt-4">
          <nav>
            <ul className="pagination pagination-sm justify-content-center mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Trước
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block modal-overlay">
          <div className={`modal-dialog modal-lg ${modalType === 'view' ? 'modal-xl' : ''} mx-auto`}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalType === 'add' && 'Thêm phim mới'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Tên phim *</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={formData.tenPhim}
                            onChange={(e) => setFormData({...formData, tenPhim: e.target.value})}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Đạo diễn *</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={formData.daoDien}
                            onChange={(e) => setFormData({...formData, daoDien: e.target.value})}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Diễn viên</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={formData.dienVien}
                            onChange={(e) => setFormData({...formData, dienVien: e.target.value})}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Thể loại *</label>
                          <select
                            className="form-select"
                            multiple
                            value={formData.theLoai}
                            onChange={e => {
                              const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
                              setFormData({ ...formData, theLoai: selected });
                            }}
                            required
                          >
                            {categories.map(cat => (
                              <option key={cat.maTheLoai} value={cat.maTheLoai}>{cat.tenTheLoai}</option>
                            ))}
                          </select>
                          <small className="text-muted">Giữ Ctrl để chọn nhiều thể loại</small>
                        </div>
                        <div className="row">
                          <div className="col-6">
                            <div className="mb-3">
                              <label className="form-label">Thời lượng (phút) *</label>
                              <input 
                                type="number" 
                                className="form-control" 
                                value={formData.thoiLuong}
                                onChange={(e) => setFormData({...formData, thoiLuong: e.target.value})}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="mb-3">
                              <label className="form-label">Độ tuổi *</label>
                              <select 
                                className="form-select"
                                value={formData.tuoi}
                                onChange={(e) => setFormData({...formData, tuoi: e.target.value})}
                                required
                              >
                                <option value="">Chọn độ tuổi</option>
                                <option value="0">0+</option>
                                <option value="13">13+</option>
                                <option value="16">16+</option>
                                <option value="18">18+</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Ngày khởi chiếu *</label>
                          <input 
                            type="date" 
                            className="form-control" 
                            value={formData.ngayKhoiChieu}
                            onChange={(e) => setFormData({...formData, ngayKhoiChieu: e.target.value})}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Trạng thái *</label>
                          <select 
                            className="form-select"
                            value={formData.trangThai}
                            onChange={(e) => setFormData({...formData, trangThai: e.target.value})}
                            required
                          >
                            <option value="Sắp chiếu">Sắp chiếu</option>
                            <option value="Đang chiếu">Đang chiếu</option>
                            <option value="Đã chiếu">Đã chiếu</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">URL Hình ảnh</label>
                          <input 
                            type="url" 
                            className="form-control" 
                            value={formData.hinhAnh}
                            onChange={(e) => setFormData({...formData, hinhAnh: e.target.value})}
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">URL Trailer</label>
                          <input 
                            type="url" 
                            className="form-control" 
                            value={formData.trailerURL}
                            onChange={(e) => setFormData({...formData, trailerURL: e.target.value})}
                            placeholder="https://youtube.com/watch?v=..."
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Mô tả</label>
                      <textarea 
                        className="form-control" 
                        rows={4}
                        value={formData.moTa}
                        onChange={e => setFormData({...formData, moTa: e.target.value})}
                        placeholder="Nhập mô tả phim..."
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                      Đóng
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {modalType === 'add' ? 'Thêm phim' : 'Lưu thay đổi'}
                    </button>
                  </div>
                </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieManagement;
