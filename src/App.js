import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, Badge, Form } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const cart = useSelector((state) => state.cart.items || []);
  const totalQuantity = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);

  const navigate = useNavigate();


  const [authUser, setAuthUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("authUser") || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const onAuthChanged = () => {
      try {
        setAuthUser(JSON.parse(localStorage.getItem("authUser") || "null"));
      } catch {
        setAuthUser(null);
      }
    };

    window.addEventListener("authChanged", onAuthChanged);
    const onStorage = (e) => {
      if (e.key === "authUser") onAuthChanged();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("authChanged", onAuthChanged);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("authUser");

      window.dispatchEvent(new Event("authChanged"));
    } catch (e) {
      console.error("Logout error:", e);
    }
    navigate("/login");
  };


  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    } else {
      navigate("/");
    }
  };

  return (
    <>
   
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

            <Form className="d-flex me-3" onSubmit={handleSearch} style={{ alignItems: "center" }}>
    
            </Form>

        
            <Nav>
              {authUser ? (
                <>
                  <Nav.Link className="d-flex align-items-center" as={Link} to="/profile">
                    <FaUser /> <span style={{ marginInlineStart: 8 }}>{authUser.name || authUser.email}</span>
                  </Nav.Link>
                  <Nav.Link onClick={handleLogout} style={{ cursor: "pointer", color: "#dc3545", marginInlineStart: 8 }}>
                    خروج
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" className="d-flex align-items-center">
                    <FaUser /> ورود
                  </Nav.Link>
                  <Nav.Link as={Link} to="/register">ثبت‌نام</Nav.Link>
                </>
              )}

              <Nav.Link as={Link} to="/cart" className="cart-link d-flex align-items-center" style={{ marginInlineStart: 12 }}>
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


      <Container className="main-container" style={{ marginTop: 16 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Container>

      <footer className="app-footer text-center">
        <Container>
          <p className="mb-2">© ۲۰۲۵ فروشگاه آنلاین - همه حقوق محفوظ است</p>

          <div className="d-flex justify-content-center gap-4 mb-2">
            <a href="https://instagram.com/yourusername" target="_blank" rel="noreferrer" className="social-icon" title="اینستاگرام">
              <i className="bi bi-instagram fs-3"></i>
            </a>

            <a href="https://t.me/yourusername" target="_blank" rel="noreferrer" className="social-icon telegram" title="تلگرام">
              <i className="bi bi-telegram fs-3"></i>
            </a>

            <a href="https://github.com/yourusername" target="_blank" rel="noreferrer" className="social-icon github" title="گیت‌هاب">
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
