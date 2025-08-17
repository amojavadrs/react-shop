// src/components/Footer.js
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaInstagram, FaTelegramPlane, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer className="app-footer">
      <Container>
        <Row className="align-items-center">
          <Col md={4}>
            <h5 className="mb-1">فروشگاه آنلاین</h5>
            <p className="text-muted small">نمونه پروژه — آمادهٔ تحویل</p>
          </Col>
          <Col md={4} className="text-center">
            <div className="d-flex gap-3 justify-content-center">
              <a href="#" aria-label="instagram" style={{ color: "#E1306C" }}><FaInstagram /></a>
              <a href="#" aria-label="telegram" style={{ color: "#229ED9" }}><FaTelegramPlane /></a>
              <a href="mailto:info@example.com" aria-label="email" style={{ color: "#6c757d" }}><FaEnvelope /></a>
            </div>
            <div className="text-muted small mt-2">پشتیبانی: info@example.com</div>
          </Col>
          <Col md={4} className="text-md-end mt-3 mt-md-0 text-muted small">
            © {new Date().getFullYear()} — فروشگاه آنلاین
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
