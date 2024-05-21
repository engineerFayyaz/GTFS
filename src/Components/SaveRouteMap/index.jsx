import React, { useState, useRef, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { toast } from 'react-toastify';
import { Form, Button, Container, Row, Col, InputGroup } from 'react-bootstrap';
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption
} from '@reach/combobox'; // Import Combobox components from '@reach/combobox'
import '@reach/combobox/styles.css';

// Define container style for Google Map
const containerStyle = { height: '600px', width: '100%' };

const libraries = ['places', 'geometry'];

const SaveRouteMap = () => {

    const [path, setPath] = useState([]);
    const [distance, setDistance] = useState(0);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [mapType, setMapType] = useState('roadmap');
    const [travelMode, setTravelMode] = useState('WALKING');
    const [selectedStop, setSelectedStop] = useState(null);
    const [directions, setDirections] = useState(null);
    const mapRef = useRef(null);
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions
    } = usePlacesAutocomplete({
        debounce: 300,
    });
    const onLoad = useCallback(map => {
        mapRef.current = map;
    }, []);

    const handleMapClick = event => {
        const newPath = [...path, { lat: event.latLng.lat(), lng: event.latLng.lng() }];
        setPath(newPath);
        calculateDistance(newPath);

        if (path.length >= 1) {
            const origin = path[path.length - 1];
            const destination = newPath[newPath.length - 1];

            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: new window.google.maps.LatLng(origin.lat, origin.lng),
                    destination: new window.google.maps.LatLng(destination.lat, destination.lng),
                    travelMode: travelMode
                },
                (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        setDirections(result);
                    } else {
                        console.error(`error fetching directions ${result}`);
                    }
                }
            );
        }
    };

    const handleSaveRoute = async () => {
        if (title && description) {
            try {
                await addDoc(collection(db, 'routes'), { title, description, path, distance });
                alert('Route saved successfully!');
            } catch (error) {
                console.error('Error saving route: ', error);
            }
        } else {
            alert('Please enter a title and description');
        }
    };

    const calculateDistance = (path) => {
        if (!window.google) return;

        let totalDistance = 0;
        for (let i = 1; i < path.length; i++) {
            totalDistance += window.google.maps.geometry.spherical.computeDistanceBetween(
                new window.google.maps.LatLng(path[i - 1]),
                new window.google.maps.LatLng(path[i])
            );
        }
        setDistance((totalDistance / 1000).toFixed(2)); // distance in km
    };

    const handleAddressSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();

        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            mapRef.current.panTo({ lat, lng });
            mapRef.current.setZoom(15);
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    const defaultCenter = { lat: -25.2744, lng: 133.7751 }; // Center of Australia

    return (
        <LoadScript
            googleMapsApiKey="AIzaSyBDDCT1y6vpC4jJ3_LGzRnMF6OclbkDEfU"
            libraries={libraries}
        >
            <Container fluid>
                <Row className="mt-3">
                    <Col>
                        <div className="p-3 bg-light rounded shadow-sm">
                            <h5 className="mb-4">Search Address</h5>
                            <Combobox onSelect={handleAddressSelect}>
                                <InputGroup>
                                    <ComboboxInput
                                        className="form-control"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        disabled={!ready}
                                        placeholder="Enter an address"
                                    />
                                    <InputGroup.Text id="basic-addon2">
                                        <Button variant="outline-secondary" onClick={clearSuggestions}>Clear</Button>
                                    </InputGroup.Text>
                                </InputGroup>
                                <ComboboxPopover>
                                    {status === 'OK' && data.map(({ place_id, description }) => (
                                        <ComboboxList key={place_id}>
                                            <ComboboxOption value={description} />
                                        </ComboboxList>
                                    ))}
                                </ComboboxPopover>
                            </Combobox>
                        </div>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col sm={12}>
                        <div className="p-3 bg-light rounded shadow-sm">
                            <h5 className="mb-4">Route Details</h5>
                            <Form.Group>
                                <Form.Label>Route Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Route Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Route Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Route Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="success" onClick={handleSaveRoute}>Save Route</Button>
                        </div>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col sm={12}>
                        <div className="p-3 bg-light rounded shadow-sm">
                            <h5 className="mb-4">Map</h5>
                            <div style={containerStyle}>
                                <GoogleMap
                                    onClick={handleMapClick}
                                    onLoad={onLoad}
                                    mapContainerStyle={containerStyle}
                                    center={defaultCenter}
                                    zoom={6} // Adjust zoom level as needed
                                    mapTypeId={mapType}
                                    options={{ zoomControl: true, mapTypeControl: false }}
                                >
                                    {path.map((pos, idx) => <Marker key={idx} position={pos} />)}
                                    {directions && <DirectionsRenderer directions={directions} />}
                                </GoogleMap>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </LoadScript>
    );
};

export default SaveRouteMap;
