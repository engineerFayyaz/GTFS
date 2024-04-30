import React, { useState, useEffect } from "react";
import { getUserFromLocalStorage } from "../../storage/loggedInUserLocalSt"
const Header = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    let u = getUserFromLocalStorage();

    setLoggedInUser(u)

  }, []);

  const handleLogout = () => {
    // Implement logout functionality here
    // For example, clearing user data from local storage and redirecting to login page
    // localStorage.removeItem("loggedInUser");
    // history.push("/SignIn");
    window.location.href = "/SignIn"; // Redirect to login page
  };

  console.log("logediuser",loggedInUser)
  return (

    <>
      <>
        <div className="site-mobile-menu site-navbar-target">
          <div className="site-mobile-menu-header">
            <div className="site-mobile-menu-close">
              <span className="icofont-close js-menu-toggle" />
            </div>
          </div>
          <div className="site-mobile-menu-body" >
            {loggedInUser ? <h2>Hello, {loggedInUser.email}</h2> : null}
          </div>
        </div>
        <nav className="site-nav">
          <div className="container">
            <div className="site-navigation">
              <a href="/" className="logo m-0">
                <img src="/images/logo white.png" width={200} alt="" />
                <span className="text-primary" />
              </a>
              <ul className="js-clone-nav d-none d-lg-inline-block text-left site-menu float-right">
                <li className="active">
                  <a href="/">GTFS</a>
                </li>
                <li>
                  <a href="/Resources">Resources</a>
                </li>
               
                <li>
                  <a href="/Pricing">Pricing</a>
                </li>
                {/* <li><a href="about.html">About</a></li> */}
                <li className="dropdown">
                  <a
                    href="#"
                    className="dropdown-toggle"
                    data-toggle="dropdown"
                    role="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Transit Services <span className="caret" />
                  </a>
                  <ul className="dropdown-menu">
                    {/* Dropdown menu items */}
                    <li>
                      <a href="/T1Enroute">  Enroute </a>
                    </li>
                    <li>
                      <a href="/T2Performance"> Performance </a>
                    </li>
                    <li>
                      <a href="/T3Schedules"> Schedules </a>
                    </li>
                    <li>
                      <a href="/T4GTFSStatic"> GTFS Static </a>
                    </li>
                    <li>
                      <a href="/T5GTFSRealtime"> GTFS Realtime </a>
                    </li>
                    <li>
                      <a href="/T6Operations"> Operations </a>
                    </li>
                    <li>
                      <a href="/T7Insights"> Insights </a>
                    </li>
                    <li>
                      <a href="/T8Governance"> Governance </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="/Partner">Partner</a>
                </li>
                <li className="dropdown">
                  <a
                    href="#"
                    className="dropdown-toggle"
                    data-toggle="dropdown"
                    role="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Company <span className="caret" />
                  </a>
                  <ul className="dropdown-menu">
                    {/* Dropdown menu items */}
                    <li>
                      <a href="/About">About</a>
                    </li>
                    <li>
                      <a href="/Contact">Contact Us</a>
                    </li>
                  </ul>
                </li>
                <li className="dropdown">
                  <a
                    href="#"
                    className="dropdown-toggle"
                    data-toggle="dropdown"
                    role="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    FAQs <span className="caret" />
                  </a>
                  <ul className="dropdown-menu">
                    {/* Dropdown menu items */}
                    <li>
                      <a href="/PricingFaq">Pricing FAQs</a>
                    </li>
                    <li>
                      <a href="/UserFaq">Account &amp; User FAQs</a>
                    </li>
                    <li>
                      <a href="/DataGarenteeFaq">Data Guarantee </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <div className="dropdown text-white">
                  {loggedInUser ? (
                    <li>
                      {/* Show user name if logged in */}
                      <span >{loggedInUser.email.split('@')[0]}</span>
                    </li>
                  ) : (
                    <li>
                      {/* Show login button if not logged in */}
                      <a href="/SignIn">Login</a>
                    </li>
                  )}
                  </div>
                </li>  
              </ul>
              <a
                href="#"
                className="burger ml-auto float-right site-menu-toggle js-menu-toggle d-inline-block d-lg-none light"
                data-toggle="collapse"
                data-target="#main-navbar"
              >
                <span />
              </a>
            </div>
          </div>
        </nav>
      </>
    </>
  );
};

export default Header;
