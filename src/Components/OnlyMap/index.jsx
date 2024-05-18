import React, { useState, useEffect } from "react";
// import "./map.css";
import { WhatsappShareButton, FacebookShareButton, InstapaperShareButton } from 'react-share';

const OnlyMap = () => {
  const [map, setMap] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [viewOption, setViewOption] = useState("Map");
  const [markedPoints, setMarkedPoints] = useState([]);

  useEffect(() => {
    // Load Google Maps API script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBDDCT1y6vpC4jJ3_LGzRnMF6OclbkDEfU&libraries=geometry,drawing`;
    script.onload = () => initMap();
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initMap = () => {
    const google = window.google;
    const mapOptions = {
      center: { lat: -25.344, lng: 131.036 }, // Center of Australia
      zoom: 4,
      mapTypeId: viewOption === "Satellite" ? "satellite" : "roadmap",
    };
    const newMap = new google.maps.Map(
      document.getElementById("map"),
      mapOptions
    );
    setMap(newMap);

    // Add drawing manager for routes
    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYLINE,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYLINE],
      },
      polylineOptions: {
        clickable: true,
        editable: true,
        strokeColor: "#FF0000",
      },
    });
    drawingManager.setMap(newMap);

    // Add event listeners for drawing manager
    google.maps.event.addListener(
      drawingManager,
      "overlaycomplete",
      (event) => {
        if (event.type === google.maps.drawing.OverlayType.POLYLINE) {
          const newRoute = event.overlay.getPath().getArray();
          setRoutes([...routes, newRoute]);
        //   const distance = calculateDistance(newRoute);
        //   setTotalDistance(totalDistance + distance);
        }
      }
    );

    // Add event listener for click on map to mark points
    google.maps.event.addListener(newMap, "click", (event) => {
      const clickedLatLng = event.latLng;
      setMarkedPoints([...markedPoints, clickedLatLng]);
    });
  };

  return (
    <div className="map-container container">
      <div id="map" className="rounded-3" style={{ height: "300px", width: "100%" }} />
    </div>
  );
};

export default OnlyMap;
