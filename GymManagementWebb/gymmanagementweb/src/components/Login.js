import { useContext, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import Apis, { authApis, endpoints } from "../configs/Apis";
import MySpinner from "./layout/MySpinner";
import { useNavigate, useSearchParams } from "react-router-dom";
import cookie from "react-cookies";
import { MyDispatchContext } from "../contexts/Contexts";

const Login = () => {
    const info = [
        { label: "Tên đăng nhập", field: "username", type: "text" },
        { label: "Mật khẩu", field: "password", type: "password" },
    ];

    const [user, setUser] = useState({ username: "", password: "" });
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const dispatch = useContext(MyDispatchContext);
    const [q] = useSearchParams();

    const login = async (e) => {
        e.preventDefault();
        setMsg(null);

        try {
            setLoading(true);

            // Gửi login, nhận token
            const res = await Apis.post(endpoints["login"], {
                username: user.username,
                password: user.password,
            });

            // Lưu token vào cookie
            cookie.save("token", res.data.token, { path: "/" });

            // Dùng token gọi api lấy thông tin user
            const u = await authApis().get(endpoints["current-user"]);
            console.log("Thông tin user:", u.data);

            // Cập nhật context lưu user
            dispatch({ type: "login", payload: u.data });

            // ✅ Chuyển về trang chủ sau đăng nhập
            nav("/", { replace: true });
        } catch (ex) {
            console.error(ex);
            setMsg("Tên đăng nhập hoặc mật khẩu không đúng!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h1 className="text-center text-success mt-2">ĐĂNG NHẬP NGƯỜI DÙNG</h1>

            {msg && <Alert variant="danger" className="mt-1">{msg}</Alert>}

            <Form onSubmit={login}>
                {info.map((i) => (
                    <Form.Group key={i.field} className="mb-3">
                        <Form.Control
                            value={user[i.field]}
                            onChange={(e) => setUser({ ...user, [i.field]: e.target.value })}
                            type={i.type}
                            placeholder={i.label}
                            required
                            autoComplete={i.field === "username" ? "username" : "current-password"}
                        />
                    </Form.Group>
                ))}

                <Form.Group className="mb-3">
                    {loading ? <MySpinner /> : <Button type="submit" variant="danger">Đăng nhập</Button>}
                </Form.Group>
            </Form>
        </>
    );
};

export default Login;
