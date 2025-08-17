// src/pages/Login.js
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    setServerError("");
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const found = users.find(u => u.email.toLowerCase() === (data.email || "").toLowerCase());
    if (!found) { setServerError("کاربری با این ایمیل یافت نشد."); return; }
    if (found.password !== data.password) { setServerError("رمز عبور نادرست است."); return; }
    localStorage.setItem("authUser", JSON.stringify({ email: found.email, name: found.name }));
    navigate("/profile");
  };

  return (
    <Container className="mt-4" style={{ maxWidth:480 }}>
      <Card><Card.Body>
        <h3 className="mb-3">ورود</h3>
        {serverError && <Alert variant="danger">{serverError}</Alert>}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>ایمیل</Form.Label>
            <Form.Control type="email" {...register("email", { required: "ایمیل لازم است" })} />
            {errors.email && <small className="text-danger">{errors.email.message}</small>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>رمز عبور</Form.Label>
            <Form.Control type="password" {...register("password", { required: "رمز لازم است" })} />
            {errors.password && <small className="text-danger">{errors.password.message}</small>}
          </Form.Group>
          <Button type="submit" className="w-100">ورود</Button>
        </Form>
        <div className="mt-3 text-center">حساب ندارید؟ <Link to="/register">ثبت‌نام</Link></div>
      </Card.Body></Card>
    </Container>
  );
}

export default Login;
