import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Spinner, Form, InputGroup, Toast, ToastContainer, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { toToman, formatToman } from "../utils/currency";

const PAGE_SIZE = 8;

function Home() {
  const [products, setProducts] = useState([]);
  const [visible, setVisible] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();
  const cart = useSelector(s => s.cart.items || []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios.get("https://fakestoreapi.com/products")
      .then(res => {
        if (!mounted) return;
        setProducts(res.data);
        setVisible(res.data);
        const cats = Array.from(new Set(res.data.map(p => p.category)));
        setCategories(cats);
      })
      .catch(err => console.error(err))
      .finally(() => mounted && setLoading(false));
    return () => mounted = false;
  }, []);

  useEffect(() => {
    const ql = q.trim().toLowerCase();
    const f = products.filter(p => {
      const matchQ = !ql || p.title.toLowerCase().includes(ql) || (p.description && p.description.toLowerCase().includes(ql));
      const matchCat = category === "all" || p.category === category;
      return matchQ && matchCat;
    });
    setVisible(f);
    setPage(1);
  }, [q, category, products]);

  const handleAdd = (p) => {
    dispatch(addToCart(p));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
  };

  if (loading) return (
    <Container className="mt-5 text-center"><Spinner animation="border" /><p className="mt-2">در حال بارگذاری...</p></Container>
  );

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const pageItems = visible.slice((page-1)*PAGE_SIZE, (page-1)*PAGE_SIZE + PAGE_SIZE);

  return (
    <Container className="mt-2">
      <Card className="mb-4 shadow-sm border-0">
        <Card.Body className="d-flex flex-column flex-md-row align-items-center gap-3">
          <div style={{ flex: 1 }}>
            <h2 className="mb-1">به فروشگاه ما خوش آمدید</h2>
            <p className="text-muted mb-0">محصولات باکیفیت و تجربه خرید ساده</p>
          </div>

          <div style={{ minWidth: 320 }}>
            <InputGroup>
              <Form.Control placeholder="جست‌وجو در محصولات..." value={q} onChange={e => setQ(e.target.value)} />
              <Form.Select value={category} onChange={e => setCategory(e.target.value)} style={{ maxWidth:160 }}>
                <option value="all">همه دسته‌ها</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </Form.Select>
            </InputGroup>
          </div>
        </Card.Body>
      </Card>

      <Row className="g-3">
        {pageItems.map(p => (
          <Col key={p.id} sm={6} md={4} lg={3}>
            <Card className="h-100 card-hover shadow-sm">
              <div className="card-media">
                <img src={p.image} alt={p.title} loading="lazy" style={{ maxHeight: "100%", maxWidth:"100%", objectFit:"contain" }} />
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="card-title">{p.title}</Card.Title>
                <div className="text-muted mb-2" style={{ fontSize:13 }}>{p.category}</div>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <div style={{ fontWeight:700 }}>{formatToman(toToman(p.price))}</div>
                  <div className="d-flex">
                    <Link to={`/product/${p.id}`} className="btn btn-sm btn-outline-primary me-2">جزئیات</Link>
                    <Button size="sm" variant="success" onClick={() => handleAdd(p)}>افزودن</Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.First onClick={() => setPage(1)} disabled={page===1}/>
          <Pagination.Prev onClick={() => setPage(s=>Math.max(1,s-1))} disabled={page===1}/>
          {Array.from({length: totalPages}).map((_,i) => {
            const p = i+1;
            if (totalPages > 7 && p !== 1 && p !== totalPages && Math.abs(p-page) > 2) {
              if (p === page-3 || p === page+3) return <Pagination.Ellipsis key={p} disabled />;
              return null;
            }
            return <Pagination.Item key={p} active={p===page} onClick={() => setPage(p)}>{p}</Pagination.Item>;
          })}
          <Pagination.Next onClick={() => setPage(s=>Math.min(totalPages,s+1))} disabled={page===totalPages}/>
          <Pagination.Last onClick={() => setPage(totalPages)} disabled={page===totalPages}/>
        </Pagination>
      </div>

      <ToastContainer position="top-end" style={{ position: "fixed", top: 90, right: 20, zIndex: 1060 }}>
        <Toast bg="success" onClose={() => setShowToast(false)} show={showToast} autohide delay={1400}>
          <Toast.Body className="text-white">✅ محصول به سبد خرید اضافه شد</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}

export default Home;
