import React from "react";
import {
  Container,
  Row,
  Col,
  FormGroup,
  Label,
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../features/UserSlice";
import { useNavigate } from "react-router-dom";
import { UserLogin } from "../validations/UserLogin";
import "../styles/Login.css";

const Login = () => {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const isSuccess = useSelector((state) => state.user.isSuccess);
  const isError = useSelector((state) => state.user.isError);
  const isLoading = useSelector((state) => state.user.isLoading);
  const theme = useSelector((state) => state.theme.mode);
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const {
    register,
    handleSubmit: submitForm,
    formState: { errors },
  } = useForm({ resolver: yupResolver(UserLogin) });

  const validate = () => {
    const data = {
      email: email,
      password: password,
    };
    dispatch(getUser(data));
  };

  useEffect(() => {
    if (isSuccess && user?.username) {
      if (user?.isAdmin) navigate("/admin");
      else navigate("/home");
    }
    if (isError && isLoading === false) navigate("/");
  }, [user?.username, user?.isAdmin, isSuccess, isError, isLoading, navigate]);

  return (
    <div className={isDark ? "login-page-dark" : "login-page-light"}>
      <Container>
        <Row className="justify-content-center">
          <Col xs="12" sm="10" md="8" lg="6" xl="5">
            <div className="login-card">
              <div className="login-header">
                <h2 className="login-title">
                  Welcome Back! 🎮
                </h2>
                <p className="login-subtitle">
                  Sign in to continue to PlayStation Games
                </p>
              </div>

              <form onSubmit={submitForm(validate)}>
                <FormGroup className="login-form-group">
                  <input
                    type="email"
                    className="form-control login-input"
                    placeholder="Email Address"
                    {...register("email", {
                      onChange: (e) => setEmail(e.target.value),
                    })}
                  />
                  {errors.email && (
                    <p className="login-error">
                      <span>⚠️</span> {errors.email.message}
                    </p>
                  )}
                </FormGroup>

                <FormGroup className="login-form-group">
                  <input
                    type="password"
                    className="form-control login-input"
                    placeholder="Password"
                    {...register("password", {
                      onChange: (e) => setPassword(e.target.value),
                    })}
                  />
                  {errors.password && (
                    <p className="login-error">
                      <span>⚠️</span> {errors.password.message}
                    </p>
                  )}
                </FormGroup>

                <Button
                  type="submit"
                  className="form-control login-btn"
                  disabled={isLoading}
                >
                  {isLoading ? "⏳ Signing in..." : "🚀 Sign In"}
                </Button>

                <FormGroup className="login-link-container">
                  <Link to="/forgot-password" className="login-link">
                    🔑 Forgot Password?
                  </Link>
                </FormGroup>
                <FormGroup className="login-footer">
                  <Label className="login-footer-label">
                    Don't have an account?{" "}
                    <Link to="/" className="login-footer-link">
                      Sign Up Now
                    </Link>
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

export default Login;
