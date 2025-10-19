import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import profileService from "../services/profileService";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // State cho thông tin cá nhân
  const [profileData, setProfileData] = useState({
    hoTen: "",
    email: "",
    sdt: "",
    ngaySinh: "",
  });

  // State cho đổi mật khẩu
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Load thông tin user khi component mount
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    setLoading(true);
    try {
      const result = await profileService.getMyInfo();
      if (result.success) {
        const userData = result.data;

        // Logic mới, đơn giản hơn rất nhiều
        setProfileData({
          hoTen: userData.hoTen || "",
          email: userData.email || "",
          sdt: userData.sdt || "",
          // Gán trực tiếp chuỗi "YYYY-MM-DD" từ API vào state
          ngaySinh: userData.ngaySinh || "",
        });
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error("Error loading user info:", error);
      setErrorMessage("Có lỗi xảy ra khi tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateProfile = () => {
    const newErrors = {};

    if (!profileData.hoTen.trim()) {
      newErrors.hoTen = "Vui lòng nhập họ tên";
    }

    if (!profileData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!profileData.sdt.trim()) {
      newErrors.sdt = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10}$/.test(profileData.sdt)) {
      newErrors.sdt = "Số điện thoại không hợp lệ (10 chữ số)";
    }

    return newErrors;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.oldPassword) {
      newErrors.oldPassword = "Vui lòng nhập mật khẩu cũ";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    return newErrors;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const newErrors = validateProfile();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const result = await profileService.updateMyInfo(profileData);

      if (result.success) {
        setSuccessMessage("Cập nhật thông tin thành công!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage("Có lỗi xảy ra khi cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const newErrors = validatePassword();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const result = await profileService.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      if (result.success) {
        setSuccessMessage("Đổi mật khẩu thành công!");
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordForm(false);
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage("Có lỗi xảy ra khi đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData.email) {
    return (
      <div className="profile-page">
        <div className="container">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "60vh" }}
          >
            <div className="text-center">
              <div
                className="spinner-border text-primary mb-3"
                style={{ width: "3rem", height: "3rem" }}
              ></div>
              <h5>Đang tải thông tin...</h5>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Page Header */}
      <div className="bg-primary text-white py-4 mb-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h2 className="mb-0">
                <i className="bi bi-person-circle me-2"></i>
                Quản lý tài khoản cá nhân
              </h2>
              <p className="mb-0 opacity-75">
                Xem và chỉnh sửa thông tin tài khoản của bạn
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="container mb-3">
          <div
            className="alert alert-success alert-dismissible fade show"
            role="alert"
          >
            <i className="bi bi-check-circle me-2"></i>
            {successMessage}
            <button
              type="button"
              className="btn-close"
              onClick={() => setSuccessMessage("")}
            ></button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="container mb-3">
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            <i className="bi bi-exclamation-triangle me-2"></i>
            {errorMessage}
            <button
              type="button"
              className="btn-close"
              onClick={() => setErrorMessage("")}
            ></button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  <button
                    className={`list-group-item list-group-item-action d-flex align-items-center ${
                      activeTab === "info" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("info")}
                  >
                    <i className="bi bi-person me-2"></i>
                    Thông tin cá nhân
                  </button>
                  <button
                    className={`list-group-item list-group-item-action d-flex align-items-center ${
                      activeTab === "security" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("security")}
                  >
                    <i className="bi bi-shield-lock me-2"></i>
                    Bảo mật
                  </button>
                </div>
              </div>
            </div>

            {/* User Info Card */}
            <div className="card border-0 shadow-sm mt-3">
              <div className="card-body text-center">
                <div
                  className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px", fontSize: "2rem" }}
                >
                  <i className="bi bi-person"></i>
                </div>
                <h5 className="mb-1">{user?.username || "User"}</h5>
                <p className="text-muted small mb-0">{profileData.email}</p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-lg-9">
            {activeTab === "info" && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white py-3">
                  <h5 className="mb-0">
                    <i className="bi bi-pencil-square me-2"></i>
                    Thông tin cá nhân
                  </h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleUpdateProfile}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Họ và tên <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            errors.hoTen ? "is-invalid" : ""
                          }`}
                          name="hoTen"
                          value={profileData.hoTen}
                          onChange={handleProfileChange}
                          placeholder="Nhập họ tên"
                        />
                        {errors.hoTen && (
                          <div className="invalid-feedback">{errors.hoTen}</div>
                        )}
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className={`form-control ${
                            errors.email ? "is-invalid" : ""
                          }`}
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          placeholder="Nhập email"
                        />
                        {errors.email && (
                          <div className="invalid-feedback">{errors.email}</div>
                        )}
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Số điện thoại <span className="text-danger">*</span>
                        </label>
                        <input
                          type="tel"
                          className={`form-control ${
                            errors.sdt ? "is-invalid" : ""
                          }`}
                          name="sdt"
                          value={profileData.sdt}
                          onChange={handleProfileChange}
                          placeholder="Nhập số điện thoại"
                        />
                        {errors.sdt && (
                          <div className="invalid-feedback">{errors.sdt}</div>
                        )}
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Ngày sinh</label>
                        <input
                          type="date"
                          className="form-control"
                          name="ngaySinh"
                          value={profileData.ngaySinh}
                          onChange={handleProfileChange}
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => navigate("/")}
                      >
                        <i className="bi bi-x-circle me-1"></i>
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-1"></i>
                            Lưu thay đổi
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white py-3">
                  <h5 className="mb-0">
                    <i className="bi bi-shield-lock me-2"></i>
                    Bảo mật tài khoản
                  </h5>
                </div>
                <div className="card-body">
                  {!showPasswordForm ? (
                    <div>
                      <div className="d-flex align-items-start mb-4">
                        <div className="flex-shrink-0">
                          <div
                            className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center"
                            style={{ width: "50px", height: "50px" }}
                          >
                            <i className="bi bi-key fs-4"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-1">Mật khẩu</h6>
                          <p className="text-muted mb-2">
                            Đổi mật khẩu định kỳ để bảo vệ tài khoản của bạn
                          </p>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => setShowPasswordForm(true)}
                          >
                            <i className="bi bi-pencil me-1"></i>
                            Đổi mật khẩu
                          </button>
                        </div>
                      </div>

                      <hr />

                      <div className="d-flex align-items-start">
                        <div className="flex-shrink-0">
                          <div
                            className="rounded-circle bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center"
                            style={{ width: "50px", height: "50px" }}
                          >
                            <i className="bi bi-check-circle fs-4"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-1">Tài khoản đã xác thực</h6>
                          <p className="text-muted mb-2">
                            Tài khoản của bạn đã được xác thực và bảo mật
                          </p>
                          <span className="badge bg-success">
                            Đang hoạt động
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleChangePassword}>
                      <div className="mb-3">
                        <label className="form-label">
                          Mật khẩu hiện tại{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="password"
                          className={`form-control ${
                            errors.oldPassword ? "is-invalid" : ""
                          }`}
                          name="oldPassword"
                          value={passwordData.oldPassword}
                          onChange={handlePasswordChange}
                          placeholder="Nhập mật khẩu hiện tại"
                        />
                        {errors.oldPassword && (
                          <div className="invalid-feedback">
                            {errors.oldPassword}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          Mật khẩu mới <span className="text-danger">*</span>
                        </label>
                        <input
                          type="password"
                          className={`form-control ${
                            errors.newPassword ? "is-invalid" : ""
                          }`}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="Nhập mật khẩu mới"
                        />
                        {errors.newPassword && (
                          <div className="invalid-feedback">
                            {errors.newPassword}
                          </div>
                        )}
                        <small className="text-muted">
                          Mật khẩu phải có ít nhất 6 ký tự
                        </small>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          Xác nhận mật khẩu mới{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="password"
                          className={`form-control ${
                            errors.confirmPassword ? "is-invalid" : ""
                          }`}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="Nhập lại mật khẩu mới"
                        />
                        {errors.confirmPassword && (
                          <div className="invalid-feedback">
                            {errors.confirmPassword}
                          </div>
                        )}
                      </div>

                      <div className="d-flex justify-content-end gap-2 mt-4">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            setShowPasswordForm(false);
                            setPasswordData({
                              oldPassword: "",
                              newPassword: "",
                              confirmPassword: "",
                            });
                            setErrors({});
                          }}
                        >
                          <i className="bi bi-x-circle me-1"></i>
                          Hủy
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Đang xử lý...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-check-circle me-1"></i>
                              Đổi mật khẩu
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-page {
          min-height: calc(100vh - 120px);
          background-color: #f8f9fa;
          padding-bottom: 3rem;
        }

        .list-group-item.active {
          background-color: #0d6efd;
          border-color: #0d6efd;
        }

        .list-group-item:hover:not(.active) {
          background-color: #f8f9fa;
        }

        .card {
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        }

        @media (max-width: 768px) {
          .col-md-6.text-end {
            text-align: left !important;
            margin-top: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
