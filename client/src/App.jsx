import React from "react";
import "./styles/darkMode.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import Adminpage from "./components/Adminpage.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./components/Home.jsx";
import Downloads from "./components/Downloads.jsx";
import Profile from "./components/Profile.jsx";
import AddPlaystation from "./components/AddPlaystation.jsx";
import { Container, Row } from "reactstrap";
import Locations from "./components/Locations.jsx";
import EditProfile from "./components/EditProfile.jsx";

function App() {
  const user = useSelector((state) => state.user.user);
  const theme = useSelector((state) => state.theme.mode);

  const shouldShowHeader = Boolean(user?.username);
  const shouldShowFooter = Boolean(user?.username && !user?.isAdmin);

  // Apply theme to body
  useEffect(() => {
    const body = document.body;
    body.classList.remove("light-mode", "dark-mode");
    body.classList.add(`${theme}-mode`);
  }, [theme]);

  return (
    <Container fluid>
      <BrowserRouter>
        <Row>{shouldShowHeader ? <Header /> : null}</Row>
        <Row>
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin" element={<Adminpage />} />
            <Route path="/header" element={<Header />} />
            <Route path="/footer" element={<Footer />} />
            <Route path="/home" element={<Home />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/addplaystation" element={<AddPlaystation />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </Routes>
        </Row>
        <Row>{shouldShowFooter ? <Footer /> : null}</Row>
      </BrowserRouter>
    </Container>
  );
}

export default App;
