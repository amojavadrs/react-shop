// src/pages/Checkout.js
import React, { useEffect, useState } from "react";
import { Container, Form, Button, Alert, Table } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/cartSlice";
import { toToman, formatToman } from "../utils/currency";

function Checkout() {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart.items || []);
  const [authUser, setAuthUser] = useState(null);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", address: "" });
  const [error, setError] = useState("");
  const [successOrder, setSuccessOrder] = useState(null);

  useEffect(() => {
    let user = null;
    try { user = JSON.parse(localStorage.getItem("authUser") || "null"); } catch { user = null; }
    if (!user) { window.location.href = "/login"; return; }
    setAuthUser(user);
    setForm(f => ({ ...f, fullName: user.name || "", email: user.email || "" }));
  }, []);

  const totalUSD = cart.reduce((s, it) => s + (it.price * (it.quantity || 1)), 0);
  const totalToman = toToman(totalUSD);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.fullName || !form.email || !form.phone || !form.address) { setError("لطفاً همه فیلدها را تکمیل کنید."); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError("ایمیل معتبر نیست."); return false; }
    if (!/^\d{7,15}$/.test(form.phone)) { setError("شماره تماس معتبر وارد کنید."); return false; }
    if (cart.length === 0) { setError("سبد خرید خالی است."); return false; }
    return true;
  };

  const handleSubmit = e => {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      customer: { name: form.fullName, email: form.email, phone: form.phone, address: form.address },
      items: cart,
      totalUSD: +totalUSD.toFixed(2),
      totalToman
    };

    const key = `orders_${authUser.email}`;
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.unshift(order);
    localStorage.setItem(key, JSON.stringify(existing));

    dispatch(clearCart());
    setSuccessOrder(order);
  };

  if (!authUser) return null;

  return (
    <Container className="mt-4" style={{ maxWidth: 900 }}>
      <h3>تکمیل خرید</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {successOrder && (
        <Alert variant="success">
          سفارش ثبت شد — شماره: <b>{successOrder.id}</b>
          <div className="mt-2">
            <Button variant="primary" onClick={() => window.location.href = "/profile"}>مشاهده سفارش‌ها</Button>
          </div>
        </Alert>
      )}

      {!successOrder && (
        <>
          <Table responsive className="mb-4">
            <thead>
              <tr><th>محصول</th><th>قیمت واحد</th><th>تعداد</th><th>جمع</th></tr>
            </thead>
            <tbody>
              {cart.map(it => (
                <tr key={it.id}>
                  <td style={{ maxWidth:320 }}>{it.title}</td>
                  <td style={{ whiteSpace:"nowrap" }}>{formatToman(toToman(it.price))}</td>
                  <td>{it.quantity || 1}</td>
                  <td style={{ whiteSpace:"nowrap" }}>{formatToman(toToman(it.price * (it.quantity || 1)))}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <div className="text-muted">جمع کل (تومان)</div>
              <div style={{ fontSize:20, fontWeight:700 }}>{formatToman(totalToman)}</div>
            </div>

            <Form onSubmit={handleSubmit} style={{ minWidth: 420 }}>
              <Form.Group className="mb-3">
                <Form.Label>نام و نام خانوادگی</Form.Label>
                <Form.Control name="fullName" value={form.fullName} onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>ایمیل</Form.Label>
                <Form.Control name="email" type="email" value={form.email} onChange={handleChange}/>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>شماره تماس</Form.Label>
                <Form.Control name="phone" value={form.phone} onChange={handleChange}/>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>آدرس</Form.Label>
                <Form.Control as="textarea" rows={3} name="address" value={form.address} onChange={handleChange}/>
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center">
                <Button variant="success" type="submit">ثبت سفارش و پرداخت</Button>
                <Button variant="outline-secondary" onClick={() => window.location.href = "/cart"}>بازگشت به سبد</Button>
              </div>
            </Form>
          </div>
        </>
      )}
    </Container>
  );
}

export default Checkout;
