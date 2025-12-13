import React from "react";
import {
  Container,
  FormGroup,
  Label,
  Button,
  Row,
  Col,
  Alert,
} from "reactstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserRegister } from "../validations/UserRegister";
import { useState } from "react";
import { addUser } from "../features/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setusername] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [age, setAge] = useState(null);

  const dispatch = useDispatch();
  const message = useSelector((state) => state.user.message);
  const isError = useSelector((state) => state.user.isError);
  const isSuccess = useSelector((state) => state.user.isSuccess);
  const isLoading = useSelector((state) => state.user.isLoading);
  const theme = useSelector((state) => state.theme.mode);
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const {
    register,
    handleSubmit: submitForm,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(UserRegister),
  });

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    setDateOfBirth(dateValue);
    if (dateValue) {
      const calculatedAge = calculateAge(dateValue);
      setAge(calculatedAge);
    } else {
      setAge(null);
    }
  };

  const validate = async () => {
    let finalAge = age;
    if (!finalAge && dateOfBirth) {
      finalAge = calculateAge(dateOfBirth);
    }

    const data = {
      username,
      email,
      password,
      gender,
      dateOfBirth,
      age: finalAge,
    };

    const result = await dispatch(addUser(data));
    if (result.payload?.message === "Success") {
      navigate("/login");
    }
  };

  return (
    <div className={isDark ? "register-page-dark" : "register-page-light"}>
      <Container>
        <Row className="justify-content-center">
          <Col xs="12" sm="10" md="8" lg="7" xl="6">
            <div className="register-card">
              <div className="register-header">
                <h2 className="register-title">
                  Join Us! 🎮
                </h2>
                <p className="register-subtitle">
                  Create your account and start gaming
                </p>
              </div>

              <form onSubmit={submitForm(validate)}>
                <FormGroup className="register-form-group">
                  <input
                    type="text"
                    placeholder="Username"
                    className="form-control register-input"
                    {...register("username", {
                      onChange: (e) => setusername(e.target.value),
                    })}
                  />
                  {errors.username && (
                    <p className="register-error">
                      ⚠️ {errors.username.message}
                    </p>
                  )}
                </FormGroup>

                <FormGroup className="register-form-group">
                  <input
                    type="email"
                    placeholder="Email"
                    className="form-control register-input"
                    {...register("email", {
                      onChange: (e) => setEmail(e.target.value),
                    })}
                  />
                  {errors.email && (
                    <p className="register-error">
                      ⚠️ {errors.email.message}
                    </p>
                  )}
                </FormGroup>

                <FormGroup className="register-form-group">
                  <input
                    type="password"
                    placeholder="Password"
                    className="form-control register-input"
                    {...register("password", {
                      onChange: (e) => setPassword(e.target.value),
                    })}
                  />
                  {errors.password && (
                    <p className="register-error">
                      ⚠️ {errors.password.message}
                    </p>
                  )}
                </FormGroup>

                <FormGroup className="register-form-group">
                  <input
                    type="date"
                    className="form-control register-input"
                    placeholder="Date of Birth"
                    {...register("dateOfBirth", {
                      onChange: handleDateChange,
                    })}
                  />
                  {age !== null && (
                    <p className="register-age-info">
                      ✅ Age: {age} years old
                    </p>
                  )}
                  {errors.dateOfBirth && (
                    <p className="register-error">
                      ⚠️ {errors.dateOfBirth.message}
                    </p>
                  )}
                </FormGroup>

                <FormGroup tag="fieldset" className="register-gender-group">
                  <div className="register-gender-options">
                    <FormGroup check inline style={{ margin: 0 }}>
                      <input
                        type="radio"
                        value="Male"
                        name="gender"
                        className="register-radio"
                        {...register("gender", {
                          onChange: (e) => setGender(e.target.value),
                        })}
                      />
                      <Label check className="register-radio-label">
                        👨 Male
                      </Label>
                    </FormGroup>
                    <FormGroup check inline style={{ margin: 0 }}>
                      <input
                        type="radio"
                        value="Female"
                        name="gender"
                        className="register-radio"
                        {...register("gender", {
                          onChange: (e) => setGender(e.target.value),
                        })}
                      />
                      <Label check className="register-radio-label">
                        👩 Female
                      </Label>
                    </FormGroup>
                  </div>
                  {errors.gender && (
                    <p className="register-error">
                      ⚠️ {errors.gender.message}
                    </p>
                  )}
                </FormGroup>

                <FormGroup check className="register-form-group">
                  <input
                    type="checkbox"
                    className="register-checkbox"
                    {...register("checkbox")}
                  />
                  <Label check className="register-checkbox-label">
                    I accept Terms and Conditions
                  </Label>
                  {errors.checkbox && (
                    <p className="register-error">
                      ⚠️ {errors.checkbox.message}
                    </p>
                  )}
                </FormGroup>

                <Button
                  type="submit"
                  className="form-control register-btn"
                  disabled={isLoading}
                >
                  {isLoading ? "⏳ Creating Account..." : "🚀 Create Account"}
                </Button>

                <FormGroup className="register-footer">
                  <Label className="register-footer-label">
                    Already have an account?{" "}
                    <Link to="/login" className="register-footer-link">
                      Login Now
                    </Link>
                  </Label>
                </FormGroup>

                {message && (
                  <Alert
                    color={isError ? "danger" : isSuccess ? "success" : "secondary"}
                    className="register-alert"
                  >
                    {message}
                  </Alert>
                )}
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
