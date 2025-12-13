import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../features/UserSlice";
import {
  Container,
  Row,
  Col,
  Input,
  Button,
  Alert,
  Spinner,
  Form,
} from "reactstrap";
import "../styles/EditProfile.css";

const EditProfile = () => {
  const dispatch = useDispatch();
  const { user, isLoading, isError, message } = useSelector(
    (state) => state.user
  );
  const theme = useSelector((state) => state.theme.mode);
  const isDark = theme === "dark";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setGender(user.gender || "");
      setProfilePicture(user.profilePicture || "");
      setDateOfBirth(user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "");
    }
  }, [user]);

  if (!user) return <p className="text-center mt-5">Loading profile...</p>;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateUser({ email, username, dateOfBirth, gender, profilePicture })
    ).then((result) => {
      if (result.payload?.user) {
        // Update localStorage with the updated user data
        localStorage.setItem("user", JSON.stringify(result.payload.user));
      }
    });
  };

  return (
    <div className={isDark ? "edit-profile-page-dark" : "edit-profile-page-light"}>
      <Container>
        <Row className="justify-content-center">
          <Col xs="12" sm="10" md="8" lg="7" xl="6">
            <div className="edit-profile-card">
              <h2 className="mb-4 text-center edit-profile-title">Edit Profile</h2>

              {isError && <Alert color="danger" className="edit-profile-alert">{message}</Alert>}
              {!isError && message && <Alert color="success" className="edit-profile-alert">{message}</Alert>}

              <Form onSubmit={handleSubmit}>
                <div className="edit-profile-form-group">
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="edit-profile-input"
                    placeholder="Username"
                  />
                </div>

                <div className="edit-profile-form-group">
                  <Input type="email" value={email} disabled className="edit-profile-input" placeholder="Email" />
                </div>

                <div className="edit-profile-form-group">
                  <Input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                    className="edit-profile-input"
                  />
                </div>

                <div className="edit-profile-form-group">
                  <Input
                    type="select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    className="edit-profile-input"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Input>
                </div>

                <div className="edit-profile-form-group">
                  <Input
                    type="text"
                    value={profilePicture}
                    onChange={(e) => setProfilePicture(e.target.value)}
                    className="edit-profile-input"
                    placeholder="Profile Picture URL"
                  />
                </div>

                <Button
                  color="primary"
                  type="submit"
                  className="w-100 edit-profile-btn"
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner size="sm" /> : "Update Profile"}
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EditProfile;
