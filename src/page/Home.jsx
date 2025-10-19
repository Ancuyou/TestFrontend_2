import { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import Banner from "../components/home/MovieBanner";
import MovieSlider from "../components/home/MovieSlider";
import PromotionSection from "../components/home/PromotionSection";

const Home = () => {
  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const [resNow, resSoon] = await Promise.all([
          fetch("http://localhost:8080/api/phim/dangchieu").then((r) => r.json()),
          fetch("http://localhost:8080/api/phim/sapchieu").then((r) => r.json()),
        ]);

        setNowShowing(resNow.data || []);
        setComingSoon(resSoon.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi tải phim:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{ background: "#181a20", overflowX: "hidden" }}
    >
      {/* Header */}
      <div style={{ width: "100vw", marginLeft: "calc(-50vw + 50%)" }}>
        <Header />
      </div>

      {/* Banner */}
      <div style={{ width: "100vw", marginLeft: "calc(-50vw + 50%)" }}>
        <Banner movies={nowShowing} />
      </div>

      {/* Nội dung chính */}
      <main className="flex-grow-1 py-5">
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
            </div>
          ) : (
            <>
              {/* PHIM ĐANG CHIẾU */}
              <section className="mb-5">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h2
                    className="mb-0 fw-semibold"
                    style={{ color: "#ff4b2b" }}
                  >
                    <i className="fas fa-fire-alt me-2"></i>Phim đang chiếu
                  </h2>
                  <a
                    href="/movies"
                    className="btn btn-sm border text-white"
                    style={{
                      borderColor: "#ff4b2b",
                      color: "#ff4b2b",
                    }}
                  >
                    Xem tất cả <i className="fas fa-chevron-right ms-1"></i>
                  </a>
                </div>
                <MovieSlider movies={nowShowing} />
              </section>

              {/* PHIM SẮP RA MẮT */}
              <section className="mb-5">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h2
                    className="mb-0 fw-semibold"
                    style={{ color: "#ff4b2b" }}
                  >
                    <i className="fas fa-calendar-alt me-2"></i>Sắp ra mắt
                  </h2>
                  <a
                    href="/movies"
                    className="btn btn-sm border text-white"
                    style={{
                      borderColor: "#ff4b2b",
                      color: "#ff4b2b",
                    }}
                  >
                    Xem tất cả <i className="fas fa-chevron-right ms-1"></i>
                  </a>
                </div>
                <MovieSlider movies={comingSoon} />
              </section>

              {/* KHUYẾN MÃI */}
              <PromotionSection />
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <div style={{ width: "100vw", marginLeft: "calc(-50vw + 50%)" }}>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
