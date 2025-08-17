// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import { Container, Card, Table, Button, Alert } from "react-bootstrap";
import { toToman, formatToman } from "../utils/currency";

function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let auth = null;
    try { auth = JSON.parse(localStorage.getItem("authUser") || "null"); } catch { auth = null; }
    if (!auth) { window.location.href = "/login"; return; }
    setUser(auth);
    const key = `orders_${auth.email}`;
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem(key) || "[]"); } catch { saved = []; }
    setOrders(saved);
  }, []);

  if (!user) return null;

  return (
    <Container className="mt-4" style={{ maxWidth: 980 }}>
      <Card className="mb-3 shadow-sm">
        <Card.Body className="d-flex justify-content-between align-items-center flex-column flex-md-row gap-3">
          <div>
            <h4 className="mb-1">{user.name || "کاربر"}</h4>
            <div className="text-muted">{user.email}</div>
          </div>
          <div className="text-md-end">
            <Button variant="outline-secondary" onClick={() => window.location.href = "/register"}>ویرایش اطلاعات</Button>
          </div>
        </Card.Body>
      </Card>

      <h5 className="mb-3">سفارش‌های شما</h5>
      {orders.length === 0 ? <Alert variant="info">شما هنوز سفارشی ثبت نکرده‌اید.</Alert> :
        orders.map(order => (
          <Card className="mb-3 shadow-sm" key={order.id}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start flex-column flex-md-row">
                <div>
                  <h6 className="mb-1">سفارش #{order.id}</h6>
                  <div className="text-muted" style={{ fontSize:13 }}>تاریخ: {new Date(order.date).toLocaleString()}</div>
                </div>
                <div className="text-md-end mt-3 mt-md-0">
                  <div style={{ fontWeight:700 }}>{formatToman(order.totalToman ?? toToman(order.totalUSD || 0))}</div>
                  <div className="text-muted" style={{ fontSize:13 }}>آیتم‌ها: {order.items?.length || 0}</div>
                </div>
              </div>

              <Table size="sm" className="mt-3">
                <thead><tr><th>محصول</th><th>تعداد</th><th>قیمت واحد</th><th>جمع</th></tr></thead>
                <tbody>
                  {order.items.map(it => (
                    <tr key={it.id}>
                      <td style={{ maxWidth:280 }}>{it.title}</td>
                      <td>{it.quantity || 1}</td>
                      <td>{formatToman(toToman(it.price))}</td>
                      <td>{formatToman(toToman(it.price * (it.quantity || 1)))}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="d-flex justify-content-end gap-2 mt-2">
                <Button size="sm" variant="outline-primary" onClick={() => alert("جزئیات سفارش:\n" + order.items.map(i => `${i.title} × ${i.quantity || 1}`).join("\n"))}>جزئیات</Button>
              </div>
            </Card.Body>
          </Card>
        ))
      }
    </Container>
  );
}

export default Profile;
