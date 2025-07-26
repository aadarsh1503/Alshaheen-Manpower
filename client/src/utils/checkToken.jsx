// src/utils/checkToken.js
import jwt_decode from "jwt-decode";

export function checkToken() {
  const token = localStorage.getItem('token'); // or sessionStorage
  if (token) {
    try {
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.removeItem('token');
        alert("Session expired. Please login again.");
        window.location.href = "/login"; // or navigate using react-router
      } else {
        console.log("Token is still valid.");
      }
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem('token');
      window.location.href = "/login";
    }
  }
}
