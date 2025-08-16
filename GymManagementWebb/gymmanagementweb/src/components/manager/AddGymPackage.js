import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Apis, { endpoints, authApis } from "../../configs/Apis";
import { Form, Button, Container, Card } from "react-bootstrap";

const AddGymPackage = () => {
  const [form, setForm] = useState({
    namePack: "",
    price: 0,
    duration: 1,       // số lượng thời gian
    unit: "month",     // đơn vị: tháng/quý/năm
    description: "",
    dayswpt: 0,
    discount: 0,
    isActive: true,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        choice: `${form.duration}-${form.unit}`, // gộp lại như "3-month"
      };
      delete payload.duration;
      delete payload.unit;

      await authApis().post(endpoints["gym-packages"], payload);
      navigate("/gym-packages-mana");
    } catch (err) {
      console.error("Lỗi thêm gói tập:", err);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: 600 }}>
      <Card className="shadow-sm p-4 rounded-4">
        <h3 className="text-primary fw-bold mb-4 text-center">Thêm Gói Tập</h3>
        <Form onSubmit={handleSubmit}>

          <Form.Group controlId="namePack" className="mb-3">
            <Form.Label>Tên gói tập</Form.Label>
            <Form.Control
              name="namePack"
              value={form.namePack}
              onChange={handleChange}
              required
              placeholder="Nhập tên gói tập"
            />
          </Form.Group>

          <Form.Group controlId="price" className="mb-3">
            <Form.Label>Giá (VNĐ)</Form.Label>
            <Form.Control
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
              min={0}
            />
          </Form.Group>

          <Form.Group controlId="duration-unit" className="mb-3">
            <Form.Label>Thời gian gói tập</Form.Label>
            <div className="d-flex">
              <Form.Control
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                required
                min="1"
                className="me-2"
                style={{ maxWidth: "100px" }}
              />
              <Form.Select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                style={{ maxWidth: "150px" }}
              >
                <option value="month">Tháng</option>
                <option value="quarter">Quý</option>
                <option value="year">Năm</option>
              </Form.Select>
            </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Quyền lợi</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Nhập mô tả quyền lợi của gói tập"
              required
            />
          </Form.Group>

          <Form.Group controlId="dayswpt" className="mb-3">
            <Form.Label>Số buổi PT</Form.Label>
            <Form.Control
              name="dayswpt"
              type="number"
              value={form.dayswpt}
              onChange={handleChange}
              required
              min={0}
            />
          </Form.Group>

          <Form.Group controlId="discount" className="mb-3">
            <Form.Label>Giảm giá (%)</Form.Label>
            <Form.Control
              name="discount"
              type="number"
              value={form.discount}
              onChange={handleChange}
              min={0}
              max={100}
            />
          </Form.Group>

          <Form.Group controlId="isActive" className="mb-3">
            <Form.Check
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              label="Đang hoạt động"
            />
          </Form.Group>


          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-2" onClick={() => navigate("/gym-packages-mana")}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              Lưu Gói Tập
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default AddGymPackage;
