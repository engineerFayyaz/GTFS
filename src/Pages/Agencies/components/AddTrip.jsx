import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  Breadcrumb,
  Tab,
  Tabs,
  Accordion,
  useAccordionButton,
  Card,
  Button,
  Modal,
} from "react-bootstrap";
import {
  addDoc,
  collection,
  getFirestore,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore"; // Import the Firestore database
import Loader from "../../../Components/Loader";

export const AddTrip = () => {
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState("");
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [stops, setStops] = useState([]);
  const [routeMaps, setRouteMaps] = useState([]);
  const [formData, setFormData] = useState({
    service: "",
    tripHeadsign: "",
    shortName: "",
    direction: "",
    block: "",
    bikesAllowed: "",
    wheelchair: "",
    addStop: "",
    routeMap: "",
  });

  const db = getFirestore();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const servicesSnapshot = await getDocs(collection(db, "Agencies_services_data"));
        const stopsSnapshot = await getDocs(collection(db, "Agencies_stops_data"));
        const routeMapsSnapshot = await getDocs(collection(db, "agencies_routes_data"));

        setServices(servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setStops(stopsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setRouteMaps(routeMapsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [db]);

  const handleClose = () => {
    setShow(false);
    setFormData({
      service: "",
      tripHeadsign: "",
      shortName: "",
      direction: "",
      block: "",
      bikesAllowed: "",
      wheelchair: "",
      addStop: "",
      routeMap: "",
    });
  };
  const handleShow = () => setShow(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editMode) {
        // Update existing route
        await updateDoc(doc(db, "agencies_trips_data", editId), formData);
        setTimeout(() => {
          toast.success("Data updated successfully");
        }, 1000);
      } else {
        // Add new route
        const docRef = await addDoc(collection(db, "agencies_trips_data"), formData);
        setTimeout(() => {
          toast.success("Trips uploaded successfully");
        }, 1000);
      }
      handleClose();
    } catch (error) {
      console.error("Error adding/updating route: ", error);
      alert("Failed to add/update route");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
    <ToastContainer />
      <button
        id="add_stop_btn"
        className="btn btn-outline-dark  px-3 py-2"
        style={{ marginTop: 0 }}
        onClick={handleShow}
      >
        <i className="fa fa-map-marker mr-1"></i>Add Trip
      </button>

      <Modal
        show={show}
        onHide={handleClose}
        centered
        backdrop="static"
        size="lg"
        responsive
        className="add_company_modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <b>
              {" "}
              <h3>Create Company</h3>
            </b>
          </Modal.Title>
        </Modal.Header>
        <form
          method="post"
          name="add_trip_form"
          id="add_trip_form"
          className="p-4"
          onSubmit={handleFormSubmit}
        >
          <div className="row">
            <div className="col-sm-12 departure">
              <div className="row">
                <div className="form-group col-sm-9">
                  <label htmlFor="cal_service_id">
                    Service <span className="requ-lft">Required</span>
                  </label>
                  <div className="custom_search_parent full_width_select">
                    <select
                      className="custom_search"
                      id="cal_service_id"
                      name="service"
                      onChange={handleInputChange}
                      value={formData.service}
                    >
                      <option value="" disabled="disabled" selected="selected">
                        Select One
                      </option>
                      {services.map(service => (
                        <option key={service.id} value={service.id}>
                          {service.serviceName}
                        </option>
                      ))}
                    </select>
                    <span className="cont_arrow" />
                  </div>
                </div>
                {/* <div className="form-group col-sm-3" style={{ display: "none" }}>
          <label htmlFor="trip_id">
            Trip Id <span className="requ-lft">Required</span>
          </label>
          <input
            type="text"
            placeholder=""
            name="trip_id"
            id="trip_id"
            className="form-control"
            defaultValue={2}
            onChange={handleInputChange}
            // value={formData.trip}
          />
        </div> */}
              </div>
              <div className="row">
                <div className="form-group col-sm-6">
                  <label htmlFor="trip_h_sign">Trip Headsign</label>
                  <input
                    type="text"
                    name="tripHeadsign"
                    id="tripHeadsign"
                    placeholder="E.g. The text on the signs used for passengers"
                    className="form-control"
                    style={{ textAlign: "left" }}
                    onChange={handleInputChange}
                    value={formData.tripHeadsign}
                  />
                  <input
                    type="hidden"
                    name="my_hdn_trip"
                    id="my_hdn_trip"
                    defaultValue=""
                  />
                </div>
                <div className="form-group col-sm-6">
                  <label htmlFor="trip_s_name">Short Name</label>
                  <input
                    type="text"
                    name="shortName"
                    id="shortName"
                    className="form-control"
                    style={{ textAlign: "left" }}
                    placeholder="Use only if each trip in a day has a unique name"
                    onChange={handleInputChange}
                    value={formData.shortName}
                  />
                  <input
                    type="hidden"
                    name="hdn_file_id"
                    id="hdn_file_id"
                    defaultValue={98477}
                  />
                  <input
                    type="hidden"
                    name="hdn_trip_id"
                    id="hdn_trip_id"
                    defaultValue=""
                  />
                  <input
                    type="hidden"
                    name="hdn_route_id"
                    id="hdn_route_id"
                    defaultValue={1}
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group col-sm-6">
                  <label htmlFor="direction">Direction</label>
                  <div className="custom_search_parent full_width_select">
                    <select
                      className="custom_search"
                      name="direction"
                      id="direction"
                      onChange={handleInputChange}
                      value={formData.direction}
                    >
                      <option value={0}>Travel in one direction</option>
                      <option value={1}>
                        Travel in the opposite direction
                      </option>
                    </select>
                    <span className="cont_arrow" />
                  </div>
                </div>
                <div className="form-group col-sm-6">
                  <label htmlFor="add_add_block_id">Block</label>
                  <div className="custom_search_parent full_width_select">
                    <select
                      className="custom_search tempclass"
                      id="block"
                      name="block"
                      onChange={handleInputChange}
                      value={formData.block}
                    >
                      <option value="" disabled="disabled" selected="selected">
                        No blocks created yet
                      </option>
                    </select>
                    <span className="cont_arrow" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="form-group col-sm-6">
                  <label htmlFor="trip_bike">Bikes Allowed</label>
                  <div className="custom_search_parent full_width_select">
                    <select
                      className="custom_search"
                      name="bikesAllowed"
                      id="bikesAllowed"
                      onChange={handleInputChange}
                      value={formData.bikesAllowed}
                    >
                      <option value={0}>
                        No bike information for the trip
                      </option>
                      <option value={1}>
                        Vehicle can accommodate at least one bicycle
                      </option>
                      <option value={2}>
                        No bicycles are allowed on this trip
                      </option>
                    </select>
                    <span className="cont_arrow" />
                  </div>
                </div>
                <div className="form-group col-sm-6">
                  <label htmlFor="trip_wheel">Wheelchair Accessible</label>
                  <div className="custom_search_parent full_width_select">
                    <select
                      className="custom_search"
                      name="wheelchair"
                      id="wheelchair"
                      onChange={handleInputChange}
                      value={formData.wheelchair}
                    >
                      <option value={0}>
                        No accessibility information for the trip
                      </option>
                      <option value={1}>
                        Vehicle can accommodate at least one wheelchair rider
                      </option>
                      <option value={2}>
                        No riders in wheelchairs can be accommodated
                      </option>
                    </select>
                    <span className="cont_arrow" />
                  </div>
                </div>
              </div>
              {/*<a style="padding:10px;" href="#" class="btn btn-default border-1"><i class="fa fa-plus">&nbsp;</i> Add Departure</a>*/}
            </div>
          </div>
          <table className="table table-striped table-responsive table-hover table-bordered">
            <thead>
              <tr className="bg-head">
                <th style={{ textAlign: "center" }}>
                  <i className="fa fa-clock-o" aria-hidden="true" />
                </th>
                <th
                  style={{ width: 220 }}
                  title="Time zone used for all arrivals/departures"
                >
                  Asia/Karachi
                </th>
                <th
                  colSpan={2}
                  style={{ textAlign: "center" }}
                  title="Use hours > 24 for stops occuring the next day (e.g. 25:12 = 01:12am Day+1)"
                >
                  24 Hour Format
                  {/* input type="checkbox" id="edit_keepsame" name="edit_keepsame" style="width:auto" />&nbsp;&nbsp;<label for="edit_keepsame" style="width:auto">Keep Same</label !*/}
                </th>
                <th className="" rowSpan={2} style={{ textAlign: "center" }}>
                  Stop Headsign
                </th>
                <th className="select_td" rowSpan={2}>
                  Pickup
                  <br />
                  Type
                </th>
                <th className="select_td" rowSpan={2}>
                  Drop off
                  <br />
                  Type
                </th>
                <th className="select_td" rowSpan={2}>
                  Distance
                  <br />
                  Travelled
                </th>
                <th className="edit_remove" style={{ width: 30 }} rowSpan={2} />
              </tr>
              <tr className="bg-head">
                <th style={{ textAlign: "center" }}>#</th>
                <th>Stop Name</th>
                <th className="edit_remove">Arrive</th>
                <th className="edit_remove">Depart</th>
              </tr>
            </thead>
            <tbody
              id="trip_stop_table_id"
              className="ui-sortable"
              style={{}}
            ></tbody>
          </table>
          <div className="row">
            <div className="form-group col-sm-6">
              <label htmlFor="add_add_stop_id">Add a Stop</label>
              <select
                className="form-control custom_search select2-hidden-accessible"
                id="addStop"
                name="addStop"
                data-placeholder="Select One"
                tabIndex={-1}
                aria-hidden="true"
                onChange={handleInputChange}
                value={formData.addStop}
              >
<option value="">
                select one
              </option>
              {stops.map(stop => (
                        <option key={stop.id} value={stop.id}>
                          {stop.stopName}
                        </option>
                      ))}
              </select>
              {/* div class="custom_search_parent full_width_select">
					<select class="custom_search tempclass" id="add_add_stop_id" name="stop_id">
						<option value="" disabled="disabled" selected="selected"></option>
						 
							<option value="" title="Lat/Lon: "></option>     
											</select>
					<span class="cont_arrow"></span></div !*/}
            </div>
            <div className="form-group col-sm-2">
              <br />
              <button
                className="btn btn-default"
                type="button"
                onclick="add_stop_by_trip()"
                style={{ verticalAlign: "bottom" }}
              >
                <i className="fa fa-plus"> </i>&nbsp; Add stop
              </button>
            </div>
            <div className="form-group col-sm-4" style={{ width: "auto" }}>
              {/* br/><span title="Sort 'Add a Stop'">Sort by:&nbsp;</span><input type="radio" name="stop_order" value="txt" title="Sort alpahabetically" checked="checked" onclick="stop_sort('n');" style="width:auto;"><span title="Sort alpahabetically">&nbsp;Name&nbsp;&nbsp;</span><input type="radio" name="stop_order" value="id" title="Oldest -> Newest" onclick="stop_sort('d');" style="width:auto;"><span title="Oldest -> Newest">&nbsp;Date&nbsp;&nbsp;</span */}
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-6">
              <label htmlFor="shape_id">
                Route Map
                <a
                  href="#"
                  onclick="initialize_map_route('N');"
                  data-target="#map_route"
                  data-toggle="modal"
                  data-backdrop="static"
                >
                  <i className="fa fa-crosshairs" title="Edit Route Map">
                    &nbsp;&nbsp;
                  </i>
                </a>
                &nbsp;&nbsp;
                <a
                  href="#"
                  onclick="initialize_map_route('Y');"
                  data-target="#map_route"
                  data-toggle="modal"
                  data-backdrop="static"
                >
                  Create New Route Map
                </a>
              </label>
              <div className="custom_search_parent full_width_select">
                <select
                  className="custom_search temp_class"
                  id="shape_id"
                  name="shape_id"
                >
                  <option value="" disabled="disabled" selected="selected">
                    Select One
                  </option>
                  {routeMaps.map(routeMap => (
                        <option key={routeMap.id} value={routeMap.id}>
                          {routeMap.name}
                        </option>
                      ))}
                </select>
                <span className="cont_arrow" />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-default"
              data-dismiss="modal"
            >
              Cancel
            </button>
            <button
              className="btn btn-success add-trip"
              type="button"
              value="Submit"
            >
              Submit
            </button>
            {/* input type="button" class="btn btn-success add-trip" value="Submit" !*/}
          </div>
        </form>
      </Modal>
    </>
  );
};
