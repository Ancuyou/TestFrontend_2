const Footer = () => {
  return (
    <footer style={{ background: '#23272f', color: '#f1f1f1', borderTop: '1px solid rgba(255,255,255,0.05)' }} className="pt-5">
      <div className="container">
        <div className="row g-4">
          {/* Logo & Intro */}
          <div className="col-md-3">
            <div className="d-flex align-items-center mb-3">
              <img
                src="https://i.pinimg.com/originals/54/a2/cf/54a2cfd5fc1970a4222eeb3e4fc9d724.png"
                alt="CineTickets"
                style={{ height: '40px' }}
                className="me-2"
              />
              <span className="fw-bold fs-4" style={{ color: '#ff4b2b' }}>CineTickets</span>
            </div>
            <p className="text-secondary small">
              CineTickets – hệ thống đặt vé xem phim trực tuyến hàng đầu, 
              mang đến cho bạn trải nghiệm điện ảnh tiện lợi và đẳng cấp.
            </p>
            <div className="d-flex gap-2 mt-3">
              <a href="#" className="btn text-light" style={{ background: 'rgba(255,255,255,0.1)', width: '36px', height: '36px', borderRadius: '50%', padding: 0 }}>
                <i className="fab fa-facebook-f" style={{ lineHeight: '36px' }}></i>
              </a>
              <a href="#" className="btn text-light" style={{ background: 'rgba(255,255,255,0.1)', width: '36px', height: '36px', borderRadius: '50%', padding: 0 }}>
                <i className="fab fa-twitter" style={{ lineHeight: '36px' }}></i>
              </a>
              <a href="#" className="btn text-light" style={{ background: 'rgba(255,255,255,0.1)', width: '36px', height: '36px', borderRadius: '50%', padding: 0 }}>
                <i className="fab fa-instagram" style={{ lineHeight: '36px' }}></i>
              </a>
            </div>
          </div>

          {/* Phim */}
          <div className="col-md-3">
            <h6 className="fw-bold mb-4" style={{ color: '#ff4b2b' }}>PHIM</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-light text-decoration-none small">Phim đang chiếu</a></li>
              <li className="mb-2"><a href="#" className="text-light text-decoration-none small">Phim sắp chiếu</a></li>
              <li className="mb-2"><a href="#" className="text-light text-decoration-none small">Suất chiếu đặc biệt</a></li>
            </ul>
          </div>

          {/* Rạp */}
          <div className="col-md-3">
            <h6 className="fw-bold mb-4" style={{ color: '#ff4b2b' }}>RẠP CHIẾU</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-light text-decoration-none small">Danh sách rạp</a></li>
              <li className="mb-2"><a href="#" className="text-light text-decoration-none small">Rạp đặc biệt</a></li>
              <li className="mb-2"><a href="#" className="text-light text-decoration-none small">Lịch chiếu</a></li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div className="col-md-3">
            <h6 className="fw-bold mb-4" style={{ color: '#ff4b2b' }}>HỖ TRỢ KHÁCH HÀNG</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-light text-decoration-none small">Hướng dẫn đặt vé</a></li>
              <li className="mb-2"><a href="#" className="text-light text-decoration-none small">Chính sách hoàn vé</a></li>
              <li className="mb-2"><a href="#" className="text-light text-decoration-none small">Liên hệ</a></li>
            </ul>
          </div>
        </div>

        {/* Phương thức thanh toán */}
        <div className="row mt-4">
          <div className="col-12">
            <h6 className="fw-bold mb-3 text-light">PHƯƠNG THỨC THANH TOÁN</h6>
            <div className="d-flex flex-wrap gap-2">
              <img src="https://www.svgrepo.com/show/473649/visa-colored.svg" alt="Visa" height="30" />
              <img src="https://www.svgrepo.com/show/473589/mastercard.svg" alt="Mastercard" height="30" />
              <img src="https://www.svgrepo.com/show/473554/jcbcard.svg" alt="JCB" height="30" />
              <img src="https://www.svgrepo.com/show/511558/momo.svg" alt="MoMo" height="30" />
              <img src="https://www.svgrepo.com/show/452252/zalo-pay.svg" alt="ZaloPay" height="30" />
            </div>
          </div>
        </div>

        {/* Company Info */}
        <hr className="my-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <div className="text-center text-secondary small pb-4">
          <p className="mb-1">Công ty TNHH CineTickets Việt Nam</p>
          <p className="mb-1">Địa chỉ: Tòa nhà Innovation, 24 Quang Trung, Quận Gò Vấp, TP. Hồ Chí Minh</p>
          <p className="mb-0">&copy; {new Date().getFullYear()} CineTickets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
