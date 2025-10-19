import React, { useEffect, useState } from "react";

const PromotionSection = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/khuyenmai/valid");
        const data = await res.json();
        setPromotions(data.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi tải khuyến mãi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  if (loading)
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );

  if (promotions.length === 0)
    return (
      <section className="mt-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="mb-0 fw-semibold" style={{ color: "#ff4b2b" }}>
            <i className="fas fa-gift me-2"></i>Khuyến mãi
          </h2>
        </div>

        <div className="row g-4">
          {[
            {
              tenKm: "Ưu đãi thành viên SuperMovie",
              moTa: "Giảm giá 30% cho tất cả suất chiếu vào Thứ 4 hàng tuần.",
              hinhAnh:
                "https://api-website.cinestar.com.vn/media/wysiwyg/CMSPage/Promotions/HSSV-2.jpg",
              ngayBatDau: "01/10/2025",
              ngayKetThuc: "31/12/2025",
            },
            {
              tenKm: "Happy Day - Vé chỉ 45.000đ",
              moTa: "Áp dụng cho học sinh, sinh viên tại các rạp SuperMovie toàn quốc.",
              hinhAnh: "https://media.lottecinemavn.com/Media/Event/60cb72826642494ab62b80df02cbeb22.jpg",
              ngayBatDau: "05/10/2025",
              ngayKetThuc: "31/12/2025",
            },
            {
              tenKm: "Combo bắp nước chỉ 45.000đ",
              moTa: "Combo bắp nước chỉ 45.000đ",
              hinhAnh: "https://media.lottecinemavn.com/Media/Event/5bb61105185d44158c2e50326cdfa05e.jpg",
              ngayBatDau: "10/10/2025",
              ngayKetThuc: "31/12/2025",
            },
          ].map((km, i) => (
            <div key={i} className="col-md-4 col-sm-6">
              <div
                className="card h-100 border-0 shadow-sm"
                style={{ background: "#20232a", color: "#fff" }}
              >
                <img
                  src={km.hinhAnh}
                  alt={km.tenKm}
                  className="card-img-top"
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "4px 4px 0 0",
                  }}
                />
                <div className="card-body">
                  <h5
                    className="card-title fw-semibold"
                    style={{ color: "#ff4b2b" }}
                  >
                    {km.tenKm}
                  </h5>
                  <p
                    className="card-text text-muted"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {km.moTa}
                  </p>
                </div>
                <div className="card-footer border-0 bg-transparent">
                  <small className="text-secondary">
                    ⏳ {km.ngayBatDau} → {km.ngayKetThuc}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );

  return (
    <section className="mt-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="mb-0 fw-semibold" style={{ color: "#ff4b2b" }}>
          <i className="fas fa-gift me-2"></i>Khuyến mãi
        </h2>
        <a
          href="/promotions"
          className="btn btn-sm border text-white"
          style={{
            borderColor: "#ff4b2b",
            color: "#ff4b2b",
          }}
        >
          Xem tất cả <i className="fas fa-chevron-right ms-1"></i>
        </a>
      </div>

      <div className="row g-4">
        {promotions.map((km) => (
          <div key={km.maKm} className="col-md-4 col-sm-6">
            <div
              className="card h-100 border-0 shadow-sm"
              style={{ background: "#20232a", color: "#fff" }}
            >
              <img
                src={km.hinhAnh || "/default-promo.jpg"}
                alt={km.tenKm}
                className="card-img-top"
                style={{
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "4px 4px 0 0",
                }}
              />
              <div className="card-body">
                <h5
                  className="card-title fw-semibold"
                  style={{ color: "#ff4b2b" }}
                >
                  {km.tenKm}
                </h5>
                <p
                  className="card-text text-muted"
                  style={{ fontSize: "0.9rem" }}
                >
                  {km.moTa?.length > 100
                    ? km.moTa.substring(0, 100) + "..."
                    : km.moTa}
                </p>
              </div>
              <div className="card-footer border-0 bg-transparent">
                <small className="text-secondary">
                  ⏳ {km.ngayBatDau} → {km.ngayKetThuc}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PromotionSection;
