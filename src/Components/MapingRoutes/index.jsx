import React, { useState, useEffect, useCallback } from 'react';
import GoogleMapReact from 'google-map-react';
import { getFirestore, collection, getDocs, addDoc, writeBatch, doc } from 'firebase/firestore';
import FileSaver from 'file-saver';
import { Container, Form, Button, Row, Col, Card, InputGroup, FormControl } from 'react-bootstrap';
import Marker from '../Marker';
import './MapingRoutes.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt,faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';


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
  const [center, setCenter] = useState({ lat: 6.5244, lng: 3.3792 });
  const [zoom, setZoom] = useState(15);


  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    } else {
      console.error('Geolocation is not available');
    }
  }, []);
  const searchLocation = (term) => {
    if (mapsApi && map && term) {
      const service = new mapsApi.places.PlacesService(map);
      const request = {
        query: term,
        fields: ['name', 'geometry'],
      };
      service.findPlaceFromQuery(request, (results, status) => {
        if (status === mapsApi.places.PlacesServiceStatus.OK && results) {
          const place = results[0];
          const { lat, lng } = place.geometry.location;
          setSuggestions([{ lat: lat(), lng: lng() }]);
          map.setCenter({ lat: lat(), lng: lng() });
          map.setZoom(15);
        }
      });
    }
  };

  const fetchSuggestions = (term) => {
    if (mapsApi && term) {
      const service = new mapsApi.places.AutocompleteService();
      service.getPlacePredictions({ input: term }, (predictions, status) => {
        if (status === mapsApi.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions);
        } else {
          setSuggestions([]);
        }
      });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchLocation(searchTerm);
  };

  const handleSuggestionClick = (suggestion) => {
    const service = new mapsApi.places.PlacesService(map);
    const request = {
      placeId: suggestion.place_id,
      fields: ['name', 'geometry'],
    };
    service.getDetails(request, (place, status) => {
      if (status === mapsApi.places.PlacesServiceStatus.OK) {
        const { lat, lng } = place.geometry.location;
        setSearchTerm(suggestion.description);
        setSuggestions([]);
        map.setCenter({ lat: lat(), lng: lng() });
        map.setZoom(15);
      }
    });
  };


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

  const renderRoutesOnMap = (map, maps) => {
    if (map && maps && routes.length > 0) {
      const bounds = new maps.LatLngBounds(); // Create bounds object to include all markers

      routes.forEach((route, index) => {
        if (Array.isArray(route)) {
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
        } else {
          console.error('Expected route to be an array but got:', route);
        }
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
    if (Array.isArray(route)) {
      const routePath = route.map(point => ({
        lat: parseFloat(point.shape_pt_lat),
        lng: parseFloat(point.shape_pt_lon)
      }));
      setPath(routePath);
      calculateDistance(routePath);
    } else {
      console.error('Expected route to be an array but got:', route);
    }
  };
  const generateRouteId = (title) => {
    return `${title}-${Date.now()}`;
  };
  const saveRoute = async () => {
    try {
      // Add the route to the 'routes' collection with auto-generated ID
      const routeRef = await addDoc(collection(db, 'routes'), { path, title, description });
      const routeId = routeRef.id;

      let totalDistance = 0;
      const routeData = path.map((point, index) => {
        if (index > 0) {
          totalDistance += haversineDistance(path[index - 1], point);
        }
        return {
          shape_id: routeId, // using routeId as the shape_id for linking
          shape_pt_lat: point.lat.toString(), // latitude as string
          shape_pt_lon: point.lng.toString(), // longitude as string
          shape_pt_sequence: (index + 1).toString(), // sequence as string
          shape_dist_traveled: totalDistance.toFixed(4) // distance traveled as string
        };
      });

      // Save the data to the 'shapes' collection using a batch
      const batch = writeBatch(db);
      routeData.forEach(point => {
        const shapeRef = doc(collection(db, 'shapes2'));
        batch.set(shapeRef, point);
      });
      await batch.commit();

      // Save the data to the 'shapes2' collection using a batch with auto-generated IDs
      const batch2 = writeBatch(db);
      routeData.forEach(point => {
        const shape2Ref = doc(collection(db, 'shapes2'));
        batch2.set(shape2Ref, point);
      });
      await batch2.commit();

      // Save shape_id to the 'routes2' collection with auto-generated ID
      const route2Data = {
        routeId: routeId,
        shape_id: routeId, // ensure that shape_id in routes2 matches the one used in shapes2
        title: title,
        description: description
      };
      await addDoc(collection(db, 'routes2'), route2Data);

      // Retrieve data from 'agencies_routes_data' collection
      const agenciesRoutesSnapshot = await getDocs(collection(db, 'agencies_routes_data'));
      agenciesRoutesSnapshot.forEach(doc => {
        const data = doc.data();
        // Save data to 'routes2' collection
        addDoc(collection(db, 'routes2'), data);
      });

      // Generate the text file content
      const headers = "shape_id,shape_pt_lat,shape_pt_lon,shape_pt_sequence,shape_dist_traveled";
      const shapeText = routeData.map(point =>
        `${point.shape_id},${point.shape_pt_lat},${point.shape_pt_lon},${point.shape_pt_sequence},${point.shape_dist_traveled}`
      ).join('\n');
      const fileContent = `${headers}\n${shapeText}`;

      // Save the text file
      const blob = new Blob([fileContent], { type: 'text/plain' });
      FileSaver.saveAs(blob, 'shapes.txt');

      // Show success toast messages
      toast.success("Data saved successfully to shapes and shapes2 collections");
      toast.success("Shape ID saved successfully to routes2 collection");
    } catch (error) {
      console.error('Error saving route:', error);
      toast.error("Error saving data");
    }
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

  const handleApiLoaded = (map, maps) => {
    setMap(map);
    setMapsApi(maps);
    renderRoutesOnMap(map, maps);
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
  const renderPolylines = (map, maps) => {
    routes.forEach((route, index) => {
      if (Array.isArray(route)) {
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
      } else {
        console.error('Expected route to be an array but got:', route);
      }
    });
  };

  return (
    <Container>

      <Row className="my-4">
        <Col className="col-lg-8 mx-auto">
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
                    onChange={(e) => setMapType(e.target.value)}
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
                <Form.Group controlId="loopRoute" className="custom-form-group" style={{ width: "200px" }}>
                  <Form.Check style={{ width: "10px", marginLeft: "44px" }}

                    label="Loop Route"
                    type="checkbox"
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
        <Col className='col-lg-8 mx-auto'>
          <Form onSubmit={handleSearchSubmit}>
            <Form.Group as={Row} controlId="searchTerm">
              <Col sm={8} style={{width:"100%"}}>
                <InputGroup>
                  <FormControl
                    type="text"
                    placeholder="Search for a location"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      fetchSuggestions(e.target.value);
                    }}
                  />
                  <Button type="submit">Search</Button>
                </InputGroup>
              </Col>
            </Form.Group>
          </Form>
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
            defaultCenter={{ lat: -25.0, lng: 133.0 }} // Centered in the middle of Australia
            center={center}
            zoom={zoom}
            defaultZoom={5} // Adjust zoom level as needed
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
            <Marker
              lat={center.lat}
              lng={center.lng}
              text="You are here"
            />
            {path.map((point, index) => (
              <FontAwesomeIcon style={{ color: 'red' }} size="2x" />
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
    </Container>
  );
}

export default MapingRoutes;
