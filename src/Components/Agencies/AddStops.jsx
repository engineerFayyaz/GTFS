import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  addDoc,
  collection,
  getFirestore,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
  updateDoc,
} from "firebase/firestore"; // Import the Firestore database
import {getAuth, onAuthStateChanged} from "firebase/auth";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loader from "../Loader";
import OnlyMap from "../OnlyMap";
import moment from 'moment-timezone';
import Select from 'react-select';

export const AddStops = () => {
  const db = getFirestore();
  const auth = getAuth();
  const [show, setShow] = useState(false);
  const [stopsInfo, setStopsInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stops, setStops] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingStopId, setEditingStopId] = useState(null);
  const [timezones, setTimezones] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState(null);
  const [formData, setFormData] = useState({
    stopName: "",
    lat: "",
    long: "",
    stopCode: "",
    type: "",
    desc: "",
    stopUrl: "",
    fareZone: "",
    parentStation: "",
    timeZone: "",
    boarding: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStops, setFilteredStops] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const firstMatchRef = useRef(null);
  //   for modal
  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setEditingStopId(null);
    setFormData({
      stopName: "",
      lat: "",
      long: "",
      stopCode: "",
      type: "",
      desc: "",
      stopUrl: "",
      fareZone: "",
      parentStation: "",
      timeZone: "",
      boarding: "",
    });
  };

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchStops(user.uid);
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  const fetchStops = async (userId) => {
    try {
      setLoading(true);

      const docRef = collection(db, "Agencies_stops_data");
      const q = query(docRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const stopsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStopsInfo(stopsData);
      setFilteredStops(stopsData);
      console.log("data is:", stopsData);
    } catch (error) {
      toast.error("Error fetching stops: " + error.message);
      console.log("Error fetching stops: ", error.code, error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  useEffect(() => {
    const tz = moment.tz.names().map(tz => ({ value: tz, label: tz }));
    setTimezones(tz);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (!currentUser) {
        toast.error("Please login to add/update stops.");
        return;
      }

      const stopsData = {
        ...formData,
        userId: currentUser.uid,
      };

      if (editingStopId) {
        await updateDoc(doc(db, "Agencies_stops_data", editingStopId), stopsData);
        setTimeout(() => {
          toast.success("Stop updated successfully");
        }, 1000);
      } else {
        await addDoc(collection(db, "Agencies_stops_data"), stopsData);
        setTimeout(() => {
          toast.success("Stop added successfully");
        }, 1000);
      }
      handleClose();
      fetchStops(currentUser.uid);
    } catch (error) {
      toast.error("Error saving stop data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (stop) => {
    setFormData({
      stopName: stop.stopName || "",
      lat: stop.lat || "",
      long: stop.long || "",
      stopCode: stop.stopCode || "",
      type: stop.type || "",
      desc: stop.desc || "",
      stopUrl: stop.stopUrl || "",
      fareZone: stop.fareZone || "",
      parentStation: stop.parentStation || "",
      timeZone: stop.timeZone || "",
      boarding: stop.boarding || "",
    });
    setEditingStopId(stop.id);
    setShow(true);
  };

  const handleDelete = async (stopId) => {
    if (window.confirm("Are you sure you want to delete this stop?")) {
      try {
        await deleteDoc(doc(db, "Agencies_stops_data", stopId));
        setStops(stops.filter((stop) => stop.id !== stopId));
        toast.success("Stop deleted successfully");
        fetchStops(currentUser.uid);
      } catch (error) {
        console.error("Error deleting stop: ", error);
        toast.error("Failed to delete stop");
      }
    }
  };

  useEffect(() => {
    const results = stopsInfo.filter((stop) =>
      stop.stopName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStops(results);
    setCurrentPage(1);
  }, [searchTerm, stopsInfo]);

  useEffect(() => {
    if (filteredStops.length > 0 && searchTerm) {
      firstMatchRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [filteredStops, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedStops = filteredStops.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const totalPages = Math.ceil(filteredStops.length / entriesPerPage);

  if (loading) {
    return <Loader />;
  }

  const handleChange = (selectedOption) => {
    setSelectedTimezone(selectedOption);
    setFormData({ ...formData, timezone: selectedOption.value });
  };
  return (
    <>
      <div
        id="stops-grid_wrapper"
        className="container dataTables_wrapper form-inline dt-bootstrap"
      >
        <div className="row d-flex align-items-center justify-content-between w-100 my-3">
          <div className="col-sm-4">
            <button
              id="add_stop_btn"
              className="btn btn-outline-primary text-dark px-3 py-2"
              style={{ marginTop: 0 }}
              onClick={handleShow}
            >
              <i className="fa fa-map-marker mr-1"></i>Add stop
            </button>
            <br />
          </div>
          <div className="col-sm-4">
            <div className="dataTables_length" id="stops-grid_length">
              <label>
                Show{" "}
                <select
                  name="stops-grid_length"
                  aria-controls="stops-grid"
                  className="form-control input-sm mx-1"
                  value={entriesPerPage}
                  onChange={handleEntriesChange}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>{" "}
                entries
              </label>
            </div>
          </div>
          <div className="col-sm-4 text-right">
            <div id="stops-grid_filter" className="dataTables_filter">
              <label>
                Search:
                <input
                  type="search"
                  className="form-control input-sm mx-1"
                  placeholder=""
                  aria-controls="stops-grid"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <table
              id="stops-grid"
              className="table table-striped table-bordered dataTable"
              cellSpacing={0}
              style={{ width: "100%" }}
              role="grid"
              aria-describedby="stops-grid_info"
            >
              <thead>
                <tr role="row">
                  <th
                    className="sorting_asc"
                    tabIndex={0}
                    aria-controls="stops-grid"
                    rowSpan={1}
                    colSpan={1}
                    style={{ width: "268.333px" }}
                    aria-label="Stop Name: activate to sort column descending"
                    aria-sort="ascending"
                  >
                    Stop Name
                  </th>
                  <th
                    className="sorting_disabled"
                    rowSpan={1}
                    colSpan={1}
                    style={{ width: "491.333px" }}
                    aria-label="Routes"
                  >
                    Routes
                  </th>
                  <th
                    className="sorting_disabled text-center"
                    rowSpan={1}
                    colSpan={1}
                    style={{ width: "100.333px" }}
                    aria-label="Edit"
                  >
                    Edit
                  </th>
                  <th
                    className="sorting_disabled text-center"
                    rowSpan={1}
                    colSpan={1}
                    style={{ width: 178 }}
                    aria-label="Remove"
                  >
                    Remove
                  </th>
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <th rowSpan={1} colSpan={1}>
                    Stop Name
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    Routes
                  </th>
                  <th className="text-center" rowSpan={1} colSpan={1}>
                    Edit
                  </th>
                  <th className="text-center" rowSpan={1} colSpan={1}>
                    Remove
                  </th>
                </tr>
              </tfoot>
              <tbody>
                {paginatedStops.length > 0 ? (
                  paginatedStops.map((stop, index) => (
                    <tr
                      role="row"
                      className="odd"
                      key={stop.id}
                      ref={index === 0 ? firstMatchRef : null}
                      style={{
                        backgroundColor: stop.stopName
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                          ? "#ffff99"
                          : "",
                      }}
                    >
                      <td className="sorting_1">{stop.stopName}</td>
                      <td>Not assigned to any route</td>
                      <td className="text-center">
                        <Link
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleEdit(stop);
                          }}
                        >
                          <i className="fa fa-edit" />
                        </Link>
                      </td>
                      <td className="text-center">
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(stop.id);
                          }}
                        >
                          <i className="fa fa-close" />
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div
              id="stops-grid_processing"
              className="dataTables_processing panel panel-default"
              style={{ display: loading ? "block" : "none" }}
            >
              Processing...
            </div>
          </div>
        </div>
        <div className="row d-flex align-items-center justify-content-between w-100">
          <div className="col-sm-5">
            <div
              className="dataTables_info"
              id="stops-grid_info"
              role="status"
              aria-live="polite"
            >
              {`Showing ${
                filteredStops.length > 0
                  ? (currentPage - 1) * entriesPerPage + 1
                  : 0
              } to ${Math.min(
                currentPage * entriesPerPage,
                filteredStops.length
              )} of ${filteredStops.length} entries`}
            </div>
          </div>
          <div className="col-sm-7 text-end pr-3">
            <div
              className="dataTables_paginate paging_simple_numbers float-end pr-4"
              id="stops-grid_paginate"
            >
              <ul className="pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <a
                    className="page-link"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                  >
                    Previous
                  </a>
                </li>
                {[...Array(totalPages).keys()].map((page) => (
                  <li
                    key={page + 1}
                    className={`page-item ${
                      currentPage === page + 1 ? "active" : ""
                    }`}
                  >
                    <a
                      className="page-link"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page + 1);
                      }}
                    >
                      {page + 1}
                    </a>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <Link
                    className="page-link"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        handlePageChange(currentPage + 1);
                    }}
                  >
                    Next
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        centered
        backdrop="static"
        size="md"
        responsive
        className="add_company_modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <b>
              {" "}
              <h3>{editingStopId ? "Edit Stop" : "Create Stop"}</h3>
            </b>
          </Modal.Title>
        </Modal.Header>
        <form id="add_stop_form" onSubmit={handleSubmit} className="p-3">
          <div className="row">
            <div className="form-group col-sm-9">
              <div className="modal_macs">
                <label htmlFor="stop_name_txt">
                  Stop Name<span className="requ-lft">Required</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="stopName"
                  id="stop_name_txt"
                  required
                  value={formData.stopName}
                  onChange={handleInputChange}
                  placeholder="E.g. 465 Smith St or Bay 5 Main Depot"
                />
                <input
                  type="hidden"
                  className="form-control"
                  name="stop_file_id"
                  id="stop_file_id"
                  defaultValue={98477}
                />
              </div>
            </div>
            <div className="form-group col-sm-3" style={{ display: "none" }}>
              <label htmlFor="stop_id">
                Id<span className="requ-lft">Required</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="stop_id"
                id="stop_id"
                defaultValue=""
                onchange="show_service_alert()"
                required=""
              />
              <input
                type="hidden"
                name="hdn_stop_fld"
                id="hdn_stop_fld"
                defaultValue=""
              />
            </div>
          </div>
          <div className="row">
            <div style={{ textAlign: "center" }}>
              <small>
                <i>
                  Search for locations using the magnifying glass{" "}
                  <i className="fa fa-search" aria-hidden="true" />
                  <br />
                  Click on the map to place the marker at the stop's location
                  (latitude and longitude).
                  <br />
                  Zoom the map and position the marker to exactly where the
                  vehicle stops/departs.
                </i>
              </small>
            </div>
            <OnlyMap />
          </div>
          <br />
          <div className="row">
            <div className="form-group col-sm-6">
              <div className="modal_macs">
                <label htmlFor="stop_lat">
                  Latitude <span className="requ-lft">Required</span>
                </label>
                <input
                  type="text"
                  name="lat"
                  id="stop_lat"
                  className="form-control"
                  required=""
                  value={formData.lat}
                  onChange={handleInputChange}
                  title=""
                />
              </div>
            </div>
            <div className="form-group col-sm-6">
              <div className="modal_macs">
                <label htmlFor="stop_lon">
                  Longitude <span className="requ-lft">Required</span>
                </label>
                <input
                  type="text"
                  name="lon"
                  id="stop_lon"
                  className="form-control"
                  required=""
                  value={formData.lon}
                  onChange={handleInputChange}
                  title=""
                />
              </div>
            </div>
          </div>
          <div className="panel-group" id="accordion">
            <div className="panel panel-default">
              <div className="panel-heading">
                {/* h4 class="panel-title" */}
                <a
                  data-toggle="collapse"
                  data-parent="#accordion"
                  href="#collapseTwo"
                >
                  Optional Fields (open/close)
                </a>
                {/*/h4 */}
              </div>
              <div
                id="collapseTwo"
                className="panel-collapse out collapse in"
                style={{}}
              >
                <div className="panel-body">
                  <div className="row">
                    <div className="form-group col-sm-5">
                      <div className="modal_macs">
                        <label htmlFor="stop_code">Stop Code</label>
                        <input
                          type="text"
                          className="form-control"
                          name="stopCode"
                          value={formData.stopCode}
                          onChange={handleInputChange}
                          id="stop_code"
                          placeholder="E.g. Stop 465"
                        />
                      </div>
                    </div>
                    <div className="form-group col-sm-7">
                      <div className="modal_macs">
                        <label htmlFor="location_type">Type</label>
                        <div className="custom_search_parent">
                          <select
                            className="custom_search"
                            name="type"
                            id="location_type"
                            value={formData.type}
                            onChange={handleInputChange}
                          >
                            <option value="" disabled="disabled">
                              Select One
                            </option>
                            <option
                              value={0}
                              title="A location where passengers board or disembark from a transit vehicle"
                              selected="selected"
                            >
                              Stop
                            </option>
                            <option
                              value={1}
                              title="A physical structure or area that contains one or more stops"
                            >
                              Terminal/Station (group of stops)
                            </option>
                            <option
                              value={2}
                              title=" A location where passengers can enter or exit a station from the street."
                            >
                              Entrance/Exit
                            </option>
                            <option
                              value={3}
                              title="A location within a station, not matching any other location, that can be used to link together pathways"
                            >
                              Generic Node
                            </option>
                            <option
                              value={4}
                              title="A specific location on a platform, where passengers can board and/or alight vehicles"
                            >
                              Boarding Area
                            </option>
                          </select>
                          <span className="cont_arrow" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-sm-12">
                      <label htmlFor="stop_desc">Description</label>
                      <textarea
                        className="form-control"
                        name="desc"
                        value={formData.desc}
                        onChange={handleInputChange}
                        id="stop_desc"
                        placeholder="Enter the stop's features. E.g. Benches, covered access, car parking and local amenities"
                        cols={2}
                        style={{ lineHeight: "normal" }}
                        defaultValue={""}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-sm-12">
                      <label htmlFor="stop_url">
                        Stop URL
                        <a
                          target="_blank"
                          className="test_link fetch_link"
                          href="#"
                          style={{
                            fontSize: 12,
                            paddingLeft: 15,
                            paddingTop: 6,
                          }}
                        >
                          Test Link
                        </a>
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="The web page for a train station, bus depot or terminal"
                        name="stopUrl"
                        id="stop_url"
                        value={formData.stopUrl}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-sm-6">
                      <div className="modal_macs">
                        <label htmlFor="zone_id">Fare Zone</label>
                        <div className="custom_search_parent">
                          <select
                            className="custom_search"
                            name="fareZone"
                            id="zone_id"
                            value={formData.fareZone}
                            onChange={handleInputChange}
                          >
                            {" "}
                            <option
                              value=""
                              disabled="disabled"
                              selected="selected"
                            >
                              No fare zones setup yet
                            </option>
                          </select>
                          <span className="cont_arrow" />
                        </div>
                      </div>
                    </div>
                    <div className="form-group col-sm-6">
                      <div className="modal_macs">
                        <label htmlFor="parent_station">Parent Station</label>
                        <div className="custom_search_parent">
                          <select
                            className="custom_search"
                            name="parentStation"
                            id="parent_station"
                            value={formData.parentStation}
                            onChange={handleInputChange}
                          >
                            <option
                              value=""
                              title="A station cannot contain other stations"
                            >
                              Not Applicable
                            </option>
                          </select>
                          <span className="cont_arrow" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-sm-12">
                      <div className="modal_macs">
                        <label htmlFor="stop_timezone">Time Zone</label>
                        <div className="custom_search_parent">
                  <Select
                    name="timezone"
                    className="custom_search"
                    id="time_zone"
                    required
                    onChange={handleChange}
                    value={selectedTimezone}
                    options={timezones}
                    placeholder="Select One"
                  />
                  {formData.timezone && (
                    <div>
                      <p>Selected Timezone: {formData.timezone}</p>
                    </div>
                  )}
                </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-sm-12">
                      <div className="modal_macs">
                        <label htmlFor="wheelchair_boarding">
                          Wheelchair Boarding
                        </label>
                        <div
                          className="custom_search_parent"
                          id="wheel_board_div"
                        >
                          <select
                            className="custom_search"
                            name="boarding"
                            value={formData.boarding}
                            onChange={handleInputChange}
                          >
                            <option value={0}>
                              Refer parent station accessibility
                            </option>
                            <option value={1}>
                              Accessible path from outside station to
                              stop/platform
                            </option>
                            <option value={2}>
                              No accessible path from outside station to
                              stop/platform
                            </option>
                          </select>
                          <span className="cont_arrow" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="clearfix" />
          <div className="modal-footer">
            <button
              data-dismiss="modal"
              className="btn btn-default"
              type="button"
              onClick={handleClose}
            >
              Cancel
            </button>
            <input type="hidden" name="action" defaultValue="insert" />
            <button
              className="btn btn-success"
              type="submit"
              name="add_submit"
              id="add_submit"
            >
              {editingStopId ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
