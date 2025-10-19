import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import authService from "../services/authService";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Token không hợp lệ hoặc đã hết hạn.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }
    setLoading(true);
    const result = await authService.resetPassword({
      token: token,
      newPassword: password,
    });
    setLoading(false);

    if (result.success) {
      setSuccess(
        "Đặt lại mật khẩu thành công! Tự động chuyển về trang đăng nhập..."
      );
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else {
      setError(result.message || "Lỗi không xác định.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title text-center mb-4">Đặt Lại Mật Khẩu</h3>
              <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && (
                  <div className="alert alert-success">{success}</div>
                )}

                {!success && (
                  <>
                    <div className="form-group mb-3">
                      <label>Mật Khẩu Mới</label>
                      <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Nhập Lại Mật Khẩu Mới</label>
                      <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary w-100"
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
                        "Xác nhận"
                      )}
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
