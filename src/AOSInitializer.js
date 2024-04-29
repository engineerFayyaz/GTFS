// AOSInitializer.js
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AOSInitializer = ({ children }) => {
  useEffect(() => {
    AOS.init({
      // Global settings
      duration: 1200, // Animation duration in milliseconds
      once: false, // Whether to only animate elements once
      easing: 'ease-in-out', // Easing function
      // Add more global settings as needed
    });
  }, []);

  return <>{children}</>;
};

export default AOSInitializer;
