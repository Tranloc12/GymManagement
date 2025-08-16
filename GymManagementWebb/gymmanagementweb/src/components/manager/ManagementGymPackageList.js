// ManagementGymPackageList.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Apis, { endpoints, authApis } from "../../configs/Apis";
import { Table, Badge, Container, Button, Spinner, Alert } from "react-bootstrap";
import { handleApiCall, formatPrice, getChoiceLabel } from "../../utils/apiUtils";

const ManagementGymPackageList = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchPackages = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await Apis.get(endpoints["gym-packages"]);
      console.log("API trả về:", res.data);
      setPackages(res.data);
    } catch (err) {
      setError("Không tải được danh sách gói tập");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa gói tập này không?")) {
      try {
        await authApis().delete(`${endpoints["gym-packages"]}/${id}`);
        setPackages((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        alert("Xóa gói tập thất bại");
      }
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý Gói Tập</h2>
        <Button variant="success" onClick={() => navigate("/gym-packages-mana/add")}>
          + Thêm gói tập
        </Button>
      </div>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && packages.length === 0 && <p>Không có gói tập nào.</p>}

      {!loading && packages.length > 0 && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên gói tập</th>
              <th>Giá (VNĐ)</th>
              <th>Thời gian</th>
              <th>Quyền lợi</th>
              <th>Số buổi PT</th>
              <th>Giảm giá</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((p, index) => (
              <tr key={p.id}>
                <td>{index + 1}</td>
                <td>{p.namePack}</td>
                <td className="text-danger fw-semibold">{formatPrice(p.price)}</td>
                <td>{getChoiceLabel(p.choice)}</td>
                <td>{p.description}</td>
                <td>{p.dayswpt}</td>
                <td>{p.discount ? `${p.discount}%` : "Không có"}</td>
                <td>
                  <Badge bg={p.isActive ? "success" : "secondary"}>
                    {p.isActive ? "Hoạt động" : "Không hoạt động"}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/gym-packages-mana/edit/${p.id}`)}
                  >
                    Sửa
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)}>
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ManagementGymPackageList;
