import { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import Banner from "../components/home/MovieBanner";
import Movie from "../components/home/Movie";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [bannerMovies, setBannerMovies] = useState([]); // Giữ banner cố định
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        let url = "";

        if (statusFilter === "dangchieu")
          url = "http://localhost:8080/api/phim/dangchieu";
        else if (statusFilter === "sapchieu")
          url = "http://localhost:8080/api/phim/sapchieu";
        else url = `http://localhost:8080/api/phim/pageable?page=${page}&size=8`;

        const res = await fetch(url);
        const data = await res.json();

        if (data?.data) {
          if (Array.isArray(data.data)) {
            setMovies(data.data);
            if (statusFilter === "all" && bannerMovies.length === 0) {
              setBannerMovies(data.data); // Lưu phim cho banner lần đầu
            }
          } else {
            setMovies(data.data.currentMovies || []);
            setTotalPages(data.data.totalPages || 1);
            if (statusFilter === "all" && bannerMovies.length === 0) {
              setBannerMovies(data.data.currentMovies || []);
            }
          }
        }
      } catch (error) {
        console.error("Lỗi tải danh sách phim:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [page, statusFilter]);

  const filteredMovies = movies.filter((m) =>
    m.tenPhim?.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="d-flex flex-column min-vh-100" style={{ background: "#181a20" }}>
      <Header />

      {/* ✅ Banner vẫn giữ nguyên khi đổi filter */}
      <Banner movies={bannerMovies.length ? bannerMovies : movies} />

      {/* Bộ lọc phim */}
      <section className="py-4" style={{ background: "#101114" }}>
        <div className="container d-flex flex-wrap align-items-center justify-content-between gap-3">
          {/* Nút lọc trạng thái */}
          <div className="btn-group" role="group">
            {[
              { key: "all", label: "Tất cả" },
              { key: "dangchieu", label: "Đang chiếu" },
              { key: "sapchieu", label: "Sắp chiếu" },
            ].map((btn) => (
              <button
                key={btn.key}
                className={`btn ${
                  statusFilter === btn.key ? "btn-danger" : "btn-outline-light"
                }`}
                style={{
                  borderRadius: "20px",
                  padding: "6px 18px",
                  fontWeight: "500",
                  borderColor: "#ff4b2b",
                  color: statusFilter === btn.key ? "#fff" : "#ccc",
                }}
                onClick={() => {
                  setStatusFilter(btn.key);
                  setPage(1);
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Ô tìm kiếm */}
          <div
            className="d-flex align-items-center"
            style={{
              background: "#e0e3e8ff",
              borderRadius: "25px",
              padding: "6px 14px",
              border: "1px solid #ff4b2b",
              width: "260px",
            }}
          >
            <i className="fas fa-search text-light me-2"></i>
            <input
              type="text"
              className="form-control bg-transparent border-0 text-white"
              placeholder="Tìm kiếm tên phim..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{
                outline: "none",
                boxShadow: "none",
                fontSize: "14px",
                color: "#fff",
              }}
            />
          </div>
        </div>
      </section>

      {/* Danh sách phim */}
      <main className="flex-grow-1 py-5 text-white">
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h2 className="mb-0" style={{ color: "#ff4b2b" }}>
                  <i className="fas fa-film me-2"></i>
                  {statusFilter === "dangchieu"
                    ? "Phim đang chiếu"
                    : statusFilter === "sapchieu"
                    ? "Phim sắp ra mắt"
                    : "Tất cả phim"}
                </h2>
              </div>

              <div className="row g-4 justify-content-center">
                {filteredMovies.length > 0 ? (
                  filteredMovies.map((movie, idx) => (
                    <div
                      key={idx}
                      className="col-lg-3 col-md-4 col-sm-6 d-flex justify-content-center"
                    >
                      <Movie movie={movie} />
                    </div>
                  ))
                ) : (
                  <div className="text-center text-secondary fs-5">
                    Không tìm thấy phim phù hợp.
                  </div>
                )}
              </div>

              {/* Phân trang */}
              {statusFilter === "all" && totalPages > 1 && (
                <div className="d-flex justify-content-center mt-5">
                  <nav>
                    <ul className="pagination">
                      <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => setPage(page - 1)}
                          style={{
                            background: "#101114",
                            color: "#ff4b2b",
                            border: "1px solid #ff4b2b",
                            borderRadius: "20px 0 0 20px",
                          }}
                        >
                          <i className="fas fa-chevron-left"></i> Trước
                        </button>
                      </li>

                      {Array.from({ length: totalPages }, (_, i) => (
                        <li key={i} className="page-item">
                          <button
                            className="page-link"
                            onClick={() => setPage(i + 1)}
                            style={{
                              background:
                                page === i + 1 ? "#ff4b2b" : "transparent",
                              color: page === i + 1 ? "#fff" : "#ccc",
                              border: "1px solid #ff4b2b",
                              borderRadius: "0",
                              transition: "all 0.2s",
                            }}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}

                      <li
                        className={`page-item ${
                          page === totalPages ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setPage(page + 1)}
                          style={{
                            background: "#101114",
                            color: "#ff4b2b",
                            border: "1px solid #ff4b2b",
                            borderRadius: "0 20px 20px 0",
                          }}
                        >
                          Sau <i className="fas fa-chevron-right"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Movies;
