import { useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
export const AddServices = () => {
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

  return (
    <>
      <div className="col-sm-12 ">
        <div>
          <div className="row d-flex align-items-center justify-content-between my-4">
            <div className="col-sm-4">
              <h3 id="span_msg_calendar">
                No Services{" "}
                <a
                  data-toggle="popover"
                  data-html="true"
                  data-trigger="click hover"
                  title=""
                  data-content="Create a schedule record for each type of service day. Here's an example:<br></a><img src='services-example.png'/>"
                  data-original-title="Quick Hint"
                >
                  <i className="fa fa-info-circle" />
                </a>
              </h3>
            </div>
            <div className="col-sm-3">
              <div style={{ marginTop: 20, marginBottom: 10 }}>
                <div
                  id="spshowservice"
                  className="btn-group"
                  style={{ display: "none" }}
                >
                  <button
                    id="butsss2"
                    type="button"
                    className="btn btn-default"
                    onclick="showservice(2);"
                  >
                    Past
                  </button>
                  <button
                    id="butsss1"
                    type="button"
                    className="btn btn-default"
                    onclick="showservice(1);"
                  >
                    Current
                  </button>
                  <button
                    id="butsss3"
                    type="button"
                    className="btn btn-default"
                    onclick="showservice(3);"
                  >
                    Future
                  </button>
                </div>
              </div>
            </div>
            <div className="col-sm-5 text-end">
              <h3 className="optional">
              <Link
                    onClick={handleShow}
                  className="btn btn-outline-primary px-2 py-2 text-dark"
                >
                  <i className="fa fa-plus"></i> add service
                </Link>
                <Link
                  id="deleteservicebtn"
                  className="btn btn-outline-primary px-2 py-2 text-dark ms-2"
                  onclick="delete_selected_service();"
                >
                  <i className="fa fa-trash"></i> Delete Service
                </Link>
              </h3>
            </div>
          </div>
          <div className="row table">
          <table
             id="stops-grid"
             className="table table-striped table-bordered dataTable"
             cellSpacing={0}
             style={{ width: "100%" }}
             role="grid"
             aria-describedby="stops-grid_info"
          >
            <thead className="w-100">
              <tr>
                <th style={{ borderLeft: "none !important" }}></th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thu</th>
                <th>Fri</th>
                <th>Sat</th>
                <th>Sun</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody id="calendar_tbody">
            <tr>
                <td style={{ borderRight: "none !important" }}>
                  {/* input type="checkbox" id="select_all_services" onclick="remove_service('select_all_services');" / */}
                </td>
                <td>Mon</td>
                <td>Tue</td>
                <td>Wed</td>
                <td>Thu</td>
                <td>Fri</td>
                <td>Sat</td>
                <td>Sun</td>
                <td>Edit</td>
              </tr>
            </tbody>
          </table>
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
              <h3>Add Services</h3>
            </b>
          </Modal.Title>
        </Modal.Header>
        <form id="add_calendar_form" name="add_calendar_form" method="POST">
  <div className="row">
    <div className="col-sm-12 fare_rule">
      <div className="form-group col-md-8">
        <label htmlFor="service_id">
          Service Name <span className="requ-lft">Required</span>
        </label>
        <input
          type="text"
          placeholder='For example: "Weekday", "Sat", "Special"'
          id="service_name"
          name="service_name"
          className="form-control"
          defaultValue=""
        />
      </div>
      <div className="form-group col-md-4" style={{ display: "none" }}>
        <label htmlFor="service_id">
          Service Id<span className="requ-lft">Required</span>
        </label>
        <input
          type="text"
          onchange="show_service_alert();"
          placeholder="Service Id"
          id="service_id"
          name="service_id"
          className="form-control"
          defaultValue=""
        />
      </div>
      <div className="form-group col-md-12">
        <label>
          Service Availability <span className="requ-lft">Required</span>
        </label>
        <table
          className="table table-bordered week-table custom_checkbox"
          style={{ marginBottom: 0 }}
        >
          <thead>
            <tr>
              <th>Mon</th>
              <th>Tue</th>
              <th>Wed</th>
              <th>Thu</th>
              <th>Fri</th>
              <th>Sat</th>
              <th>Sun</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ width: "14%" }}>
                <input type="checkbox" id="monday" name="monday" />
                <input
                  type="hidden"
                  id="amonday"
                  name="amonday"
                  defaultValue={0}
                />
                <label htmlFor="monday" style={{ cursor: "default" }}>
                  <span
                    style={{
                      cursor: "default",
                      width: "100%",
                      textAlign: "center",
                      margin: "4px 0px 0px 0px"
                    }}
                  >
                    <i
                      style={{ cursor: "pointer" }}
                      className="fa fa-times change_class_icon grey_color"
                    />
                  </span>
                </label>
              </td>
              <td style={{ width: "14%" }}>
                <input type="checkbox" id="tuesday" name="tuesday" />
                <input
                  type="hidden"
                  id="atuesday"
                  name="atuesday"
                  defaultValue={0}
                />
                <label htmlFor="tuesday">
                  <span
                    style={{
                      cursor: "default",
                      width: "100%",
                      textAlign: "center",
                      margin: "4px 0px 0px 0px"
                    }}
                  >
                    <i
                      style={{ cursor: "pointer" }}
                      className="fa fa-times change_class_icon grey_color"
                    />
                  </span>
                </label>
              </td>
              <td style={{ width: "14%" }}>
                <input type="checkbox" id="wednesday" name="wednesday" />
                <input
                  type="hidden"
                  id="awednesday"
                  name="awednesday"
                  defaultValue={0}
                />
                <label htmlFor="wednesday">
                  <span
                    style={{
                      cursor: "default",
                      width: "100%",
                      textAlign: "center",
                      margin: "4px 0px 0px 0px"
                    }}
                  >
                    <i
                      style={{ cursor: "pointer" }}
                      className="fa fa-times change_class_icon grey_color"
                    />
                  </span>
                </label>
              </td>
              <td style={{ width: "14%" }}>
                <input type="checkbox" id="thursday" name="thursday" />
                <input
                  type="hidden"
                  id="athursday"
                  name="athursday"
                  defaultValue={0}
                />
                <label htmlFor="thursday">
                  <span
                    style={{
                      cursor: "default",
                      width: "100%",
                      textAlign: "center",
                      margin: "4px 0px 0px 0px"
                    }}
                  >
                    <i
                      style={{ cursor: "pointer" }}
                      className="fa fa-times change_class_icon grey_color"
                    />
                  </span>
                </label>
                <input
                  type="hidden"
                  id="hdn_service_id"
                  name="hdn_service_id"
                  className="form-control"
                  defaultValue=""
                />
                <input
                  type="hidden"
                  id="hdn_file_id"
                  name="hdn_file_id"
                  className="form-control"
                  defaultValue={98477}
                />
                <input
                  type="hidden"
                  id="hdn_tble_id"
                  name="hdn_tble_id"
                  className="form-control"
                  defaultValue=""
                />
              </td>
              <td style={{ width: "14%" }}>
                <input type="checkbox" id="friday" name="friday" />
                <input
                  type="hidden"
                  id="afriday"
                  name="afriday"
                  defaultValue={0}
                />
                <label htmlFor="friday">
                  <span
                    style={{
                      cursor: "default",
                      width: "100%",
                      textAlign: "center",
                      margin: "4px 0px 0px 0px"
                    }}
                  >
                    <i
                      style={{ cursor: "pointer" }}
                      className="fa fa-times change_class_icon grey_color"
                    />
                  </span>
                </label>
              </td>
              <td style={{ width: "14%" }}>
                <input type="checkbox" id="saturday" name="saturday" />
                <input
                  type="hidden"
                  id="asaturday"
                  name="asaturday"
                  defaultValue={0}
                />
                <label htmlFor="saturday">
                  <span
                    style={{
                      cursor: "default",
                      width: "100%",
                      textAlign: "center",
                      margin: "4px 0px 0px 0px"
                    }}
                  >
                    <i
                      style={{ cursor: "pointer" }}
                      className="fa fa-times change_class_icon grey_color"
                    />
                  </span>
                </label>
              </td>
              <td style={{ width: "14%" }}>
                <input type="checkbox" id="sunday" name="sunday" />
                <input
                  type="hidden"
                  id="asunday"
                  name="asunday"
                  defaultValue={0}
                />
                <label htmlFor="sunday">
                  <span
                    style={{
                      cursor: "default",
                      width: "100%",
                      textAlign: "center",
                      margin: "4px 0px 0px 0px"
                    }}
                  >
                    <i
                      style={{ cursor: "pointer" }}
                      className="fa fa-times change_class_icon grey_color"
                    />
                  </span>
                </label>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="form-group col-md-6">
        <label htmlFor="start_date">
          Start Date<span className="requ-lft">Required</span>
        </label>
        <div className="input-group">
          <input
            type="text"
            placeholder=""
            id="start_date"
            name="start_date"
            className="form-control"
            defaultValue="18 May 2024"
          />{" "}
          <span className="input-group-btn color_btn">
            {" "}
            <label htmlFor="start_date">
              <i className="fa fa-calendar" />{" "}
            </label>{" "}
          </span>
        </div>
        {/* /input-group */}
      </div>
      <div className="form-group col-md-6">
        <label htmlFor="end_date">
          End Date<span className="requ-lft">Required</span>
        </label>
        <div className="input-group">
          <input
            type="text"
            placeholder=""
            id="end_date"
            name="end_date"
            className="form-control"
            defaultValue="18 May 2025"
          />{" "}
          <span className="input-group-btn color_btn">
            {" "}
            <label htmlFor="end_date">
              <i className="fa fa-calendar" />{" "}
            </label>{" "}
          </span>
        </div>
        {/* /input-group */}
      </div>
      <div className="form-group col-md-12">
        <label>Availability Exceptions</label>
        <div className="form-group">
          <div className="cont_select">
            <div
              id="add_input_fields_wrap"
              className="custom_search_parent input_fields_wrap userType"
            >
              <div className="exception_run row">
                <div className="col-sm-5">
                  <div className="input-group">
                    <input
                      type="text"
                      className="excp_input form-control"
                      title="DATE"
                      id="add_datepick_I2"
                      name="service_exce_date[]"
                      placeholder="Select Date"
                    />
                    <span className="input-group-btn color_btn">
                      <label htmlFor="add_datepick_I2">
                        <i className="fa fa-calendar" />
                      </label>
                    </span>
                  </div>
                </div>
                <div className="col-sm-5">
                  <div className="custom_search_parent">
                    <select
                      className="excep_drop custom_search"
                      name="service_exce_unavailable[]"
                    >
                      <option value={1}>Service Available</option>
                      <option value={2}>Service Unavailable</option>
                    </select>
                    <span className="cont_arrow" />
                  </div>
                </div>
                <div className="col-sm-1">
                  <a href="#" className="remove_field col-sm-1">
                    <i className="fa fa-trash" />
                  </a>
                </div>
              </div>
              <div className="exception_run row">
                <div className="col-sm-5">
                  <div className="input-group">
                    <input
                      type="text"
                      className="excp_input form-control"
                      title="DATE"
                      id="add_datepick_I3"
                      name="service_exce_date[]"
                      placeholder="Select Date"
                    />
                    <span className="input-group-btn color_btn">
                      <label htmlFor="add_datepick_I3">
                        <i className="fa fa-calendar" />
                      </label>
                    </span>
                  </div>
                </div>
                <div className="col-sm-5">
                  <div className="custom_search_parent">
                    <select
                      className="excep_drop custom_search"
                      name="service_exce_unavailable[]"
                    >
                      <option value={1}>Service Available</option>
                      <option value={2}>Service Unavailable</option>
                    </select>
                    <span className="cont_arrow" />
                  </div>
                </div>
                <div className="col-sm-1">
                  <a href="#" className="remove_field col-sm-1">
                    <i className="fa fa-trash" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <button className="add_field_button btn btn-default col-sm-12">
            <i className="fa fa-warning"> </i>&nbsp; Add Exceptions
          </button>
        </div>
      </div>
    </div>
  </div>
</form>

      </Modal>
    </>
  );
};
