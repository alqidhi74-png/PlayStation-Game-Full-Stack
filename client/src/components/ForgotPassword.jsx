import React from "react";
import {
  Container,
  FormGroup,
  Label,
  Button,
  Row,
  Col,
} from "reactstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { useSelector } from "react-redux";
import "../styles/ForgotPassword.css";

const ForgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Not a Valid Email Format!!")
    .required("Email is Required.."),
});

const ForgotPassword = () => {
  const theme = useSelector((state) => state.theme.mode);
  const isDark = theme === "dark";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
  });

  const handleForgotPassword = (data) => {
    console.log(data);
  };

  return (
    <div className={isDark ? "forgot-password-page-dark" : "forgot-password-page-light"}>
      <Container>
        <Row className="justify-content-center">
          <Col xs="12" sm="10" md="8" lg="6" xl="5">
            <div className="forgot-password-card">
              <h2 className="text-center mb-4 forgot-password-title">Forgot Password</h2>

              <form onSubmit={handleSubmit(handleForgotPassword)}>
                <FormGroup>
                  <input
                    type="email"
                    className="form-control forgot-password-input"
                    placeholder="Enter your email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="forgot-password-error">
                      {errors.email.message}
                    </p>
                  )}
                </FormGroup>

                <Button
                  type="submit"
                  className="form-control forgot-password-btn"
                >
                  Send Reset Link
                </Button>

                <FormGroup className="text-center mt-3">
                  <Label className="forgot-password-footer-label">
                    <Link to="/login" className="forgot-password-link">Back to Login</Link>
                  </Label>
                </FormGroup>
                <FormGroup className="text-center">
                  <Label className="forgot-password-footer-label">
                    Don't have an account? <Link to="/" className="forgot-password-link">Sign Up Now</Link>
                  </Label>
                </FormGroup>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPassword;
