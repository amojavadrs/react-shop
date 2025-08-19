import React, { useEffect, useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    let auth = null;
    try { auth = JSON.parse(localStorage.getItem("authUser") || "null"); } catch { auth = null; }
    if (!auth) {
      navigate("/login");
      return;
    }
    setValue("name", auth.name || "");
    setValue("email", auth.email || "");
  }, [navigate, setValue]);

  const onSubmit = (data) => {
    setServerError("");
    setSuccessMsg("");

    let users = [];
    try { users = JSON.parse(localStorage.getItem("users") || "[]"); } catch { users = []; }

    let auth = null;
    try { auth = JSON.parse(localStorage.getItem("authUser") || "null"); } catch { auth = null; }
    if (!auth) { setServerError("خطا: کاربری یافت نشد. لطفاً وارد شوید."); return; }

    const oldEmail = auth.email;
    const emailLower = (data.email || "").toLowerCase();
    const emailTaken = users.some(u => (u.email || "").toLowerCase() === emailLower && (u.email || "").toLowerCase() !== (oldEmail || "").toLowerCase());
    if (emailTaken) {
      setServerError("این ایمیل قبلاً برای حساب دیگری استفاده شده است.");
      return;
    }

    let updated = false;
    users = users.map(u => {
      if ((u.email || "").toLowerCase() === (oldEmail || "").toLowerCase()) {
        updated = true;
        return { ...u, name: data.name, email: data.email, password: data.password ? data.password : u.password };
      }
      return u;
    });
    if (!updated) users.push({ name: data.name, email: data.email, password: data.password || "" });

    try { localStorage.setItem("users", JSON.stringify(users)); } catch (e) { setServerError("خطا در ذخیره‌سازی کاربران."); return; }

    try {
      if ((oldEmail || "") !== (data.email || "")) {
        const oldKey = `orders_${oldEmail}`;
        const newKey = `orders_${data.email}`;
        const oldOrders = JSON.parse(localStorage.getItem(oldKey) || "[]");
        const newOrders = JSON.parse(localStorage.getItem(newKey) || "[]");
        const merged = [...oldOrders, ...newOrders];
        localStorage.setItem(newKey, JSON.stringify(merged));
        localStorage.removeItem(oldKey);
      }
    } catch (e) {
      console.warn("order-move error", e);
    }

    const newAuth = { name: data.name, email: data.email };
    try {
      localStorage.setItem("authUser", JSON.stringify(newAuth));
      window.dispatchEvent(new Event("authChanged"));
    } catch (e) { setServerError("خطا در ذخیره اطلاعات ورود."); return; }

    setSuccessMsg("اطلاعات با موفقیت بروزرسانی شد.");
    setTimeout(() => navigate("/profile"), 900);
  };

  return (
    <Container className="mt-4" style={{ maxWidth: 560 }}>
      <Card>
        <Card.Body>
          <h4 className="mb-3">ویرایش اطلاعات</h4>
          {serverError && <Alert variant="danger">{serverError}</Alert>}
          {successMsg && <Alert variant="success">{successMsg}</Alert>}

          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Form.Group className="mb-3">
              <Form.Label>نام و نام خانوادگی</Form.Label>
              <Form.Control {...register("name", { required: "نام لازم است" })} />
              {errors.name && <small className="text-danger">{errors.name.message}</small>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>ایمیل</Form.Label>
              <Form.Control type="email" {...register("email", { required: "ایمیل لازم است", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "ایمیل معتبر نیست" } })} />
              {errors.email && <small className="text-danger">{errors.email.message}</small>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>تغییر رمز (اختیاری)</Form.Label>
              <Form.Control type="password" placeholder="در صورت نیاز وارد کنید" {...register("password", { minLength: { value: 4, message: "حداقل 4 کاراکتر" } })} />
              {errors.password && <small className="text-danger">{errors.password.message}</small>}
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate("/profile")}>انصراف</Button>
              <Button variant="primary" type="submit">ذخیره تغییرات</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
