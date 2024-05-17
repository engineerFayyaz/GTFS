import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  addDoc,
  collection,
  getFirestore,
  getDocs,
  doc,
  deleteDoc,
  Timestamp
} from "firebase/firestore"; // Import the Firestore database
import Header from "../../Components/Header";
import "./addtransit.css";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loader from "../../Components/Loader";
export const AddTransit = () => {
  const [show, setShow] = useState(false);
  const [companyInfo, setCompanyInfo] = useState([]);
  const [loading, setLoading ] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const handleShow = () => setShow(true);
  const db = getFirestore();
  const [formData, setFormData] = useState({
    companyName: "",
    country: "",
    timezone: "",
    language: "",
    companyDesc: "",
    companyUrl: "",
    telephone: "",
    postalAddress: "",
    supportemail: "",
    fareUrl: "",
    compannyId: "",
    distanceUnit: "",
  });

  const handleClose = () => {
    setShow(false);
    setFormData({
      companyName: "",
      country: "",
      timezone: "",
      language: "",
      companyDesc: "",
      companyUrl: "",
      telephone: "",
      postalAddress: "",
      supportemail: "",
      fareUrl: "",
      compannyId: "",
      distanceUnit: "",
    });
  };

  // fetching company data
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "created_agencies"));
        const routesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          // createdAt: doc.data().createdAt?.toDate(), // Convert Firestore timestamp to Date object
          ...doc.data(),
        }));
        setCompanyInfo(routesData);
      } catch (error) {
        toast.error("Error fetching agencies: ", error);
        console.log("Error fetching agencies: ", error.code, error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRoutes();
  }, [db]);
  
  // handel input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // handle form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const createdAt = Timestamp.now(); // Use Firestore Timestamp for createdAt
      const docData = {
        ...formData,
        createdAt: createdAt, // Add createdAt field
      };
      const docRef = await addDoc(collection(db, "created_agencies"), docData);
      setTimeout(() => {
        toast.success("Data uploaded successfully");
      },1000)
      handleClose();
    } catch (error) {
      toast.error("Failed to add agency");
      alert("Failed to add agency");
      console.log("Failed to add agency", error.message, error.code);
    } finally{
      setLoading(false);
    }
  };
   // handle checkbox change
   const handleCheckboxChange = (id) => {
    setSelectedCompanies((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((companyId) => companyId !== id)
        : [...prevSelected, id]
    );
  };

  // handle delete
  const handleDeleteSelected = async () => {
    if (window.confirm("Are you sure you want to delete selected companies?")) {
      try {
        setLoading(true);
        await Promise.all(
          selectedCompanies.map((id) => deleteDoc(doc(db, "created_agencies", id)))
        );
        setCompanyInfo(companyInfo.filter((company) => !selectedCompanies.includes(company.id)));
        setSelectedCompanies([]);
        setTimeout(() => {
          toast.success("Selected companies deleted successfully");
        },1000)
      } catch (error) {
        console.error("Error deleting companies: ", error);
        toast.error("Failed to delete companies");
      } finally {
        setLoading(false);
      }
    }
  };

  if(loading){
    return   <Loader />
  }
  
  const handleCreate = () => {};
  return (
    <>
    <ToastContainer />
      <Header />
      <div className="container demo-1 mt-5">
        <header>
          <h1 style={{ float: "left" }} className="agency_head">
            Transit Companies
          </h1>
          <div className="col-sm-6 float-end ">
            <Link
              className="btn btn-default border-0 "
              onClick={handleDeleteSelected} 
            >
              <i className="fa fa-trash">&nbsp;</i>
              Delete
            </Link>
            <a
              href="uploader/select-gtfs-file.php"
              className="btn btn-default border-0"
              onclick="import_GTFS();"
              id="import_btn"
            >
              <i className="fa fa-upload">&nbsp;</i>
              Import GTFS File
            </a>
            <a
              href="#"
              className="btn btn-default border-0 "
              id="view_export_btn"
            >
              <i className="fa fa-file-text">&nbsp;</i>View Exports
            </a>
            {/*<p class="select_all" >									
						Select all &nbsp;<input type="checkbox" id="select_alls">
					</p> */}
          </div>
        </header>
        <ul className="grid container-fluid p-0 cs-style-1">
          <div className="row w-100 p-0 gap-1 justify-content-start agency">
            <div className="col-md-3 col-sm-6 col-xs-12">
              <figure className="box_tab_add">
                <figcaption
                  id="btnaddagency"
                  data-toggle="modal"
                  data-target="#myModal"
                  style={{ cursor: "pointer" }}
                  onClick={handleShow}
                >
                  <i className="fa fa-plus" />
                  <span>
                    Add
                    <br />
                    Company
                  </span>
                </figcaption>
              </figure>
            </div>
            {companyInfo.map((company, index) => (
        <div className="col-md-3 col-sm-6 col-xs-12" id={`del_${company.id}`} key={company.id}>
          <figure>
            <div
              className="box_bg w-100"
              style={{ cursor: "pointer" }}
              title="Click to manage routes, schedules and trips"
            >
              <p style={{ float: "right" }}>
                <input
                  type="checkbox"
                  className="agency_chk u_chk"
                  checked={selectedCompanies.includes(company.id)}
                  onChange={() => handleCheckboxChange(company.id)}
                />{" "}
              </p>
              <h3>
                <Link className="box_bg_title" style={{ wordWrap: "break-word" }} to={`/Agencies/${company.id}`}>
                  {company.companyName}
                </Link>
              </h3>
              <p className="cont_posi" style={{ wordWrap: "break-word", width: "80%" }}>
                <br />
                <small>Created:</small>
              </p>
            </div>
          </figure>
        </div>
            ))}
          </div>
        </ul>
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
        <form role="form" name="myForm" id="myform" onSubmit={handleFormSubmit}>
          <div className="modal-body p-4">
            <div className="row">
              <div className="form-group col-sm-9">
                <label htmlFor="name">
                  Company Name<span className="requ-left">Required</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="companyName"
                  placeholder="E.g. Brown's Buses"
                  autoComplete="organization"
                  required
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group col-sm-12">
                <label htmlFor="website">
                  Website
                  <a
                    target="_blank"
                    className="test_link fetch_link"
                    href="#"
                    style={{ fontSize: 12, paddingLeft: 15, paddingTop: 6 }}
                  >
                    Test Link
                  </a>
                  <span className="requ-left">Required</span>
                </label>
                <input
                  type="url"
                  className="form-control"
                  id="website"
                  name="companyUrl"
                  placeholder="Your website URL (E.g. http://....)"
                  required
                  onblur="checkwebsiteurl();"
                  onChange={handleInputChange}
                  value={formData.companyUrl}
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group col-sm-12">
                <label htmlFor="tz_country">
                  Country<span className="requ-left">Required</span>
                </label>
                <div className="custom_search_parent">
                  <select
                    name="country"
                    className="custom_search"
                    id="tz_country"
                    required
                    onChange={handleInputChange}
                    value={formData.country}
                  >
                    <option value="" disabled="disabled" selected="selected">
                      Select One
                    </option>
                    <option value="Aaland Islands">Aaland Islands</option>
                    <option value="Afghanistan">Afghanistan</option>
                    <option value="Albania">Albania</option>
                    <option value="Algeria">Algeria</option>
                    <option value="American Samoa">American Samoa</option>
                    <option value="Andorra">Andorra</option>
                    <option value="Angola">Angola</option>
                    <option value="Anguilla">Anguilla</option>
                    <option value="Antarctica">Antarctica</option>
                    <option value="Antigua and Barbuda">
                      Antigua and Barbuda
                    </option>
                    <option value="Argentina">Argentina</option>
                    <option value="Armenia">Armenia</option>
                    <option value="Aruba">Aruba</option>
                    <option value="Australia">Australia</option>
                    <option value="Austria">Austria</option>
                    <option value="Azerbaijan">Azerbaijan</option>
                    <option value="Bahamas">Bahamas</option>
                    <option value="Bahrain">Bahrain</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Barbados">Barbados</option>
                    <option value="Belarus">Belarus</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Belize">Belize</option>
                    <option value="Benin">Benin</option>
                    <option value="Bermuda">Bermuda</option>
                    <option value="Bhutan">Bhutan</option>
                    <option value="Bolivia">Bolivia</option>
                    <option value="Bosnia And Herzegovina">
                      Bosnia And Herzegovina
                    </option>
                    <option value="Botswana">Botswana</option>
                    <option value="Brazil">Brazil</option>
                    <option value="British Indian Ocean Territory">
                      British Indian Ocean Territory
                    </option>
                    <option value="Brunei">Brunei</option>
                    <option value="Bulgaria">Bulgaria</option>
                    <option value="Burkina Faso">Burkina Faso</option>
                    <option value="Burundi">Burundi</option>
                    <option value="Cambodia">Cambodia</option>
                    <option value="Cameroon">Cameroon</option>
                    <option value="Canada">Canada</option>
                    <option value="Cape Verde">Cape Verde</option>
                    <option value="Cayman Islands">Cayman Islands</option>
                    <option value="Central African Republic">
                      Central African Republic
                    </option>
                    <option value="Chad">Chad</option>
                    <option value="Chile">Chile</option>
                    <option value="China">China</option>
                    <option value="Christmas Island">Christmas Island</option>
                    <option value="Cocos (Keeling) Islands">
                      Cocos (Keeling) Islands
                    </option>
                    <option value="Colombia">Colombia</option>
                    <option value="Comoros">Comoros</option>
                    <option value="Congo, The Democratic Republic Of The">
                      Congo, The Democratic Republic Of The
                    </option>
                    <option value="Congo, The Republic Of">
                      Congo, The Republic Of
                    </option>
                    <option value="Cook Islands">Cook Islands</option>
                    <option value="Costa Rica">Costa Rica</option>
                    <option value="Côte D'ivoire">Côte D'ivoire</option>
                    <option value="Croatia">Croatia</option>
                    <option value="Cuba">Cuba</option>
                    <option value="Curacao">Curacao</option>
                    <option value="Cyprus">Cyprus</option>
                    <option value="Czech Republic">Czech Republic</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Djibouti">Djibouti</option>
                    <option value="Dominica">Dominica</option>
                    <option value="Dominican Republic">
                      Dominican Republic
                    </option>
                    <option value="Ecuador">Ecuador</option>
                    <option value="Egypt">Egypt</option>
                    <option value="El Salvador">El Salvador</option>
                    <option value="Equatorial Guinea">Equatorial Guinea</option>
                    <option value="Eritrea">Eritrea</option>
                    <option value="Estonia">Estonia</option>
                    <option value="Ethiopia">Ethiopia</option>
                    <option value="Falkland Islands (Malvinas)">
                      Falkland Islands (Malvinas)
                    </option>
                    <option value="Faroe Islands">Faroe Islands</option>
                    <option value="Fiji">Fiji</option>
                    <option value="Finland">Finland</option>
                    <option value="France">France</option>
                    <option value="French Guiana">French Guiana</option>
                    <option value="French Polynesia">French Polynesia</option>
                    <option value="French Southern And Antarctic Lands, Territory of">
                      French Southern And Antarctic Lands, Territory of
                    </option>
                    <option value="Gabon">Gabon</option>
                    <option value="Gambia">Gambia</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Germany">Germany</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Gibraltar">Gibraltar</option>
                    <option value="Greece">Greece</option>
                    <option value="Greenland">Greenland</option>
                    <option value="Grenada">Grenada</option>
                    <option value="Guadeloupe">Guadeloupe</option>
                    <option value="Guam">Guam</option>
                    <option value="Guatemala">Guatemala</option>
                    <option value="Guernsey">Guernsey</option>
                    <option value="Guinea">Guinea</option>
                    <option value="Guinea-Bissau">Guinea-Bissau</option>
                    <option value="Guyana">Guyana</option>
                    <option value="Haiti">Haiti</option>
                    <option value="Honduras">Honduras</option>
                    <option value="Hong Kong">Hong Kong</option>
                    <option value="Hungary">Hungary</option>
                    <option value="Iceland">Iceland</option>
                    <option value="India">India</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Iran, Islamic Republic Of">
                      Iran, Islamic Republic Of
                    </option>
                    <option value="Iraq">Iraq</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Isle of Man">Isle of Man</option>
                    <option value="Israel">Israel</option>
                    <option value="Italy">Italy</option>
                    <option value="Jamaica">Jamaica</option>
                    <option value="Japan">Japan</option>
                    <option value="Jersey">Jersey</option>
                    <option value="Jordan">Jordan</option>
                    <option value="Kazakhstan">Kazakhstan</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Kiribati">Kiribati</option>
                    <option value="Korea, Democratic People's Republic Of">
                      Korea, Democratic People's Republic Of
                    </option>
                    <option value="Korea, Republic Of">
                      Korea, Republic Of
                    </option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Kyrgyzstan">Kyrgyzstan</option>
                    <option value="Lao People's Democratic Republic">
                      Lao People's Democratic Republic
                    </option>
                    <option value="Latvia">Latvia</option>
                    <option value="Lebanon">Lebanon</option>
                    <option value="Lesotho">Lesotho</option>
                    <option value="Liberia">Liberia</option>
                    <option value="Libya">Libya</option>
                    <option value="Liechtenstein">Liechtenstein</option>
                    <option value="Lithuania">Lithuania</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Macau">Macau</option>
                    <option value="Macedonia, The Former Yugoslav Republic Of">
                      Macedonia, The Former Yugoslav Republic Of
                    </option>
                    <option value="Madagascar">Madagascar</option>
                    <option value="Malawi">Malawi</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Maldives">Maldives</option>
                    <option value="Mali">Mali</option>
                    <option value="Malta">Malta</option>
                    <option value="Marshall Islands">Marshall Islands</option>
                    <option value="Martinique">Martinique</option>
                    <option value="Mauritania">Mauritania</option>
                    <option value="Mauritius">Mauritius</option>
                    <option value="Mayotte">Mayotte</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Micronesia, Federated States Of">
                      Micronesia, Federated States Of
                    </option>
                    <option value="Moldova, Republic Of">
                      Moldova, Republic Of
                    </option>
                    <option value="Monaco">Monaco</option>
                    <option value="Mongolia">Mongolia</option>
                    <option value="Montenegro">Montenegro</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Morocco">Morocco</option>
                    <option value="Mozambique">Mozambique</option>
                    <option value="Myanmar">Myanmar</option>
                    <option value="Namibia">Namibia</option>
                    <option value="Nauru">Nauru</option>
                    <option value="Nepal">Nepal</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="New Caledonia">New Caledonia</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Nicaragua">Nicaragua</option>
                    <option value="Niger">Niger</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Niue">Niue</option>
                    <option value="Norfolk Island">Norfolk Island</option>
                    <option value="Northern Mariana Islands">
                      Northern Mariana Islands
                    </option>
                    <option value="Norway">Norway</option>
                    <option value="Oman">Oman</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Palau">Palau</option>
                    <option value="Palestinian Territory, Occupied">
                      Palestinian Territory, Occupied
                    </option>
                    <option value="Panama">Panama</option>
                    <option value="Papua New Guinea">Papua New Guinea</option>
                    <option value="Paraguay">Paraguay</option>
                    <option value="Peru">Peru</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Pitcairn">Pitcairn</option>
                    <option value="Poland">Poland</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Puerto Rico">Puerto Rico</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Reunion">Reunion</option>
                    <option value="Romania">Romania</option>
                    <option value="Russian Federation">
                      Russian Federation
                    </option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="Saint Barthélemy">Saint Barthélemy</option>
                    <option value="Saint Helena">Saint Helena</option>
                    <option value="Saint Kitts and Nevis">
                      Saint Kitts and Nevis
                    </option>
                    <option value="Saint Lucia">Saint Lucia</option>
                    <option value="Saint Martin, Collectivity of">
                      Saint Martin, Collectivity of
                    </option>
                    <option value="Saint Pierre and Miquelon">
                      Saint Pierre and Miquelon
                    </option>
                    <option value="Saint Vincent and the Grenadines">
                      Saint Vincent and the Grenadines
                    </option>
                    <option value="Samoa, Independent State of">
                      Samoa, Independent State of
                    </option>
                    <option value="San Marino">San Marino</option>
                    <option value="Sao Tome And Principe">
                      Sao Tome And Principe
                    </option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Senegal">Senegal</option>
                    <option value="Serbia">Serbia</option>
                    <option value="Seychelles">Seychelles</option>
                    <option value="Sierra Leone">Sierra Leone</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Sint Maarten">Sint Maarten</option>
                    <option value="Slovakia">Slovakia</option>
                    <option value="Slovenia">Slovenia</option>
                    <option value="Solomon Islands">Solomon Islands</option>
                    <option value="Somalia">Somalia</option>
                    <option value="South Africa">South Africa</option>
                    <option value="South Georgia and the South Sandwich Islands">
                      South Georgia and the South Sandwich Islands
                    </option>
                    <option value="Spain">Spain</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="Sudan, Republic of">
                      Sudan, Republic of
                    </option>
                    <option value="Sudan, Republic of South">
                      Sudan, Republic of South
                    </option>
                    <option value="Suriname">Suriname</option>
                    <option value="Svalbard and Jan Mayen">
                      Svalbard and Jan Mayen
                    </option>
                    <option value="Swaziland">Swaziland</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Syrian Arab Republic">
                      Syrian Arab Republic
                    </option>
                    <option value="Taiwan">Taiwan</option>
                    <option value="Tajikistan">Tajikistan</option>
                    <option value="Tanzania, United Republic Of">
                      Tanzania, United Republic Of
                    </option>
                    <option value="Thailand">Thailand</option>
                    <option value="Timor-Leste">Timor-Leste</option>
                    <option value="Togo">Togo</option>
                    <option value="Tokelau">Tokelau</option>
                    <option value="Tonga">Tonga</option>
                    <option value="Trinidad and Tobago">
                      Trinidad and Tobago
                    </option>
                    <option value="Tunisia">Tunisia</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Turkmenistan">Turkmenistan</option>
                    <option value="Turks and Caicos Islands">
                      Turks and Caicos Islands
                    </option>
                    <option value="Tuvalu">Tuvalu</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Ukraine">Ukraine</option>
                    <option value="United Arab Emirates">
                      United Arab Emirates
                    </option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="United States Minor Outlying Islands">
                      United States Minor Outlying Islands
                    </option>
                    <option value="Uruguay">Uruguay</option>
                    <option value="Uzbekistan">Uzbekistan</option>
                    <option value="Vanuatu">Vanuatu</option>
                    <option value="Vatican City">Vatican City</option>
                    <option value="Venezuela">Venezuela</option>
                    <option value="Vietnam, Socialist Republic of">
                      Vietnam, Socialist Republic of
                    </option>
                    <option value="Virgin Islands, British">
                      Virgin Islands, British
                    </option>
                    <option value="Virgin Islands, U.S.">
                      Virgin Islands, U.S.
                    </option>
                    <option value="Wallis And Futuna">Wallis And Futuna</option>
                    <option value="Western Sahara">Western Sahara</option>
                    <option value="Yemen">Yemen</option>
                    <option value="Zambia">Zambia</option>
                    <option value="Zimbabwe">Zimbabwe</option>
                  </select>
                  <span className="cont_arrow" />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-sm-6">
                <label htmlFor="time_zone">
                  Time Zone<span className="requ-left">Required</span>
                </label>
                <div className="custom_search_parent">
                  <select
                    name="timezone"
                    className="custom_search"
                    id="time_zone"
                    required
                    onChange={handleInputChange}
                    value={formData.timezone}
                  >
                    <option
                      id="tz_sel_one"
                      value=""
                      disabled="disabled"
                      selected="selected"
                    >
                      Select One
                    </option>
                    <option value="Africa/Abidjan" data-ctry="Côte D'ivoire">
                      Africa/Abidjan
                    </option>
                    <option value="Africa/Accra" data-ctry="Ghana">
                      Africa/Accra
                    </option>
                    <option value="Africa/Addis_Ababa" data-ctry="Ethiopia">
                      Africa/Addis_Ababa
                    </option>
                    <option value="Africa/Algiers" data-ctry="Algeria">
                      Africa/Algiers
                    </option>
                    <option value="Africa/Asmara" data-ctry="Eritrea">
                      Africa/Asmara
                    </option>
                    <option value="Africa/Bamako" data-ctry="Mali">
                      Africa/Bamako
                    </option>
                    <option
                      value="Africa/Bangui"
                      data-ctry="Central African Republic"
                    >
                      Africa/Bangui
                    </option>
                    <option value="Africa/Banjul" data-ctry="Gambia">
                      Africa/Banjul
                    </option>
                    <option value="Africa/Bissau" data-ctry="Guinea-Bissau">
                      Africa/Bissau
                    </option>
                    <option value="Africa/Blantyre" data-ctry="Malawi">
                      Africa/Blantyre
                    </option>
                    <option
                      value="Africa/Brazzaville"
                      data-ctry="Congo, The Republic Of"
                    >
                      Africa/Brazzaville
                    </option>
                    <option value="Africa/Bujumbura" data-ctry="Burundi">
                      Africa/Bujumbura
                    </option>
                    <option value="Africa/Cairo" data-ctry="Egypt">
                      Africa/Cairo
                    </option>
                    <option value="Africa/Casablanca" data-ctry="Morocco">
                      Africa/Casablanca
                    </option>
                    <option value="Africa/Ceuta" data-ctry="Spain">
                      Africa/Ceuta
                    </option>
                    <option value="Africa/Conakry" data-ctry="Guinea">
                      Africa/Conakry
                    </option>
                    <option value="Africa/Dakar" data-ctry="Senegal">
                      Africa/Dakar
                    </option>
                    <option
                      value="Africa/Dar_es_Salaam"
                      data-ctry="Tanzania, United Republic Of"
                    >
                      Africa/Dar_es_Salaam
                    </option>
                    <option value="Africa/Djibouti" data-ctry="Djibouti">
                      Africa/Djibouti
                    </option>
                    <option value="Africa/Douala" data-ctry="Cameroon">
                      Africa/Douala
                    </option>
                    <option value="Africa/El_Aaiun" data-ctry="Western Sahara">
                      Africa/El_Aaiun
                    </option>
                    <option value="Africa/Freetown" data-ctry="Sierra Leone">
                      Africa/Freetown
                    </option>
                    <option value="Africa/Gaborone" data-ctry="Botswana">
                      Africa/Gaborone
                    </option>
                    <option value="Africa/Harare" data-ctry="Zimbabwe">
                      Africa/Harare
                    </option>
                    <option
                      value="Africa/Johannesburg"
                      data-ctry="South Africa"
                    >
                      Africa/Johannesburg
                    </option>
                    <option
                      value="Africa/Juba"
                      data-ctry="Sudan, Republic of South"
                    >
                      Africa/Juba
                    </option>
                    <option value="Africa/Kampala" data-ctry="Uganda">
                      Africa/Kampala
                    </option>
                    <option
                      value="Africa/Khartoum"
                      data-ctry="Sudan, Republic of"
                    >
                      Africa/Khartoum
                    </option>
                    <option value="Africa/Kigali" data-ctry="Rwanda">
                      Africa/Kigali
                    </option>
                    <option
                      value="Africa/Kinshasa"
                      data-ctry="Congo, The Democratic Republic Of The"
                    >
                      Africa/Kinshasa
                    </option>
                    <option value="Africa/Lagos" data-ctry="Nigeria">
                      Africa/Lagos
                    </option>
                    <option value="Africa/Libreville" data-ctry="Gabon">
                      Africa/Libreville
                    </option>
                    <option value="Africa/Lome" data-ctry="Togo">
                      Africa/Lome
                    </option>
                    <option value="Africa/Luanda" data-ctry="Angola">
                      Africa/Luanda
                    </option>
                    <option
                      value="Africa/Lubumbashi"
                      data-ctry="Congo, The Democratic Republic Of The"
                    >
                      Africa/Lubumbashi
                    </option>
                    <option value="Africa/Lusaka" data-ctry="Zambia">
                      Africa/Lusaka
                    </option>
                    <option value="Africa/Malabo" data-ctry="Equatorial Guinea">
                      Africa/Malabo
                    </option>
                    <option value="Africa/Maputo" data-ctry="Mozambique">
                      Africa/Maputo
                    </option>
                    <option value="Africa/Maseru" data-ctry="Lesotho">
                      Africa/Maseru
                    </option>
                    <option value="Africa/Mbabane" data-ctry="Swaziland">
                      Africa/Mbabane
                    </option>
                    <option value="Africa/Mogadishu" data-ctry="Somalia">
                      Africa/Mogadishu
                    </option>
                    <option value="Africa/Monrovia" data-ctry="Liberia">
                      Africa/Monrovia
                    </option>
                    <option value="Africa/Nairobi" data-ctry="Kenya">
                      Africa/Nairobi
                    </option>
                    <option value="Africa/Ndjamena" data-ctry="Chad">
                      Africa/Ndjamena
                    </option>
                    <option value="Africa/Niamey" data-ctry="Niger">
                      Africa/Niamey
                    </option>
                    <option value="Africa/Nouakchott" data-ctry="Mauritania">
                      Africa/Nouakchott
                    </option>
                    <option value="Africa/Ouagadougou" data-ctry="Burkina Faso">
                      Africa/Ouagadougou
                    </option>
                    <option value="Africa/Porto-Novo" data-ctry="Benin">
                      Africa/Porto-Novo
                    </option>
                    <option
                      value="Africa/Sao_Tome"
                      data-ctry="Sao Tome And Principe"
                    >
                      Africa/Sao_Tome
                    </option>
                    <option value="Africa/Timbuktu" data-ctry="Mali">
                      Africa/Timbuktu
                    </option>
                    <option value="Africa/Tripoli" data-ctry="Libya">
                      Africa/Tripoli
                    </option>
                    <option value="Africa/Tunis" data-ctry="Tunisia">
                      Africa/Tunis
                    </option>
                    <option value="Africa/Windhoek" data-ctry="Namibia">
                      Africa/Windhoek
                    </option>
                    <option value="America/Adak" data-ctry="United States">
                      America/Adak
                    </option>
                    <option value="America/Anchorage" data-ctry="United States">
                      America/Anchorage
                    </option>
                    <option value="America/Anguilla" data-ctry="Anguilla">
                      America/Anguilla
                    </option>
                    <option
                      value="America/Antigua"
                      data-ctry="Antigua and Barbuda"
                    >
                      America/Antigua
                    </option>
                    <option value="America/Araguaina" data-ctry="Brazil">
                      America/Araguaina
                    </option>
                    <option
                      value="America/Argentina/Buenos_Aires"
                      data-ctry="Argentina"
                    >
                      America/Argentina/Buenos_Aires
                    </option>
                    <option
                      value="America/Argentina/Catamarca"
                      data-ctry="Argentina"
                    >
                      America/Argentina/Catamarca
                    </option>
                    <option
                      value="America/Argentina/Cordoba"
                      data-ctry="Argentina"
                    >
                      America/Argentina/Cordoba
                    </option>
                    <option
                      value="America/Argentina/Jujuy"
                      data-ctry="Argentina"
                    >
                      America/Argentina/Jujuy
                    </option>
                    <option
                      value="America/Argentina/La_Rioja"
                      data-ctry="Argentina"
                    >
                      America/Argentina/La_Rioja
                    </option>
                    <option
                      value="America/Argentina/Mendoza"
                      data-ctry="Argentina"
                    >
                      America/Argentina/Mendoza
                    </option>
                    <option
                      value="America/Argentina/Rio_Gallegos"
                      data-ctry="Argentina"
                    >
                      America/Argentina/Rio_Gallegos
                    </option>
                    <option
                      value="America/Argentina/Salta"
                      data-ctry="Argentina"
                    >
                      America/Argentina/Salta
                    </option>
                    <option
                      value="America/Argentina/San_Juan"
                      data-ctry="Argentina"
                    >
                      America/Argentina/San_Juan
                    </option>
                    <option
                      value="America/Argentina/San_Luis"
                      data-ctry="Argentina"
                    >
                      America/Argentina/San_Luis
                    </option>
                    <option
                      value="America/Argentina/Tucuman"
                      data-ctry="Argentina"
                    >
                      America/Argentina/Tucuman
                    </option>
                    <option
                      value="America/Argentina/Ushuaia"
                      data-ctry="Argentina"
                    >
                      America/Argentina/Ushuaia
                    </option>
                    <option value="America/Aruba" data-ctry="Aruba">
                      America/Aruba
                    </option>
                    <option value="America/Asuncion" data-ctry="Paraguay">
                      America/Asuncion
                    </option>
                    <option value="America/Atikokan" data-ctry="Canada">
                      America/Atikokan
                    </option>
                    <option value="America/Bahia" data-ctry="Brazil">
                      America/Bahia
                    </option>
                    <option value="America/Bahia_Banderas" data-ctry="Mexico">
                      America/Bahia_Banderas
                    </option>
                    <option value="America/Barbados" data-ctry="Barbados">
                      America/Barbados
                    </option>
                    <option value="America/Belem" data-ctry="Brazil">
                      America/Belem
                    </option>
                    <option value="America/Belize" data-ctry="Belize">
                      America/Belize
                    </option>
                    <option value="America/Blanc-Sablon" data-ctry="Canada">
                      America/Blanc-Sablon
                    </option>
                    <option value="America/Boa_Vista" data-ctry="Brazil">
                      America/Boa_Vista
                    </option>
                    <option value="America/Bogota" data-ctry="Colombia">
                      America/Bogota
                    </option>
                    <option value="America/Boise" data-ctry="United States">
                      America/Boise
                    </option>
                    <option value="America/Cambridge_Bay" data-ctry="Canada">
                      America/Cambridge_Bay
                    </option>
                    <option value="America/Campo_Grande" data-ctry="Brazil">
                      America/Campo_Grande
                    </option>
                    <option value="America/Cancun" data-ctry="Mexico">
                      America/Cancun
                    </option>
                    <option value="America/Caracas" data-ctry="Venezuela">
                      America/Caracas
                    </option>
                    <option value="America/Cayenne" data-ctry="French Guiana">
                      America/Cayenne
                    </option>
                    <option value="America/Cayman" data-ctry="Cayman Islands">
                      America/Cayman
                    </option>
                    <option value="America/Chicago" data-ctry="United States">
                      America/Chicago
                    </option>
                    <option value="America/Chihuahua" data-ctry="Mexico">
                      America/Chihuahua
                    </option>
                    <option value="America/Costa_Rica" data-ctry="Costa Rica">
                      America/Costa_Rica
                    </option>
                    <option value="America/Creston" data-ctry="Canada">
                      America/Creston
                    </option>
                    <option value="America/Cuiaba" data-ctry="Brazil">
                      America/Cuiaba
                    </option>
                    <option value="America/Curacao" data-ctry="Curacao">
                      America/Curacao
                    </option>
                    <option value="America/Danmarkshavn" data-ctry="Greenland">
                      America/Danmarkshavn
                    </option>
                    <option value="America/Dawson" data-ctry="Canada">
                      America/Dawson
                    </option>
                    <option value="America/Dawson_Creek" data-ctry="Canada">
                      America/Dawson_Creek
                    </option>
                    <option value="America/Denver" data-ctry="United States">
                      America/Denver
                    </option>
                    <option value="America/Detroit" data-ctry="United States">
                      America/Detroit
                    </option>
                    <option value="America/Dominica" data-ctry="Dominica">
                      America/Dominica
                    </option>
                    <option value="America/Edmonton" data-ctry="Canada">
                      America/Edmonton
                    </option>
                    <option value="America/Eirunepe" data-ctry="Brazil">
                      America/Eirunepe
                    </option>
                    <option value="America/El_Salvador" data-ctry="El Salvador">
                      America/El_Salvador
                    </option>
                    <option value="America/Fortaleza" data-ctry="Brazil">
                      America/Fortaleza
                    </option>
                    <option value="America/Glace_Bay" data-ctry="Canada">
                      America/Glace_Bay
                    </option>
                    <option value="America/Godthab" data-ctry="Greenland">
                      America/Godthab
                    </option>
                    <option value="America/Goose_Bay" data-ctry="Canada">
                      America/Goose_Bay
                    </option>
                    <option
                      value="America/Grand_Turk"
                      data-ctry="Turks and Caicos Islands"
                    >
                      America/Grand_Turk
                    </option>
                    <option value="America/Grenada" data-ctry="Grenada">
                      America/Grenada
                    </option>
                    <option value="America/Guadeloupe" data-ctry="Guadeloupe">
                      America/Guadeloupe
                    </option>
                    <option value="America/Guatemala" data-ctry="Guatemala">
                      America/Guatemala
                    </option>
                    <option value="America/Guayaquil" data-ctry="Ecuador">
                      America/Guayaquil
                    </option>
                    <option value="America/Guyana" data-ctry="Guyana">
                      America/Guyana
                    </option>
                    <option value="America/Halifax" data-ctry="Canada">
                      America/Halifax
                    </option>
                    <option value="America/Havana" data-ctry="Cuba">
                      America/Havana
                    </option>
                    <option value="America/Hermosillo" data-ctry="Mexico">
                      America/Hermosillo
                    </option>
                    <option
                      value="America/Indiana/Indianapolis"
                      data-ctry="United States"
                    >
                      America/Indiana/Indianapolis
                    </option>
                    <option
                      value="America/Indiana/Knox"
                      data-ctry="United States"
                    >
                      America/Indiana/Knox
                    </option>
                    <option
                      value="America/Indiana/Marengo"
                      data-ctry="United States"
                    >
                      America/Indiana/Marengo
                    </option>
                    <option
                      value="America/Indiana/Petersburg"
                      data-ctry="United States"
                    >
                      America/Indiana/Petersburg
                    </option>
                    <option
                      value="America/Indiana/Tell_City"
                      data-ctry="United States"
                    >
                      America/Indiana/Tell_City
                    </option>
                    <option
                      value="America/Indiana/Valparaiso"
                      data-ctry="United States"
                    >
                      America/Indiana/Valparaiso
                    </option>
                    <option
                      value="America/Indiana/Vevay"
                      data-ctry="United States"
                    >
                      America/Indiana/Vevay
                    </option>
                    <option
                      value="America/Indiana/Vincennes"
                      data-ctry="United States"
                    >
                      America/Indiana/Vincennes
                    </option>
                    <option
                      value="America/Indiana/Winamac"
                      data-ctry="United States"
                    >
                      America/Indiana/Winamac
                    </option>
                    <option value="America/Inuvik" data-ctry="Canada">
                      America/Inuvik
                    </option>
                    <option value="America/Iqaluit" data-ctry="Canada">
                      America/Iqaluit
                    </option>
                    <option value="America/Jamaica" data-ctry="Jamaica">
                      America/Jamaica
                    </option>
                    <option value="America/Juneau" data-ctry="United States">
                      America/Juneau
                    </option>
                    <option
                      value="America/Kentucky/Louisville"
                      data-ctry="United States"
                    >
                      America/Kentucky/Louisville
                    </option>
                    <option
                      value="America/Kentucky/Monticello"
                      data-ctry="United States"
                    >
                      America/Kentucky/Monticello
                    </option>
                    <option value="America/Kralendijk" data-ctry="Netherlands">
                      America/Kralendijk
                    </option>
                    <option value="America/La_Paz" data-ctry="Bolivia">
                      America/La_Paz
                    </option>
                    <option value="America/Lima" data-ctry="Peru">
                      America/Lima
                    </option>
                    <option
                      value="America/Los_Angeles"
                      data-ctry="United States"
                    >
                      America/Los_Angeles
                    </option>
                    <option
                      value="America/Lower_Princes"
                      data-ctry="Sint Maarten"
                    >
                      America/Lower_Princes
                    </option>
                    <option value="America/Maceio" data-ctry="Brazil">
                      America/Maceio
                    </option>
                    <option value="America/Managua" data-ctry="Nicaragua">
                      America/Managua
                    </option>
                    <option value="America/Manaus" data-ctry="Brazil">
                      America/Manaus
                    </option>
                    <option
                      value="America/Marigot"
                      data-ctry="Saint Martin, Collectivity of"
                    >
                      America/Marigot
                    </option>
                    <option value="America/Martinique" data-ctry="Martinique">
                      America/Martinique
                    </option>
                    <option value="America/Matamoros" data-ctry="Mexico">
                      America/Matamoros
                    </option>
                    <option value="America/Mazatlan" data-ctry="Mexico">
                      America/Mazatlan
                    </option>
                    <option value="America/Menominee" data-ctry="United States">
                      America/Menominee
                    </option>
                    <option value="America/Merida" data-ctry="Mexico">
                      America/Merida
                    </option>
                    <option
                      value="America/Metlakatla"
                      data-ctry="United States"
                    >
                      America/Metlakatla
                    </option>
                    <option value="America/Mexico_City" data-ctry="Mexico">
                      America/Mexico_City
                    </option>
                    <option
                      value="America/Miquelon"
                      data-ctry="Saint Pierre and Miquelon"
                    >
                      America/Miquelon
                    </option>
                    <option value="America/Moncton" data-ctry="Canada">
                      America/Moncton
                    </option>
                    <option value="America/Monterrey" data-ctry="Mexico">
                      America/Monterrey
                    </option>
                    <option value="America/Montevideo" data-ctry="Uruguay">
                      America/Montevideo
                    </option>
                    <option value="America/Montreal" data-ctry="Canada">
                      America/Montreal
                    </option>
                    <option value="America/Montserrat" data-ctry="Montserrat">
                      America/Montserrat
                    </option>
                    <option value="America/Nassau" data-ctry="Bahamas">
                      America/Nassau
                    </option>
                    <option value="America/New_York" data-ctry="United States">
                      America/New_York
                    </option>
                    <option value="America/Nipigon" data-ctry="Canada">
                      America/Nipigon
                    </option>
                    <option value="America/Nome" data-ctry="United States">
                      America/Nome
                    </option>
                    <option value="America/Noronha" data-ctry="Brazil">
                      America/Noronha
                    </option>
                    <option
                      value="America/North_Dakota/Beulah"
                      data-ctry="United States"
                    >
                      America/North_Dakota/Beulah
                    </option>
                    <option
                      value="America/North_Dakota/Center"
                      data-ctry="United States"
                    >
                      America/North_Dakota/Center
                    </option>
                    <option
                      value="America/North_Dakota/New_Salem"
                      data-ctry="United States"
                    >
                      America/North_Dakota/New_Salem
                    </option>
                    <option value="America/Ojinaga" data-ctry="Mexico">
                      America/Ojinaga
                    </option>
                    <option value="America/Panama" data-ctry="Panama">
                      America/Panama
                    </option>
                    <option value="America/Pangnirtung" data-ctry="Canada">
                      America/Pangnirtung
                    </option>
                    <option value="America/Paramaribo" data-ctry="Suriname">
                      America/Paramaribo
                    </option>
                    <option value="America/Phoenix" data-ctry="United States">
                      America/Phoenix
                    </option>
                    <option
                      value="America/Port_of_Spain"
                      data-ctry="Trinidad and Tobago"
                    >
                      America/Port_of_Spain
                    </option>
                    <option value="America/Port-au-Prince" data-ctry="Haiti">
                      America/Port-au-Prince
                    </option>
                    <option value="America/Porto_Velho" data-ctry="Brazil">
                      America/Porto_Velho
                    </option>
                    <option value="America/Puerto_Rico" data-ctry="Puerto Rico">
                      America/Puerto_Rico
                    </option>
                    <option value="America/Rainy_River" data-ctry="Canada">
                      America/Rainy_River
                    </option>
                    <option value="America/Rankin_Inlet" data-ctry="Canada">
                      America/Rankin_Inlet
                    </option>
                    <option value="America/Recife" data-ctry="Brazil">
                      America/Recife
                    </option>
                    <option value="America/Regina" data-ctry="Canada">
                      America/Regina
                    </option>
                    <option value="America/Resolute" data-ctry="Canada">
                      America/Resolute
                    </option>
                    <option value="America/Rio_Branco" data-ctry="Brazil">
                      America/Rio_Branco
                    </option>
                    <option value="America/Santa_Isabel" data-ctry="Mexico">
                      America/Santa_Isabel
                    </option>
                    <option value="America/Santarem" data-ctry="Brazil">
                      America/Santarem
                    </option>
                    <option value="America/Santiago" data-ctry="Chile">
                      America/Santiago
                    </option>
                    <option
                      value="America/Santo_Domingo"
                      data-ctry="Dominican Republic"
                    >
                      America/Santo_Domingo
                    </option>
                    <option value="America/Sao_Paulo" data-ctry="Brazil">
                      America/Sao_Paulo
                    </option>
                    <option value="America/Scoresbysund" data-ctry="Greenland">
                      America/Scoresbysund
                    </option>
                    <option value="America/Sitka" data-ctry="United States">
                      America/Sitka
                    </option>
                    <option
                      value="America/St_Barthelemy"
                      data-ctry="Saint Barthélemy"
                    >
                      America/St_Barthelemy
                    </option>
                    <option value="America/St_Johns" data-ctry="Canada">
                      America/St_Johns
                    </option>
                    <option
                      value="America/St_Kitts"
                      data-ctry="Saint Kitts and Nevis"
                    >
                      America/St_Kitts
                    </option>
                    <option value="America/St_Lucia" data-ctry="Saint Lucia">
                      America/St_Lucia
                    </option>
                    <option
                      value="America/St_Thomas"
                      data-ctry="Virgin Islands, U.S."
                    >
                      America/St_Thomas
                    </option>
                    <option
                      value="America/St_Vincent"
                      data-ctry="Saint Vincent and the Grenadines"
                    >
                      America/St_Vincent
                    </option>
                    <option value="America/Swift_Current" data-ctry="Canada">
                      America/Swift_Current
                    </option>
                    <option value="America/Tegucigalpa" data-ctry="Honduras">
                      America/Tegucigalpa
                    </option>
                    <option value="America/Thule" data-ctry="Greenland">
                      America/Thule
                    </option>
                    <option value="America/Thunder_Bay" data-ctry="Canada">
                      America/Thunder_Bay
                    </option>
                    <option value="America/Tijuana" data-ctry="Mexico">
                      America/Tijuana
                    </option>
                    <option value="America/Toronto" data-ctry="Canada">
                      America/Toronto
                    </option>
                    <option
                      value="America/Tortola"
                      data-ctry="Virgin Islands, British"
                    >
                      America/Tortola
                    </option>
                    <option value="America/Vancouver" data-ctry="Canada">
                      America/Vancouver
                    </option>
                    <option value="America/Whitehorse" data-ctry="Canada">
                      America/Whitehorse
                    </option>
                    <option value="America/Winnipeg" data-ctry="Canada">
                      America/Winnipeg
                    </option>
                    <option value="America/Yakutat" data-ctry="United States">
                      America/Yakutat
                    </option>
                    <option value="America/Yellowknife" data-ctry="Canada">
                      America/Yellowknife
                    </option>
                    <option value="Antarctica/Casey" data-ctry="Antarctica">
                      Antarctica/Casey
                    </option>
                    <option value="Antarctica/Davis" data-ctry="Antarctica">
                      Antarctica/Davis
                    </option>
                    <option
                      value="Antarctica/DumontDUrville"
                      data-ctry="Antarctica"
                    >
                      Antarctica/DumontDUrville
                    </option>
                    <option value="Antarctica/Macquarie" data-ctry="Antarctica">
                      Antarctica/Macquarie
                    </option>
                    <option value="Antarctica/Mawson" data-ctry="Antarctica">
                      Antarctica/Mawson
                    </option>
                    <option value="Antarctica/McMurdo" data-ctry="Antarctica">
                      Antarctica/McMurdo
                    </option>
                    <option value="Antarctica/Palmer" data-ctry="Antarctica">
                      Antarctica/Palmer
                    </option>
                    <option value="Antarctica/Rothera" data-ctry="Antarctica">
                      Antarctica/Rothera
                    </option>
                    <option value="Antarctica/Syowa" data-ctry="Antarctica">
                      Antarctica/Syowa
                    </option>
                    <option value="Antarctica/Troll" data-ctry="Antarctica">
                      Antarctica/Troll
                    </option>
                    <option value="Antarctica/Vostok" data-ctry="Antarctica">
                      Antarctica/Vostok
                    </option>
                    <option
                      value="Arctic/Longyearbyen"
                      data-ctry="Svalbard and Jan Mayen"
                    >
                      Arctic/Longyearbyen
                    </option>
                    <option value="Asia/Aden" data-ctry="Yemen">
                      Asia/Aden
                    </option>
                    <option value="Asia/Almaty" data-ctry="Kazakhstan">
                      Asia/Almaty
                    </option>
                    <option value="Asia/Amman" data-ctry="Jordan">
                      Asia/Amman
                    </option>
                    <option value="Asia/Anadyr" data-ctry="Russian Federation">
                      Asia/Anadyr
                    </option>
                    <option value="Asia/Aqtau" data-ctry="Kazakhstan">
                      Asia/Aqtau
                    </option>
                    <option value="Asia/Aqtobe" data-ctry="Kazakhstan">
                      Asia/Aqtobe
                    </option>
                    <option value="Asia/Ashgabat" data-ctry="Turkmenistan">
                      Asia/Ashgabat
                    </option>
                    <option value="Asia/Baghdad" data-ctry="Iraq">
                      Asia/Baghdad
                    </option>
                    <option value="Asia/Bahrain" data-ctry="Bahrain">
                      Asia/Bahrain
                    </option>
                    <option value="Asia/Baku" data-ctry="Azerbaijan">
                      Asia/Baku
                    </option>
                    <option value="Asia/Bangkok" data-ctry="Thailand">
                      Asia/Bangkok
                    </option>
                    <option value="Asia/Beirut" data-ctry="Lebanon">
                      Asia/Beirut
                    </option>
                    <option value="Asia/Bishkek" data-ctry="Kyrgyzstan">
                      Asia/Bishkek
                    </option>
                    <option value="Asia/Brunei" data-ctry="Brunei">
                      Asia/Brunei
                    </option>
                    <option value="Asia/Choibalsan" data-ctry="Mongolia">
                      Asia/Choibalsan
                    </option>
                    <option value="Asia/Chongqing" data-ctry="China">
                      Asia/Chongqing
                    </option>
                    <option value="Asia/Colombo" data-ctry="Sri Lanka">
                      Asia/Colombo
                    </option>
                    <option
                      value="Asia/Damascus"
                      data-ctry="Syrian Arab Republic"
                    >
                      Asia/Damascus
                    </option>
                    <option value="Asia/Dhaka" data-ctry="Bangladesh">
                      Asia/Dhaka
                    </option>
                    <option value="Asia/Dili" data-ctry="Timor-Leste">
                      Asia/Dili
                    </option>
                    <option value="Asia/Dubai" data-ctry="United Arab Emirates">
                      Asia/Dubai
                    </option>
                    <option value="Asia/Dushanbe" data-ctry="Tajikistan">
                      Asia/Dushanbe
                    </option>
                    <option
                      value="Asia/Gaza"
                      data-ctry="Palestinian Territory, Occupied"
                    >
                      Asia/Gaza
                    </option>
                    <option value="Asia/Harbin" data-ctry="China">
                      Asia/Harbin
                    </option>
                    <option
                      value="Asia/Hebron"
                      data-ctry="Palestinian Territory, Occupied"
                    >
                      Asia/Hebron
                    </option>
                    <option
                      value="Asia/Ho_Chi_Minh"
                      data-ctry="Vietnam, Socialist Republic of"
                    >
                      Asia/Ho_Chi_Minh
                    </option>
                    <option value="Asia/Hong_Kong" data-ctry="Hong Kong">
                      Asia/Hong_Kong
                    </option>
                    <option value="Asia/Hovd" data-ctry="Mongolia">
                      Asia/Hovd
                    </option>
                    <option value="Asia/Irkutsk" data-ctry="Russian Federation">
                      Asia/Irkutsk
                    </option>
                    <option value="Asia/Istanbul" data-ctry="Turkey">
                      Asia/Istanbul
                    </option>
                    <option value="Asia/Jakarta" data-ctry="Indonesia">
                      Asia/Jakarta
                    </option>
                    <option value="Asia/Jayapura" data-ctry="Indonesia">
                      Asia/Jayapura
                    </option>
                    <option value="Asia/Jerusalem" data-ctry="Israel">
                      Asia/Jerusalem
                    </option>
                    <option value="Asia/Kabul" data-ctry="Afghanistan">
                      Asia/Kabul
                    </option>
                    <option
                      value="Asia/Kamchatka"
                      data-ctry="Russian Federation"
                    >
                      Asia/Kamchatka
                    </option>
                    <option value="Asia/Karachi" data-ctry="Pakistan">
                      Asia/Karachi
                    </option>
                    <option value="Asia/Kashgar" data-ctry="China">
                      Asia/Kashgar
                    </option>
                    <option value="Asia/Kathmandu" data-ctry="Nepal">
                      Asia/Kathmandu
                    </option>
                    <option
                      value="Asia/Khandyga"
                      data-ctry="Russian Federation"
                    >
                      Asia/Khandyga
                    </option>
                    <option value="Asia/Kolkata" data-ctry="India">
                      Asia/Kolkata
                    </option>
                    <option
                      value="Asia/Krasnoyarsk"
                      data-ctry="Russian Federation"
                    >
                      Asia/Krasnoyarsk
                    </option>
                    <option value="Asia/Kuala_Lumpur" data-ctry="Malaysia">
                      Asia/Kuala_Lumpur
                    </option>
                    <option value="Asia/Kuching" data-ctry="Malaysia">
                      Asia/Kuching
                    </option>
                    <option value="Asia/Kuwait" data-ctry="Kuwait">
                      Asia/Kuwait
                    </option>
                    <option value="Asia/Macau" data-ctry="Macau">
                      Asia/Macau
                    </option>
                    <option value="Asia/Magadan" data-ctry="Russian Federation">
                      Asia/Magadan
                    </option>
                    <option value="Asia/Makassar" data-ctry="Indonesia">
                      Asia/Makassar
                    </option>
                    <option value="Asia/Manila" data-ctry="Philippines">
                      Asia/Manila
                    </option>
                    <option value="Asia/Muscat" data-ctry="Oman">
                      Asia/Muscat
                    </option>
                    <option value="Asia/Nicosia" data-ctry="Cyprus">
                      Asia/Nicosia
                    </option>
                    <option
                      value="Asia/Novokuznetsk"
                      data-ctry="Russian Federation"
                    >
                      Asia/Novokuznetsk
                    </option>
                    <option
                      value="Asia/Novosibirsk"
                      data-ctry="Russian Federation"
                    >
                      Asia/Novosibirsk
                    </option>
                    <option value="Asia/Omsk" data-ctry="Russian Federation">
                      Asia/Omsk
                    </option>
                    <option value="Asia/Oral" data-ctry="Kazakhstan">
                      Asia/Oral
                    </option>
                    <option value="Asia/Phnom_Penh" data-ctry="Cambodia">
                      Asia/Phnom_Penh
                    </option>
                    <option value="Asia/Pontianak" data-ctry="Indonesia">
                      Asia/Pontianak
                    </option>
                    <option
                      value="Asia/Pyongyang"
                      data-ctry="Korea, Democratic People's Republic Of"
                    >
                      Asia/Pyongyang
                    </option>
                    <option value="Asia/Qatar" data-ctry="Qatar">
                      Asia/Qatar
                    </option>
                    <option value="Asia/Qyzylorda" data-ctry="Kazakhstan">
                      Asia/Qyzylorda
                    </option>
                    <option value="Asia/Rangoon" data-ctry="Myanmar">
                      Asia/Rangoon
                    </option>
                    <option value="Asia/Riyadh" data-ctry="Saudi Arabia">
                      Asia/Riyadh
                    </option>
                    <option
                      value="Asia/Sakhalin"
                      data-ctry="Russian Federation"
                    >
                      Asia/Sakhalin
                    </option>
                    <option value="Asia/Samarkand" data-ctry="Uzbekistan">
                      Asia/Samarkand
                    </option>
                    <option value="Asia/Seoul" data-ctry="Korea, Republic Of">
                      Asia/Seoul
                    </option>
                    <option value="Asia/Shanghai" data-ctry="China">
                      Asia/Shanghai
                    </option>
                    <option value="Asia/Singapore" data-ctry="Singapore">
                      Asia/Singapore
                    </option>
                    <option value="Asia/Taipei" data-ctry="Taiwan">
                      Asia/Taipei
                    </option>
                    <option value="Asia/Tashkent" data-ctry="Uzbekistan">
                      Asia/Tashkent
                    </option>
                    <option value="Asia/Tbilisi" data-ctry="Georgia">
                      Asia/Tbilisi
                    </option>
                    <option
                      value="Asia/Tehran"
                      data-ctry="Iran, Islamic Republic Of"
                    >
                      Asia/Tehran
                    </option>
                    <option value="Asia/Thimphu" data-ctry="Bhutan">
                      Asia/Thimphu
                    </option>
                    <option value="Asia/Tokyo" data-ctry="Japan">
                      Asia/Tokyo
                    </option>
                    <option value="Asia/Ulaanbaatar" data-ctry="Mongolia">
                      Asia/Ulaanbaatar
                    </option>
                    <option value="Asia/Urumqi" data-ctry="China">
                      Asia/Urumqi
                    </option>
                    <option
                      value="Asia/Ust-Nera"
                      data-ctry="Russian Federation"
                    >
                      Asia/Ust-Nera
                    </option>
                    <option
                      value="Asia/Vientiane"
                      data-ctry="Lao People's Democratic Republic"
                    >
                      Asia/Vientiane
                    </option>
                    <option
                      value="Asia/Vladivostok"
                      data-ctry="Russian Federation"
                    >
                      Asia/Vladivostok
                    </option>
                    <option value="Asia/Yakutsk" data-ctry="Russian Federation">
                      Asia/Yakutsk
                    </option>
                    <option
                      value="Asia/Yekaterinburg"
                      data-ctry="Russian Federation"
                    >
                      Asia/Yekaterinburg
                    </option>
                    <option value="Asia/Yerevan" data-ctry="Armenia">
                      Asia/Yerevan
                    </option>
                    <option value="Atlantic/Azores" data-ctry="Portugal">
                      Atlantic/Azores
                    </option>
                    <option value="Atlantic/Bermuda" data-ctry="Bermuda">
                      Atlantic/Bermuda
                    </option>
                    <option value="Atlantic/Canary" data-ctry="Spain">
                      Atlantic/Canary
                    </option>
                    <option value="Atlantic/Cape_Verde" data-ctry="Cape Verde">
                      Atlantic/Cape_Verde
                    </option>
                    <option value="Atlantic/Faroe" data-ctry="Faroe Islands">
                      Atlantic/Faroe
                    </option>
                    <option value="Atlantic/Madeira" data-ctry="Portugal">
                      Atlantic/Madeira
                    </option>
                    <option value="Atlantic/Reykjavik" data-ctry="Iceland">
                      Atlantic/Reykjavik
                    </option>
                    <option
                      value="Atlantic/South_Georgia"
                      data-ctry="South Georgia and the South Sandwich Islands"
                    >
                      Atlantic/South_Georgia
                    </option>
                    <option value="Atlantic/St_Helena" data-ctry="Saint Helena">
                      Atlantic/St_Helena
                    </option>
                    <option
                      value="Atlantic/Stanley"
                      data-ctry="Falkland Islands (Malvinas)"
                    >
                      Atlantic/Stanley
                    </option>
                    <option value="Australia/Adelaide" data-ctry="Australia">
                      Australia/Adelaide
                    </option>
                    <option value="Australia/Brisbane" data-ctry="Australia">
                      Australia/Brisbane
                    </option>
                    <option value="Australia/Broken_Hill" data-ctry="Australia">
                      Australia/Broken_Hill
                    </option>
                    <option value="Australia/Currie" data-ctry="Australia">
                      Australia/Currie
                    </option>
                    <option value="Australia/Darwin" data-ctry="Australia">
                      Australia/Darwin
                    </option>
                    <option value="Australia/Eucla" data-ctry="Australia">
                      Australia/Eucla
                    </option>
                    <option value="Australia/Hobart" data-ctry="Australia">
                      Australia/Hobart
                    </option>
                    <option value="Australia/Lindeman" data-ctry="Australia">
                      Australia/Lindeman
                    </option>
                    <option value="Australia/Lord_Howe" data-ctry="Australia">
                      Australia/Lord_Howe
                    </option>
                    <option value="Australia/Melbourne" data-ctry="Australia">
                      Australia/Melbourne
                    </option>
                    <option value="Australia/Perth" data-ctry="Australia">
                      Australia/Perth
                    </option>
                    <option value="Australia/Sydney" data-ctry="Australia">
                      Australia/Sydney
                    </option>
                    <option value="Etc/GMT" data-ctry="United Kingdom">
                      Etc/GMT
                    </option>
                    <option value="Etc/GMT+0" data-ctry="United Kingdom">
                      Etc/GMT+0
                    </option>
                    <option value="Etc/UCT" data-ctry="United Kingdom">
                      Etc/UCT
                    </option>
                    <option value="Etc/Universal" data-ctry="United Kingdom">
                      Etc/Universal
                    </option>
                    <option value="Etc/UTC" data-ctry="United Kingdom">
                      Etc/UTC
                    </option>
                    <option value="Etc/Zulu" data-ctry="United Kingdom">
                      Etc/Zulu
                    </option>
                    <option value="Europe/Amsterdam" data-ctry="Netherlands">
                      Europe/Amsterdam
                    </option>
                    <option value="Europe/Andorra" data-ctry="Andorra">
                      Europe/Andorra
                    </option>
                    <option value="Europe/Athens" data-ctry="Greece">
                      Europe/Athens
                    </option>
                    <option value="Europe/Belgrade" data-ctry="Serbia">
                      Europe/Belgrade
                    </option>
                    <option value="Europe/Berlin" data-ctry="Germany">
                      Europe/Berlin
                    </option>
                    <option value="Europe/Bratislava" data-ctry="Slovakia">
                      Europe/Bratislava
                    </option>
                    <option value="Europe/Brussels" data-ctry="Belgium">
                      Europe/Brussels
                    </option>
                    <option value="Europe/Bucharest" data-ctry="Romania">
                      Europe/Bucharest
                    </option>
                    <option value="Europe/Budapest" data-ctry="Hungary">
                      Europe/Budapest
                    </option>
                    <option value="Europe/Busingen" data-ctry="Germany">
                      Europe/Busingen
                    </option>
                    <option
                      value="Europe/Chisinau"
                      data-ctry="Moldova, Republic Of"
                    >
                      Europe/Chisinau
                    </option>
                    <option value="Europe/Copenhagen" data-ctry="Denmark">
                      Europe/Copenhagen
                    </option>
                    <option value="Europe/Dublin" data-ctry="Ireland">
                      Europe/Dublin
                    </option>
                    <option value="Europe/Gibraltar" data-ctry="Gibraltar">
                      Europe/Gibraltar
                    </option>
                    <option value="Europe/Guernsey" data-ctry="Guernsey">
                      Europe/Guernsey
                    </option>
                    <option value="Europe/Helsinki" data-ctry="Finland">
                      Europe/Helsinki
                    </option>
                    <option value="Europe/Isle_of_Man" data-ctry="Isle of Man">
                      Europe/Isle_of_Man
                    </option>
                    <option value="Europe/Istanbul" data-ctry="Turkey">
                      Europe/Istanbul
                    </option>
                    <option value="Europe/Jersey" data-ctry="Jersey">
                      Europe/Jersey
                    </option>
                    <option
                      value="Europe/Kaliningrad"
                      data-ctry="Russian Federation"
                    >
                      Europe/Kaliningrad
                    </option>
                    <option value="Europe/Kiev" data-ctry="Ukraine">
                      Europe/Kiev
                    </option>
                    <option value="Europe/Lisbon" data-ctry="Portugal">
                      Europe/Lisbon
                    </option>
                    <option value="Europe/Ljubljana" data-ctry="Slovenia">
                      Europe/Ljubljana
                    </option>
                    <option value="Europe/London" data-ctry="United Kingdom">
                      Europe/London
                    </option>
                    <option value="Europe/Luxembourg" data-ctry="Luxembourg">
                      Europe/Luxembourg
                    </option>
                    <option value="Europe/Madrid" data-ctry="Spain">
                      Europe/Madrid
                    </option>
                    <option value="Europe/Malta" data-ctry="Malta">
                      Europe/Malta
                    </option>
                    <option value="Europe/Mariehamn" data-ctry="Aaland Islands">
                      Europe/Mariehamn
                    </option>
                    <option value="Europe/Minsk" data-ctry="Belarus">
                      Europe/Minsk
                    </option>
                    <option value="Europe/Monaco" data-ctry="Monaco">
                      Europe/Monaco
                    </option>
                    <option
                      value="Europe/Moscow"
                      data-ctry="Russian Federation"
                    >
                      Europe/Moscow
                    </option>
                    <option value="Europe/Nicosia" data-ctry="Cyprus">
                      Europe/Nicosia
                    </option>
                    <option value="Europe/Oslo" data-ctry="Norway">
                      Europe/Oslo
                    </option>
                    <option value="Europe/Paris" data-ctry="France">
                      Europe/Paris
                    </option>
                    <option value="Europe/Podgorica" data-ctry="Montenegro">
                      Europe/Podgorica
                    </option>
                    <option value="Europe/Prague" data-ctry="Czech Republic">
                      Europe/Prague
                    </option>
                    <option value="Europe/Riga" data-ctry="Latvia">
                      Europe/Riga
                    </option>
                    <option value="Europe/Rome" data-ctry="Italy">
                      Europe/Rome
                    </option>
                    <option
                      value="Europe/Samara"
                      data-ctry="Russian Federation"
                    >
                      Europe/Samara
                    </option>
                    <option value="Europe/San_Marino" data-ctry="San Marino">
                      Europe/San_Marino
                    </option>
                    <option
                      value="Europe/Sarajevo"
                      data-ctry="Bosnia And Herzegovina"
                    >
                      Europe/Sarajevo
                    </option>
                    <option
                      value="Europe/Simferopol"
                      data-ctry="Russian Federation"
                    >
                      Europe/Simferopol
                    </option>
                    <option
                      value="Europe/Skopje"
                      data-ctry="Macedonia, The Former Yugoslav Republic Of"
                    >
                      Europe/Skopje
                    </option>
                    <option value="Europe/Sofia" data-ctry="Bulgaria">
                      Europe/Sofia
                    </option>
                    <option value="Europe/Stockholm" data-ctry="Sweden">
                      Europe/Stockholm
                    </option>
                    <option value="Europe/Tallinn" data-ctry="Estonia">
                      Europe/Tallinn
                    </option>
                    <option value="Europe/Tirane" data-ctry="Albania">
                      Europe/Tirane
                    </option>
                    <option value="Europe/Uzhgorod" data-ctry="Ukraine">
                      Europe/Uzhgorod
                    </option>
                    <option value="Europe/Vaduz" data-ctry="Liechtenstein">
                      Europe/Vaduz
                    </option>
                    <option value="Europe/Vatican" data-ctry="Vatican City">
                      Europe/Vatican
                    </option>
                    <option value="Europe/Vienna" data-ctry="Austria">
                      Europe/Vienna
                    </option>
                    <option value="Europe/Vilnius" data-ctry="Lithuania">
                      Europe/Vilnius
                    </option>
                    <option
                      value="Europe/Volgograd"
                      data-ctry="Russian Federation"
                    >
                      Europe/Volgograd
                    </option>
                    <option value="Europe/Warsaw" data-ctry="Poland">
                      Europe/Warsaw
                    </option>
                    <option value="Europe/Zagreb" data-ctry="Croatia">
                      Europe/Zagreb
                    </option>
                    <option value="Europe/Zaporozhye" data-ctry="Ukraine">
                      Europe/Zaporozhye
                    </option>
                    <option value="Europe/Zurich" data-ctry="Switzerland">
                      Europe/Zurich
                    </option>
                    <option value="GMT" data-ctry="United Kingdom">
                      GMT
                    </option>
                    <option value="Indian/Antananarivo" data-ctry="Madagascar">
                      Indian/Antananarivo
                    </option>
                    <option
                      value="Indian/Chagos"
                      data-ctry="British Indian Ocean Territory"
                    >
                      Indian/Chagos
                    </option>
                    <option
                      value="Indian/Christmas"
                      data-ctry="Christmas Island"
                    >
                      Indian/Christmas
                    </option>
                    <option
                      value="Indian/Cocos"
                      data-ctry="Cocos (Keeling) Islands"
                    >
                      Indian/Cocos
                    </option>
                    <option value="Indian/Comoro" data-ctry="Comoros">
                      Indian/Comoro
                    </option>
                    <option
                      value="Indian/Kerguelen"
                      data-ctry="French Southern And Antarctic Lands, Territory of"
                    >
                      Indian/Kerguelen
                    </option>
                    <option value="Indian/Mahe" data-ctry="Seychelles">
                      Indian/Mahe
                    </option>
                    <option value="Indian/Maldives" data-ctry="Maldives">
                      Indian/Maldives
                    </option>
                    <option value="Indian/Mauritius" data-ctry="Mauritius">
                      Indian/Mauritius
                    </option>
                    <option value="Indian/Mayotte" data-ctry="Mayotte">
                      Indian/Mayotte
                    </option>
                    <option value="Indian/Reunion" data-ctry="Reunion">
                      Indian/Reunion
                    </option>
                    <option
                      value="Pacific/Apia"
                      data-ctry="Samoa, Independent State of"
                    >
                      Pacific/Apia
                    </option>
                    <option value="Pacific/Auckland" data-ctry="New Zealand">
                      Pacific/Auckland
                    </option>
                    <option value="Pacific/Chatham" data-ctry="New Zealand">
                      Pacific/Chatham
                    </option>
                    <option
                      value="Pacific/Chuuk"
                      data-ctry="Micronesia, Federated States Of"
                    >
                      Pacific/Chuuk
                    </option>
                    <option value="Pacific/Easter" data-ctry="Chile">
                      Pacific/Easter
                    </option>
                    <option value="Pacific/Efate" data-ctry="Vanuatu">
                      Pacific/Efate
                    </option>
                    <option value="Pacific/Enderbury" data-ctry="Kiribati">
                      Pacific/Enderbury
                    </option>
                    <option value="Pacific/Fakaofo" data-ctry="Tokelau">
                      Pacific/Fakaofo
                    </option>
                    <option value="Pacific/Fiji" data-ctry="Fiji">
                      Pacific/Fiji
                    </option>
                    <option value="Pacific/Funafuti" data-ctry="Tuvalu">
                      Pacific/Funafuti
                    </option>
                    <option value="Pacific/Galapagos" data-ctry="Ecuador">
                      Pacific/Galapagos
                    </option>
                    <option
                      value="Pacific/Gambier"
                      data-ctry="French Polynesia"
                    >
                      Pacific/Gambier
                    </option>
                    <option
                      value="Pacific/Guadalcanal"
                      data-ctry="Solomon Islands"
                    >
                      Pacific/Guadalcanal
                    </option>
                    <option value="Pacific/Guam" data-ctry="Guam">
                      Pacific/Guam
                    </option>
                    <option value="Pacific/Honolulu" data-ctry="United States">
                      Pacific/Honolulu
                    </option>
                    <option
                      value="Pacific/Johnston"
                      data-ctry="United States Minor Outlying Islands"
                    >
                      Pacific/Johnston
                    </option>
                    <option value="Pacific/Kiritimati" data-ctry="Kiribati">
                      Pacific/Kiritimati
                    </option>
                    <option
                      value="Pacific/Kosrae"
                      data-ctry="Micronesia, Federated States Of"
                    >
                      Pacific/Kosrae
                    </option>
                    <option
                      value="Pacific/Kwajalein"
                      data-ctry="Marshall Islands"
                    >
                      Pacific/Kwajalein
                    </option>
                    <option value="Pacific/Majuro" data-ctry="Marshall Islands">
                      Pacific/Majuro
                    </option>
                    <option
                      value="Pacific/Marquesas"
                      data-ctry="French Polynesia"
                    >
                      Pacific/Marquesas
                    </option>
                    <option
                      value="Pacific/Midway"
                      data-ctry="United States Minor Outlying Islands"
                    >
                      Pacific/Midway
                    </option>
                    <option value="Pacific/Nauru" data-ctry="Nauru">
                      Pacific/Nauru
                    </option>
                    <option value="Pacific/Niue" data-ctry="Niue">
                      Pacific/Niue
                    </option>
                    <option value="Pacific/Norfolk" data-ctry="Norfolk Island">
                      Pacific/Norfolk
                    </option>
                    <option value="Pacific/Noumea" data-ctry="New Caledonia">
                      Pacific/Noumea
                    </option>
                    <option
                      value="Pacific/Pago_Pago"
                      data-ctry="American Samoa"
                    >
                      Pacific/Pago_Pago
                    </option>
                    <option value="Pacific/Palau" data-ctry="Palau">
                      Pacific/Palau
                    </option>
                    <option value="Pacific/Pitcairn" data-ctry="Pitcairn">
                      Pacific/Pitcairn
                    </option>
                    <option
                      value="Pacific/Pohnpei"
                      data-ctry="Micronesia, Federated States Of"
                    >
                      Pacific/Pohnpei
                    </option>
                    <option
                      value="Pacific/Port_Moresby"
                      data-ctry="Papua New Guinea"
                    >
                      Pacific/Port_Moresby
                    </option>
                    <option value="Pacific/Rarotonga" data-ctry="Cook Islands">
                      Pacific/Rarotonga
                    </option>
                    <option
                      value="Pacific/Saipan"
                      data-ctry="Northern Mariana Islands"
                    >
                      Pacific/Saipan
                    </option>
                    <option value="Pacific/Tahiti" data-ctry="French Polynesia">
                      Pacific/Tahiti
                    </option>
                    <option value="Pacific/Tarawa" data-ctry="Kiribati">
                      Pacific/Tarawa
                    </option>
                    <option value="Pacific/Tongatapu" data-ctry="Tonga">
                      Pacific/Tongatapu
                    </option>
                    <option
                      value="Pacific/Wake"
                      data-ctry="United States Minor Outlying Islands"
                    >
                      Pacific/Wake
                    </option>
                    <option
                      value="Pacific/Wallis"
                      data-ctry="Wallis And Futuna"
                    >
                      Pacific/Wallis
                    </option>
                  </select>
                  <span className="cont_arrow" />
                  <input
                    type="hidden"
                    name="agency_hdn_id"
                    id="agency_hdn_id"
                    defaultValue=""
                  />
                </div>
              </div>
              <div className="form-group col-sm-6">
                <label htmlFor="lang">
                  Language<span className="requ-left">Required</span>
                </label>
                <div className="custom_search_parent">
                  <select
                    id="lang"
                    name="language"
                    className="custom_search"
                    onChange={handleInputChange}
                    value={formData.language}
                  >
                    <option value="" disabled="disabled" selected="selected">
                      Select One
                    </option>
                    <option value="ab">Abkhazian (ab)</option>
                    <option value="aa">Afar (aa)</option>
                    <option value="af">Afrikaans (af)</option>
                    <option value="ak">Akan (ak)</option>
                    <option value="sq">Albanian (sq)</option>
                    <option value="am">Amharic (am)</option>
                    <option value="ar">Arabic (ar)</option>
                    <option value="an">Aragonese (an)</option>
                    <option value="hy">Armenian (hy)</option>
                    <option value="as">Assamese (as)</option>
                    <option value="av">Avaric (av)</option>
                    <option value="ae">Avestan (ae)</option>
                    <option value="ay">Aymara (ay)</option>
                    <option value="az">Azerbaijani (az)</option>
                    <option value="bm">Bambara (bm)</option>
                    <option value="ba">Bashkir (ba)</option>
                    <option value="eu">Basque (eu)</option>
                    <option value="be">Belarusian (be)</option>
                    <option value="bn">Bengali (bn)</option>
                    <option value="bh">Bihari languages (bh)</option>
                    <option value="bi">Bislama (bi)</option>
                    <option value="nb">
                      Bokmål, Norwegian; Norwegian Bokmål (nb)
                    </option>
                    <option value="bs">Bosnian (bs)</option>
                    <option value="br">Breton (br)</option>
                    <option value="bg">Bulgarian (bg)</option>
                    <option value="my">Burmese (my)</option>
                    <option value="ca">Catalan; Valencian (ca)</option>
                    <option value="km">Central Khmer (km)</option>
                    <option value="ch">Chamorro (ch)</option>
                    <option value="ce">Chechen (ce)</option>
                    <option value="ny">Chichewa; Chewa; Nyanja (ny)</option>
                    <option value="zh">Chinese (zh)</option>
                    <option value="cu">
                      Church Slavic; Old Slavonic; Church Slavonic; Old
                      Bulgarian; Old Church Slavonic (cu)
                    </option>
                    <option value="cv">Chuvash (cv)</option>
                    <option value="kw">Cornish (kw)</option>
                    <option value="co">Corsican (co)</option>
                    <option value="cr">Cree (cr)</option>
                    <option value="hr">Croatian (hr)</option>
                    <option value="cs">Czech (cs)</option>
                    <option value="da">Danish (da)</option>
                    <option value="dv">Divehi; Dhivehi; Maldivian (dv)</option>
                    <option value="nl">Dutch; Flemish (nl)</option>
                    <option value="dz">Dzongkha (dz)</option>
                    <option value="en">English (en)</option>
                    <option value="eo">Esperanto (eo)</option>
                    <option value="et">Estonian (et)</option>
                    <option value="ee">Ewe (ee)</option>
                    <option value="fo">Faroese (fo)</option>
                    <option value="fj">Fijian (fj)</option>
                    <option value="fi">Finnish (fi)</option>
                    <option value="fr">French (fr)</option>
                    <option value="ff">Fulah (ff)</option>
                    <option value="gd">Gaelic; Scottish Gaelic (gd)</option>
                    <option value="gl">Galician (gl)</option>
                    <option value="lg">Ganda (lg)</option>
                    <option value="ka">Georgian (ka)</option>
                    <option value="de">German (de)</option>
                    <option value="el">Greek, Modern (1453-) (el)</option>
                    <option value="gn">Guarani (gn)</option>
                    <option value="gu">Gujarati (gu)</option>
                    <option value="ht">Haitian; Haitian Creole (ht)</option>
                    <option value="ha">Hausa (ha)</option>
                    <option value="he">Hebrew (he)</option>
                    <option value="hz">Herero (hz)</option>
                    <option value="hi">Hindi (hi)</option>
                    <option value="ho">Hiri Motu (ho)</option>
                    <option value="hu">Hungarian (hu)</option>
                    <option value="is">Icelandic (is)</option>
                    <option value="io">Ido (io)</option>
                    <option value="ig">Igbo (ig)</option>
                    <option value="id">Indonesian (id)</option>
                    <option value="ia">
                      Interlingua (International Auxiliary Language Association)
                      (ia)
                    </option>
                    <option value="ie">Interlingue; Occidental (ie)</option>
                    <option value="iu">Inuktitut (iu)</option>
                    <option value="ik">Inupiaq (ik)</option>
                    <option value="ga">Irish (ga)</option>
                    <option value="it">Italian (it)</option>
                    <option value="ja">Japanese (ja)</option>
                    <option value="jv">Javanese (jv)</option>
                    <option value="kl">Kalaallisut; Greenlandic (kl)</option>
                    <option value="kn">Kannada (kn)</option>
                    <option value="kr">Kanuri (kr)</option>
                    <option value="ks">Kashmiri (ks)</option>
                    <option value="kk">Kazakh (kk)</option>
                    <option value="ki">Kikuyu; Gikuyu (ki)</option>
                    <option value="rw">Kinyarwanda (rw)</option>
                    <option value="ky">Kirghiz; Kyrgyz (ky)</option>
                    <option value="kv">Komi (kv)</option>
                    <option value="kg">Kongo (kg)</option>
                    <option value="ko">Korean (ko)</option>
                    <option value="kj">Kuanyama; Kwanyama (kj)</option>
                    <option value="ku">Kurdish (ku)</option>
                    <option value="lo">Lao (lo)</option>
                    <option value="la">Latin (la)</option>
                    <option value="lv">Latvian (lv)</option>
                    <option value="li">
                      Limburgan; Limburger; Limburgish (li)
                    </option>
                    <option value="ln">Lingala (ln)</option>
                    <option value="lt">Lithuanian (lt)</option>
                    <option value="lu">Luba-Katanga (lu)</option>
                    <option value="lb">
                      Luxembourgish; Letzeburgesch (lb)
                    </option>
                    <option value="mk">Macedonian (mk)</option>
                    <option value="mg">Malagasy (mg)</option>
                    <option value="ms">Malay (ms)</option>
                    <option value="ml">Malayalam (ml)</option>
                    <option value="mt">Maltese (mt)</option>
                    <option value="gv">Manx (gv)</option>
                    <option value="mi">Maori (mi)</option>
                    <option value="mr">Marathi (mr)</option>
                    <option value="mh">Marshallese (mh)</option>
                    <option value="mn">Mongolian (mn)</option>
                    <option value="na">Nauru (na)</option>
                    <option value="nv">Navajo; Navaho (nv)</option>
                    <option value="nd">
                      Ndebele, North; North Ndebele (nd)
                    </option>
                    <option value="nr">
                      Ndebele, South; South Ndebele (nr)
                    </option>
                    <option value="ng">Ndonga (ng)</option>
                    <option value="ne">Nepali (ne)</option>
                    <option value="se">Northern Sami (se)</option>
                    <option value="no">Norwegian (no)</option>
                    <option value="nn">
                      Norwegian Nynorsk; Nynorsk, Norwegian (nn)
                    </option>
                    <option value="oc">Occitan (post 1500) (oc)</option>
                    <option value="oj">Ojibwa (oj)</option>
                    <option value="or">Oriya (or)</option>
                    <option value="om">Oromo (om)</option>
                    <option value="os">Ossetian; Ossetic (os)</option>
                    <option value="pi">Pali (pi)</option>
                    <option value="pa">Panjabi; Punjabi (pa)</option>
                    <option value="fa">Persian (fa)</option>
                    <option value="pl">Polish (pl)</option>
                    <option value="pt">Portuguese (pt)</option>
                    <option value="pt-BR">Portuguese (Brazil) (pt-BR)</option>
                    <option value="ps">Pushto; Pashto (ps)</option>
                    <option value="qu">Quechua (qu)</option>
                    <option value="ro">
                      Romanian; Moldavian; Moldovan (ro)
                    </option>
                    <option value="rm">Romansh (rm)</option>
                    <option value="rn">Rundi (rn)</option>
                    <option value="ru">Russian (ru)</option>
                    <option value="sm">Samoan (sm)</option>
                    <option value="sg">Sango (sg)</option>
                    <option value="sa">Sanskrit (sa)</option>
                    <option value="sc">Sardinian (sc)</option>
                    <option value="sr">Serbian (sr)</option>
                    <option value="sn">Shona (sn)</option>
                    <option value="ii">Sichuan Yi; Nuosu (ii)</option>
                    <option value="sd">Sindhi (sd)</option>
                    <option value="si">Sinhala; Sinhalese (si)</option>
                    <option value="sk">Slovak (sk)</option>
                    <option value="sl">Slovenian (sl)</option>
                    <option value="so">Somali (so)</option>
                    <option value="st">Sotho, Southern (st)</option>
                    <option value="es">Spanish; Castilian (es)</option>
                    <option value="su">Sundanese (su)</option>
                    <option value="sw">Swahili (sw)</option>
                    <option value="ss">Swati (ss)</option>
                    <option value="sv">Swedish (sv)</option>
                    <option value="tl">Tagalog (tl)</option>
                    <option value="ty">Tahitian (ty)</option>
                    <option value="tg">Tajik (tg)</option>
                    <option value="ta">Tamil (ta)</option>
                    <option value="tt">Tatar (tt)</option>
                    <option value="te">Telugu (te)</option>
                    <option value="th">Thai (th)</option>
                    <option value="bo">Tibetan (bo)</option>
                    <option value="ti">Tigrinya (ti)</option>
                    <option value="to">Tonga (Tonga Islands) (to)</option>
                    <option value="ts">Tsonga (ts)</option>
                    <option value="tn">Tswana (tn)</option>
                    <option value="tr">Turkish (tr)</option>
                    <option value="tk">Turkmen (tk)</option>
                    <option value="tw">Twi (tw)</option>
                    <option value="ug">Uighur; Uyghur (ug)</option>
                    <option value="uk">Ukrainian (uk)</option>
                    <option value="ur">Urdu (ur)</option>
                    <option value="uz">Uzbek (uz)</option>
                    <option value="ve">Venda (ve)</option>
                    <option value="vi">Vietnamese (vi)</option>
                    <option value="vo">Volapük (vo)</option>
                    <option value="wa">Walloon (wa)</option>
                    <option value="cy">Welsh (cy)</option>
                    <option value="fy">Western Frisian (fy)</option>
                    <option value="wo">Wolof (wo)</option>
                    <option value="xh">Xhosa (xh)</option>
                    <option value="yi">Yiddish (yi)</option>
                    <option value="yo">Yoruba (yo)</option>
                    <option value="za">Zhuang; Chuang (za)</option>
                    <option value="zu">Zulu (zu)</option>
                  </select>
                  <span className="cont_arrow" />
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
                    href="#collapseOne"
                  >
                    Optional Fields (open/close)
                  </a>
                  {/*/h4 */}
                </div>
                <div
                  id="collapseOne"
                  className="panel-collapse collapse out mt-4"
                >
                  <div className="panel-body">
                    <div className="form-group">
                      <label htmlFor="about">
                        Agency/Company Description
                        <span className="requ-left">Informational Only</span>
                      </label>
                      <textarea
                        className="form-control"
                        name="companyDesc"
                        id="about"
                        style={{ lineHeight: "normal" }}
                        placeholder="Describe your agency/company"
                        defaultValue={""}
                        onChange={handleInputChange}
                        value={formData.companyDesc}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">
                        Telephone
                        <span className="requ-left">Informational Only</span>
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="telephone"
                        autoComplete="tel"
                        placeholder="Your customer contact telephone number"
                        onChange={handleInputChange}
                        value={formData.telephone}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="fare_url">
                        Fare URL
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
                        <span className="requ-left">Informational Only</span>
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        id="fare_url"
                        name="fareUrl"
                        placeholder="Your fare information URL"
                        onChange={handleInputChange}
                        value={formData.fareUrl}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="mail_address">
                        Postal Address
                        <span className="requ-left">Informational Only</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="mail_address"
                        name="postalAddress"
                        placeholder="Your postal/mailing address"
                        style={{
                          backgroundImage: 'url("data:image/png',
                          backgroundRepeat: "no-repeat",
                          backgroundSize: 20,
                          backgroundPosition: "97% center",
                          cursor: "auto",
                        }}
                        data-temp-mail-org={0}
                        onChange={handleInputChange}
                        value={formData.postalAddress}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">
                        Customer Support Email Address
                        <span className="requ-left">Informational Only</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="supportemail"
                        autoComplete="email"
                        placeholder="Your customer support email address"
                        style={{
                          backgroundImage: 'url("data:image/png',
                          backgroundRepeat: "no-repeat",
                          backgroundSize: 20,
                          backgroundPosition: "97% center",
                          cursor: "auto",
                        }}
                        data-temp-mail-org={1}
                        onChange={handleInputChange}
                        value={formData.supportemail}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="taxnbr">
                        Company ID/Tax Number
                        <span className="requ-left">Informational Only</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="taxnbr"
                        name="compannyId"
                        placeholder="Your company identifier/tax number"
                        onChange={handleInputChange}
                        value={formData.compannyId}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="dist_units">
                        Distance Units
                        <span className="requ-left">Informational Only</span>
                      </label>
                      <div className="custom_search_parent">
                        <select
                          name="distanceUnit"
                          className="custom_search"
                          id="dist_units"
                          onChange={handleInputChange}
                          value={formData.distanceUnit}
                        >
                          <option
                            id="du_sel_one"
                            value=""
                            disabled="disabled"
                            selected="selected"
                          >
                            Select One
                          </option>
                          <option value="km">Kilometres (km)</option>
                          <option value="m">Metres (m)</option>
                          <option value="mi">Miles (mi)</option>
                          <option value="ft">Feet (ft)</option>
                        </select>
                        <span className="cont_arrow" />
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
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
