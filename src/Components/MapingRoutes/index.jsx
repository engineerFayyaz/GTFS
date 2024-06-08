import React, { useState, useEffect, useCallback } from 'react';
import GoogleMapReact from 'google-map-react';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import FileSaver from 'file-saver';
import { Container, Form, Button, Row, Col, Card, InputGroup, FormControl } from 'react-bootstrap';
import Marker from '../Marker';
import './MapingRoutes.css';

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

  useEffect(() => {
    const fetchRoutes = async () => {
      const routesSnapshot = await getDocs(collection(db, 'routes'));
      const routesData = routesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRoutes(routesData);
    };
    fetchRoutes();
  }, [db]);

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

  const saveRoute = async () => {
    await addDoc(collection(db, 'routes'), { path, title, description });
    const blob = new Blob([JSON.stringify({ path, title, description })], { type: 'text/plain' });
    FileSaver.saveAs(blob, 'shapes.txt');
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
    if (path.length < 2) return;
  
    const start = path[0];
    const end = path[path.length - 1];
    const waypoints = path.slice(1, -1).map(point => ({ location: point }));
  
    const directionsService = new mapsApi.DirectionsService();
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
          calculateDistance(
            result.routes[0].overview_path.map(point => ({
              lat: point.lat(),
              lng: point.lng(),
            }))
          );
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

  return (
    <Container>
      <Row className="my-4">
        <h2 className='text-center'>Add Route Map</h2>
        <Col variant="12">
          <Card className="custom-card mapping-routes">
            <Card.Body>
              <Form>
                <Form.Group controlId="routeTitle" className="custom-form-group">
                  <Form.Label className='d-block'>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter title"
                    className='w-100'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="routeDescription" className="custom-form-group">
                  <Form.Label className='d-block'>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter description"
                    className='w-100'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>
                <Row>
                  <Col>
                  <Form.Group controlId="mapType" className="custom-form-group">
                  <Form.Label className='d-block'>Map Type</Form.Label>
                  <Form.Control
                    as="select"
                    value={mapType}
                    className='w-100'
                    onChange={(e) => handleMapTypeChange(e.target.value)}
                  >
                    <option value="roadmap">Map</option>
                    <option value="satellite">Satellite</option>
                    <option value="terrain">Terrain</option>
                    <option value="hybrid">Hybrid</option>
                  </Form.Control>
                </Form.Group>
                  </Col>
                  <Col>
                  <Form.Group controlId="travelMode" className="custom-form-group">
                  <Form.Label className='d-block'>Travel Mode</Form.Label>
                  <Form.Control
                    as="select"
                    value={travelMode}
                    className='w-100'
                    onChange={(e) => setTravelMode(e.target.value)}
                  >
                    <option value="WALKING">Walking</option>
                    <option value="DRIVING">Driving</option>
                    <option value="BICYCLING">Bicycling</option>
                    <option value="TRANSIT">Transit</option>
                  </Form.Control>
                </Form.Group>
                  </Col>
                </Row>
               
               
                <Form.Group controlId="loopRoute" className="custom-form-group d-block">
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
        <h3 className='text-center'>Search Route</h3>
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
            bootstrapURLKeys={{ key: "AIzaSyA6SzmrYZ9l1sxEev_InIxKI9aCwjlRAq0", libraries: ['places', 'directions'] }}
            defaultCenter={{ lat: 41.9028, lng: 12.4964 }}
            defaultZoom={10}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => {
              setMap(map);
              setMapsApi(maps);
            }}
            onClick={handleMapClick}
          >
            {path.map((point, index) => (
              <Marker key={index} lat={point.lat} lng={point.lng} />
            ))}
          </GoogleMapReact>
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
            <Card.Footer className=' saves-btns d-flex align-items-center justify-content-evenly'>
            <Button variant="primary" onClick={saveRoute}>Save Route</Button>
          <Button variant="info" onClick={exportToGPX}>Export to GPX</Button>
          <Button variant="dark" onClick={exportToKML}>Export to KML</Button>
          <Button variant="warning" onClick={handleUndoLastLeg}>Undo Last Leg</Button>
          <Button variant="danger" onClick={handleRemoveAll}>Remove All</Button>
            </Card.Footer>
          </Card>
        </Col>
        
      </Row>
    </Container>
  );
}

export default MapingRoutes;
