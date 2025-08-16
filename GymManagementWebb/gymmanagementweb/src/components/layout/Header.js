import { useContext, useEffect, useState } from "react";
import { Button, Container, Form, Image, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { MyDispatchContext, MyUserContext } from "../../contexts/Contexts";
import Apis, { endpoints } from "../../configs/Apis";
import RoleBasedComponent from "../common/RoleBasedComponent";
import { ROLES } from "../../utils/roleUtils";
import "../../index.css";

const Header = () => {
  const nav = useNavigate();
  const [kw, setKw] = useState("");
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);

  const [packages, setPackages] = useState([]);




  return (
    <Navbar expand="lg" className="navbar">
      <Container>
        <Navbar.Brand as={Link} to="/">GYM</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto align-items-center">
            <Nav.Link as={Link} to="/">Trang chủ</Nav.Link>

            {/*  Hiện danh sách gói tập */}
            <Nav.Link as={Link} to="/gym-packages">
              Gói tập

            </Nav.Link>

            {/* Admin và Manager - Quản lý gói tập */}
            <RoleBasedComponent allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
              <Nav.Link as={Link} to="/gym-packages-mana">
                Quản lí Gói tập
              </Nav.Link>
            </RoleBasedComponent>

            {/* Member - Tiến độ và gói tập */}
            <RoleBasedComponent allowedRoles={[ROLES.MEMBER]}>
              <Nav.Link as={Link} to="/member-progress">
                Tiến độ Tập Luyện
              </Nav.Link>
              <Nav.Link as={Link} to="/my-subscriptions">
                Gói tập của tôi
              </Nav.Link>
            </RoleBasedComponent>

            {/* Trainer - Quản lý hội viên */}
            <RoleBasedComponent allowedRoles={[ROLES.TRAINER]}>
              <Nav.Link as={Link} to="/trainer-progress">
                Quản Lí Hội Viên
              </Nav.Link>
              <Nav.Link as={Link} to="/trainer-schedule-view">
                Xem Lịch Hội Viên
              </Nav.Link>
            </RoleBasedComponent>

            {/* Đánh giá - Tất cả user đã đăng nhập */}
            <RoleBasedComponent allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.TRAINER, ROLES.MEMBER]}>
              <Nav.Link as={Link} to={`/secure-reviews`}>Đánh giá của tôi</Nav.Link>
            </RoleBasedComponent>

            {/* Thống kê - Chỉ Admin */}
            <RoleBasedComponent allowedRoles={[ROLES.ADMIN]}>
              <Nav.Link as={Link} to="/statistics">
                Thống kê
              </Nav.Link>
            </RoleBasedComponent>

            {
              user === null ? (
                <>
                  <Nav.Link
                    as={Link}
                    to="/register"
                    className="text-white fw-semibold"
                    style={{ transition: "color 0.3s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#dcdcdc")} // trắng xám nhạt khi hover
                    onMouseLeave={e => (e.currentTarget.style.color = "white")}
                  >
                    Đăng ký
                  </Nav.Link>

                  <Nav.Link
                    as={Link}
                    to="/login"
                    className="text-warning fw-semibold"
                    style={{ transition: "color 0.3s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff3cd")} // vàng nhạt khi hover
                    onMouseLeave={e => (e.currentTarget.style.color = "#ffc107")}
                  >
                    Đăng nhập
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/profile" className="text-success">
                    Chào {user.username}
                  </Nav.Link>

                  <Button
                    onClick={() => {
                      dispatch({ type: "logout" });
                      nav("/login");
                    }}
                    variant="danger"
                    className="ms-2"
                  >
                    Đăng xuất
                  </Button>
                </>
              )
            }




          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;