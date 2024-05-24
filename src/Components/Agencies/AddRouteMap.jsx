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

export const AddRouteMap = () => {
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
          doc(db, "Agencies_Routes_Map_data", editingStopId),
          formData
        );
        setTimeout(() => {
          toast.success("Stop updated successfully");
        }, 1000);
      } else {
        await addDoc(collection(db, "Agencies_Routes_Map_data"), formData);
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
        collection(db, "Agencies_Routes_Map_data")
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
          <div className="col-sm-6 text-start">
            <div className="dataTables_length" id="stops-grid_length">
              <label className="justify-content-start">
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
          <div className="col-sm-6 text-right">
            <div id="stops-grid_filter" className="dataTables_filter">
              <label className="justify-content-start">
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
                    Route Map
                  </th>
                  <th
                    className="sorting_disabled"
                    rowSpan={1}
                    colSpan={1}
                    style={{ width: "491.333px" }}
                    aria-label="Routes"
                  >
                    Used by these Routes
                  </th>
                  <th
                    className="sorting_disabled"
                    rowSpan={1}
                    colSpan={1}
                    style={{ width: "491.333px" }}
                    aria-label="Copy"
                  >
                    Copy
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
                    Route Map
                  </th>
                  <th rowSpan={1} colSpan={1}>
                  Used by these Routes
                  </th>
                  <th className="text-center" rowSpan={1} colSpan={1}>
                    Copy
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

    
    </>
  );
};
