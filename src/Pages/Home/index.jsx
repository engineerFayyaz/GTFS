import React, { useEffect } from "react";
import Header from "../../Components/Header";
import HomeSlider from "../../Components/HomeSlider";
import Services from "../../Components/Services";
import RouteMap from "../../Components/RouteMap";
import Tools from "../../Components/Tools";
import PricingPlan from "../../Components/PricingPlan";
import Testimonials from "../../Components/Testimonials";
import ServiceVideo from "../../Components/ServiceVideo";
import Subscribe from "../../Components/Subscribe";
import Footer from "../../Components/Footer";
import AOS from 'aos';
import 'aos/dist/aos.css';
import UserHeader from "../../Components/UserHeader";

const Home = () => {
  useEffect(() => {
    AOS.init();
  }, [])
  return (
    <>
      {/* <Header /> */}
      <UserHeader />
      <HomeSlider  />
      <Services />
      <RouteMap />
      <Tools />
      <>
        {/* counter 2 */}
        <div className="untree_co-section mt-0 pt-0">
          <div className="container">
            <div className="row  justify-content-center">
              <div className="col-lg-6 text-center">
                <h2 className="section-title text-center mb-3">Statistics</h2>
              </div>
            </div>
          </div>
        </div>
        <div id="projectFacts" className="sectionClass">
          <div className="fullWidth eight columns">
            <div className="projectFactsWrap">
              <div
                className="item wow fadeInUpBig animated animated"
                data-number={12}
                style={{ visibility: "visible" }}
              >
                <i className="fa fa-briefcase" />
                <p id="number1" className="number" data-count={12}>
                  12
                </p>
                <span />
                <p>Number of Tools</p>
              </div>
              <div
                className="item wow fadeInUpBig animated animated"
                data-number={55}
                style={{ visibility: "visible" }}
              >
                <i className="fa fa-gear" />
                <p id="number2" className="number" data-count={4440}>
                  4440
                </p>
                <span />
                <p>Resources</p>
              </div>
              <div
                className="item wow fadeInUpBig animated animated"
                data-number={359}
                style={{ visibility: "visible" }}
              >
                <i className="fa fa-user" />
                <p id="number3" className="number" data-count={359}>
                  359
                </p>
                <span />
                <p>Satisfied Clients</p>
              </div>
              <div
                className="item wow fadeInUpBig animated animated"
                data-number={246}
                style={{ visibility: "visible" }}
              >
                <i className="fa-regular fa-face-smile" />
                <p id="number4" className="number" data-count={246}>
                  246
                </p>
                <span />
                <p>Problems Solved</p>
              </div>
            </div>
          </div>
        </div>
        <PricingPlan />
        <Testimonials />
        <div className="untree_co-section">
          <div className="container">
            <div className="row justify-content-center text-center mb-5">
              <div className="col-lg-6">
                <h2 className="section-title text-center mb-3">
                  Resources to help transport operators
                </h2>
                <p>Need to be able to filter by topic</p>
              </div>
            </div>
            <div className="row gap-2">
              <div className="col-6 col-sm-6 col-md-6 col-lg-4 mb-4 mb-lg-0 p-0 p-md-5">
                <div className="media-1">
                  <a href="#" className="d-block mb-3">
                    <img
                      src="images/tool_bus.jpg"
                      width="100%"
                      alt="Image"
                      className="img-fluid"
                    />
                  </a>
                  {/* <span class="d-flex align-items-center loc mb-2">
							<span class="icon-room mr-3"></span>
							<span>Italy</span>
						</span> */}
                  <div className="d-flex align-items-center justify-content-center">
                    <div>
                      <h3>
                        <a href="#">GTFS Buider</a>
                      </h3>
                      <div className="price ml-auto">
                        <span>Edit Agency Details</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 col-sm-6 col-md-6 col-lg-4 mb-4 mb-lg-0 p-0 p-md-5">
                <div className="media-1">
                  <a href="#" className="d-block mb-3">
                    <img
                      src="images/logo_card.jpg"
                      width="100%"
                      alt="Image"
                      className="img-fluid"
                    />
                  </a>
                  {/* <span class="d-flex align-items-center loc mb-2">
							<span class="icon-room mr-3"></span>
							<span>United States</span>
						</span> */}
                  <div className="d-flex align-items-center justify-content-center mt-5">
                    <div>
                      <h3>
                        <a href="#">GTFS Buider</a>
                      </h3>
                      <div className="price ml-auto">
                        <span>Edit Agency Details</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 col-sm-6 col-md-6 col-lg-4 mb-4 mb-lg-0 p-0 p-md-5">
                <div className="media-1">
                  <a href="#" className="d-block mb-3">
                    <img
                      src="images/logo_card.jpg"
                      width="100%"
                      alt="Image"
                      className="img-fluid"
                    />
                  </a>
                  {/* <span class="d-flex align-items-center loc mb-2">
							<span class="icon-room mr-3"></span>
							<span>United States</span>
						</span> */}
                  <div className="d-flex align-items-center justify-content-center mt-5">
                    <div>
                      <h3>
                        <a href="#">GTFS Buider</a>
                      </h3>
                      <div className="price ml-auto">
                        <span>Edit Agency Details</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ServiceVideo />
        <Subscribe />
        <Footer />
      </>
    </>
  );
};

export default Home;
