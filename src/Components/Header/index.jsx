import React, { useState, useEffect } from "react";
// import firebase from "firebase/app";
import { getAuth, sendEmailVerification,signOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button, Table } from "react-bootstrap";
import "firebase/auth";

const Header = () => {
  const [user, setUser] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [emailVerificationMessage, setEmailVerificationMessage] = useState("");
  const [remainingDays, setRemainingDays] = useState(14); // Initialize remaining days to 14

  const auth = getAuth();
  const db = getFirestore();




  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user && !user.emailVerified) {
        setEmailVerificationMessage(
          "Your email is not verified yet. Please check your inbox for the email or resend the verification email."
        );
      } else if (user && user.emailVerified) {
        const registrationDate = new Date(user.metadata.creationTime);
        const verificationDate = new Date(user.metadata.lastSignInTime);
        const fourteenDaysInMilliseconds = 14 * 24 * 60 * 60 * 1000;
        
        const expirationDate = new Date(registrationDate.getTime() + fourteenDaysInMilliseconds);
        const currentDate = new Date();
        
        if (currentDate > expirationDate) {
          signOut(auth).then(() => {
            setUser(null);
            toast.error(
              "Your trial period has ended. Please buy the package to continue using the service."
            );
          });
        } else {
          const remainingMilliseconds = expirationDate.getTime() - currentDate.getTime();
          const remainingDays = Math.ceil(remainingMilliseconds / (1000 * 60 * 60 * 24));
          setRemainingDays(remainingDays);
          setEmailVerificationMessage(
            `Your email is verified. You are logged in for the next ${remainingDays} days.`
          );
        }
      } else {
        setEmailVerificationMessage("");
      }
    });
  
    const unsubscribeNotifications = onSnapshot(
      collection(db, "notifications"),
      (snapshot) => {
        const notificationData = snapshot.docs.map((doc) => doc.data());
        setNotifications(notificationData);
      }
    );
  
    return () => {
      unsubscribe();
      unsubscribeNotifications();
    };
  }, [auth, db]);
  
  
  
  
  
  
  
  

  const handleSignOut = () => {
    auth.signOut();
  };

  const handleResendVerificationEmail = () => {
    if (user) {
      sendEmailVerification(auth.currentUser)
        .then(() => {
          toast.success("Verification email sent.");
        })
        .catch((error) => {
          toast.error("Error sending verification email: " + error.message);
        });
    }
  };
  

  const handleClearAll = async () => {
    try {
      await Promise.all(
        notifications.map(async (notification) => {
          if (notification.id) {
            // Check if id exists
            const notificationRef = doc(db, "notifications", notification.id);
            await deleteDoc(notificationRef);
            toast.success("Notification deleted:");
          } else {
             toast.warn("Notification ID is missing:");
          }
        })
      );
      toast.success("All notifications cleared successfully.");
      setNotifications([]); // Clear notifications from state after deletion
    } catch (error) {
      toast.error("Error clearing notifications:");
    }
  };
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <>
      <div className="verify-email d-flex justify-content-center">
        {emailVerificationMessage && (
          <div className="email-verification-message">
            {emailVerificationMessage}{" "}
            {user && !user.emailVerified && (
              <a href="#" onClick={handleResendVerificationEmail}>
                Resend verification email
              </a>
            )}
          </div>
        )}
      </div>
        <div className="site-mobile-menu site-navbar-target">
          <div className="site-mobile-menu-header">
            <div className="site-mobile-menu-close">
              <span className="icofont-close js-menu-toggle" />
            </div>
          </div>
          <div className="site-mobile-menu-body">
            <h2>Hello</h2>
          </div>
        </div>
        <nav className="site-nav">
          <div className="container-fluid px-2 px-md-4">
            <div className="site-navigation">
              <a href="/" className="logo m-0">
                <img src="/images/logo white.png" width={200} alt="" />
                <span className="text-primary" />
              </a>
              <ul className="js-clone-nav d-none d-lg-inline-block text-left site-menu float-right">
                <li className="active">
                  <a href="/">GTFS</a>
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
                    Tools <span className="caret" />
                  </a>
                  <ul className="dropdown-menu p-3" style={{ width: "900px", top:"3rem", left:"-20rem" }}>
                    {/* Dropdown menu items */}
                    <div className="row">
                      <div className="col-md-4">
                        <li>
                        <img src="/images/icons/online.png" width={30} alt="" /><a href="/T1Enroute"> Service Frequency Calculator </a>
                        </li>
                      </div>
                      <div className="col-md-4">
                        <li>
                        <img src="/images/icons/speedometer.png" width={30} alt="" /><a href="/T1Enroute"> Average Speed Calculator </a>
                        </li>
                      </div>
                      <div className="col-md-4">
                        <li>
                        <img src="/images/icons/calculator.png" width={30} alt="" /><a href="/T1Enroute"> Charter Cost Calculator </a>
                        </li>
                      </div>

                      <div className="col-md-4">
                        <li>
                        <img src="/images/icons/bus.png" width={30} alt="" /><a href="/T1Enroute"> Peak Vehicle Estimator </a>
                        </li>
                      </div>
                      <div className="col-md-4">
                        <li>
                        <img src="/images/icons/hand.png" width={30} alt="" /><a href="/T1Enroute"> Bus Stop Capacity Calculator </a>
                        </li>
                      </div>
                      <div className="col-md-4">
                        <li>
                        <img src="/images/icons/plane.png" width={30} alt="" /><a href="/T1Enroute"> Average Fleet Age </a>
                        </li>
                      </div>

                      <div className="col-md-4">
                        <li>
                        <img src="/images/icons/online.png" width={30} alt="" /><a href="/T1Enroute"> Enroute </a>
                        </li>
                      </div>
                      <div className="col-md-4">
                        <li>
                        <img src="/images/icons/online.png" width={30} alt="" /><a href="/T1Enroute"> Enroute </a>
                        </li>
                      </div>
                      <div className="col-md-4">
                        <li>
                        <img src="/images/icons/online.png" width={30} alt="" /><a href="/T1Enroute"> Enroute </a>
                        </li>
                      </div>

                      <div className="col-md-4">
                        <li>
                        <img src="/images/icons/online.png" width={30} alt="" /><a href="/T1Enroute"> Enroute </a>
                        </li>
                      </div>
                      <div className="col-md-4">
                        <li>
                        <img src="/images/icons/online.png" width={30} alt="" /><a href="/T1Enroute"> Enroute </a>
                        </li>
                      </div>
                      <div className="col-md-4">
                        <li>
                        <img src="/images/icons/online.png" width={30} alt="" /><a href="/T1Enroute"> Enroute </a>
                        </li>
                      </div>
                    </div>
                  </ul>
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
                      <a href="/T1Enroute"> Enroute </a>
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
                {user ? (
                  <li className="dropdown dropstart">
                    <a
                      href="#"
                      className="dropdown-toggle"
                      data-toggle="dropdown"
                      role="button"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      {user.email.split("@")[0]} <span className="caret" />
                    </a>
                    <ul className="dropdown-menu " style={{ minWidth: "7rem" }}>
                      {/* Dropdown menu items */}
                      <li>
                        <a href={""} onClick={handleSignOut}>
                          Logout
                        </a>
                      </li>
                    </ul>
                  </li>
                ) : (
                  <>
                    <li>
                      <a href="/signin"> Login </a>
                    </li>
                  </>
                )}
                <li>
                  <a>
                    <i
                      className="fas fa-bell"
                      onClick={handleShow}
                      style={{ cursor: "pointer" }}
                    ></i>
                    {notifications.length > 0 && (
                      <span className="badge">{notifications.length}</span>
                    )}
                  </a>
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
        {/* <div className="remaining-days">
        {remainingDays > 0 && (
          <p>Your trial period will end in {remainingDays} days.</p>
        )}
      </div> */}
      </>

      <Modal
        show={show}
        onHide={handleClose}
        centered
        backdrop="static"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <b>
              {" "}
              <i className="fas fa-bell" /> All Notifications{" "}
            </b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            <div>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Message Title</th>
                    <th>Message Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notification, index) => (
                    <tr key={index}>
                      <>
                        <td>{notification.title}</td>
                        <td>{notification.body}</td>
                        <td>{notification.title}</td>
                        <td>{notification.body}</td>
                      </>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </>
                </tbody>
              </Table>
            </div>
          </>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleClearAll}>
            Clear All
          </Button>
        </Modal.Footer>
        
      </Modal>
      
      
    </>
  );
};

export default Header;
