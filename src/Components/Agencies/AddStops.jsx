import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  addDoc,
  collection,
  getFirestore,
  getDocs,
  doc,
  deleteDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore"; // Import the Firestore database

import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loader from "../Loader";
import OnlyMap from "../OnlyMap";

export const AddStops = () => {
  const db = getFirestore();
  const [show, setShow] = useState(false);
  const [stopsInfo, setStopsInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stops, setStops] = useState([]);
  const [editingStopId, setEditingStopId] = useState(null);
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

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingStopId) {
        await updateDoc(
          doc(db, "Agencies_stops_data", editingStopId),
          formData
        );
        setTimeout(() => {
          toast.success("Stop updated successfully");
        }, 1000);
      } else {
        await addDoc(collection(db, "Agencies_stops_data"), formData);
        setTimeout(() => {
          toast.success("Stop added successfully");
        }, 1000);
      }
      handleClose();
      fetchStops();
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

  const handleDelete = async (stopId) => {
    if (window.confirm("Are you sure you want to delete this stop?")) {
      try {
        await deleteDoc(doc(db, "Agencies_stops_data", stopId));
        setStops(stops.filter((stop) => stop.id !== stopId));
        toast.success("Stop deleted successfully");
        fetchStops();
      } catch (error) {
        console.error("Error deleting stop: ", error);
        toast.error("Failed to delete stop");
      }
    }
  };

  const fetchStops = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(
        collection(db, "Agencies_stops_data")
      );
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

  useEffect(() => {
    fetchStops();
  }, [db, editingStopId, show]);

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
                  <a
                    className="page-link"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        handlePageChange(currentPage + 1);
                    }}
                  >
                    Next
                  </a>
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
                          <select
                            className="custom_search"
                            name="timeZone"
                            id="stop_timezone"
                            value={formData.timeZone}
                            onChange={handleInputChange}
                          >
                            <option value="" disabled="disabled">
                              Select One
                            </option>
                            <option value="Africa/Abidjan">
                              Africa/Abidjan
                            </option>
                            <option value="Africa/Accra">Africa/Accra</option>
                            <option value="Africa/Addis_Ababa">
                              Africa/Addis_Ababa
                            </option>
                            <option value="Africa/Algiers">
                              Africa/Algiers
                            </option>
                            <option value="Africa/Asmara">Africa/Asmara</option>
                            <option value="Africa/Bamako">Africa/Bamako</option>
                            <option value="Africa/Bangui">Africa/Bangui</option>
                            <option value="Africa/Banjul">Africa/Banjul</option>
                            <option value="Africa/Bissau">Africa/Bissau</option>
                            <option value="Africa/Blantyre">
                              Africa/Blantyre
                            </option>
                            <option value="Africa/Brazzaville">
                              Africa/Brazzaville
                            </option>
                            <option value="Africa/Bujumbura">
                              Africa/Bujumbura
                            </option>
                            <option value="Africa/Cairo">Africa/Cairo</option>
                            <option value="Africa/Casablanca">
                              Africa/Casablanca
                            </option>
                            <option value="Africa/Ceuta">Africa/Ceuta</option>
                            <option value="Africa/Conakry">
                              Africa/Conakry
                            </option>
                            <option value="Africa/Dakar">Africa/Dakar</option>
                            <option value="Africa/Dar_es_Salaam">
                              Africa/Dar_es_Salaam
                            </option>
                            <option value="Africa/Djibouti">
                              Africa/Djibouti
                            </option>
                            <option value="Africa/Douala">Africa/Douala</option>
                            <option value="Africa/El_Aaiun">
                              Africa/El_Aaiun
                            </option>
                            <option value="Africa/Freetown">
                              Africa/Freetown
                            </option>
                            <option value="Africa/Gaborone">
                              Africa/Gaborone
                            </option>
                            <option value="Africa/Harare">Africa/Harare</option>
                            <option value="Africa/Johannesburg">
                              Africa/Johannesburg
                            </option>
                            <option value="Africa/Juba">Africa/Juba</option>
                            <option value="Africa/Kampala">
                              Africa/Kampala
                            </option>
                            <option value="Africa/Khartoum">
                              Africa/Khartoum
                            </option>
                            <option value="Africa/Kigali">Africa/Kigali</option>
                            <option value="Africa/Kinshasa">
                              Africa/Kinshasa
                            </option>
                            <option value="Africa/Lagos">Africa/Lagos</option>
                            <option value="Africa/Libreville">
                              Africa/Libreville
                            </option>
                            <option value="Africa/Lome">Africa/Lome</option>
                            <option value="Africa/Luanda">Africa/Luanda</option>
                            <option value="Africa/Lubumbashi">
                              Africa/Lubumbashi
                            </option>
                            <option value="Africa/Lusaka">Africa/Lusaka</option>
                            <option value="Africa/Malabo">Africa/Malabo</option>
                            <option value="Africa/Maputo">Africa/Maputo</option>
                            <option value="Africa/Maseru">Africa/Maseru</option>
                            <option value="Africa/Mbabane">
                              Africa/Mbabane
                            </option>
                            <option value="Africa/Mogadishu">
                              Africa/Mogadishu
                            </option>
                            <option value="Africa/Monrovia">
                              Africa/Monrovia
                            </option>
                            <option value="Africa/Nairobi">
                              Africa/Nairobi
                            </option>
                            <option value="Africa/Ndjamena">
                              Africa/Ndjamena
                            </option>
                            <option value="Africa/Niamey">Africa/Niamey</option>
                            <option value="Africa/Nouakchott">
                              Africa/Nouakchott
                            </option>
                            <option value="Africa/Ouagadougou">
                              Africa/Ouagadougou
                            </option>
                            <option value="Africa/Porto-Novo">
                              Africa/Porto-Novo
                            </option>
                            <option value="Africa/Sao_Tome">
                              Africa/Sao_Tome
                            </option>
                            <option value="Africa/Timbuktu">
                              Africa/Timbuktu
                            </option>
                            <option value="Africa/Tripoli">
                              Africa/Tripoli
                            </option>
                            <option value="Africa/Tunis">Africa/Tunis</option>
                            <option value="Africa/Windhoek">
                              Africa/Windhoek
                            </option>
                            <option value="America/Adak">America/Adak</option>
                            <option value="America/Anchorage">
                              America/Anchorage
                            </option>
                            <option value="America/Anguilla">
                              America/Anguilla
                            </option>
                            <option value="America/Antigua">
                              America/Antigua
                            </option>
                            <option value="America/Araguaina">
                              America/Araguaina
                            </option>
                            <option value="America/Argentina/Buenos_Aires">
                              America/Argentina/Buenos_Aires
                            </option>
                            <option value="America/Argentina/Catamarca">
                              America/Argentina/Catamarca
                            </option>
                            <option value="America/Argentina/Cordoba">
                              America/Argentina/Cordoba
                            </option>
                            <option value="America/Argentina/Jujuy">
                              America/Argentina/Jujuy
                            </option>
                            <option value="America/Argentina/La_Rioja">
                              America/Argentina/La_Rioja
                            </option>
                            <option value="America/Argentina/Mendoza">
                              America/Argentina/Mendoza
                            </option>
                            <option value="America/Argentina/Rio_Gallegos">
                              America/Argentina/Rio_Gallegos
                            </option>
                            <option value="America/Argentina/Salta">
                              America/Argentina/Salta
                            </option>
                            <option value="America/Argentina/San_Juan">
                              America/Argentina/San_Juan
                            </option>
                            <option value="America/Argentina/San_Luis">
                              America/Argentina/San_Luis
                            </option>
                            <option value="America/Argentina/Tucuman">
                              America/Argentina/Tucuman
                            </option>
                            <option value="America/Argentina/Ushuaia">
                              America/Argentina/Ushuaia
                            </option>
                            <option value="America/Aruba">America/Aruba</option>
                            <option value="America/Asuncion">
                              America/Asuncion
                            </option>
                            <option value="America/Atikokan">
                              America/Atikokan
                            </option>
                            <option value="America/Bahia">America/Bahia</option>
                            <option value="America/Bahia_Banderas">
                              America/Bahia_Banderas
                            </option>
                            <option value="America/Barbados">
                              America/Barbados
                            </option>
                            <option value="America/Belem">America/Belem</option>
                            <option value="America/Belize">
                              America/Belize
                            </option>
                            <option value="America/Blanc-Sablon">
                              America/Blanc-Sablon
                            </option>
                            <option value="America/Boa_Vista">
                              America/Boa_Vista
                            </option>
                            <option value="America/Bogota">
                              America/Bogota
                            </option>
                            <option value="America/Boise">America/Boise</option>
                            <option value="America/Cambridge_Bay">
                              America/Cambridge_Bay
                            </option>
                            <option value="America/Campo_Grande">
                              America/Campo_Grande
                            </option>
                            <option value="America/Cancun">
                              America/Cancun
                            </option>
                            <option value="America/Caracas">
                              America/Caracas
                            </option>
                            <option value="America/Cayenne">
                              America/Cayenne
                            </option>
                            <option value="America/Cayman">
                              America/Cayman
                            </option>
                            <option value="America/Chicago">
                              America/Chicago
                            </option>
                            <option value="America/Chihuahua">
                              America/Chihuahua
                            </option>
                            <option value="America/Costa_Rica">
                              America/Costa_Rica
                            </option>
                            <option value="America/Creston">
                              America/Creston
                            </option>
                            <option value="America/Cuiaba">
                              America/Cuiaba
                            </option>
                            <option value="America/Curacao">
                              America/Curacao
                            </option>
                            <option value="America/Danmarkshavn">
                              America/Danmarkshavn
                            </option>
                            <option value="America/Dawson">
                              America/Dawson
                            </option>
                            <option value="America/Dawson_Creek">
                              America/Dawson_Creek
                            </option>
                            <option value="America/Denver">
                              America/Denver
                            </option>
                            <option value="America/Detroit">
                              America/Detroit
                            </option>
                            <option value="America/Dominica">
                              America/Dominica
                            </option>
                            <option value="America/Edmonton">
                              America/Edmonton
                            </option>
                            <option value="America/Eirunepe">
                              America/Eirunepe
                            </option>
                            <option value="America/El_Salvador">
                              America/El_Salvador
                            </option>
                            <option value="America/Fortaleza">
                              America/Fortaleza
                            </option>
                            <option value="America/Glace_Bay">
                              America/Glace_Bay
                            </option>
                            <option value="America/Godthab">
                              America/Godthab
                            </option>
                            <option value="America/Goose_Bay">
                              America/Goose_Bay
                            </option>
                            <option value="America/Grand_Turk">
                              America/Grand_Turk
                            </option>
                            <option value="America/Grenada">
                              America/Grenada
                            </option>
                            <option value="America/Guadeloupe">
                              America/Guadeloupe
                            </option>
                            <option value="America/Guatemala">
                              America/Guatemala
                            </option>
                            <option value="America/Guayaquil">
                              America/Guayaquil
                            </option>
                            <option value="America/Guyana">
                              America/Guyana
                            </option>
                            <option value="America/Halifax">
                              America/Halifax
                            </option>
                            <option value="America/Havana">
                              America/Havana
                            </option>
                            <option value="America/Hermosillo">
                              America/Hermosillo
                            </option>
                            <option value="America/Indiana/Indianapolis">
                              America/Indiana/Indianapolis
                            </option>
                            <option value="America/Indiana/Knox">
                              America/Indiana/Knox
                            </option>
                            <option value="America/Indiana/Marengo">
                              America/Indiana/Marengo
                            </option>
                            <option value="America/Indiana/Petersburg">
                              America/Indiana/Petersburg
                            </option>
                            <option value="America/Indiana/Tell_City">
                              America/Indiana/Tell_City
                            </option>
                            <option value="America/Indiana/Valparaiso">
                              America/Indiana/Valparaiso
                            </option>
                            <option value="America/Indiana/Vevay">
                              America/Indiana/Vevay
                            </option>
                            <option value="America/Indiana/Vincennes">
                              America/Indiana/Vincennes
                            </option>
                            <option value="America/Indiana/Winamac">
                              America/Indiana/Winamac
                            </option>
                            <option value="America/Inuvik">
                              America/Inuvik
                            </option>
                            <option value="America/Iqaluit">
                              America/Iqaluit
                            </option>
                            <option value="America/Jamaica">
                              America/Jamaica
                            </option>
                            <option value="America/Juneau">
                              America/Juneau
                            </option>
                            <option value="America/Kentucky/Louisville">
                              America/Kentucky/Louisville
                            </option>
                            <option value="America/Kentucky/Monticello">
                              America/Kentucky/Monticello
                            </option>
                            <option value="America/Kralendijk">
                              America/Kralendijk
                            </option>
                            <option value="America/La_Paz">
                              America/La_Paz
                            </option>
                            <option value="America/Lima">America/Lima</option>
                            <option value="America/Los_Angeles">
                              America/Los_Angeles
                            </option>
                            <option value="America/Lower_Princes">
                              America/Lower_Princes
                            </option>
                            <option value="America/Maceio">
                              America/Maceio
                            </option>
                            <option value="America/Managua">
                              America/Managua
                            </option>
                            <option value="America/Manaus">
                              America/Manaus
                            </option>
                            <option value="America/Marigot">
                              America/Marigot
                            </option>
                            <option value="America/Martinique">
                              America/Martinique
                            </option>
                            <option value="America/Matamoros">
                              America/Matamoros
                            </option>
                            <option value="America/Mazatlan">
                              America/Mazatlan
                            </option>
                            <option value="America/Menominee">
                              America/Menominee
                            </option>
                            <option value="America/Merida">
                              America/Merida
                            </option>
                            <option value="America/Metlakatla">
                              America/Metlakatla
                            </option>
                            <option value="America/Mexico_City">
                              America/Mexico_City
                            </option>
                            <option value="America/Miquelon">
                              America/Miquelon
                            </option>
                            <option value="America/Moncton">
                              America/Moncton
                            </option>
                            <option value="America/Monterrey">
                              America/Monterrey
                            </option>
                            <option value="America/Montevideo">
                              America/Montevideo
                            </option>
                            <option value="America/Montreal">
                              America/Montreal
                            </option>
                            <option value="America/Montserrat">
                              America/Montserrat
                            </option>
                            <option value="America/Nassau">
                              America/Nassau
                            </option>
                            <option value="America/New_York">
                              America/New_York
                            </option>
                            <option value="America/Nipigon">
                              America/Nipigon
                            </option>
                            <option value="America/Nome">America/Nome</option>
                            <option value="America/Noronha">
                              America/Noronha
                            </option>
                            <option value="America/North_Dakota/Beulah">
                              America/North_Dakota/Beulah
                            </option>
                            <option value="America/North_Dakota/Center">
                              America/North_Dakota/Center
                            </option>
                            <option value="America/North_Dakota/New_Salem">
                              America/North_Dakota/New_Salem
                            </option>
                            <option value="America/Ojinaga">
                              America/Ojinaga
                            </option>
                            <option value="America/Panama">
                              America/Panama
                            </option>
                            <option value="America/Pangnirtung">
                              America/Pangnirtung
                            </option>
                            <option value="America/Paramaribo">
                              America/Paramaribo
                            </option>
                            <option value="America/Phoenix">
                              America/Phoenix
                            </option>
                            <option value="America/Port_of_Spain">
                              America/Port_of_Spain
                            </option>
                            <option value="America/Port-au-Prince">
                              America/Port-au-Prince
                            </option>
                            <option value="America/Porto_Velho">
                              America/Porto_Velho
                            </option>
                            <option value="America/Puerto_Rico">
                              America/Puerto_Rico
                            </option>
                            <option value="America/Rainy_River">
                              America/Rainy_River
                            </option>
                            <option value="America/Rankin_Inlet">
                              America/Rankin_Inlet
                            </option>
                            <option value="America/Recife">
                              America/Recife
                            </option>
                            <option value="America/Regina">
                              America/Regina
                            </option>
                            <option value="America/Resolute">
                              America/Resolute
                            </option>
                            <option value="America/Rio_Branco">
                              America/Rio_Branco
                            </option>
                            <option value="America/Santa_Isabel">
                              America/Santa_Isabel
                            </option>
                            <option value="America/Santarem">
                              America/Santarem
                            </option>
                            <option value="America/Santiago">
                              America/Santiago
                            </option>
                            <option value="America/Santo_Domingo">
                              America/Santo_Domingo
                            </option>
                            <option value="America/Sao_Paulo">
                              America/Sao_Paulo
                            </option>
                            <option value="America/Scoresbysund">
                              America/Scoresbysund
                            </option>
                            <option value="America/Sitka">America/Sitka</option>
                            <option value="America/St_Barthelemy">
                              America/St_Barthelemy
                            </option>
                            <option value="America/St_Johns">
                              America/St_Johns
                            </option>
                            <option value="America/St_Kitts">
                              America/St_Kitts
                            </option>
                            <option value="America/St_Lucia">
                              America/St_Lucia
                            </option>
                            <option value="America/St_Thomas">
                              America/St_Thomas
                            </option>
                            <option value="America/St_Vincent">
                              America/St_Vincent
                            </option>
                            <option value="America/Swift_Current">
                              America/Swift_Current
                            </option>
                            <option value="America/Tegucigalpa">
                              America/Tegucigalpa
                            </option>
                            <option value="America/Thule">America/Thule</option>
                            <option value="America/Thunder_Bay">
                              America/Thunder_Bay
                            </option>
                            <option value="America/Tijuana">
                              America/Tijuana
                            </option>
                            <option value="America/Toronto">
                              America/Toronto
                            </option>
                            <option value="America/Tortola">
                              America/Tortola
                            </option>
                            <option value="America/Vancouver">
                              America/Vancouver
                            </option>
                            <option value="America/Whitehorse">
                              America/Whitehorse
                            </option>
                            <option value="America/Winnipeg">
                              America/Winnipeg
                            </option>
                            <option value="America/Yakutat">
                              America/Yakutat
                            </option>
                            <option value="America/Yellowknife">
                              America/Yellowknife
                            </option>
                            <option value="Antarctica/Casey">
                              Antarctica/Casey
                            </option>
                            <option value="Antarctica/Davis">
                              Antarctica/Davis
                            </option>
                            <option value="Antarctica/DumontDUrville">
                              Antarctica/DumontDUrville
                            </option>
                            <option value="Antarctica/Macquarie">
                              Antarctica/Macquarie
                            </option>
                            <option value="Antarctica/Mawson">
                              Antarctica/Mawson
                            </option>
                            <option value="Antarctica/McMurdo">
                              Antarctica/McMurdo
                            </option>
                            <option value="Antarctica/Palmer">
                              Antarctica/Palmer
                            </option>
                            <option value="Antarctica/Rothera">
                              Antarctica/Rothera
                            </option>
                            <option value="Antarctica/Syowa">
                              Antarctica/Syowa
                            </option>
                            <option value="Antarctica/Troll">
                              Antarctica/Troll
                            </option>
                            <option value="Antarctica/Vostok">
                              Antarctica/Vostok
                            </option>
                            <option value="Arctic/Longyearbyen">
                              Arctic/Longyearbyen
                            </option>
                            <option value="Asia/Aden">Asia/Aden</option>
                            <option value="Asia/Almaty">Asia/Almaty</option>
                            <option value="Asia/Amman">Asia/Amman</option>
                            <option value="Asia/Anadyr">Asia/Anadyr</option>
                            <option value="Asia/Aqtau">Asia/Aqtau</option>
                            <option value="Asia/Aqtobe">Asia/Aqtobe</option>
                            <option value="Asia/Ashgabat">Asia/Ashgabat</option>
                            <option value="Asia/Baghdad">Asia/Baghdad</option>
                            <option value="Asia/Bahrain">Asia/Bahrain</option>
                            <option value="Asia/Baku">Asia/Baku</option>
                            <option value="Asia/Bangkok">Asia/Bangkok</option>
                            <option value="Asia/Beirut">Asia/Beirut</option>
                            <option value="Asia/Bishkek">Asia/Bishkek</option>
                            <option value="Asia/Brunei">Asia/Brunei</option>
                            <option value="Asia/Choibalsan">
                              Asia/Choibalsan
                            </option>
                            <option value="Asia/Chongqing">
                              Asia/Chongqing
                            </option>
                            <option value="Asia/Colombo">Asia/Colombo</option>
                            <option value="Asia/Damascus">Asia/Damascus</option>
                            <option value="Asia/Dhaka">Asia/Dhaka</option>
                            <option value="Asia/Dili">Asia/Dili</option>
                            <option value="Asia/Dubai">Asia/Dubai</option>
                            <option value="Asia/Dushanbe">Asia/Dushanbe</option>
                            <option value="Asia/Gaza">Asia/Gaza</option>
                            <option value="Asia/Harbin">Asia/Harbin</option>
                            <option value="Asia/Hebron">Asia/Hebron</option>
                            <option value="Asia/Ho_Chi_Minh">
                              Asia/Ho_Chi_Minh
                            </option>
                            <option value="Asia/Hong_Kong">
                              Asia/Hong_Kong
                            </option>
                            <option value="Asia/Hovd">Asia/Hovd</option>
                            <option value="Asia/Irkutsk">Asia/Irkutsk</option>
                            <option value="Asia/Istanbul">Asia/Istanbul</option>
                            <option value="Asia/Jakarta">Asia/Jakarta</option>
                            <option value="Asia/Jayapura">Asia/Jayapura</option>
                            <option value="Asia/Jerusalem">
                              Asia/Jerusalem
                            </option>
                            <option value="Asia/Kabul">Asia/Kabul</option>
                            <option value="Asia/Kamchatka">
                              Asia/Kamchatka
                            </option>
                            <option value="Asia/Karachi" selected="">
                              Asia/Karachi
                            </option>
                            <option value="Asia/Kashgar">Asia/Kashgar</option>
                            <option value="Asia/Kathmandu">
                              Asia/Kathmandu
                            </option>
                            <option value="Asia/Khandyga">Asia/Khandyga</option>
                            <option value="Asia/Kolkata">Asia/Kolkata</option>
                            <option value="Asia/Krasnoyarsk">
                              Asia/Krasnoyarsk
                            </option>
                            <option value="Asia/Kuala_Lumpur">
                              Asia/Kuala_Lumpur
                            </option>
                            <option value="Asia/Kuching">Asia/Kuching</option>
                            <option value="Asia/Kuwait">Asia/Kuwait</option>
                            <option value="Asia/Macau">Asia/Macau</option>
                            <option value="Asia/Magadan">Asia/Magadan</option>
                            <option value="Asia/Makassar">Asia/Makassar</option>
                            <option value="Asia/Manila">Asia/Manila</option>
                            <option value="Asia/Muscat">Asia/Muscat</option>
                            <option value="Asia/Nicosia">Asia/Nicosia</option>
                            <option value="Asia/Novokuznetsk">
                              Asia/Novokuznetsk
                            </option>
                            <option value="Asia/Novosibirsk">
                              Asia/Novosibirsk
                            </option>
                            <option value="Asia/Omsk">Asia/Omsk</option>
                            <option value="Asia/Oral">Asia/Oral</option>
                            <option value="Asia/Phnom_Penh">
                              Asia/Phnom_Penh
                            </option>
                            <option value="Asia/Pontianak">
                              Asia/Pontianak
                            </option>
                            <option value="Asia/Pyongyang">
                              Asia/Pyongyang
                            </option>
                            <option value="Asia/Qatar">Asia/Qatar</option>
                            <option value="Asia/Qyzylorda">
                              Asia/Qyzylorda
                            </option>
                            <option value="Asia/Rangoon">Asia/Rangoon</option>
                            <option value="Asia/Riyadh">Asia/Riyadh</option>
                            <option value="Asia/Sakhalin">Asia/Sakhalin</option>
                            <option value="Asia/Samarkand">
                              Asia/Samarkand
                            </option>
                            <option value="Asia/Seoul">Asia/Seoul</option>
                            <option value="Asia/Shanghai">Asia/Shanghai</option>
                            <option value="Asia/Singapore">
                              Asia/Singapore
                            </option>
                            <option value="Asia/Taipei">Asia/Taipei</option>
                            <option value="Asia/Tashkent">Asia/Tashkent</option>
                            <option value="Asia/Tbilisi">Asia/Tbilisi</option>
                            <option value="Asia/Tehran">Asia/Tehran</option>
                            <option value="Asia/Thimphu">Asia/Thimphu</option>
                            <option value="Asia/Tokyo">Asia/Tokyo</option>
                            <option value="Asia/Ulaanbaatar">
                              Asia/Ulaanbaatar
                            </option>
                            <option value="Asia/Urumqi">Asia/Urumqi</option>
                            <option value="Asia/Ust-Nera">Asia/Ust-Nera</option>
                            <option value="Asia/Vientiane">
                              Asia/Vientiane
                            </option>
                            <option value="Asia/Vladivostok">
                              Asia/Vladivostok
                            </option>
                            <option value="Asia/Yakutsk">Asia/Yakutsk</option>
                            <option value="Asia/Yekaterinburg">
                              Asia/Yekaterinburg
                            </option>
                            <option value="Asia/Yerevan">Asia/Yerevan</option>
                            <option value="Atlantic/Azores">
                              Atlantic/Azores
                            </option>
                            <option value="Atlantic/Bermuda">
                              Atlantic/Bermuda
                            </option>
                            <option value="Atlantic/Canary">
                              Atlantic/Canary
                            </option>
                            <option value="Atlantic/Cape_Verde">
                              Atlantic/Cape_Verde
                            </option>
                            <option value="Atlantic/Faroe">
                              Atlantic/Faroe
                            </option>
                            <option value="Atlantic/Madeira">
                              Atlantic/Madeira
                            </option>
                            <option value="Atlantic/Reykjavik">
                              Atlantic/Reykjavik
                            </option>
                            <option value="Atlantic/South_Georgia">
                              Atlantic/South_Georgia
                            </option>
                            <option value="Atlantic/St_Helena">
                              Atlantic/St_Helena
                            </option>
                            <option value="Atlantic/Stanley">
                              Atlantic/Stanley
                            </option>
                            <option value="Australia/Adelaide">
                              Australia/Adelaide
                            </option>
                            <option value="Australia/Brisbane">
                              Australia/Brisbane
                            </option>
                            <option value="Australia/Broken_Hill">
                              Australia/Broken_Hill
                            </option>
                            <option value="Australia/Currie">
                              Australia/Currie
                            </option>
                            <option value="Australia/Darwin">
                              Australia/Darwin
                            </option>
                            <option value="Australia/Eucla">
                              Australia/Eucla
                            </option>
                            <option value="Australia/Hobart">
                              Australia/Hobart
                            </option>
                            <option value="Australia/Lindeman">
                              Australia/Lindeman
                            </option>
                            <option value="Australia/Lord_Howe">
                              Australia/Lord_Howe
                            </option>
                            <option value="Australia/Melbourne">
                              Australia/Melbourne
                            </option>
                            <option value="Australia/Perth">
                              Australia/Perth
                            </option>
                            <option value="Australia/Sydney">
                              Australia/Sydney
                            </option>
                            <option value="Etc/GMT">Etc/GMT</option>
                            <option value="Etc/GMT+0">Etc/GMT+0</option>
                            <option value="Etc/UCT">Etc/UCT</option>
                            <option value="Etc/Universal">Etc/Universal</option>
                            <option value="Etc/UTC">Etc/UTC</option>
                            <option value="Etc/Zulu">Etc/Zulu</option>
                            <option value="Europe/Amsterdam">
                              Europe/Amsterdam
                            </option>
                            <option value="Europe/Andorra">
                              Europe/Andorra
                            </option>
                            <option value="Europe/Athens">Europe/Athens</option>
                            <option value="Europe/Belgrade">
                              Europe/Belgrade
                            </option>
                            <option value="Europe/Berlin">Europe/Berlin</option>
                            <option value="Europe/Bratislava">
                              Europe/Bratislava
                            </option>
                            <option value="Europe/Brussels">
                              Europe/Brussels
                            </option>
                            <option value="Europe/Bucharest">
                              Europe/Bucharest
                            </option>
                            <option value="Europe/Budapest">
                              Europe/Budapest
                            </option>
                            <option value="Europe/Busingen">
                              Europe/Busingen
                            </option>
                            <option value="Europe/Chisinau">
                              Europe/Chisinau
                            </option>
                            <option value="Europe/Copenhagen">
                              Europe/Copenhagen
                            </option>
                            <option value="Europe/Dublin">Europe/Dublin</option>
                            <option value="Europe/Gibraltar">
                              Europe/Gibraltar
                            </option>
                            <option value="Europe/Guernsey">
                              Europe/Guernsey
                            </option>
                            <option value="Europe/Helsinki">
                              Europe/Helsinki
                            </option>
                            <option value="Europe/Isle_of_Man">
                              Europe/Isle_of_Man
                            </option>
                            <option value="Europe/Istanbul">
                              Europe/Istanbul
                            </option>
                            <option value="Europe/Jersey">Europe/Jersey</option>
                            <option value="Europe/Kaliningrad">
                              Europe/Kaliningrad
                            </option>
                            <option value="Europe/Kiev">Europe/Kiev</option>
                            <option value="Europe/Lisbon">Europe/Lisbon</option>
                            <option value="Europe/Ljubljana">
                              Europe/Ljubljana
                            </option>
                            <option value="Europe/London">Europe/London</option>
                            <option value="Europe/Luxembourg">
                              Europe/Luxembourg
                            </option>
                            <option value="Europe/Madrid">Europe/Madrid</option>
                            <option value="Europe/Malta">Europe/Malta</option>
                            <option value="Europe/Mariehamn">
                              Europe/Mariehamn
                            </option>
                            <option value="Europe/Minsk">Europe/Minsk</option>
                            <option value="Europe/Monaco">Europe/Monaco</option>
                            <option value="Europe/Moscow">Europe/Moscow</option>
                            <option value="Europe/Nicosia">
                              Europe/Nicosia
                            </option>
                            <option value="Europe/Oslo">Europe/Oslo</option>
                            <option value="Europe/Paris">Europe/Paris</option>
                            <option value="Europe/Podgorica">
                              Europe/Podgorica
                            </option>
                            <option value="Europe/Prague">Europe/Prague</option>
                            <option value="Europe/Riga">Europe/Riga</option>
                            <option value="Europe/Rome">Europe/Rome</option>
                            <option value="Europe/Samara">Europe/Samara</option>
                            <option value="Europe/San_Marino">
                              Europe/San_Marino
                            </option>
                            <option value="Europe/Sarajevo">
                              Europe/Sarajevo
                            </option>
                            <option value="Europe/Simferopol">
                              Europe/Simferopol
                            </option>
                            <option value="Europe/Skopje">Europe/Skopje</option>
                            <option value="Europe/Sofia">Europe/Sofia</option>
                            <option value="Europe/Stockholm">
                              Europe/Stockholm
                            </option>
                            <option value="Europe/Tallinn">
                              Europe/Tallinn
                            </option>
                            <option value="Europe/Tirane">Europe/Tirane</option>
                            <option value="Europe/Uzhgorod">
                              Europe/Uzhgorod
                            </option>
                            <option value="Europe/Vaduz">Europe/Vaduz</option>
                            <option value="Europe/Vatican">
                              Europe/Vatican
                            </option>
                            <option value="Europe/Vienna">Europe/Vienna</option>
                            <option value="Europe/Vilnius">
                              Europe/Vilnius
                            </option>
                            <option value="Europe/Volgograd">
                              Europe/Volgograd
                            </option>
                            <option value="Europe/Warsaw">Europe/Warsaw</option>
                            <option value="Europe/Zagreb">Europe/Zagreb</option>
                            <option value="Europe/Zaporozhye">
                              Europe/Zaporozhye
                            </option>
                            <option value="Europe/Zurich">Europe/Zurich</option>
                            <option value="GMT">GMT</option>
                            <option value="Indian/Antananarivo">
                              Indian/Antananarivo
                            </option>
                            <option value="Indian/Chagos">Indian/Chagos</option>
                            <option value="Indian/Christmas">
                              Indian/Christmas
                            </option>
                            <option value="Indian/Cocos">Indian/Cocos</option>
                            <option value="Indian/Comoro">Indian/Comoro</option>
                            <option value="Indian/Kerguelen">
                              Indian/Kerguelen
                            </option>
                            <option value="Indian/Mahe">Indian/Mahe</option>
                            <option value="Indian/Maldives">
                              Indian/Maldives
                            </option>
                            <option value="Indian/Mauritius">
                              Indian/Mauritius
                            </option>
                            <option value="Indian/Mayotte">
                              Indian/Mayotte
                            </option>
                            <option value="Indian/Reunion">
                              Indian/Reunion
                            </option>
                            <option value="Pacific/Apia">Pacific/Apia</option>
                            <option value="Pacific/Auckland">
                              Pacific/Auckland
                            </option>
                            <option value="Pacific/Chatham">
                              Pacific/Chatham
                            </option>
                            <option value="Pacific/Chuuk">Pacific/Chuuk</option>
                            <option value="Pacific/Easter">
                              Pacific/Easter
                            </option>
                            <option value="Pacific/Efate">Pacific/Efate</option>
                            <option value="Pacific/Enderbury">
                              Pacific/Enderbury
                            </option>
                            <option value="Pacific/Fakaofo">
                              Pacific/Fakaofo
                            </option>
                            <option value="Pacific/Fiji">Pacific/Fiji</option>
                            <option value="Pacific/Funafuti">
                              Pacific/Funafuti
                            </option>
                            <option value="Pacific/Galapagos">
                              Pacific/Galapagos
                            </option>
                            <option value="Pacific/Gambier">
                              Pacific/Gambier
                            </option>
                            <option value="Pacific/Guadalcanal">
                              Pacific/Guadalcanal
                            </option>
                            <option value="Pacific/Guam">Pacific/Guam</option>
                            <option value="Pacific/Honolulu">
                              Pacific/Honolulu
                            </option>
                            <option value="Pacific/Johnston">
                              Pacific/Johnston
                            </option>
                            <option value="Pacific/Kiritimati">
                              Pacific/Kiritimati
                            </option>
                            <option value="Pacific/Kosrae">
                              Pacific/Kosrae
                            </option>
                            <option value="Pacific/Kwajalein">
                              Pacific/Kwajalein
                            </option>
                            <option value="Pacific/Majuro">
                              Pacific/Majuro
                            </option>
                            <option value="Pacific/Marquesas">
                              Pacific/Marquesas
                            </option>
                            <option value="Pacific/Midway">
                              Pacific/Midway
                            </option>
                            <option value="Pacific/Nauru">Pacific/Nauru</option>
                            <option value="Pacific/Niue">Pacific/Niue</option>
                            <option value="Pacific/Norfolk">
                              Pacific/Norfolk
                            </option>
                            <option value="Pacific/Noumea">
                              Pacific/Noumea
                            </option>
                            <option value="Pacific/Pago_Pago">
                              Pacific/Pago_Pago
                            </option>
                            <option value="Pacific/Palau">Pacific/Palau</option>
                            <option value="Pacific/Pitcairn">
                              Pacific/Pitcairn
                            </option>
                            <option value="Pacific/Pohnpei">
                              Pacific/Pohnpei
                            </option>
                            <option value="Pacific/Port_Moresby">
                              Pacific/Port_Moresby
                            </option>
                            <option value="Pacific/Rarotonga">
                              Pacific/Rarotonga
                            </option>
                            <option value="Pacific/Saipan">
                              Pacific/Saipan
                            </option>
                            <option value="Pacific/Tahiti">
                              Pacific/Tahiti
                            </option>
                            <option value="Pacific/Tarawa">
                              Pacific/Tarawa
                            </option>
                            <option value="Pacific/Tongatapu">
                              Pacific/Tongatapu
                            </option>
                            <option value="Pacific/Wake">Pacific/Wake</option>
                            <option value="Pacific/Wallis">
                              Pacific/Wallis
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
