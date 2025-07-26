import React from 'react';
import { Link } from 'react-router-dom';
import './n.css'; // Hum is file ko agle step mein banayenge

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="glitch" data-text="404">404</h1>
        <h2 className="futuristic-subheading">SIGNAL LOST // ROUTE NOT FOUND</h2>
        <p className="futuristic-text">
        You’ve drifted into the digital void. There’s nothing here.
        Perhaps you’ve ended up at the wrong coordinates.
        </p>
        <Link to="/" className="futuristic-button">
          RETURN TO HOME BASE
        </Link>
      </div>
    </div>
  );
};

export default NotFound;