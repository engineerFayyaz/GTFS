import React, { useState } from "react";
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
import Header from "../../Components/Header";
import "./agencies.css";
export const Agnecies = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [key, setKey] = useState("home");
  function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
      console.log("totally custom!")
    );

    return (
      <a className=" border-0 " onClick={decoratedOnClick}>
        {children}
      </a>
    );
  }
  return (
    <>
      <Header />
      <div className="container  demo-1 mt-5">
        <Breadcrumb>
          <Breadcrumb.Item href="#">Transit Companies </Breadcrumb.Item>
          <Breadcrumb.Item active>Software Company</Breadcrumb.Item>
        </Breadcrumb>
        <div className="row">
          <div className="col-sm-8 d-flex flex-wrap">
            <h1 className="heading agency_head">Software Company</h1>
            <div className="edit_btn" style={{ margin: "23px 23px 0px 15px" }}>
              <a href="#" onclick="load_data_Agency('13925')">
                <i className="fa fa-edit">&nbsp;</i>Edit Company
              </a>
            </div>
          </div>
          <div className="col-sm-4 float-end text-end">
            <a href="#" className="btn btn-outline-dark rounded-2 px-2 py-2">
              <i className="fa fa-download">&nbsp;</i>Export GTFS
            </a>
            <a
              href="#"
              className="btn btn-outline-dark rounded-2 px-2 py-2"
              style={{ marginLeft: 5 }}
            >
              <i id="gtfs_help_btn_icon" className="fa fa-comment">
                &nbsp;
              </i>
              Need Help?
            </a>
          </div>
        </div>
        <div className="row">
          <div
            className="col-sm-9 bordr_right detail_user"
            style={{ borderRight: "0px none" }}
          >
            <span />
            <a href="https://codes-inc.com/" target="_blank">
              https://codes-inc.com/
            </a>
          </div>
          <div className="col-sm-3 text-end">
            <span>Asia/Karachi</span>
            <span />
          </div>
        </div>
      </div>
      <div className="container all_tabs mt-4">
        <div className="row">
          <Tabs
            id="controlled-tab-example"
            defaultActiveKey="routes"
            onSelect={(k) => setKey(k)}
            className="mb-3"
          >
            <Tab eventKey="routes" title="Routes">
              <div className="row">
                <div className="col-sm-4">
                  <a
                    className="btn  btn-outline-dark rounded-3 px-2 py-2"
                    href="#"
                    onClick={handleShow}
                  >
                    <i className="fa fa-plus" />
                    Add route
                  </a>
                  {/* a class="btn btn-default border-0" onclick="add_stop_modal();" href="#" data-target="#stop_modal" data-toggle="modal" data-backdrop="static">
									<i class="fa fa-map-marker">&nbsp;</i>
									Add stop
								</a */}
                </div>
                {/* div class="col-sm-4 pull-right btn_right">
								<a class="btn btn-default border-0 pull-right" href="#">
									<i class="fa fa-trash">&nbsp;</i>
									delete
								</a */}
                {/* a class="select_all" href="#">									
									Select all
								</a !*/}
                {/* /div */}
              </div>
              <div
                className="row mt-4"
                style={{ border: "1px solid #d4d6d7", borderRadius: "10px" }}
              >
                <div className="col-sm-8">
                  <Accordion className="accordian_agency" defaultActiveKey="0">
                    <Card className="border-0 card_agency">
                      <Card.Header className="d-flex align-items-center gap-4 border-0">
                        <div className="col-sm-6 d-flex align-items-center gap-3">
                          <CustomToggle eventKey="0" className="border-0">
                            <i
                              className="fa fa-border fa-caret-down card_agency_accordian_icon"
                              eventKey="0"
                            />{" "}
                          </CustomToggle>
                          <h2>Station Via Bus</h2>
                        </div>

                        <div className="col-sm-6 text-end card_agency_icon">
                          <i
                            className="fa fa-edit"
                            style={{ cursor: "pointer" }}
                            title="Edit Route Name & Description"
                          />
                          <i
                            className="fa fa-trash ml-3"
                            style={{ cursor: "pointer" }}
                            title="Delete Route Name & Description"
                          />
                        </div>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0" className="px-5">
                        <Card.Body>
                          <h4>Hello! I'm the body</h4>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                </div>
                <div className="col-sm-4"></div>
              </div>
            </Tab>
            <Tab eventKey="stops" title="Stops">
              Tab content for Profile
            </Tab>
            <Tab eventKey="services" title="Services">
              Tab content for Contact
            </Tab>
            <Tab eventKey="route_map" title="Route Map">
              Tab content for Route Map
            </Tab>
            <Tab eventKey="optional_data" title="Optional Data">
              Tab content for Optional Data
            </Tab>
            <Tab eventKey="warning" title="Warnings">
              Tab content for Warnings
            </Tab>
          </Tabs>
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
              <h3>Create Company</h3>
            </b>
          </Modal.Title>
        </Modal.Header>
        <form method="POST" id="add_route_form">
          <div className="modal-body">
            <div className="row">
              <div className="form-group col-sm-12">
                <label htmlFor="add_route_type_cat">
                  Route Type <span className="requ-lft">Required</span>
                </label>
                <select
                  className="form-control custom_srch"
                  name="route_type_cat"
                  id="add_route_type_cat"
                  required=""
                >
                  <option value="" disabled="disabled">
                    Select One
                  </option>
                  <option value="Standard_Route_Types">
                    Standard Route Types
                  </option>
                  <optgroup label="Extensions">
                    <option value="Air">Air</option>
                    <option value="Bus">Bus</option>
                    <option value="Coach">Coach</option>
                    <option value="Ferry">Ferry</option>
                    <option value="Funicular">Funicular</option>
                    <option value="Metro">Metro</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                    <option value="Railway">Railway</option>
                    <option value="Self_Drive">Self Drive</option>
                    <option value="Surburban_Railway">Surburban Railway</option>
                    <option value="Taxi">Taxi</option>
                    <option value="Telecabin">Telecabin</option>
                    <option value="Tram">Tram</option>
                    <option value="Trolleybus">Trolleybus</option>
                    <option value="Underground">Underground</option>
                    <option value="Urban_Railway">Urban Railway</option>
                    <option value="Water_Transport">Water Transport</option>
                  </optgroup>{" "}
                </select>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-sm-12">
                <label htmlFor="add_route_type">
                  Route Sub Type/Extension{" "}
                  <span className="requ-lft">Required</span>
                </label>
                <select
                  className="form-control custom_srch"
                  name="route_type"
                  id="add_route_type"
                  required=""
                >
                  <option
                    id="add_route_type_one"
                    value=""
                    disabled="disabled"
                    style={{ display: "none" }}
                  >
                    Select One
                  </option>
                  <option
                    value={3}
                    data_cat="S"
                    data-route-group="Standard_Route_Types"
                  >
                    Bus
                  </option>
                  <option
                    value={5}
                    data_cat="S"
                    data-route-group="Standard_Route_Types"
                  >
                    Cable Car
                  </option>
                  <option
                    value={4}
                    data_cat="S"
                    data-route-group="Standard_Route_Types"
                  >
                    Ferry
                  </option>
                  <option
                    value={7}
                    data_cat="S"
                    data-route-group="Standard_Route_Types"
                  >
                    Funicular
                  </option>
                  <option
                    value={6}
                    data_cat="S"
                    data-route-group="Standard_Route_Types"
                  >
                    Gondola
                  </option>
                  <option
                    value={12}
                    data_cat="S"
                    data-route-group="Standard_Route_Types"
                  >
                    Monorail
                  </option>
                  <option
                    value={2}
                    data_cat="S"
                    data-route-group="Standard_Route_Types"
                  >
                    Rail
                  </option>
                  <option
                    value={1}
                    data_cat="S"
                    data-route-group="Standard_Route_Types"
                  >
                    Subway, Metro
                  </option>
                  <option
                    value={11}
                    data_cat="S"
                    data-route-group="Standard_Route_Types"
                  >
                    Trolleybus
                  </option>
                  <optgroup
                    id="add_opt_cat_G"
                    label="Google Supported Extension"
                    style={{ display: "none" }}
                  >
                    <option
                      value={700}
                      data_cat="G"
                      data-route-group="Bus"
                      style={{ display: "none" }}
                    >
                      Bus Service
                    </option>
                    <option
                      value={715}
                      data_cat="G"
                      data-route-group="Bus"
                      style={{ display: "none" }}
                    >
                      Demand and Response
                    </option>
                    <option
                      value={702}
                      data_cat="G"
                      data-route-group="Bus"
                      style={{ display: "none" }}
                    >
                      Express
                    </option>
                    <option
                      value={704}
                      data_cat="G"
                      data-route-group="Bus"
                      style={{ display: "none" }}
                    >
                      Local
                    </option>
                    <option
                      value={701}
                      data_cat="G"
                      data-route-group="Bus"
                      style={{ display: "none" }}
                    >
                      Regional
                    </option>
                    <option
                      value={717}
                      data_cat="G"
                      data-route-group="Bus"
                      style={{ display: "none" }}
                    >
                      Share Taxi Service
                    </option>
                    <option
                      value={200}
                      data_cat="G"
                      data-route-group="Coach"
                      style={{ display: "none" }}
                    >
                      Coach Service
                    </option>
                    <option
                      value={208}
                      data_cat="G"
                      data-route-group="Coach"
                      style={{ display: "none" }}
                    >
                      Commuter
                    </option>
                    <option
                      value={201}
                      data_cat="G"
                      data-route-group="Coach"
                      style={{ display: "none" }}
                    >
                      International
                    </option>
                    <option
                      value={202}
                      data_cat="G"
                      data-route-group="Coach"
                      style={{ display: "none" }}
                    >
                      National
                    </option>
                    <option
                      value={204}
                      data_cat="G"
                      data-route-group="Coach"
                      style={{ display: "none" }}
                    >
                      Regional
                    </option>
                    <option
                      value={1200}
                      data_cat="G"
                      data-route-group="Ferry"
                      style={{ display: "none" }}
                    >
                      Ferry Service
                    </option>
                    <option
                      value={1400}
                      data_cat="G"
                      data-route-group="Funicular"
                      style={{ display: "none" }}
                    >
                      Funicular Service
                    </option>
                    <option
                      value={1701}
                      data_cat="G"
                      data-route-group="Miscellaneous"
                      style={{ display: "none" }}
                    >
                      Cable Car
                    </option>
                    <option
                      value={1702}
                      data_cat="G"
                      data-route-group="Miscellaneous"
                      style={{ display: "none" }}
                    >
                      Horse Drawn Carriage
                    </option>
                    <option
                      value={1700}
                      data_cat="G"
                      data-route-group="Miscellaneous"
                      style={{ display: "none" }}
                    >
                      Miscellaneous Service
                    </option>
                    <option
                      value={101}
                      data_cat="G"
                      data-route-group="Railway"
                      style={{ display: "none" }}
                    >
                      High Speed
                    </option>
                    <option
                      value={103}
                      data_cat="G"
                      data-route-group="Railway"
                      style={{ display: "none" }}
                    >
                      Inter Regional
                    </option>
                    <option
                      value={102}
                      data_cat="G"
                      data-route-group="Railway"
                      style={{ display: "none" }}
                    >
                      Long Distance
                    </option>
                    <option
                      value={108}
                      data_cat="G"
                      data-route-group="Railway"
                      style={{ display: "none" }}
                    >
                      Rail Shuttle (Within Complex)
                    </option>
                    <option
                      value={100}
                      data_cat="G"
                      data-route-group="Railway"
                      style={{ display: "none" }}
                    >
                      Railway
                    </option>
                    <option
                      value={106}
                      data_cat="G"
                      data-route-group="Railway"
                      style={{ display: "none" }}
                    >
                      Regional
                    </option>
                    <option
                      value={105}
                      data_cat="G"
                      data-route-group="Railway"
                      style={{ display: "none" }}
                    >
                      Sleeper
                    </option>
                    <option
                      value={109}
                      data_cat="G"
                      data-route-group="Railway"
                      style={{ display: "none" }}
                    >
                      Suburban
                    </option>
                    <option
                      value={107}
                      data_cat="G"
                      data-route-group="Railway"
                      style={{ display: "none" }}
                    >
                      Tourist
                    </option>
                    <option
                      value={1501}
                      data_cat="G"
                      data-route-group="Taxi"
                      style={{ display: "none" }}
                    >
                      Communal
                    </option>
                    <option
                      value={1500}
                      data_cat="G"
                      data-route-group="Taxi"
                      style={{ display: "none" }}
                    >
                      Taxi
                    </option>
                    <option
                      value={1300}
                      data_cat="G"
                      data-route-group="Telecabin"
                      style={{ display: "none" }}
                    >
                      Aerial Lift Service
                    </option>
                    <option
                      value={907}
                      data_cat="G"
                      data-route-group="Tram"
                      style={{ display: "none" }}
                    >
                      Cable Tram
                    </option>
                    <option
                      value={900}
                      data_cat="G"
                      data-route-group="Tram"
                      style={{ display: "none" }}
                    >
                      Tram Service
                    </option>
                    <option
                      value={800}
                      data_cat="G"
                      data-route-group="Trolleybus"
                      style={{ display: "none" }}
                    >
                      Trolleybus Service
                    </option>
                    <option
                      value={401}
                      data_cat="G"
                      data-route-group="Urban_Railway"
                      style={{ display: "none" }}
                    >
                      Metro
                    </option>
                    <option
                      value={405}
                      data_cat="G"
                      data-route-group="Urban_Railway"
                      style={{ display: "none" }}
                    >
                      Monorail
                    </option>
                    <option
                      value={402}
                      data_cat="G"
                      data-route-group="Urban_Railway"
                      style={{ display: "none" }}
                    >
                      Underground
                    </option>
                    <option
                      value={403}
                      data_cat="G"
                      data-route-group="Urban_Railway"
                      style={{ display: "none" }}
                    >
                      Urban (Limited)
                    </option>
                    <option
                      value={400}
                      data_cat="G"
                      data-route-group="Urban_Railway"
                      style={{ display: "none" }}
                    >
                      Urban Railway Service
                    </option>
                    <option
                      value={1000}
                      data_cat="G"
                      data-route-group="Water_Transport"
                      style={{ display: "none" }}
                    >
                      Water Transport
                    </option>
                  </optgroup>
                  <optgroup
                    id="add_opt_cat_F"
                    label="Future Extension"
                    style={{ display: "none" }}
                  >
                    <option
                      value={1100}
                      data_cat="F"
                      data-route-group="Air"
                      style={{ display: "none" }}
                    >
                      Air Service
                    </option>
                    <option
                      value={1113}
                      data_cat="F"
                      data-route-group="Air"
                      style={{ display: "none" }}
                    >
                      Airship
                    </option>
                    <option
                      value={1114}
                      data_cat="F"
                      data-route-group="Air"
                      style={{ display: "none" }}
                    >
                      All Air Services
                    </option>
                    <option
                      value={1102}
                      data_cat="F"
                      data-route-group="Air"
                      style={{ display: "none" }}
                    >
                      Domestic
                    </option>
                    <option
                      value={1111}
                      data_cat="F"
                      data-route-group="Air"
                      style={{ display: "none" }}
                    >
                      Domestic Charter
                    </option>
                    <option
                      value={1104}
                      data_cat="F"
                      data-route-group="Air"
                      style={{ display: "none" }}
                    >
                      Domestic Scheduled
                    </option>
                    <option
                      value={1110}
                      data_cat="F"
                      data-route-group="Air"
                      style={{ display: "none" }}
                    >
                      Helicopter
                    </option>
                    <option
                      value={1103}
                      data_cat="F"
                      data-route-group="Air"
                      style={{ display: "none" }}
                    >
                      Intercontinental
                    </option>
                    <option
                      value={1106}
                      data_cat="F"
                      data-route-group="Air"
                      style={{ display: "none" }}
                    >
                      Intercontinental Charter
                    </option>
                    <option
                      value={1101}
                      data_cat="F"
                      data-route-group="Air"
                      style={{ display: "none" }}
                    >
                      International
                    </option>
                    <option
                      value={1107}
                      data_cat="F"
                      data-route-group="Air"
                      style={{ display: "none" }}
                    >
                      International Charter
                    </option>
                    <option
                      value={1108}
                      data_cat="F"
                      data-route-group="Air"
                      style={{ display: "none" }}
                    >
                      Round-Trip Charter
                    </option>
                    <option
                      value={1112}
                      data_cat="F"
                      data-route-group="Air"
                      style={{ display: "none" }}
                    >
                      Schengen-Area
                    </option>
                    <option
                      value={1105}
                      data_cat="F"
                      data-route-group="Air"
                      style={{ display: "none" }}
                    >
                      Shuttle
                    </option>
                    <option
                      value={1109}
                      data_cat="F"
                      data-route-group="Air"
                      style={{ display: "none" }}
                    >
                      Sightseeing
                    </option>
                    <option
                      value={716}
                      data_cat="F"
                      data-route-group="Bus"
                      style={{ display: "none" }}
                    >
                      All Bus Services
                    </option>
                    <option
                      value={708}
                      data_cat="F"
                      data-route-group="Bus"
                      style={{ display: "none" }}
                    >
                      Mobility
                    </option>
                    <option
                      value={709}
                      data_cat="F"
                      data-route-group="Bus"
                      style={{ display: "none" }}
                    >
                      Mobility Bus for Registered Disabled
                    </option>
                    <option
                      value={705}
                      data_cat="F"
                      data-route-group="Bus"
                      style={{ display: "none" }}
                    >
                      Night
                    </option>
                    <option
                      value={706}
                      data_cat="F"
                      data-route-group="Bus"
                      style={{ display: "none" }}
                    >
                      Post
                    </option>
                    <option
                      value={714}
                      data_cat="F"
                      data-route-group="Bus"
                      style={{ display: "none" }}
                    >
                      Rail Replacement
                    </option>
                    <option
                      value={712}
                      data_cat="F"
                      data-route-group="Bus"
                      style={{ display: "none" }}
                    >
                      School
                    </option>
                    <option
                      value={713}
                      data_cat="F"
                      data-route-group="Bus"
                      style={{ display: "none" }}
                    >
                      School and Public Service
                    </option>
                    <option
                      value={711}
                      data_cat="F"
                      data-route-group="Bus"
                      style={{ display: "none" }}
                    >
                      Shuttle
                    </option>
                    <option
                      value={710}
                      data_cat="F"
                      data-route-group="Bus"
                      style={{ display: "none" }}
                    >
                      Sightseeing
                    </option>
                    <option
                      value={707}
                      data_cat="F"
                      data-route-group="Bus"
                      style={{ display: "none" }}
                    >
                      Special Needs
                    </option>
                    <option
                      value={703}
                      data_cat="F"
                      data-route-group="Bus"
                      style={{ display: "none" }}
                    >
                      Stopping
                    </option>
                    <option
                      value={209}
                      data_cat="F"
                      data-route-group="Coach"
                      style={{ display: "none" }}
                    >
                      All Coach Services
                    </option>
                    <option
                      value={203}
                      data_cat="F"
                      data-route-group="Coach"
                      style={{ display: "none" }}
                    >
                      Shuttle
                    </option>
                    <option
                      value={206}
                      data_cat="F"
                      data-route-group="Coach"
                      style={{ display: "none" }}
                    >
                      Sightseeing
                    </option>
                    <option
                      value={205}
                      data_cat="F"
                      data-route-group="Coach"
                      style={{ display: "none" }}
                    >
                      Special
                    </option>
                    <option
                      value={207}
                      data_cat="F"
                      data-route-group="Coach"
                      style={{ display: "none" }}
                    >
                      Tourist
                    </option>
                    <option
                      value={1402}
                      data_cat="F"
                      data-route-group="Funicular"
                      style={{ display: "none" }}
                    >
                      All Funicular Service
                    </option>
                    <option
                      value={1401}
                      data_cat="F"
                      data-route-group="Funicular"
                      style={{ display: "none" }}
                    >
                      Funicular Service (Limited)
                    </option>
                    <option
                      value={500}
                      data_cat="F"
                      data-route-group="Metro"
                      style={{ display: "none" }}
                    >
                      Metro Service
                    </option>
                    <option
                      value={117}
                      data_cat="F"
                      data-route-group="Railway"
                      style={{ display: "none" }}
                    >
                      Additional Rail Service
                    </option>
                    <option
                      value={113}
                      data_cat="F"
                      data-route-group="Railway"
                      style={{ display: "none" }}
                    >
                      All Rail Services
                    </option>
                    <option
                      value={104}
                      data_cat="F"
                      data-route-group="Railway"
                      style={{ display: "none" }}
                    >
                      Car Transport
                    </option>
                    <option
                      value={114}
                      data_cat="F"
                      data-route-group="Railway"
                      style={{ display: "none" }}
                    >
                      Cross Country
                    </option>
                    <option
                      value={112}
                      data_cat="F"
                      data-route-group="Railway"
                      style={{ display: "none" }}
                    >
                      Lorry Transport
                    </option>
                    <option
                      value={116}
                      data_cat="F"
                      data-route-group="Railway"
                      style={{ display: "none" }}
                    >
                      Rack and Pinion Railway
                    </option>
                    <option
                      value={110}
                      data_cat="F"
                      data-route-group="Railway"
                      style={{ display: "none" }}
                    >
                      Replacement Rail Service
                    </option>
                    <option
                      value={111}
                      data_cat="F"
                      data-route-group="Railway"
                      style={{ display: "none" }}
                    >
                      Special Rail Service
                    </option>
                    <option
                      value={115}
                      data_cat="F"
                      data-route-group="Railway"
                      style={{ display: "none" }}
                    >
                      Vehicle Transport
                    </option>
                    <option
                      value={1601}
                      data_cat="F"
                      data-route-group="Self_Drive"
                      style={{ display: "none" }}
                    >
                      Hire Car
                    </option>
                    <option
                      value={1604}
                      data_cat="F"
                      data-route-group="Self_Drive"
                      style={{ display: "none" }}
                    >
                      Hire Cycle
                    </option>
                    <option
                      value={1603}
                      data_cat="F"
                      data-route-group="Self_Drive"
                      style={{ display: "none" }}
                    >
                      Hire Motorbike
                    </option>
                    <option
                      value={1602}
                      data_cat="F"
                      data-route-group="Self_Drive"
                      style={{ display: "none" }}
                    >
                      Hire Van
                    </option>
                    <option
                      value={1600}
                      data_cat="F"
                      data-route-group="Self_Drive"
                      style={{ display: "none" }}
                    >
                      Self Drive
                    </option>
                    <option
                      value={300}
                      data_cat="F"
                      data-route-group="Surburban_Railway"
                      style={{ display: "none" }}
                    >
                      Suburban Railway Service
                    </option>
                    <option
                      value={1507}
                      data_cat="F"
                      data-route-group="Taxi"
                      style={{ display: "none" }}
                    >
                      All Taxi Services
                    </option>
                    <option
                      value={1504}
                      data_cat="F"
                      data-route-group="Taxi"
                      style={{ display: "none" }}
                    >
                      Bike
                    </option>
                    <option
                      value={1505}
                      data_cat="F"
                      data-route-group="Taxi"
                      style={{ display: "none" }}
                    >
                      Licensed
                    </option>
                    <option
                      value={1506}
                      data_cat="F"
                      data-route-group="Taxi"
                      style={{ display: "none" }}
                    >
                      Private Hire
                    </option>
                    <option
                      value={1503}
                      data_cat="F"
                      data-route-group="Taxi"
                      style={{ display: "none" }}
                    >
                      Rail
                    </option>
                    <option
                      value={1502}
                      data_cat="F"
                      data-route-group="Taxi"
                      style={{ display: "none" }}
                    >
                      Water
                    </option>
                    <option
                      value={1307}
                      data_cat="F"
                      data-route-group="Telecabin"
                      style={{ display: "none" }}
                    >
                      All Telecabin Services
                    </option>
                    <option
                      value={1302}
                      data_cat="F"
                      data-route-group="Telecabin"
                      style={{ display: "none" }}
                    >
                      Cable Car
                    </option>
                    <option
                      value={1304}
                      data_cat="F"
                      data-route-group="Telecabin"
                      style={{ display: "none" }}
                    >
                      Chair Lift
                    </option>
                    <option
                      value={1305}
                      data_cat="F"
                      data-route-group="Telecabin"
                      style={{ display: "none" }}
                    >
                      Drag Lift
                    </option>
                    <option
                      value={1303}
                      data_cat="F"
                      data-route-group="Telecabin"
                      style={{ display: "none" }}
                    >
                      Elevator
                    </option>
                    <option
                      value={1306}
                      data_cat="F"
                      data-route-group="Telecabin"
                      style={{ display: "none" }}
                    >
                      Small Telecabin
                    </option>
                    <option
                      value={1301}
                      data_cat="F"
                      data-route-group="Telecabin"
                      style={{ display: "none" }}
                    >
                      Telecabin (Limited)
                    </option>
                    <option
                      value={906}
                      data_cat="F"
                      data-route-group="Tram"
                      style={{ display: "none" }}
                    >
                      All Tram Services
                    </option>
                    <option
                      value={901}
                      data_cat="F"
                      data-route-group="Tram"
                      style={{ display: "none" }}
                    >
                      City
                    </option>
                    <option
                      value={902}
                      data_cat="F"
                      data-route-group="Tram"
                      style={{ display: "none" }}
                    >
                      Local
                    </option>
                    <option
                      value={903}
                      data_cat="F"
                      data-route-group="Tram"
                      style={{ display: "none" }}
                    >
                      Regional
                    </option>
                    <option
                      value={905}
                      data_cat="F"
                      data-route-group="Tram"
                      style={{ display: "none" }}
                    >
                      Shuttle
                    </option>
                    <option
                      value={904}
                      data_cat="F"
                      data-route-group="Tram"
                      style={{ display: "none" }}
                    >
                      Sightseeing
                    </option>
                    <option
                      value={600}
                      data_cat="F"
                      data-route-group="Underground"
                      style={{ display: "none" }}
                    >
                      Underground Service
                    </option>
                    <option
                      value={404}
                      data_cat="F"
                      data-route-group="Urban_Railway"
                      style={{ display: "none" }}
                    >
                      All Urban Railway Services
                    </option>
                    <option
                      value={1012}
                      data_cat="F"
                      data-route-group="Water_Transport"
                      style={{ display: "none" }}
                    >
                      Airport Link Ferry
                    </option>
                    <option
                      value={1021}
                      data_cat="F"
                      data-route-group="Water_Transport"
                      style={{ display: "none" }}
                    >
                      All Water Transport
                    </option>
                    <option
                      value={1017}
                      data_cat="F"
                      data-route-group="Water_Transport"
                      style={{ display: "none" }}
                    >
                      Cable Drawn Boat
                    </option>
                    <option
                      value={1013}
                      data_cat="F"
                      data-route-group="Water_Transport"
                      style={{ display: "none" }}
                    >
                      Car High Speed Ferry
                    </option>
                    <option
                      value={1001}
                      data_cat="F"
                      data-route-group="Water_Transport"
                      style={{ display: "none" }}
                    >
                      International Car Ferry
                    </option>
                    <option
                      value={1005}
                      data_cat="F"
                      data-route-group="Water_Transport"
                      style={{ display: "none" }}
                    >
                      International Passenger Ferry
                    </option>
                    <option
                      value={1004}
                      data_cat="F"
                      data-route-group="Water_Transport"
                      style={{ display: "none" }}
                    >
                      Local Car Ferry
                    </option>
                    <option
                      value={1008}
                      data_cat="F"
                      data-route-group="Water_Transport"
                      style={{ display: "none" }}
                    >
                      Local Passenger Ferry
                    </option>
                    <option
                      value={1002}
                      data_cat="F"
                      data-route-group="Water_Transport"
                      style={{ display: "none" }}
                    >
                      National Car Ferry
                    </option>
                    <option
                      value={1006}
                      data_cat="F"
                      data-route-group="Water_Transport"
                      style={{ display: "none" }}
                    >
                      National Passenger Ferry
                    </option>
                    <option
                      value={1014}
                      data_cat="F"
                      data-route-group="Water_Transport"
                      style={{ display: "none" }}
                    >
                      Passenger High Speed Ferry
                    </option>
                    <option
                      value={1009}
                      data_cat="F"
                      data-route-group="Water_Transport"
                      style={{ display: "none" }}
                    >
                      Post Boat
                    </option>
                    <option
                      value={1003}
                      data_cat="F"
                      data-route-group="Water_Transport"
                      style={{ display: "none" }}
                    >
                      Regional Car Ferry
                    </option>
                    <option
                      value={1007}
                      data_cat="F"
                      data-route-group="Water_Transport"
                      style={{ display: "none" }}
                    >
                      Regional Passenger Ferry
                    </option>
                    <option
                      value={1018}
                      data_cat="F"
                      data-route-group="Water_Transport"
                      style={{ display: "none" }}
                    >
                      River Bus
                    </option>
                    <option
                      value={1011}
                      data_cat="F"
                      data-route-group="Water_Transport"
                      style={{ display: "none" }}
                    >
                      Road Link Ferry
                    </option>
                    <option
                      value={1019}
                      data_cat="F"
                      data-route-group="Water_Transport"
                      style={{ display: "none" }}
                    >
                      Scheduled Ferry
                    </option>
                    <option
                      value={1016}
                      data_cat="F"
                      data-route-group="Water_Transport"
                      style={{ display: "none" }}
                    >
                      School Boat
                    </option>
                    <option
                      value={1020}
                      data_cat="F"
                      data-route-group="Water_Transport"
                      style={{ display: "none" }}
                    >
                      Shuttle Ferry
                    </option>
                    <option
                      value={1015}
                      data_cat="F"
                      data-route-group="Water_Transport"
                      style={{ display: "none" }}
                    >
                      Sightseeing Boat
                    </option>
                    <option
                      value={1010}
                      data_cat="F"
                      data-route-group="Water_Transport"
                      style={{ display: "none" }}
                    >
                      Train Ferry
                    </option>
                  </optgroup>{" "}
                </select>
              </div>
            </div>
            {/* div class="row">
			<div class="form-group col-sm-12">

				<label for="add_route_type">Route Type <span class="requ-lft">Required</span></label>
				<select class="form-control custom_srch" name="route_type" id="add_route_type" required>
					<option value="" disabled="disabled">Select One</option>
					<optgroup label="Standard Route Types">							<option value="1">Subway, Metro</option>
												<option value="2">Rail</option>
												<option value="3">Bus</option>
												<option value="4">Ferry</option>
												<option value="5">Cable Car</option>
												<option value="6">Gondola</option>
												<option value="7">Funicular</option>
					<optgroup label="Railway Service Extensions">							<option value="100">Railway Service (Google Supported Extension)</option>
												<option value="101">High Speed Rail Service (Google Supported Extension)</option>
												<option value="102">Long Distance Trains (Google Supported Extension)</option>
												<option value="103">Inter Regional Rail Service (Google Supported Extension)</option>
												<option value="104">Car Transport Rail Service (Future Extension)</option>
												<option value="105">Sleeper Rail Service (Google Supported Extension)</option>
												<option value="106">Regional Rail Service (Google Supported Extension)</option>
												<option value="107">Tourist Railway Service (Google Supported Extension)</option>
												<option value="108">Rail Shuttle (Within Complex) (Google Supported Extension)</option>
												<option value="109">Suburban Railway (Google Supported Extension)</option>
												<option value="110">Replacement Rail Service (Future Extension)</option>
												<option value="111">Special Rail Service (Future Extension)</option>
												<option value="112">Lorry Transport Rail Service (Future Extension)</option>
												<option value="113">All Rail Services (Future Extension)</option>
												<option value="114">Cross-Country Rail Service (Future Extension)</option>
												<option value="115">Vehicle Transport Rail Service (Future Extension)</option>
												<option value="116">Rack and Pinion Railway (Future Extension)</option>
												<option value="117">Additional Rail Service (Future Extension)</option>
					<optgroup label="Coach Service Extensions">							<option value="200">Coach Service (Google Supported Extension)</option>
												<option value="201">International Coach Service (Google Supported Extension)</option>
												<option value="202">National Coach Service (Google Supported Extension)</option>
												<option value="203">Shuttle Coach Service (Future Extension)</option>
												<option value="204">Regional Coach Service (Google Supported Extension)</option>
												<option value="205">Special Coach Service (Future Extension)</option>
												<option value="206">Sightseeing Coach Service (Future Extension)</option>
												<option value="207">Tourist Coach Service (Future Extension)</option>
												<option value="208">Commuter Coach Service (Google Supported Extension)</option>
												<option value="209">All Coach Services (Future Extension)</option>
					<optgroup label="Surburban Railway Service Extension">							<option value="300">Suburban Railway Service (Future Extension)</option>
					<optgroup label="Urban Railway Service Extensions">							<option value="400">Urban Railway Service (Google Supported Extension)</option>
												<option value="401">Metro Service (Google Supported Extension)</option>
												<option value="402">Underground Service (Google Supported Extension)</option>
												<option value="403">Urban Railway Service (Google Supported Extension)</option>
												<option value="404">All Urban Railway Services (Future Extension)</option>
												<option value="405">Monorail (Google Supported Extension)</option>
					<optgroup label="Metro Service Extensions">							<option value="500">Metro Service (Future Extension)</option>
					<optgroup label="Underground Service Extensions">							<option value="600">Underground Service (Future Extension)</option>
					<optgroup label="Bus Service Extensions">							<option value="700">Bus Service (Google Supported Extension)</option>
												<option value="701">Regional Bus Service (Google Supported Extension)</option>
												<option value="702">Express Bus Service (Google Supported Extension)</option>
												<option value="703">Stopping Bus Service (Future Extension)</option>
												<option value="704">Local Bus Service (Google Supported Extension)</option>
												<option value="705">Night Bus Service (Future Extension)</option>
												<option value="706">Post Bus Service (Future Extension)</option>
												<option value="707">Special Needs Bus (Future Extension)</option>
												<option value="708">Mobility Bus Service (Future Extension)</option>
												<option value="709">Mobility Bus for Registered Disabled (Future Extension)</option>
												<option value="710">Sightseeing Bus (Future Extension)</option>
												<option value="711">Shuttle Bus (Future Extension)</option>
												<option value="712">School Bus (Future Extension)</option>
												<option value="713">School and Public Service Bus (Future Extension)</option>
												<option value="714">Rail Replacement Bus Service (Future Extension)</option>
												<option value="715">Demand and Response Bus Service (Google Supported Extension)</option>
												<option value="716">All Bus Services (Future Extension)</option>
					<optgroup label="Trolleybus Service Extensions">							<option value="800">Trolleybus Service (Google Supported Extension)</option>
					<optgroup label="Tram Service Extensions">							<option value="900">Tram Service (Google Supported Extension)</option>
												<option value="901">City Tram Service (Future Extension)</option>
												<option value="902">Local Tram Service (Future Extension)</option>
												<option value="903">Regional Tram Service (Future Extension)</option>
												<option value="904">Sightseeing Tram Service (Future Extension)</option>
												<option value="905">Shuttle Tram Service (Future Extension)</option>
												<option value="906">All Tram Services (Future Extension)</option>
					<optgroup label="Water Transport Service Extensions">							<option value="1000">Water Transport Service (Google Supported Extension)</option>
												<option value="1001">International Car Ferry Service (Future Extension)</option>
												<option value="1002">National Car Ferry Service (Future Extension)</option>
												<option value="1003">Regional Car Ferry Service (Future Extension)</option>
												<option value="1004">Local Car Ferry Service (Future Extension)</option>
												<option value="1005">International Passenger Ferry Service (Future Extension)</option>
												<option value="1006">National Passenger Ferry Service (Future Extension)</option>
												<option value="1007">Regional Passenger Ferry Service (Future Extension)</option>
												<option value="1008">Local Passenger Ferry Service (Future Extension)</option>
												<option value="1009">Post Boat Service (Future Extension)</option>
												<option value="1010">Train Ferry Service (Future Extension)</option>
												<option value="1011">Road-Link Ferry Service (Future Extension)</option>
												<option value="1012">Airport-Link Ferry Service (Future Extension)</option>
												<option value="1013">Car High-Speed Ferry Service (Future Extension)</option>
												<option value="1014">Passenger High-Speed Ferry Service (Future Extension)</option>
												<option value="1015">Sightseeing Boat Service (Future Extension)</option>
												<option value="1016">School Boat (Future Extension)</option>
												<option value="1017">Cable-Drawn Boat Service (Future Extension)</option>
												<option value="1018">River Bus Service (Future Extension)</option>
												<option value="1019">Scheduled Ferry Service (Future Extension)</option>
												<option value="1020">Shuttle Ferry Service (Future Extension)</option>
												<option value="1021">All Water Transport Services (Future Extension)</option>
					<optgroup label="Air Service Extensions">							<option value="1100">Air Service (Future Extension)</option>
												<option value="1101">International Air Service (Future Extension)</option>
												<option value="1102">Domestic Air Service (Future Extension)</option>
												<option value="1103">Intercontinental Air Service (Future Extension)</option>
												<option value="1104">Domestic Scheduled Air Service (Future Extension)</option>
												<option value="1105">Shuttle Air Service (Future Extension)</option>
												<option value="1106">Intercontinental Charter Air Service (Future Extension)</option>
												<option value="1107">International Charter Air Service (Future Extension)</option>
												<option value="1108">Round-Trip Charter Air Service (Future Extension)</option>
												<option value="1109">Sightseeing Air Service (Future Extension)</option>
												<option value="1110">Helicopter Air Service (Future Extension)</option>
												<option value="1111">Domestic Charter Air Service (Future Extension)</option>
												<option value="1112">Schengen-Area Air Service (Future Extension)</option>
												<option value="1113">Airship Service (Future Extension)</option>
												<option value="1114">All Air Services (Future Extension)</option>
					<optgroup label="Ferry Service Extensions">							<option value="1200">Ferry Service (Google Supported Extension)</option>
					<optgroup label="Telecabin Service Extensions">							<option value="1300">Aerial Lift Service (Google Supported Extension)</option>
												<option value="1301">Telecabin Service (Future Extension)</option>
												<option value="1302">Cable Car Service (Future Extension)</option>
												<option value="1303">Elevator Service (Future Extension)</option>
												<option value="1304">Chair Lift Service (Future Extension)</option>
												<option value="1305">Drag Lift Service (Future Extension)</option>
												<option value="1306">Small Telecabin Service (Future Extension)</option>
												<option value="1307">All Telecabin Services (Future Extension)</option>
					<optgroup label="Funicular Service Extensions">							<option value="1400">Funicular Service (Google Supported Extension)</option>
												<option value="1401">Funicular Service (Future Extension)</option>
												<option value="1402">All Funicular Service (Future Extension)</option>
					<optgroup label="Taxi Service Extensions">							<option value="1500">Taxi Service (Google Supported Extension)</option>
												<option value="1501">Communal Taxi Service (Google Supported Extension)</option>
												<option value="1502">Water Taxi Service (Future Extension)</option>
												<option value="1503">Rail Taxi Service (Future Extension)</option>
												<option value="1504">Bike Taxi Service (Future Extension)</option>
												<option value="1505">Licensed Taxi Service (Future Extension)</option>
												<option value="1506">Private Hire Service Vehicle (Future Extension)</option>
												<option value="1507">All Taxi Services (Future Extension)</option>
					<optgroup label="Self Drive Extensions">							<option value="1600">Self Drive (Future Extension)</option>
												<option value="1601">Hire Car (Future Extension)</option>
												<option value="1602">Hire Van (Future Extension)</option>
												<option value="1603">Hire Motorbike (Future Extension)</option>
												<option value="1604">Hire Cycle (Future Extension)</option>
					<optgroup label="Miscellaneous Service Extensions">							<option value="1700">Miscellaneous Service (Google Supported Extension)</option>
												<option value="1701">Cable Car (Google Supported Extension)</option>
												<option value="1702">Horse-drawn Carriage (Google Supported Extension)</option>
					<optgroup label="Bus Service Extensions">							<option value="717">Share Taxi Service (Google Supported Extension)</option>
					<optgroup label="Tram Service Extensions">							<option value="907">Cable Tram (Google Supported Extension)</option>
					<optgroup label="Standard Route Types">							<option value="11">Trolleybus</option>
												<option value="12">Monorail</option>
									</select>				
			</div>
		</div */}
            <div className="row">
              <input
                type="hidden"
                className="form-control"
                defaultValue=""
                name="add_route_hdn"
                id="add_route_hdn"
              />
              <div className="form-group col-sm-12">
                <label htmlFor="add_route_long_name">
                  Route Name (Long)<span className="requ-lft">Required</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter the name of the route. E.g. Downtown via Station"
                  name="route_long_name"
                  id="add_route_long_name"
                  required=""
                />
              </div>
            </div>
            <div className="panel-group" id="accordion">
              <div className="panel panel-default">
                <div className="panel-heading">
                  {/* h4 class="panel-title" */}
                  <a
                    data-toggle="collapse"
                    data-parent="#accordion"
                    href="#collapseFour"
                  >
                    Optional Fields (open/close)
                  </a>
                  {/*/h4 */}
                </div>
                <div
                  id="collapseFour"
                  className="panel-collapse out collapse in"
                  style={{}}
                >
                  <div className="panel-body">
                    <div className="row">
                      <div className="form-group col-sm-9">
                        <label htmlFor="add_route_short_name">
                          Route Name (Short)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="route_short_name"
                          id="add_route_short_name"
                          placeholder="Route number/id. Maximum 6 characters."
                        />
                      </div>
                      <div
                        className="form-group col-sm-3"
                        style={{ display: "none" }}
                      >
                        <label htmlFor="add_route_id">
                          Id <span className="requ-lft">Required</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder=""
                          name="add_route_id"
                          id="add_route_id"
                          onchange="show_service_alert()"
                          required=""
                        />
                        <input
                          type="hidden"
                          className="form-control"
                          defaultValue={98477}
                          name="route_ag_file_id"
                        />
                      </div>
                      <div
                        className="form-group col-sm-6"
                        style={{ display: "none" }}
                      >
                        <label htmlFor="add_rt_agency_id_sel">
                          Agency <span className="requ-lft">Required</span>
                        </label>
                        <input
                          type="hidden"
                          className="form-control"
                          defaultValue={1}
                          name="agency_id"
                          id="add_rt_agency_id"
                        />
                        <select
                          className="form-control custom_srch"
                          name="agency_id_sel"
                          id="add_rt_agency_id_sel"
                          disabled="disabled"
                        >
                          <option value="" disabled="disabled">
                            Select One
                          </option>
                          <option value={1}>Software Company</option>
                        </select>
                      </div>
                    </div>
                    <div className="row">
                      <div className="abt-agency form-group col-sm-12">
                        <label htmlFor="add_route_desc">Description</label>
                        <textarea
                          className="form-control"
                          rows={2}
                          name="route_desc"
                          id="add_route_desc"
                          style={{ lineHeight: "normal" }}
                          placeholder="Provide a textual description of the route, it's features and running times. Do not duplicate the long and/or short names."
                          defaultValue={""}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="abt-agency form-group col-sm-12">
                        <label htmlFor="add_route_url">
                          Route URL
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
                          name="route_url"
                          id="add_route_url"
                          placeholder="If available, the route specific web page. Do not use the agency url."
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col-sm-6">
                        <div className="modal_macs">
                          <label htmlFor="add_route_color">
                            Route Color{" "}
                            <small>
                              (Use Default{" "}
                              <input
                                type="checkbox"
                                id="add_route_color_default"
                                name="route_color_default"
                                defaultChecked="checked"
                                defaultValue="Y"
                                style={{ width: "auto" }}
                              />
                              )
                            </small>
                          </label>
                          <div
                            className="input-group input-append color colorpicker"
                            id="add_route_colorpick"
                            data-color=" rgb(255, 255, 255)"
                            data-color-format="hex"
                            style={{ display: "none" }}
                          >
                            <input
                              type="text"
                              className="form-control"
                              name="route_color"
                              id="add_route_color"
                              defaultValue="#FFFFFF"
                              style={{ textTransform: "uppercase" }}
                              disabled="disabled"
                            />
                            <div className="input-group-btn color_btn">
                              <span className="add-on">
                                <i
                                  style={{
                                    backgroundColor: "rgb(255, 255, 255)",
                                  }}
                                />
                              </span>
                            </div>
                            {/* /btn-group */}
                          </div>
                          {/* /input-group */}
                        </div>
                      </div>
                      {/* /.col-lg-6 */}
                      <div className="form-group col-sm-6">
                        <div className="modal_macs">
                          <label htmlFor="add_route_text_color">
                            Text Color{" "}
                            <small>
                              (Use Default{" "}
                              <input
                                type="checkbox"
                                id="add_route_text_color_default"
                                name="route_text_color_default"
                                defaultChecked="checked"
                                defaultValue="Y"
                                style={{ width: "auto" }}
                              />
                              )
                            </small>
                          </label>
                          <div
                            className="input-group input-append color colorpicker"
                            id="add_route_text_colorpick"
                            data-color=" rgb(0, 0, 0);"
                            data-color-format="hex"
                            style={{ display: "none" }}
                          >
                            <input
                              type="text"
                              className="form-control"
                              name="route_text_color"
                              id="add_route_text_color"
                              defaultValue="#000000"
                              style={{ textTransform: "uppercase" }}
                              disabled="disabled"
                            />
                            <div className="input-group-btn color_btn">
                              <span className="add-on">
                                <i
                                  style={{ backgroundColor: "rgb(0, 0, 0)" }}
                                />
                              </span>
                            </div>
                            {/* /btn-group */}
                          </div>
                          {/* /input-group */}
                        </div>
                      </div>
                      {/* /.col-lg-6 */}
                    </div>
                  </div>
                </div>
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
              type="button"
              className="btn btn-success"
              name="add_route_submit"
              id="add_route_submit"
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
