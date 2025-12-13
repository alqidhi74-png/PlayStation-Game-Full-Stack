import React, { useState } from "react";
import { Container, Row, Col, Button, Spinner } from "reactstrap";
import { useSelector } from "react-redux";
import "../styles/Locations.css";

const Locations = () => {
  const [coords, setCoords] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState("");
  const theme = useSelector((state) => state.theme.mode);
  const isDark = theme === "dark";

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocError("GPS not supported by your browser.");
      return;
    }

    setLocLoading(true);
    setLocError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocLoading(false);
      },
      () => {
        setLocError("Unable to retrieve your location.");
        setLocLoading(false);
      }
    );
  };

  return (
    <div className={isDark ? "locations-page-dark" : "locations-page-light"}>
      <Container>
        <div className="locations-header">
          <h1 className="locations-title">
            📍 Location
          </h1>
          <p className="locations-subtitle">
            Find your current location on the map
          </p>
        </div>

        <Row className="justify-content-center">
          <Col xs="12" md="10" lg="8">
            <div className="locations-card">
              <div className="locations-btn-container">
                <Button
                  color="primary"
                  onClick={getLocation}
                  disabled={locLoading}
                  className="locations-btn"
                >
                  {locLoading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Loading location...
                    </>
                  ) : (
                    "📍 Get Current Location"
                  )}
                </Button>
              </div>

              {locError && (
                <div className="locations-error">
                  <p style={{ margin: 0, fontWeight: 500 }}>
                    ⚠️ {locError}
                  </p>
                </div>
              )}

              {coords && (
                <div>
                  <div className="locations-info">
                    <p className="locations-info-title">
                      📍 Your current location:
                    </p>
                    <p className="locations-info-text">
                      Latitude: <strong>{coords.lat.toFixed(5)}</strong>
                      <br />
                      Longitude: <strong>{coords.lng.toFixed(5)}</strong>
                    </p>
                  </div>

                  <div className="locations-map-container">
                    <iframe
                      title="User Location"
                      width="100%"
                      height="450"
                      style={{ border: 0, display: "block" }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`}
                    ></iframe>
                  </div>
                </div>
              )}

              {!coords && !locLoading && !locError && (
                <div className="locations-empty-state">
                  <p className="locations-empty-text">
                    Click the button above to get your current location
                  </p>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Locations;
