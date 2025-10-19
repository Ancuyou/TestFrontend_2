import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import userService from "../../services/userService";
import { useToast } from "../common/Toast";

const UserModal = ({ show, mode, userData, onClose, onSave }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const defaultData = {
      hoTen: "",
      email: "",
      sdt: "",
      ngaySinh: "",
      tenDangNhap: "",
      matKhau: "",
      tenVaiTro: "USER", // Luôn là USER
    };
    setFormData(
      mode === "edit" && userData
        ? { ...userData, tenVaiTro: "USER" }
        : defaultData
    );
  }, [show, mode, userData]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Thêm User Mới" : "Chỉnh Sửa Thông Tin User"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Họ và Tên</label>
                <input
                  type="text"
                  name="hoTen"
                  value={formData.hoTen || ""}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Số Điện Thoại</label>
                <input
                  type="tel"
                  name="sdt"
                  value={formData.sdt || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Ngày Sinh</label>
                <input
                  type="date"
                  name="ngaySinh"
                  value={formData.ngaySinh || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Tên Đăng Nhập</label>
                <input
                  type="text"
                  name="tenDangNhap"
                  value={formData.tenDangNhap || ""}
                  onChange={handleChange}
                  className="form-control"
                  required
                  disabled={mode === "edit"}
                />
              </div>
              {mode === "add" && (
                <div className="mb-3">
                  <label className="form-label">Mật Khẩu</label>
                  <input
                    type="password"
                    name="matKhau"
                    value={formData.matKhau || ""}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              )}
              {/* Đã ẩn trường chọn Vai Trò */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 1,
    totalElements: 0,
  });
  const [filters, setFilters] = useState({
    keyword: "",
    role: "USER",
    status: "all",
  }); // Mặc định role là USER
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const result = await userService.searchUsers({
      ...filters,
      page: pagination.page,
      size: pagination.size,
    });
    if (result.success && result.data) {
      setUsers(result.data.content);
      setPagination((prev) => ({
        ...prev,
        totalPages: result.data.totalPages,
        totalElements: result.data.totalElements,
      }));
    } else {
      showError(result.message || "Không thể tải danh sách người dùng.");
    }
    setLoading(false);
  }, [filters, pagination.page, pagination.size, showError]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, keyword: searchTerm }));
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  const handleToggleStatus = async (username, currentStatus) => {
    const action = currentStatus ? "khóa" : "mở khóa";
    if (window.confirm(`Bạn có chắc muốn ${action} tài khoản '${username}'?`)) {
      const result = await userService.updateUserStatus(
        username,
        !currentStatus
      );
      if (result.success) {
        showSuccess(`Đã ${action} tài khoản thành công!`);
        fetchUsers();
      } else {
        showError(result.message || `Lỗi khi ${action} tài khoản.`);
      }
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (
      window.confirm(`Bạn có chắc muốn xóa vĩnh viễn người dùng '${userName}'?`)
    ) {
      const result = await userService.deleteUser(userId);
      if (result.success) {
        showSuccess("Xóa người dùng thành công!");
        fetchUsers();
      } else {
        showError(result.message || "Lỗi khi xóa người dùng.");
      }
    }
  };

  const handleAddUserClick = () => {
    setModalMode("add");
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const handleEditUserClick = (user) => {
    setModalMode("edit");
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (formData) => {
    let result;
    if (modalMode === "add") {
      result = await userService.createUser(formData);
    } else {
      result = await userService.updateUser(currentUser.maUser, formData);
    }

    if (result.success) {
      showSuccess(
        modalMode === "add"
          ? "Thêm người dùng thành công!"
          : "Cập nhật thành công!"
      );
      setIsModalOpen(false);
      fetchUsers();
    } else {
      showError(result.message || "Đã có lỗi xảy ra.");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4" style={{ color: "white" }}>
        Quản lý User
      </h2>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-lg-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm theo tên, email..."
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  className="btn btn-outline-primary"
                  type="button"
                  onClick={handleSearch}
                >
                  <Search size={18} />
                </button>
              </div>
            </div>
            <div className="col-lg-4">
              <select
                className="form-select"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Bị khóa</option>
              </select>
            </div>
            <div className="col-lg-2 text-end">
              <button className="btn btn-primary" onClick={handleAddUserClick}>
                <Plus size={18} className="me-1" /> Thêm mới
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Họ Tên</th>
                  <th>Email / SĐT</th>
                  <th>Vai Trò</th>
                  <th>Trạng Thái</th>
                  <th>Ngày Sinh</th>
                  <th className="text-center">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center p-5">
                      🌀 Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.maUser}>
                      <td>{user.maUser}</td>
                      <td>
                        <div className="fw-bold">{user.hoTen}</div>
                        <small className="text-muted">{user.tenDangNhap}</small>
                      </td>
                      <td>
                        <div>
                          <Mail size={14} className="me-2 text-muted" />
                          {user.email}
                        </div>
                        <div>
                          <Phone size={14} className="me-2 text-muted" />
                          {user.sdt}
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-secondary-soft text-secondary">
                          {user.tenVaiTro}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            user.trangThai
                              ? "bg-success-soft text-success"
                              : "bg-warning-soft text-warning"
                          }`}
                        >
                          {user.trangThai ? "Hoạt động" : "Bị khóa"}
                        </span>
                      </td>
                      <td>
                        {user.ngaySinh ? (
                          <>
                            <Calendar size={14} className="me-1 text-muted" />
                            {new Date(user.ngaySinh).toLocaleDateString(
                              "vi-VN"
                            )}
                          </>
                        ) : (
                          "Chưa có"
                        )}
                      </td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm" role="group">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleEditUserClick(user)}
                            title="Chỉnh sửa"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className={`btn ${
                              user.trangThai
                                ? "btn-outline-warning"
                                : "btn-outline-success"
                            }`}
                            onClick={() =>
                              handleToggleStatus(
                                user.tenDangNhap,
                                user.trangThai
                              )
                            }
                            title={user.trangThai ? "Khóa" : "Mở khóa"}
                          >
                            {user.trangThai ? (
                              <Lock size={14} />
                            ) : (
                              <Unlock size={14} />
                            )}
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() =>
                              handleDeleteUser(user.maUser, user.hoTen)
                            }
                            title="Xóa"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center p-5">
                      Không tìm thấy người dùng nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-between align-items-center">
          <div>
            Hiển thị <strong>{users.length}</strong> trên tổng số{" "}
            <strong>{pagination.totalElements}</strong> kết quả
          </div>
          <nav>
            <ul className="pagination mb-0">
              <li
                className={`page-item ${
                  pagination.page === 0 ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  <ChevronLeft size={16} />
                </button>
              </li>
              <li className="page-item active">
                <span className="page-link">
                  {pagination.page + 1} / {pagination.totalPages}
                </span>
              </li>
              <li
                className={`page-item ${
                  pagination.page >= pagination.totalPages - 1 ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  <ChevronRight size={16} />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <UserModal
        show={isModalOpen}
        mode={modalMode}
        userData={currentUser}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default UserManagement;
