import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css'; // Custom CSS for styling

const Footer = () => {
  return (
    <footer className="custom-footer text-center py-4 mt-5">
      <div className="container">
        <p className="mb-2 text-dark">
          © {new Date().getFullYear()} <strong>EventAllInOne</strong> | All Rights Reserved
        </p>
        <div className="social-icons mt-2">
          <a href="https://www.instagram.com/eventallinone_app/?igsh=bmd4YjcyNGlidG8w#" target="_blank" rel="noreferrer" className="me-3">Instagram</a>
          <a href="https://www.facebook.com/people/Eventallinoneapp/61583371712946/?rdid=uE1dLaWcqnDc16Y8&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F19xgBwg2s3%2F" target="_blank" rel="noreferrer" className="me-3">Facebook</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
