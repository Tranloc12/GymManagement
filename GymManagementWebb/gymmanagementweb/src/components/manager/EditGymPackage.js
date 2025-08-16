import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Apis, { endpoints } from "../../configs/Apis";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";

const EditGymPackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    namePack: "",
    price: "",
    duration: 1,
    unit: "month",
    description: "",
    dayswpt: 0,
    discount: 0,
    isActive: true,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await Apis.get(`${endpoints["gym-packages"]}/${id}`);
        if (res.status === 200) {
          let duration = 1;
          let unit = "month";

          if (res.data.choice) {
            const parts = res.data.choice.split("-");
            if (parts.length === 2) {
              duration = parseInt(parts[0]);
              unit = parts[1];
            }
          }

          setForm({
            namePack: res.data.namePack || "",
            price: res.data.price || 0,
            duration: duration,
            unit: unit,
            description: res.data.description || "",
            dayswpt: res.data.dayswpt || 0,
            discount: res.data.discount || 0,
            isActive: res.data.isActive ?? true,
          });
        } else {
          alert("Không tìm thấy gói tập");
          navigate("/gym-packages");
        }
      } catch (err) {
        alert("Lỗi tải dữ liệu");
        navigate("/gym-packages");
      }
    };

    fetchPackage();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (["duration", "price", "dayswpt", "discount"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        [name]: value === "" ? "" : parseInt(value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const choice = `${Number(form.duration) || 1}-${form.unit || "month"}`;

      const dataToSend = {
        namePack: form.namePack,
        price: Number(form.price) || 0,
        choice: choice,
        description: form.description,
        dayswpt: Number(form.dayswpt) || 0,
        discount: Number(form.discount) || 0,
        isActive: form.isActive,
      };

      const res = await Apis.put(`${endpoints["gym-packages"]}/${id}`, dataToSend);

      if (res.status === 200) {
        alert("Cập nhật gói tập thành công!");
        navigate("/gym-packages-mana");
      } else {
        setError("Cập nhật thất bại, vui lòng thử lại.");
      }
    } catch (err) {
      setError("Cập nhật gói tập thất bại, vui lòng thử lại.");
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: 600 }}>
      <h2 className="mb-4">Chỉnh sửa Gói Tập</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Tên gói tập</Form.Label>
          <Form.Control
            type="text"
            name="namePack"
            value={form.namePack}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Giá (VNĐ)</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={form.price || ""}
            onChange={handleChange}
            required
            min={0}
          />
        </Form.Group>

        <Row className="mb-3">
          <Col xs={6}>
            <Form.Group>
              <Form.Label>Thời gian</Form.Label>
              <Form.Control
                type="number"
                name="duration"
                value={form.duration || ""}
                onChange={handleChange}
                min={1}
                required
              />
            </Form.Group>
          </Col>
          <Col xs={6}>
            <Form.Group>
              <Form.Label>Đơn vị</Form.Label>
              <Form.Select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                required
              >
                <option value="month">Tháng</option>
                <option value="quarter">Quý</option>
                <option value="year">Năm</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Quyền lợi</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Số buổi tập với PT</Form.Label>
          <Form.Control
            type="number"
            name="dayswpt"
            value={form.dayswpt || ""}
            onChange={handleChange}
            min={0}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Giảm giá (%)</Form.Label>
          <Form.Control
            type="number"
            name="discount"
            value={form.discount || ""}
            onChange={handleChange}
            min={0}
            max={100}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
            label="Hoạt động"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Lưu thay đổi
        </Button>
        <Button
          variant="secondary"
          className="ms-2"
          onClick={() => navigate("/gym-packages-mana")}
        >
          Hủy
        </Button>
      </Form>
    </Container>
  );
};

export default EditGymPackage;