import { useForm } from "react-hook-form";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useState } from "react";

function Contact() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (data) => {
    console.log("فرم ارسال شد:", data);
    setSubmitted(true);
    reset();
  };

  return (
    <Container className="mt-4" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">تماس با ما</h2>

      {submitted && (
        <Alert variant="success">
          پیام شما با موفقیت ارسال شد ✅
        </Alert>
      )}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label>نام</Form.Label>
          <Form.Control
            type="text"
            placeholder="نام خود را وارد کنید"
            {...register("name", { required: "نام الزامی است" })}
          />
          {errors.name && <span className="text-danger">{errors.name.message}</span>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>ایمیل</Form.Label>
          <Form.Control
            type="email"
            placeholder="ایمیل خود را وارد کنید"
            {...register("email", {
              required: "ایمیل الزامی است",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "ایمیل معتبر وارد کنید",
              },
            })}
          />
          {errors.email && <span className="text-danger">{errors.email.message}</span>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>پیام</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="پیام خود را بنویسید"
            {...register("message", { required: "پیام الزامی است" })}
          />
          {errors.message && <span className="text-danger">{errors.message.message}</span>}
        </Form.Group>

        <Button type="submit" variant="primary">
          ارسال
        </Button>
      </Form>
    </Container>
  );
}

export default Contact;
