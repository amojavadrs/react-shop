import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState("");

  const onSubmit = (data) => {
    setServerError("");
    let users = [];
    try { users = JSON.parse(localStorage.getItem("users") || "[]"); } catch { users = []; }

    const found = users.find(u => (u.email || "").toLowerCase() === (data.email || "").toLowerCase());
    if (!found) { setServerError("کاربری با این ایمیل یافت نشد. لطفاً ثبت‌نام کنید."); return; }
    if (found.password !== data.password) { setServerError("رمز عبور نادرست است."); return; }

    const authObj = { email: found.email, name: found.name || "" };
    try {
      localStorage.setItem("authUser", JSON.stringify(authObj));
      window.dispatchEvent(new Event("authChanged"));
    } catch (e) {
      setServerError("خطا در ذخیره‌سازی محلی.");
      return;
    }

    window.location.href = "/profile";
  };

  return (
    <Container className="mt-4" style={{ maxWidth: 480 }}>
      <Card>
        <Card.Body>
          <h3 className="mb-3">ورود</h3>
          {serverError && <Alert variant="danger">{serverError}</Alert>}
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
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
            <div className="mt-3 text-center">حساب ندارید؟ <Link to="/register">ثبت‌نام</Link></div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
