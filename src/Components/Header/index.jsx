import React, { useState, useEffect } from "react";
// import firebase from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
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
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
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
            // toast.warn("Notification ID is missing:");
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
                    <i className="fas fa-bell" onClick={handleShow} style={{cursor:"pointer"}}></i>
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
      </>

      <Modal show={show} onHide={handleClose} centered backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title><b> <i className="fas fa-bell" /> All Notifications </b></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
            <>
              <div >
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
                      </>
                      
                    </tr>
                  ))}
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
