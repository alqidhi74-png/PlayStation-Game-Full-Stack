import React, { useState, useEffect } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Input,
} from "reactstrap";
import logo from "../assets/ps.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/UserSlice";
import { toggleTheme } from "../features/ThemeSlice";
import "../styles/Header.css";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const toggle = () => setIsOpen(!isOpen);

  const user = useSelector((state) => state.user.user);
  const theme = useSelector((state) => state.theme.mode);
  const username = user?.username;
  const isAdmin = user?.isAdmin === true;
  const location = useLocation();
  const isHomePage = location.pathname === "/home";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    dispatch(logoutUser());
    navigate("/login");
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    // Dispatch search action if needed
    if (window.handleSearchChange) {
      window.handleSearchChange(e.target.value);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`header-wrapper fixed-top ${
        scrolled || isOpen ? "header-scrolled" : "header-default"
      }`}
    >
      <Navbar expand="lg" className="header-navbar">
        <div className="header-container">
          <NavbarBrand className="header-brand">
            <img src={logo} alt="logo" className="header-logo" />
            <span className="header-brand-text">PlayStation Games</span>
          </NavbarBrand>

          <NavbarToggler onClick={toggle} className="header-toggler" />

          <Collapse isOpen={isOpen} navbar>
            <Nav className="header-nav" navbar>
              {!isAdmin && (
                <>
                  <NavItem>
                    <NavLink tag={Link} to="/home" className="header-nav-link">
                      Home
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={Link} to="/downloads" className="header-nav-link">
                      Downloads
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={Link} to="/locations" className="header-nav-link">
                      Location
                    </NavLink>
                  </NavItem>

                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret className="header-nav-link">
                      More
                    </DropdownToggle>
                    <DropdownMenu className="header-dropdown">
                      <DropdownItem tag={Link} to="/edit-profile" className="header-dropdown-item">
                        Profile
                      </DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem onClick={logout} className="header-dropdown-item header-dropdown-item-danger">
                        Log out
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </>
              )}

              {isAdmin && (
                <>
                  <NavItem>
                    <NavLink tag={Link} to="/admin" className="header-nav-link">
                      Homepage
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={Link} to="/addplaystation" className="header-nav-link">
                      Add
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink onClick={logout} className="header-nav-link header-nav-link-danger">
                      Log out
                    </NavLink>
                  </NavItem>
                </>
              )}
            </Nav>

            {/* Search Bar - Only on Home Page */}
            {isHomePage && !isAdmin && (
              <div className="header-search-wrapper">
                <Input
                  type="text"
                  placeholder="🔍 Search games..."
                  value={searchValue}
                  onChange={handleSearchChange}
                  className="header-search-input"
                />
              </div>
            )}

            <div className="header-actions">
              <button
                className="header-theme-toggle"
                onClick={handleThemeToggle}
                aria-label="Toggle theme"
              >
                {theme === "light" ? "🌙" : "☀️"}
              </button>

              <NavbarText className="header-welcome">
                Welcome {username}
              </NavbarText>
            </div>
          </Collapse>
        </div>
      </Navbar>
    </div>
  );
}

export default Header;
