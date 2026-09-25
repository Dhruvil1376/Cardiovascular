import React from 'react';
import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <Heart size={18} fill="#e11d48" color="#e11d48" />
          <span>Cardiovascular Disease Prediction System</span>
        </div>
        <div>
          College ML Project &bull; Built with React &amp; Axios
        </div>
      </div>
    </footer>
  );
};

export default Footer;
