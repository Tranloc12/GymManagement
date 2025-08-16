import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { AiFillStar } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { authApis, endpoints } from "../../configs/Apis";

const ratingLabels = {
  1: "Rất tệ",
  2: "Kém",
  3: "Trung bình",
  4: "Tốt",
  5: "Tuyệt vời",
};

const EditReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTrainer, setReviewTrainer] = useState("");
  const [reviewPack, setReviewPack] = useState("");
  const [reviewGym, setReviewGym] = useState("");
  const [subscriptionId, setSubscriptionId] = useState(null);
  const [createdAt, setCreatedAt] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await authApis().get(`${endpoints["secure-reviews"]}/${id}`);
        const r = res.data;
        setRating(r.rating || 5);
        setReviewTrainer(r.reviewTrainer || "");
        setReviewPack(r.reviewPack || "");
        setReviewGym(r.reviewGym || "");
        setSubscriptionId(r.subscriptionId?.id || null);
        setCreatedAt(r.createdAt || "");
        setError(null);
      } catch (err) {
        setError(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const dataToSend = {
        rating,
        reviewTrainer,
        reviewPack,
        reviewGym,
        createdAt,
      };
      if (subscriptionId) {
        dataToSend.subscriptionId = { id: subscriptionId };
      }

      await authApis().put(`${endpoints["secure-reviews"]}/${id}`, dataToSend);
      alert("Cập nhật đánh giá thành công!");
      navigate("/secure-reviews");
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <div className="mt-2">Đang tải dữ liệu đánh giá...</div>
      </Container>
    );
  }

  return (
    <Container
      className="mt-5 p-5"
      style={{
        maxWidth: 600,
        backgroundColor: "#fefcf8",
        borderRadius: 16,
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        fontFamily:
          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#3a3a3a",
      }}
    >
      <h2
        className="mb-5 text-center"
        style={{
          fontWeight: "700",
          fontSize: 28,
          color: "#2c3e50",
          letterSpacing: 1.2,
          fontFamily: "'Georgia', serif",
        }}
      >
        ✏️ Chỉnh sửa Đánh Giá
      </h2>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-4">
          <Form.Label
            style={{
              fontWeight: "600",
              fontSize: 18,
              color: "#34495e",
              userSelect: "none",
            }}
          >
            Ngày tạo
          </Form.Label>
          <Form.Control
            type="text"
            value={createdAt}
            readOnly
            plaintext
            className="text-muted"
            style={{ fontSize: 16 }}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label
            style={{
              fontWeight: "600",
              fontSize: 18,
              color: "#34495e",
              userSelect: "none",
            }}
          >
            Chất lượng tổng thể
          </Form.Label>
          <div>
            {[1, 2, 3, 4, 5].map((star) => {
              const fill = star <= (hoverRating || rating);
              return (
                <AiFillStar
                  key={star}
                  size={36}
                  style={{
                    cursor: "pointer",
                    color: fill ? "#facc15" : "#dcdcdc",
                    marginRight: 8,
                    filter: fill ? "drop-shadow(0 0 5px #fbbf24)" : "none",
                    transition: "color 0.3s ease, filter 0.3s ease",
                  }}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`Rating ${star} star`}
                />
              );
            })}
          </div>
          <div
            style={{
              marginTop: 8,
              fontWeight: "500",
              fontSize: 16,
              color: "#7f8c8d",
              fontStyle: "italic",
              minHeight: "24px",
            }}
          >
            {ratingLabels[hoverRating || rating]}
          </div>
        </Form.Group>

        {[
          {
            label: "Đánh giá Huấn luyện viên (PT)",
            placeholder: "Huấn luyện viên có tận tâm, nhiệt huyết không?",
            value: reviewTrainer,
            onChange: setReviewTrainer,
          },
          {
            label: "Đánh giá Gói tập",
            placeholder: "Gói tập có phù hợp và mang lại hiệu quả không?",
            value: reviewPack,
            onChange: setReviewPack,
          },
          {
            label: "Đánh giá Phòng gym",
            placeholder: "Phòng gym có sạch sẽ, tiện nghi đầy đủ không?",
            value: reviewGym,
            onChange: setReviewGym,
          },
        ].map(({ label, placeholder, value, onChange }, idx) => (
          <Form.Group key={idx} className="mb-4">
            <Form.Label
              style={{
                fontWeight: "600",
                fontSize: 17,
                color: "#34495e",
              }}
            >
              {label}
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              style={{
                fontSize: 16,
                padding: "14px 18px",
                borderRadius: 10,
                border: "1.5px solid #ccc",
                backgroundColor: "#fff",
                boxShadow: "inset 0 2px 5px rgb(0 0 0 / 0.03)",
                transition: "border-color 0.3s ease",
                resize: "vertical",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#34495e")}
              onBlur={(e) => (e.target.style.borderColor = "#ccc")}
              required
            />
          </Form.Group>
        ))}

        <Button
          type="submit"
          className="w-100"
          style={{
            backgroundColor: "#34495e",
            borderColor: "#34495e",
            padding: "14px 0",
            fontSize: 18,
            fontWeight: "600",
            borderRadius: 10,
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#2c3e50")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#34495e")}
          disabled={saving}
        >
          {saving ? "Đang lưu..." : <><FaSave className="me-2" />Lưu thay đổi</>}
        </Button>

        <Button
          variant="outline-secondary"
          className="w-100 mt-3"
          onClick={() => navigate("/secure-reviews")}
          disabled={saving}
          style={{
            borderRadius: 10,
            padding: "14px 0",
            fontWeight: 600,
          }}
        >
          <MdOutlineCancel className="me-2" /> Hủy
        </Button>
      </Form>
    </Container>
  );
};

export default EditReview;
