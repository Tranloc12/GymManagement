import { useEffect, useState } from "react";
import { Button, Card, Carousel, Col, Container, Row, Badge, Spinner } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import Apis, { authApis, endpoints } from "../configs/Apis";
import dayjs from "dayjs";
import { handleApiCall } from "../utils/apiUtils";
import "../index.css";

const Home = () => {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [gymPackages, setGymPackages] = useState([]);
  const [topReviews, setTopReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const loadServices = async () => {
    const mockServices = [
      {
        id: 1,
        name: "Personal Training",
        description: "Huấn luyện cá nhân với chuyên gia",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
      },
      {
        id: 2,
        name: "Group Classes",
        description: "Lớp tập nhóm đa dạng",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
      },
      {
        id: 3,
        name: "Nutrition Consulting",
        description: "Tư vấn dinh dưỡng chuyên nghiệp",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
      }
    ];

    await handleApiCall(
      () => Apis.get(endpoints["services"]),
      setServices,
      'services',
      mockServices
    );
  };

  const loadTestimonials = async () => {
    const mockTestimonials = [
      {
        id: 1,
        name: "Nguyễn Văn A",
        role: "Thành viên VIP",
        comment: "Gym này thật tuyệt vời! Tôi đã giảm được 10kg trong 3 tháng.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
      },
      {
        id: 2,
        name: "Trần Thị B",
        role: "Thành viên thường",
        comment: "Huấn luyện viên rất chuyên nghiệp và nhiệt tình.",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
      },
      {
        id: 3,
        name: "Lê Văn C",
        role: "Thành viên mới",
        comment: "Môi trường tập luyện sạch sẽ, thiết bị hiện đại.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
      }
    ];

    await handleApiCall(
      () => Apis.get(endpoints["testimonials"]),
      setTestimonials,
      'testimonials',
      mockTestimonials
    );
  };

  const loadGymPackages = async () => {
    try {
      const res = await Apis.get(endpoints["gym-packages"]);
      setGymPackages(res.data);
    } catch (err) {
      console.error("Error loading gym packages:", err);
    }
  };

  const loadTopReviews = async () => {
    try {
      const res = await authApis().get(endpoints["secure-reviews"]);
      const latest = res.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
      setTopReviews(latest);
    } catch (err) {
      console.error("Error loading reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    loadServices();
    loadTestimonials();
    loadGymPackages();
    loadTopReviews();
  }, [location.pathname]);

  const getChoiceLabel = (choice) => {
    const [duration, unit] = choice.split("-");
    const number = parseInt(duration);

    if (unit === "month") return `${number} tháng`;
    if (unit === "quarter") return `${number} quý - ${number * 3} tháng`;
    if (unit === "year") return `${number} năm - ${number * 12} tháng`;

    return choice;
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Carousel>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
              alt="Gym Banner 1"
            />
            <Carousel.Caption>
              <h1>Chào Mừng Đến Với Gym Của Sức Mạnh</h1>
              <p>Biến ước mơ về một cơ thể khỏe mạnh thành hiện thực!</p>
              <Button variant="primary" size="lg" onClick={() => navigate("/register")}>
                Đăng Ký Ngay
              </Button>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://beast.com.vn/wp-content/uploads/2024/07/thiet-ke-phong-gym-10.webp"
              alt="Gym Banner 2"
            />
            <Carousel.Caption>
              <h1>Tham Gia Các Lớp Tập Chuyên Nghiệp</h1>
              <p>Hãy cùng chúng tôi chinh phục mọi thử thách!</p>
              <Button variant="primary" size="lg" onClick={() => navigate("/register")}>
                Tham Gia Ngay
              </Button>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </section>

      {/* Gói Tập */}
      <section className="gym-packages-section py-5" style={{ background: "#f8f9fa" }}>
        <Container>
          <h2 className="text-center fw-bold mb-5 display-5 text-dark">🎖️ Các Gói Tập Cao Cấp</h2>
          <Row>
            {gymPackages.length > 0 ? (
              gymPackages.map((p) => (
                <Col md={4} key={p.id} className="mb-5">
                  <Card className="h-100 shadow-lg border-0 rounded-4 bg-white custom-card">
                    <Card.Body className="p-4 d-flex flex-column justify-content-between">
                      <div>
                        <Card.Title className="fw-bold fs-4 text-center text-dark mb-3">
                          {p.namePack}
                        </Card.Title>
                        <Card.Subtitle className="mb-3 text-center text-warning fs-5 fw-semibold">
                          {p.price.toLocaleString()} VNĐ
                        </Card.Subtitle>
                        <ul className="list-unstyled lh-lg text-secondary">
                          <li>⏳ <strong>Thời gian:</strong> {getChoiceLabel(p.choice)}</li>
                          <li>🎯 <strong>Quyền lợi:</strong> {p.description}</li>
                          <li>💪 <strong>Số buổi PT:</strong> {p.dayswpt}</li>
                          <li>🎁 <strong>Giảm giá:</strong> {p.discount ? `${p.discount}%` : "Không có"}</li>
                        </ul>
                      </div>
                      <div className="text-center mt-4">
                        <Button
                          variant="dark"
                          className="px-4 py-2 rounded-pill"
                          onClick={() => navigate("/register")}
                        >
                          Đăng ký ngay
                        </Button>
                      </div>
                    </Card.Body>
                    <Card.Footer className="text-center bg-transparent border-0">
                      <Badge bg={p.isActive ? "success" : "danger"} className="px-3 py-2 rounded-pill">
                        {p.isActive ? "Đang hoạt động" : "Tạm ngừng"}
                      </Badge>
                    </Card.Footer>
                  </Card>
                </Col>
              ))
            ) : (
              <p className="text-center text-muted fs-5">Đang tải gói tập...</p>
            )}
          </Row>
        </Container>
      </section>

      {/* Đánh giá tiêu biểu */}
      <section className="py-5 bg-white">
        <Container>
          <h2 className="text-center fw-bold mb-4">💬 Đánh Giá Tiêu Biểu</h2>
          {loadingReviews ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : topReviews.length === 0 ? (
            <p className="text-center text-muted">Chưa có đánh giá nào.</p>
          ) : (
            <Row>
              {topReviews.map((r) => (
                <Col md={4} key={r.id} className="mb-4">
                  <Card className="shadow-sm h-100 rounded-4">
                    <Card.Body>
                      <Card.Title className="text-warning">⭐ {r.rating}/5</Card.Title>
                      <Card.Text className="text-secondary">
                        <strong>PT:</strong> {r.reviewTrainer}<br />
                        <strong>Gói:</strong> {r.reviewPack}<br />
                        <strong>Phòng Gym:</strong> {r.reviewGym}<br />
                        <small className="text-muted">
                          Ngày: {dayjs(r.createdAt).format("DD/MM/YYYY")}
                        </small>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      {/* Call-to-Action */}
      <section className="cta-section text-center">
        <Container>
          <h2>Sẵn Sàng Để Thay Đổi Cơ Thể Của Bạn?</h2>
          <p>Đăng ký ngay hôm nay để nhận ưu đãi đặc biệt!</p>
          <Button variant="success" size="lg" onClick={() => navigate("/register")}>
            Đăng Ký Ngay
          </Button>
        </Container>
      </section>
    </div>
  );
};

export default Home;
