import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import Apis, { endpoints } from "../configs/Apis";
import MySpinner from "./layout/MySpinner";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [user, setUser] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        dob: "",
        goal: "",
        height: "",
        weight: ""
    });

    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const validate = () => {
        if (!user.password || user.password !== user.confirmPassword) {
            setMsg("Mật khẩu không khớp!");
            return false;
        }
        return true;
    };

    const register = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        setMsg(null);

        try {
            // Chỉ gửi các trường backend cần, bỏ confirmPassword
            const payload = {
                username: user.username,
                password: user.password,
                email: user.email,
                dob: user.dob,
                goal: user.goal,
                height: Number(user.height), // gửi số
                weight: Number(user.weight)  // gửi số
            };

            console.log("Payload gửi đi:", payload);

            const res = await Apis.post(endpoints['register'], payload, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (res.status === 201 || res.status === 200) {
                nav('/login');
            }
        } catch (ex) {
            console.error("Lỗi khi đăng ký:", ex.response);

            if (ex.response?.data?.message) {
                setMsg(ex.response.data.message);
            } else if (typeof ex.response?.data === 'string') {
                setMsg(ex.response.data);
            } else if (ex.response?.data?.error) {
                setMsg(ex.response.data.error);
            } else {
                setMsg("Đăng ký thất bại, vui lòng thử lại.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h1 className="text-center text-success mt-2">ĐĂNG KÝ NGƯỜI DÙNG</h1>

            {msg && <Alert variant="danger" className="mt-1">{msg}</Alert>}

            <Form onSubmit={register}>
                <Form.Group className="mb-3">
                    <Form.Control
                        value={user.username}
                        onChange={e => setUser({ ...user, username: e.target.value })}
                        type="text" placeholder="Tên đăng nhập" required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control
                        value={user.password}
                        onChange={e => setUser({ ...user, password: e.target.value })}
                        type="password" placeholder="Mật khẩu" required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control
                        value={user.confirmPassword}
                        onChange={e => setUser({ ...user, confirmPassword: e.target.value })}
                        type="password" placeholder="Xác nhận mật khẩu" required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control
                        value={user.email}
                        onChange={e => setUser({ ...user, email: e.target.value })}
                        type="email" placeholder="Email" required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control
                        value={user.dob}
                        onChange={e => setUser({ ...user, dob: e.target.value })}
                        type="date" placeholder="Ngày sinh" required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control
                        value={user.goal}
                        onChange={e => setUser({ ...user, goal: e.target.value })}
                        type="text" placeholder="Mục tiêu" required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control
                        value={user.height}
                        onChange={e => setUser({ ...user, height: e.target.value })}
                        type="number" placeholder="Chiều cao (cm)" required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control
                        value={user.weight}
                        onChange={e => setUser({ ...user, weight: e.target.value })}
                        type="number" placeholder="Cân nặng (kg)" required />
                </Form.Group>

                <Form.Group className="mb-3 text-center">
                    {loading ? <MySpinner /> : <Button type="submit" variant="danger">Đăng ký</Button>}
                </Form.Group>
            </Form>
        </>
    );
};

export default Register;
