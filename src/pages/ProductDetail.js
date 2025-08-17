// src/pages/ProductDetail.js
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button, Spinner, Toast, ToastContainer, Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { toToman, formatToman } from "../utils/currency";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector(s => s.cart.items || []);
  const inCartCount = cart.find(it => Number(it.id) === Number(id))?.quantity || 0;

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios.get(`https://fakestoreapi.com/products/${id}`)
      .then(res => mounted && setProduct(res.data))
      .catch(() => mounted && setProduct(null))
      .finally(() => mounted && setLoading(false));
    return () => mounted = false;
  }, [id]);

  const handleAdd = () => {
    dispatch(addToCart(product));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1400);
  };

  if (loading) return (<Container className="mt-5 text-center"><Spinner animation="border"/><p className="mt-2">در حال بارگذاری...</p></Container>);
  if (!product) return (<Container className="mt-5 text-center"><p>محصولی یافت نشد.</p></Container>);

  return (
    <Container className="mt-4">
      <Row>
        <Col md={5}>
          <Card className="shadow-sm">
            <div style={{ height:420, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
              <img src={product.image} alt={product.title} loading="lazy" style={{ maxHeight:"100%", maxWidth:"100%", objectFit:"contain" }} />
            </div>
          </Card>
        </Col>

        <Col md={7}>
          <h3>{product.title} <Badge bg="light" text="dark" className="ms-2" style={{ fontSize:12 }}>{product.category}</Badge></h3>
          <h4 className="text-success my-3">{formatToman(toToman(product.price))}</h4>
          <p className="text-muted" style={{ lineHeight:1.6 }}>{product.description}</p>

          <div className="d-flex gap-2 mt-4">
            <Button variant="success" onClick={handleAdd}>
              افزودن به سبد {inCartCount>0 && <span className="badge bg-white text-dark ms-2">{inCartCount}</span>}
            </Button>

            <Button variant="outline-primary" onClick={() => navigate(-1)}>← بازگشت</Button>

            <Link to="/cart" className="btn btn-outline-secondary">رفتن به سبد خرید</Link>
          </div>
        </Col>
      </Row>

      <ToastContainer position="top-end" style={{ position: "fixed", top: 90, right: 20, zIndex: 1060 }}>
        <Toast bg="success" onClose={() => setShowToast(false)} show={showToast} autohide delay={1400}>
          <Toast.Body className="text-white">✅ محصول به سبد خرید اضافه شد</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}

export default ProductDetail;
