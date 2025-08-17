// src/App.js
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, Badge, Form, FormControl, Button } from "react-bootstrap";
import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useState } from "react"; 

import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const cart = useSelector((state) => state.cart.items);
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  return (
    <>
      {/* ✅ Navbar */}
      <Navbar expand="lg" fixed="top" className="app-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            🛍️ <span className="brand-text ms-2">فروشگاه آنلاین</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">خانه</Nav.Link>
              <Nav.Link as={Link} to="/contact">تماس با ما</Nav.Link>
              <Nav.Link as={Link} to="/checkout">تکمیل خرید</Nav.Link>
            </Nav>

            {/* ✅ Search box */}
            <Form className="d-flex me-3" onSubmit={handleSearch}>
              {/* <FormControl
                type="search"
                placeholder="جستجو..."
                className="me-2 text-end"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              /> */}
              {/* <Button type="submit" variant="outline-light">
                <FaSearch />
              </Button> */}
            </Form>

            {/* ✅ User + Cart */}
            <Nav>
              <Nav.Link as={Link} to="/profile" className="user-toggle">
                <FaUser /> حساب کاربری
              </Nav.Link>
              <Nav.Link as={Link} to="/cart" className="cart-link">
                <FaShoppingCart size={18} />
                {totalQuantity > 0 && (
                  <Badge bg="danger" className="ms-1">
                    {totalQuantity}
                  </Badge>
                )}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ✅ Main pages */}
      <Container className="main-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Container>

      {/* ✅ Footer */}
<footer className="app-footer text-center">
  <Container>
    <p className="mb-2">© ۲۰۲۵ فروشگاه آنلاین - همه حقوق محفوظ است</p>

    <div className="d-flex justify-content-center gap-4 mb-2">
      {/* Instagram */}
      <a
        href="https://instagram.com/yourusername"
        target="_blank"
        rel="noreferrer"
        className="social-icon"
        title="اینستاگرام"
      >
        <i className="bi bi-instagram fs-3"></i>
      </a>

      {/* Telegram */}
      <a
        href="https://t.me/yourusername"
        target="_blank"
        rel="noreferrer"
        className="social-icon telegram"
        title="تلگرام"
      >
        <i className="bi bi-telegram fs-3"></i>
      </a>

      {/* GitHub */}
      <a
        href="https://github.com/yourusername"
        target="_blank"
        rel="noreferrer"
        className="social-icon github"
        title="گیت‌هاب"
      >
        <i className="bi bi-github fs-3"></i>
      </a>
    </div>

    <small>پروژه تحویلی: فروشگاه آنلاین محمد جواد رییسی </small>
  </Container>
</footer>

    </>
  );
}

export default AppWrapper;
