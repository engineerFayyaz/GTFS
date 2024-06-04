// Marker.js
import React from 'react';

const Marker = ({ lat, lng }) => (
  <div style={{
    color: 'red',
    backgroundColor: 'white',
    height: '25px',
    width: '25px',
    borderRadius: '50%',
    textAlign: 'center',
    lineHeight: '25px',
  }}>
    ●
  </div>
);

export default Marker;
