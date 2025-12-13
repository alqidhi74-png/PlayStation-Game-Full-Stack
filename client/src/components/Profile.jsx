import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import "../styles/Profile.css";

const Profile = () => {
    const theme = useSelector((state) => state.theme.mode);
    const isDark = theme === "dark";
    const user = useSelector((state) => state.user.user);

    return (
        <div className={isDark ? "profile-page-dark" : "profile-page-light"}>
            <Container>
                <Row className="justify-content-center">
                    <Col xs="12" md="8" lg="6">
                        <div className="profile-card">
                            <div className="profile-header">
                                <div className="profile-avatar">
                                    👤
                                </div>
                                <h1 className="profile-title">
                                    Profile
                                </h1>
                                <p className="profile-subtitle">
                                    View and manage your profile
                                </p>
                            </div>

                            <div className="profile-info-section">
                                <div className="profile-info-item">
                                    <p className="profile-info-label">
                                        Username
                                    </p>
                                    <p className="profile-info-value">
                                        {user?.username || "N/A"}
                                    </p>
                                </div>

                                <div className="profile-info-item">
                                    <p className="profile-info-label">
                                        Email
                                    </p>
                                    <p className="profile-info-value">
                                        {user?.email || "N/A"}
                                    </p>
                                </div>

                                {user?.gender && (
                                    <div className="profile-info-item">
                                        <p className="profile-info-label">
                                            Gender
                                        </p>
                                        <p className="profile-info-value">
                                            {user.gender}
                                        </p>
                                    </div>
                                )}

                                {user?.age && (
                                    <div className="profile-info-item">
                                        <p className="profile-info-label">
                                            Age
                                        </p>
                                        <p className="profile-info-value">
                                            {user.age} years old
                                        </p>
                                    </div>
                                )}
                            </div>

                            <Link
                                to="/edit-profile"
                                className="profile-edit-btn"
                            >
                                ✏️ Edit Profile
                            </Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Profile;
