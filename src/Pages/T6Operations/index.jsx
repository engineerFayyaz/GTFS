import React from "react";
import "./T6Operations.css"
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import T1Banner from "../../Components/T1banner";
import TransitInformation from "../../Components/TransitInformation";
import FollowUs from "../../Components/FollowUs";



const T6Operations = () => {
    return (

        <>
            <Header />

            <T1Banner
                title="T6 OPERATIONS TRANSIT SERVICE"
                subtitle="Digitalize, visualize and"
                subtitle2="optimize your operations in"
                subtitle3="real-time"
                btnlink="#"
                btntext="request demo"
                imgsrc="/images/images-entour/For+operators.png"
            />

            {/* information section */}
            <TransitInformation
                title="T6 Operations transit service"
                imgsrc="/images/images-entour/T6_Operations.png"
                detail="   Real-time transit data empowers operators to optimize assignments
                and dispatch, as well as make necessary changes in real-time. We
                have designed an efficient and user-friendly operations control
                service for managing the entire vehicle fleet. Our T6 Operations
                transit service enables real-time vehicle monitoring, instant
                notifications for deviations from plans, trip updates, services
                alerts, and accurate trip planning for passengers."
            />
            <>
                {/* image with text */}
                <div className="images-text p-5 mt-5">
                    <div className="row p-4">
                        <div className="col-lg-6 text-light fs-6">
                            <h3 className="">Real-time map overview</h3>
                            <p>
                                On the real-time map, you will see a detailed overview of your entire
                                transit network and fleet of buses. Details about a specific vehicle’s
                                work assignment during a service workday is clearly shown, including
                                dead runs, service journeys and temporary pauses/breaks/layovers.
                            </p>
                        </div>
                        <div className="col-lg-6 side-image-one">
                            <img
                                src="images/images-entour/parked-and-blue-buses-with+vehicle-details-drawer.png"
                                alt=""
                            />
                        </div>
                    </div>
                    <div className="row p-4">
                        <div className="col-lg-6 image-2">
                            <img
                                src="images/images-entour/connect2route.png"
                                className=""
                                style={{ height: 250, width: "auto" }}
                                alt=""
                            />
                        </div>
                        <div className="col-lg-6 text-light fs-6">
                            <h3>Connect2Route®</h3>
                            <p>
                                Generate GTFS Realtime feeds by using GPS device updates from the
                                vehicles. The system constantly monitors and aligns the vehicle's
                                location with its scheduled service journey in real-time. It starts by
                                generating, verifying, and publishing the vehicle positions feed,
                                providing regular real-time updates on the vehicle's current position
                                along its routes.
                            </p>
                        </div>
                    </div>
                    <div className="row p-4">
                        <div className="col-lg-6 text-light fs-6">
                            <h3>Notifications and service alerts</h3>
                            <p>
                                If vehicles deviate from their scheduled services, notifications will
                                be clearly shown on the real-time map. If using our T5 GTFS Realtime
                                transit service, these notifications will be automatically sent to any
                                trip planning app and passenger information service.
                            </p>
                        </div>
                        <div className="col-lg-6 side-image">
                            <img src="images/images-entour/TRANSIT+APP.png" alt="" />
                        </div>
                    </div>
                </div>
            </>

            {/* transit services packages */}
            <div className="transit-services">
                <div className="container text-center mt-5 p-5">
                    <h1>Operations package</h1>
                    <p>
                        Our Operations package offers the full spectrum of our transit services,
                        encompassing T1 Enroute, T2 Performance, T3 Schedules, T4 GTFS Static,
                        T5 GTFS Realtime, and T6 Operations. These services are essential for
                        effective operations control, enabling you to manage your entire vehicle
                        fleet successfully.
                    </p>
                    <a href="demo.html">
                        <button>Requset a demo</button>
                    </a>
                </div>
            </div>
            <div className="two-images-section overflow-hidden">
                <div className="row p-5 g-3">
                    <div className="col-lg-6 t3-schedule text-light d-flex justify-content-center align-items-center flex-column">
                        <h4>Learn more about GTFS data</h4>
                        <h1>T6 GTFS Static</h1>
                        <a href="t4.html">
                            <button className="btn-two-images-section">Learn more</button>
                        </a>
                        {/* <img src="images/images-entour/performance.png" alt=""> */}
                    </div>
                    <div className="col-lg-6 text-light t4-gtfs-static d-flex justify-content-center align-items-center flex-column">
                        <h4>More riders. More revenue.</h4>
                        <h1>T7 GTFS Realtime</h1>
                        <a href="t5.html">
                            <button className="btn-two-images-section">Learn more</button>
                        </a>
                    </div>
                </div>
            </div>

            {/* social media icons */}
           <FollowUs />

            <Footer />
        </>
    );

};

export default T6Operations;