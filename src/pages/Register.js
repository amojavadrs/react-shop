import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState("");

  const onSubmit = (data) => {
    setServerError("");
    let users = [];
    try { users = JSON.parse(localStorage.getItem("users") || "[]"); } catch { users = []; }

    if (users.find(u => (u.email || "").toLowerCase() === data.email.toLowerCase())) {
      setServerError("این ایمیل قبلاً ثبت شده است."); return;
    }

    users.push({ name: data.name, email: data.email, password: data.password });
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("authUser", JSON.stringify({ name: data.name, email: data.email }));
    window.dispatchEvent(new Event("authChanged"));
    navigate("/profile");
  };

  return (
    <Container className="mt-4" style={{ maxWidth:480 }}>
      <Card>
        <Card.Body>
          <h3 className="mb-3">ثبت‌نام</h3>
          {serverError && <Alert variant="danger">{serverError}</Alert>}
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Form.Group className="mb-3">
              <Form.Label>نام</Form.Label>
              <Form.Control {...register("name", { required: "نام لازم است" })} />
              {errors.name && <small className="text-danger">{errors.name.message}</small>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ایمیل</Form.Label>
              <Form.Control type="email" {...register("email", { required: "ایمیل لازم است" })} />
              {errors.email && <small className="text-danger">{errors.email.message}</small>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>رمز عبور</Form.Label>
              <Form.Control type="password" {...register("password", { required: "رمز لازم است", minLength: { value:6, message:"حداقل 6 کاراکتر" } })} />
              {errors.password && <small className="text-danger">{errors.password.message}</small>}
            </Form.Group>
            <Button type="submit" className="w-100" variant="success">ثبت‌نام</Button>
          </Form>
          <div className="mt-3 text-center">قبلاً حساب دارید؟ <Link to="/login">ورود</Link></div>
        </Card.Body>
      </Card>
    </Container>
  );
}
