import { Container, Row, Col, Nav } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone } from "react-icons/fa"; // Using react-icons for social media icons
import { Link } from "react-router-dom";
import "../../index.css"; 
const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          {/* Brand/Logo Section */}
          <Col md={4} className="mb-3">
            <h5 className="fw-bold">GYM</h5>
            <p className="text-muted">
              Your ultimate destination for fitness and wellness. Join us to achieve your fitness goals!
            </p>
          </Col>

          {/* Navigation Links */}
          <Col md={4} className="mb-3">
            <h5 className="fw-bold">Quick Links</h5>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/" className="text-light p-0 mb-2">
                Trang chủ
              </Nav.Link>
              <Nav.Link as={Link} to="/about" className="text-light p-0 mb-2">
                Giới thiệu
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" className="text-light p-0 mb-2">
                Liên hệ
              </Nav.Link>
              <Nav.Link as={Link} to="/services" className="text-light p-0 mb-2">
                Dịch vụ
              </Nav.Link>
            </Nav>
          </Col>

          {/* Contact Info & Social Media */}
          <Col md={4} className="mb-3">
            <h5 className="fw-bold">Liên hệ</h5>
            <p className="text-muted mb-1">
              <FaEnvelope className="me-2" /> support@gym.com
            </p>
            <p className="text-muted mb-3">
              <FaPhone className="me-2" /> +84 123 456 789
            </p>
            <h6 className="fw-bold">Theo dõi chúng tôi</h6>
            <div className="d-flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-light">
                <FaFacebook size={24} className="social-icon" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-light">
                <FaTwitter size={24} className="social-icon" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-light">
                <FaInstagram size={24} className="social-icon" />
              </a>
            </div>
          </Col>
        </Row>

        {/* Copyright Section */}
        <Row className="mt-3">
          <Col className="text-center">
            <p className="mb-0 text-muted">&copy; {new Date().getFullYear()} GYM. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;