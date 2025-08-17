// src/pages/Cart.js
import { useSelector, useDispatch } from "react-redux";
import { Container, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { removeFromCart, increaseQuantity, decreaseQuantity } from "../redux/cartSlice";
import { toToman, formatToman } from "../utils/currency";

function Cart() {
  const cart = useSelector(s => s.cart.items || []);
  const dispatch = useDispatch();
  const authUser = (() => { try { return JSON.parse(localStorage.getItem("authUser") || "null"); } catch { return null; } })();

  const totalUSD = cart.reduce((s, it) => s + it.price * (it.quantity || 1), 0);
  const totalToman = toToman(totalUSD);

  if (cart.length === 0) return (<Container className="mt-4 text-center"><h5>سبد خرید شما خالی است 🛒</h5></Container>);

  return (
    <Container className="mt-4">
      <h3>سبد خرید</h3>
      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>عکس</th>
            <th>نام محصول</th>
            <th>قیمت (تومان)</th>
            <th>تعداد</th>
            <th>مجموع</th>
            <th>حذف</th>
          </tr>
        </thead>
        <tbody>
          {cart.map(it => {
            const itemTotal = toToman(it.price * (it.quantity || 1));
            return (
              <tr key={it.id}>
                <td><img src={it.image} alt={it.title} style={{ width:60, height:60, objectFit:"contain" }}/></td>
                <td>{it.title}</td>
                <td>{formatToman(toToman(it.price))}</td>
                <td className="text-center">
                  <Button size="sm" variant="outline-secondary" onClick={() => dispatch(decreaseQuantity(it.id))}>-</Button>
                  <span className="mx-2">{it.quantity}</span>
                  <Button size="sm" variant="outline-secondary" onClick={() => dispatch(increaseQuantity(it.id))}>+</Button>
                </td>
                <td>{formatToman(itemTotal)}</td>
                <td><Button size="sm" variant="danger" onClick={() => dispatch(removeFromCart(it.id))}>حذف</Button></td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center">
        <h5>مجموع کل: {formatToman(totalToman)}</h5>
        {authUser ? (
          <Link to="/checkout"><Button variant="success">تکمیل خرید</Button></Link>
        ) : (
          <Link to="/login"><Button variant="primary">ورود برای تکمیل خرید</Button></Link>
        )}
      </div>
    </Container>
  );
}

export default Cart;
