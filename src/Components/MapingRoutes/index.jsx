import React, { useState, useEffect, useCallback } from 'react';
import GoogleMapReact from 'google-map-react';
import { getFirestore, collection, getDocs, addDoc} from 'firebase/firestore';
import FileSaver from 'file-saver';
import { Container, Form, Button, Row, Col, Card, InputGroup, FormControl } from 'react-bootstrap';
import Marker from '../Marker';
import './MapingRoutes.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarker } from '@fortawesome/free-solid-svg-icons';


function MapingRoutes() {
  const [path, setPath] = useState([]);
  const [distance, setDistance] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mapType, setMapType] = useState('roadmap');
  const [travelMode, setTravelMode] = useState('WALKING');
  const [searchTerm, setSearchTerm] = useState('');
  const [routes, setRoutes] = useState([]);
  const [map, setMap] = useState(null);
  const [mapsApi, setMapsApi] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoop, setIsLoop] = useState(false);

  const db = getFirestore();

  const handleMapClick = useCallback((event) => {
    const newPoint = { lat: event.lat, lng: event.lng };
    setPath((currentPath) => {
      const newPath = [...currentPath, newPoint];
      calculateDistance(newPath);
      return newPath;
    });
  }, []);

  const calculateDistance = (path) => {
    let totalDistance = 0;
    if (path.length > 1) {
      for (let i = 1; i < path.length; i++) {
        totalDistance += haversineDistance(path[i - 1], path[i]);
      }
    }
    setDistance(totalDistance);
  };

  const haversineDistance = (point1, point2) => {
    const R = 6371e3; // metres
    const φ1 = point1.lat * Math.PI / 180;
    const φ2 = point2.lat * Math.PI / 180;
    const Δφ = (point2.lat - point1.lat) * Math.PI / 180;
    const Δλ = (point2.lng - point1.lng) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance / 1000; // in kilometers
  };

  const fetchRoutesFromFirestore = async () => {
    try {
      const querySnapshotShapes = await getDocs(collection(db, 'shapes'));
      const querySnapshotShapes2 = await getDocs(collection(db, 'shapes2'));
      
      const routesData = [];
      querySnapshotShapes.forEach(doc => {
        routesData.push(doc.data());
      });
      querySnapshotShapes2.forEach(doc => {
        routesData.push(doc.data());
      });
      setRoutes(routesData);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };
  
  useEffect(() => {
    fetchRoutesFromFirestore();
  }, [db]);

  
  const renderRoutesOnMap = (map, maps) => {
    if (map && maps && routes.length > 0) {
      const bounds = new maps.LatLngBounds(); // Create bounds object to include all markers
  
      routes.forEach((route, index) => {
        route.forEach((point, idx) => {
          const markerIcon = {
            path: FontAwesomeIcon ? FontAwesomeIcon(faMapMarker).html.join('') : '', // Get FontAwesome icon SVG path
            fillColor: '#FF0000', // Fill color of the icon
            fillOpacity: 1, // Opacity of the icon
            anchor: new maps.Point(12, 24), // Icon anchor point
            scale: 0.5, // Icon scale
            strokeWeight: 0, // Stroke weight of the icon
            labelOrigin: new maps.Point(12, 12) // Label origin point
          };
  
          const marker = new maps.Marker({
            position: { lat: parseFloat(point.shape_pt_lat), lng: parseFloat(point.shape_pt_lon) },
            map: map,
            icon: markerIcon // Set the icon for the marker
          });
  
          // Extend bounds to include marker's position
          bounds.extend(marker.getPosition());
  
          // Optionally, add event listeners to markers
          marker.addListener('click', () => {
            // Handle marker click event
          });
        });
      });
  
      // Zoom the map to fit all markers within the bounds
      if (routes.length > 0) {
        map.fitBounds(bounds);
      }
    }
  };
  


  const renderRoutesFromFirestore = () => {
    return routes.map((route, index) => (
      <Card key={index}>
        <Card.Body>
          <Card.Title>{route.shape_id}</Card.Title>
          <Button onClick={() => handleDisplayRoute(route)}>Display Route</Button>
        </Card.Body>
      </Card>
    ));
  };

  const handleDisplayRoute = (route) => {
    const routePath = route.map(point => ({ lat: parseFloat(point.shape_pt_lat), lng: parseFloat(point.shape_pt_lon) }));
    setPath(routePath);
    calculateDistance(routePath);
  };

  const saveRoute = async () => {
    await addDoc(collection(db, 'routes'), { path, title, description });
    // Prepare data for routes.txt file
    const routeData = path.map((point, index) => ({
      shape_id: title,
      shape_pt_lat: point.lat,
      shape_pt_lon: point.lng,
      shape_pt_sequence: index + 1,
    }));
    const shapeText = routeData.map(point => `${point.shape_id},${point.shape_pt_lat},${point.shape_pt_lon},${point.shape_pt_sequence}`).join('\n');
    const blob = new Blob([shapeText], { type: 'text/plain' });
    FileSaver.saveAs(blob, 'routes.txt');
  };
  

  const exportToGPX = () => {
    const gpxData = `
      <gpx version="1.1" creator="Your App">
        <trk><name>${title}</name><desc>${description}</desc><trkseg>
          ${path.map(point => `<trkpt lat="${point.lat}" lon="${point.lng}"></trkpt>`).join('')}
        </trkseg></trk>
      </gpx>
    `;
    const blob = new Blob([gpxData], { type: 'application/gpx+xml' });
    FileSaver.saveAs(blob, 'route.gpx');
  };

  const exportToKML = () => {
    const kmlData = `
      <kml xmlns="http://www.opengis.net/kml/2.2">
        <Document><name>${title}</name><description>${description}</description>
          <Placemark><LineString><coordinates>
            ${path.map(point => `${point.lng},${point.lat},0`).join(' ')}
          </coordinates></LineString></Placemark>
        </Document>
      </kml>
    `;
    const blob = new Blob([kmlData], { type: 'application/vnd.google-earth.kml+xml' });
    FileSaver.saveAs(blob, 'route.kml');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (mapsApi && e.target.value) {
      const service = new mapsApi.places.AutocompleteService();
      service.getPlacePredictions({ input: e.target.value }, (predictions) => {
        setSuggestions(predictions || []);
      });
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (mapsApi && map) {
      const service = new mapsApi.places.PlacesService(map);
      service.getDetails({ placeId: suggestion.place_id }, (result, status) => {
        if (status === mapsApi.places.PlacesServiceStatus.OK) {
          const location = result.geometry.location;
          map.setCenter(location);
          setPath([{ lat: location.lat(), lng: location.lng() }]);
          setSearchTerm(result.name);
          setSuggestions([]);
        }
      });
    }
  };

  const calculateRoute = () => {
    if (!mapsApi || !map || path.length < 2) return; // Add null check for mapsApi and map
    
    const start = path[0];
    const end = path[path.length - 1];
    const waypoints = path.slice(1, -1).map(point => ({ location: point }));
  
    const directionsService = new mapsApi.DirectionsService(); // Add null check for mapsApi
    const directionsRenderer = new mapsApi.DirectionsRenderer();
    directionsRenderer.setMap(map);
  
    directionsService.route(
      {
        origin: start,
        destination: end,
        waypoints: waypoints,
        travelMode: travelMode,
      },
      (result, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
          const detailedPath = result.routes[0].overview_path.map(point => ({
            lat: point.lat(),
            lng: point.lng(),
          }));
          setPath(detailedPath);
          calculateDistance(detailedPath);
        } else {
          console.error('Directions request failed due to ' + status);
        }
      }
    );
  };
  

  const handleUndoLastLeg = () => {
    setPath((currentPath) => {
      const newPath = currentPath.slice(0, -1);
      calculateDistance(newPath);
      return newPath;
    });
  };

  const handleRemoveAll = () => {
    setPath([]);
    setDistance(0);
  };

  const handleMapTypeChange = (type) => {
    setMapType(type);
    if (map) {
      map.setMapTypeId(type);
    }
  };

  const handleRouteClick = (routePath) => {
    setPath(routePath);
    calculateDistance(routePath);
  };

  const renderPolylines = (map, maps) => {
    routes.forEach((route, index) => {
      const routeCoordinates = route.map(point => ({
        lat: parseFloat(point.shape_pt_lat),
        lng: parseFloat(point.shape_pt_lon)
      }));
  
      new maps.Polyline({
        path: routeCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        map: map,
      });
    });
  };
  

  return (
    <Container>
     
      <Row className="my-4">
        <Col>
          <Card className="custom-card">
            <Card.Body>
              <Form>
                <Form.Group controlId="routeTitle" className="custom-form-group">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="routeDescription" className="custom-form-group">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="mapType" className="custom-form-group">
                  <Form.Label>Map Type</Form.Label>
                  <Form.Control
                    as="select"
                    value={mapType}
                    onChange={(e) => handleMapTypeChange(e.target.value)}
                  >
                    <option value="roadmap">Map</option>
                    <option value="satellite">Satellite</option>
                    <option value="terrain">Terrain</option>
                    <option value="hybrid">Hybrid</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="travelMode" className="custom-form-group">
                  <Form.Label>Travel Mode</Form.Label>
                  <Form.Control
                    as="select"
                    value={travelMode}
                    onChange={(e) => setTravelMode(e.target.value)}
                  >
                    <option value="WALKING">Walking</option>
                    <option value="DRIVING">Driving</option>
                    <option value="BICYCLING">Bicycling</option>
                    <option value="TRANSIT">Transit</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="loopRoute" className="custom-form-group">
                  <Form.Check
                    type="checkbox"
                    label="Loop Route"
                    checked={isLoop}
                    onChange={(e) => setIsLoop(e.target.checked)}
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="my-4">
        <Col>
          <InputGroup className="mb-3 custom-input-group">
            <FormControl
              placeholder="Search routes"
              aria-label="Search routes"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Button variant="outline-secondary" className="custom-button">Search</Button>
          </InputGroup>
          {suggestions.length > 0 && (
            <div className="suggestions-container">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.place_id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="suggestion-item"
                >
                  {suggestion.description}
                </div>
              ))}
            </div>
          )}
        </Col>
      </Row>
      <Row>
        <Col style={{ height: '500px' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyCt6m1rrV32jEStp8x-cgBL0WwL9zXKOG4", libraries: ['places', 'directions'] }}
            defaultCenter={{ lat: 41.9028, lng: 12.4964 }}
            defaultZoom={10}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => {
              setMap(map);
              setMapsApi(maps);
              renderPolylines(map, maps);
              renderRoutesOnMap(map, maps); // Call the function to render routes with SVG markers
            }}
            
            onClick={handleMapClick}
            options={{
              draggableCursor: 'crosshair',
              draggingCursor: 'move'
            }}
          >
            {path.map((point, index) => (
              <Marker key={index} lat={point.lat} lng={point.lng} />
            ))}
          </GoogleMapReact>
        </Col>
      </Row>
      <Row className="my-4">
        <Col className="d-flex justify-content-between">
          <Button variant="primary" onClick={saveRoute}>Save Route</Button>
          <Button variant="secondary" onClick={exportToGPX}>Export to GPX</Button>
          <Button variant="secondary" onClick={exportToKML}>Export to KML</Button>
          <Button variant="warning" onClick={handleUndoLastLeg}>Undo Last Leg</Button>
          <Button variant="danger" onClick={handleRemoveAll}>Remove All</Button>
          <Button variant="success" onClick={calculateRoute}>Calculate Route</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Text>
                <strong>Total Distance:</strong> {distance.toFixed(2)} km
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* <Row>
        <Col>
          {renderRoutesFromFirestore()}
        </Col>
      </Row> */}
    </Container>
  );
}

export default MapingRoutes;
