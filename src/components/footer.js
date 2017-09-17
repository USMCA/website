import React, { Component } from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="page-footer teal darken-4">
    <div className="footer-copyright teal darken-4 center">
      <div className="container">
        <ul className="grey-text text-lighten-3">
          <li>&copy; 2017 USMCA</li>
          <li><Link to="/about" className="grey-text text-lighten-3">About</Link></li>
        </ul>
      </div>
    </div>
  </footer>
);

export default Footer;
