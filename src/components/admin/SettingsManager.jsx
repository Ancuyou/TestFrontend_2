import React, { useState, useEffect } from "react";
import {Plus, Pencil, Trash2, CalendarCog, Save, Search, Calendar, Edit2, ImagePlay, FileCog} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import SeatTypeManager from "./SeatTypeManager.jsx";
import settingService from "../../services/settingService.js";
import {movieService, promotionService, serviceService} from "../../services/index.js";
import {useToast} from "../common/Toast.jsx";

const SettingsManager = () => {
    const [activeTab, setActiveTab] = useState("system");
    const [settings, setSettings] = useState([]);
    const [movie, setMovies] = useState([]);
    const [promotion, setPromotion] = useState([]);
    const [service, setService] = useState([])
    const [prevSettings, setPrevSettings] = useState([])
    const {showSuccess, showError} = useToast();
    const [formStyle, setFormStyle] = useState('')
    const [formData, setFormData] = useState({
        maCauHinh: '',
        tieuDe: '',
        urlHinh: '',
        DoiTuong: '',
        Loai: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [selectedImages, setSelectedImages] = useState(null);
    const categories = [
        { id: 'movie', name: 'Phim', badge: 'primary' },
        { id: 'service', name: 'Dịch vụ', badge: 'warning' },
        { id: 'promotion', name: 'Khuyến mãi', badge: 'info' },
    ];

    useEffect(() => {
        fetchSettings()
        fetchMovies()
        fetchPromotions()
        fetchService()
    },[])

    useEffect(() => {
        if (formData.Loai !== 'Phim' && formData.DoiTuong) {
            let DoiTuong = {}
            if (formData.Loai === 'Khuyến mãi') {
                DoiTuong = promotion.find(p => p.maKm = formData.DoiTuong)
            }
            else DoiTuong = service.find(p => p.maDv = formData.DoiTuong)

            setFormData(prev => ({
                ...prev,
                urlHinh: DoiTuong.urlHinh
            }));
        }
    }, [formData.Loai, formData.DoiTuong]);

    const fetchSettings = async () => {
        const caiDatHeThong = await settingService.getAllSetting();
        setSettings(caiDatHeThong.data);
        setPrevSettings(caiDatHeThong.data);
    }

    const getCategoryBadge = (category) => {
        const cat = categories.find(c => c.name === category);
        return cat?.badge || 'secondary';
    };

    const fetchMovies = async () => {
        const movies = await movieService.getAllMovies();
        if (movies.success) {
            const filteredMovies = movies.data.filter(
                (m) => m.trangThai === 'Sắp chiếu' || m.trangThai === 'Đang chiếu'
            )
            setMovies(filteredMovies);
        }
        else {
            showError(movies.message);
        }
    }


    const fetchPromotions = async () => {
        const promotions = await promotionService.getAllPromotions();
        if (promotions.success) {
            const filteredPromotions = promotions.data.filter(
                p => p.trangThai === true
            )
            setPromotion(filteredPromotions)
        }
        else {
            showError(promotions.message)
        }
    }

    const fetchService = async () => {
        const services = await serviceService.getAllServices();
        if (services.success) {
            const filteredServices = services.data.filter(
                s => s.trangThai === true
            )
            setService(filteredServices);
        }
        else {
            showError(services.message)
        }
    }

    const handleDeleteSlider = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa slider này không?")) {
            setSliders((prev) => prev.filter((s) => s.id !== id));
        }
    };

    const sliders = settings.filter((s) =>
        s.maCauHinh.includes("SLIDER")
    );

    const getSettingValue = (key) => {
        const item = settings.find(s => s.maCauHinh === key);
        return item ? item.giaTri : '';
    };

    const openModal = (style, item = null) => {
        setShowModal(true)
        setFormStyle(style)
        const match = item.tenCauHinh.match(/[0-9a-fA-F-]{36}/);
        const id = match ? match[0] : null;
        setFormData(item ? {
            maCauHinh: item.maCauHinh,
            tieuDe: item.tenCauHinh.split("-")[0].trim(),
            urlHinh: item.giaTri,
            DoiTuong: id,
            Loai: item.loai
        } : {
            maCauHinh: '',
            tieuDe: '',
            urlHinh: '',
            DoiTuong: '',
            Loai: ''
        });
        console.log(item)
        setShowModal(true);
    };

    const handleInputChange = (key, value) => {
        setSettings(prev =>
            prev.map(item =>
                item.maCauHinh === key
                    ? { ...item, giaTri: value } // tạo bản copy, không mutate
                    : item
            )
        );
    };

    const handleInputFormDataChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };



    const changedSettings = settings.filter(s => {
        const old = prevSettings.find(p => p.maCauHinh === s.maCauHinh);
        return old && old.giaTri !== s.giaTri;
    });

    const handleSaveChange = async () => {
        const changedSettings = settings.filter(s => {
            const old = prevSettings.find(p => p.maCauHinh === s.maCauHinh);
            return old && old.giaTri !== s.giaTri;
        });

        if (changedSettings.length === 0) {
            showError("Không có thay đổi nào để lưu!");
            return;
        }

        try {
            for (const s of changedSettings) {
                const result = await settingService.updateSetting(s);
                if (result.success) {
                    showSuccess(`Đã lưu ${s.maCauHinh} thành công`);
                    fetchSettings();
                } else {
                    showError(`Lỗi khi lưu ${s.maCauHinh}: ${result.error}`);
                }
            }
        } catch (err) {
            showError("Lỗi kết nối tới server!");
            console.error(err);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setFormStyle('');
        setActiveTab("slider")
    };

    const handleImageSubmit = async () => {
        const slider = {
            maCauHinh: formData.maCauHinh,
            tenCauHinh: formData.tieuDe + ' - ' + formData.DoiTuong,
            giaTri: formData.urlHinh,
            loai: formData.Loai,
        }
        let result;
        try {
            if (formStyle === "update") {
                result = await settingService.updateSetting(slider);
            }
            else result = await settingService.creatSetting(slider);
            console.log(result)
            if (result.success) {
                showSuccess(`Đã lưu ${formData.maCauHinh} thành công`);
                fetchSettings();
                setActiveTab("slider");
            } else {
                showError(`Đã có lỗi xảy ra ${result.data}`);
            }
            closeModal();
            setActiveTab("slider");
        } catch (err) {
            showError(`Đã có lỗi xảy ra ${result.data}`);
            closeModal();
        }
    }


    return (
        <div className="container-fluid p-4">
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-primary text-white p-3 rounded">
                                <CalendarCog size={32}/>
                            </div>
                            <div>
                                <h1 className="mb-0 h3">Cấu hình hệ thống</h1>
                                <p className="text-muted mb-0">Hệ thống quản lý rạp chiếu phim</p>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
            <div className="container-fluid p-4">
                <div className="card border-1 shadow-sm">
                    <div className="card-header bg-white border-1 pt-3">
                        <ul className="nav nav-tabs card-header-tabs">
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'system' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('system')}
                                >
                                    <FileCog Size={16}/> Cấu hình hệ thống
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === "slider" ? "active" : ""}`}
                                    onClick={() => setActiveTab("slider")}
                                >
                                    <ImagePlay Size={16}/> Danh sách Slider
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div className="card-body">
                        {activeTab === "system" && (
                            <div className="card shadow-sm border-0">
                                <div className="card-body">
                                    <h5 className="fw-bold mb-3">Cấu hình hệ thống</h5>
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <label className="form-label fw-semibold">Thời gian giữ ghế (phút)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={getSettingValue('TIME_HOLD_SEAT')}
                                                onChange={(e) =>
                                                    handleInputChange('TIME_HOLD_SEAT', e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fw-semibold">Số vé tối đa mỗi trong một phim</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={getSettingValue('MAX_TICKET_BOOKING')}
                                                onChange={(e) =>
                                                    handleInputChange('MAX_TICKET_BOOKING', e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fw-semibold">Thời gian chuyển ảnh slider (giây)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={getSettingValue('TIME_IMAGES_TRANSITION')}
                                                onChange={(e) =>
                                                    handleInputChange('TIME_IMAGES_TRANSITION', e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fw-semibold">Email hỗ trợ</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={getSettingValue('EMAIL_SUPPORT')}
                                                onChange={(e) =>
                                                    handleInputChange('EMAIL_SUPPORT', e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fw-semibold">Hotline hệ thống</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={getSettingValue('HOT_LINE')}
                                                onChange={(e) =>
                                                    handleInputChange('HOT_LINE ', e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="col-12">
                                            <button className="btn btn-primary mt-3"
                                            onClick={() => handleSaveChange()}
                                            >
                                                <Save size={16}/> Lưu cấu hình
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "slider" && (
                            <div className="card shadow-sm border-0">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="fw-bold mb-0">Danh Sách Banner</h5>
                                        <button className="btn btn-primary d-flex align-items-center gap-2"
                                        onClick={() => openModal('add', null)}
                                        >
                                            <Plus size={18} /> Thêm Mới
                                        </button>
                                    </div>

                                    {/* Search box */}
                                    <div className="input-group mb-3">
              <span className="input-group-text bg-white">
                <i className="bi bi-search"></i>
              </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Tìm kiếm slider..."
                                        />
                                    </div>

                                    {/* Table */}
                                    <div className="table-responsive">
                                        <table className="table align-middle table-hover">
                                            <thead className="table-light">
                                            <tr>
                                                <th>ID</th>
                                                <th>Hình ảnh</th>
                                                <th>Tiêu đề</th>
                                                <th>Loại quảng cáo</th>
                                                <th className="text-center">Thao Tác</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {Array.isArray(settings) && sliders.map((slider) => (
                                                <tr key={slider.maCauHinh}>
                                                    <td>{slider.maCauHinh}</td>
                                                    <td>
                                                        <img
                                                            src={slider.giaTri}
                                                            alt={slider.tenCauHinh}
                                                            className="rounded"
                                                            style={{ width: 80, height: 50, objectFit: "cover" }}
                                                        />
                                                    </td>
                                                    <td>{slider.tenCauHinh.split("-")[0]}</td>
                                                    <td>
                                                        <span
                                                            className={`badge bg-${getCategoryBadge(slider.loai)}`}>
                                                    {categories.find(c => c.name === slider.loai)?.name}
                                                </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <button className="btn btn-outline-primary btn-sm me-2"
                                                        onClick={() => openModal('update', slider)}
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for Add/Edit Seat Type */}
            {showModal && (
                <div className="modal show d-block modal-overlay">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Chỉnh sửa banner quảng cáo
                                </h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <form onSubmit={handleImageSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="tieuDe" className="form-label">Tiêu đề quảng cáo *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="tieuDe"
                                            name="tieuDe"
                                            value={formData.tieuDe}
                                            onChange={handleInputFormDataChange}
                                            required
                                        />
                                    </div>

                                        <div className="mb-3">
                                            <label htmlFor="loai" className="form-label">Loại quảng cáo *</label>
                                            <select
                                                className="form-select"
                                                id="loai"
                                                value={formData.Loai || ''}   // đảm bảo có default value
                                                onChange={e => setFormData({ ...formData, Loai: e.target.value })}
                                                required
                                            >
                                                <option value="">-- Chọn loại quảng cáo --</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    {formData.Loai && (
                                    <div className="mb-3">
                                        <label htmlFor="phim" className="form-label">
                                            {formData.Loai === 'Phim' ?
                                                'Phim *' :
                                                formData.Loai === 'Dịch vụ' ?
                                                'Dịch vụ *' : 'Khuyến mãi *'
                                            }
                                        </label>
                                        <select
                                            className="form-select"
                                            id="phim"
                                            value={formData.DoiTuong || ''}   // đảm bảo có default value
                                            onChange={e => setFormData({ ...formData, DoiTuong: e.target.value })}
                                            required
                                        >
                                            {/*<option value="">*/}
                                            {/*    {formData.Loai === 'Phim' ?*/}
                                            {/*        '-- Chọn phim --' :*/}
                                            {/*        formData.Loai === 'Dịch vụ' ?*/}
                                            {/*            '-- Chọn dịch vụ --' : '-- Chọn khuyến mãi --'*/}
                                            {/*    }*/}
                                            {/*</option>*/}
                                            {formData.Loai === 'Phim' ?
                                                movie.map(m => (
                                                        <option key={m.maPhim} value={m.maPhim}>{m.tenPhim}</option>
                                                    )) :
                                                formData.Loai === 'Dịch vụ' ?
                                                    service.map(s => (
                                                        <option key={s.maDv} value={s.maDv}>{s.tenDv}</option>
                                                    )) :
                                                    promotion.map(p => (
                                                        <option key={p.maKm} value={p.maKm}>{p.maCode}</option>
                                                    ))
                                            }
                                        </select>
                                    </div>)}

                                    <div className="mb-3">
                                        <label htmlFor="urlHinh" className="form-label">Hình ảnh *</label>
                                        <input
                                            type="url"
                                            className="form-control"
                                            id="urlHinh"
                                            name="urlHinh"
                                            value={formData.urlHinh}
                                            onChange={handleInputChange}
                                            placeholder="https://example.com/image.jpg"
                                            required
                                            //readOnly= {formData.Loai === 'Phim'}
                                        />
                                    </div>

                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeModal}>Hủy</button>
                                    <button type="submit" className="btn btn-primary">
                                        Cập nhật
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

export default SettingsManager;

