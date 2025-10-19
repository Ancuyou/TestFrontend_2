import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate
import authService from "../services/authService";
import "./Login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Khởi tạo navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (!email) {
      setError("Vui lòng nhập email của bạn.");
      return;
    }
    setLoading(true);
    const result = await authService.forgotPassword(email);
    setLoading(false);
    if (result.success) {
      setMessage(
        "Yêu cầu thành công! Vui lòng kiểm tra email. Tự động chuyển về trang đăng nhập sau 3 giây."
      );
      // Tự động chuyển hướng sau 3 giây
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else {
      setError(result.message || "Email không tồn tại trong hệ thống.");
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <div className="login-form-container p-4 p-sm-5">
        <h2 className="text-center mb-4">Quên Mật Khẩu</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}
          <div className="form-group mb-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email đã đăng ký"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span className="sr-only"> Đang tải...</span>
              </>
            ) : (
              "Gửi yêu cầu"
            )}
          </button>
          <div className="text-center">
            <Link to="/login">Quay lại Đăng nhập</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
