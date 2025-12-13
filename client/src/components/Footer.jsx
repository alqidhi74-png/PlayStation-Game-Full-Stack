import React from 'react';
import { useSelector } from 'react-redux';
import "../styles/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const theme = useSelector((state) => state.theme.mode);

  return (
    <footer className="footer">
      <div className="text-center footer-content">
        <p className="footer-text">
          <span>© {currentYear}</span>
          <span className="footer-brand">
            PlayStationGames
          </span>
          <span>All rights reserved.</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
