import { useEffect, useState } from "react";
import { Alert, Container, Card, Button, Modal, Spinner } from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";
import { useNavigate } from "react-router-dom";
import { AiOutlineEdit, AiOutlineDelete, AiFillStar } from "react-icons/ai";
import { formatDate } from "../../utils/apiUtils";

const ReviewList = () => {
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const res = await authApis().get(endpoints["secure-reviews"]);
                const sortedReviews = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setReviews(sortedReviews);
                setError(null);
            } catch (err) {
                console.error("Lỗi khi gọi API reviews:", err);
                setError(err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const handleDelete = async (id) => {
        try {
            setDeleting(true);
            await authApis().delete(`${endpoints["secure-reviews"]}/${id}`);
            setReviews(reviews.filter(r => r.id !== id));
            setError(null);
        } catch (err) {
            console.error("Lỗi khi xóa review:", err);
            setError(err.response?.data || err.message);
        } finally {
            setDeletingId(null);
            setDeleting(false);
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit-review/${id}`);
    };

    return (
        <Container className="mt-5" style={{ maxWidth: "800px" }}>
            <h2 className="mb-4 text-center" style={{ color: "#2c3e50", fontWeight: "700" }}>
                📋 Đánh Giá Của Bạn
            </h2>

            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <div>Đang tải đánh giá...</div>
                </div>
            ) : reviews.length === 0 ? (
                <Alert variant="info">Bạn chưa có đánh giá nào.</Alert>
            ) : (
                reviews.map(r => (
                    <Card
                        key={r.id}
                        className="mb-4 shadow-sm"
                        style={{
                            borderLeft: "6px solid #f1c40f",
                            border: "1px solid #ddd",
                            borderRadius: "12px",
                            padding: "16px", // giảm padding cho nhỏ hơn
                            background: "#fcfcfc",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                            transition: "all 0.3s ease", // hiệu ứng mượt
                            transform: "translateY(0px)",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
                    >
                        <Card.Body>
                            <Card.Title style={{ fontSize: "20px", fontWeight: "600", marginBottom: "10px" }}>
                                {[...Array(r.rating)].map((_, i) => (
                                    <AiFillStar key={i} color="#f1c40f" size={20} />
                                ))}{" "}
                                ({r.rating}/5)
                            </Card.Title>

                            <Card.Text style={{ fontSize: "18px", lineHeight: "1.6" }}>
                                <strong>📅 Ngày:</strong> {formatDate(r.createdAt)} <br />
                                <strong>🏋️ Gói tập:</strong> {r.subscriptionId.packageId.namePack}<br />
                                <strong>👨‍🏫 Huấn luyện viên:</strong> {r.subscriptionId.trainerId.username}<br />
                                <strong>👤 Hội viên:</strong> {r.subscriptionId.memberId.username}<br />
                                <hr />
                                <strong>💬 PT:</strong> {r.reviewTrainer}<br />
                                <strong>💼 Gói:</strong> {r.reviewPack}<br />
                                <strong>🏢 Phòng gym:</strong> {r.reviewGym}
                            </Card.Text>

                            <div className="text-end">
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleEdit(r.id)}
                                >
                                    <AiOutlineEdit /> Sửa
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => setDeletingId(r.id)}
                                >
                                    <AiOutlineDelete /> Xóa
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                ))
            )}

            {/* Modal confirm xóa */}
            <Modal show={deletingId !== null} onHide={() => setDeletingId(null)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn xóa đánh giá này không?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDeletingId(null)}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(deletingId)} disabled={deleting}>
                        {deleting ? "Đang xóa..." : "Xóa"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ReviewList;
