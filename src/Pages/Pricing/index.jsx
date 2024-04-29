import React from "react";
import "./Pricing.css";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import FollowUs from "../../Components/FollowUs";

const Pricing = () => {
    return (
        <>
            <Header />
            <main>
                {/* pricinng cards  */}
                <div className="untree_co-section pricing-info pb-0 mb-0">
                    <div className="row text-center justify-content-center mb-5">
                        <div className="col-lg-7">
                            <p className="mb-0 text-light">Affordable Tools &amp; Calculators</p>
                            <h2 className="section-title text-center text-light">
                                Our Pricing Plans
                            </h2>
                        </div>
                    </div>
                    <div className="demo">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-3 col-sm-6">
                                    <div className="pricingTable">
                                        <h3 className="title">Bronze</h3>
                                        <div className="price-value">
                                            <span className="currency">$</span>
                                            <span className="amount">20.00</span>
                                            <span className="month">/month per user</span>
                                        </div>
                                        <ul className="pricing-content">
                                            <li>
                                                <b>Agencies:</b> 1
                                            </li>
                                            <li>
                                                <b>Stops:</b> Unlimited
                                            </li>
                                            <li>
                                                <b>Routes</b> 2
                                            </li>
                                            <li>
                                                <b>Import/export</b> Unlimited
                                            </li>
                                        </ul>
                                        <a href="#" className="pricingTable-signup">
                                            Buy Now
                                        </a>
                                        <a href="#" className="pricingTable-signup">
                                            Try For Free
                                        </a>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6">
                                    <div className="pricingTable pink">
                                        <h3 className="title">Silver</h3>
                                        <div className="price-value">
                                            <span className="currency">$</span>
                                            <span className="amount">45.00</span>
                                            <span className="month">/month per user</span>
                                        </div>
                                        <ul className="pricing-content">
                                            <li>
                                                <b>Agencies:</b> 1
                                            </li>
                                            <li>
                                                <b>Stops:</b> Unlimited
                                            </li>
                                            <li>
                                                <b>Routes</b> 5
                                            </li>
                                            <li>
                                                <b>Import/export</b> Unlimited
                                            </li>
                                        </ul>
                                        <a href="#" className="pricingTable-signup">
                                            Buy Now
                                        </a>
                                        <a href="#" className="pricingTable-signup">
                                            Try For Free
                                        </a>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6">
                                    <div className="pricingTable blue">
                                        <h3 className="title">Gold</h3>
                                        <div className="price-value">
                                            <span className="currency">$</span>
                                            <span className="amount">150.00</span>
                                            <span className="month">/month per user</span>
                                        </div>
                                        <ul className="pricing-content">
                                            <li>
                                                <b>Agencies:</b> 2
                                            </li>
                                            <li>
                                                <b>Stops:</b> Unlimited
                                            </li>
                                            <li>
                                                <b>Routes</b> 20 combined
                                            </li>
                                            <li>
                                                <b>Import/export</b> Unlimited
                                            </li>
                                        </ul>
                                        <a href="#" className="pricingTable-signup">
                                            Buy Now
                                        </a>
                                        <a href="#" className="pricingTable-signup">
                                            Try For Free
                                        </a>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6">
                                    <div className="pricingTable platinium">
                                        <h3 className="title">Platinum</h3>
                                        <div className="price-value">
                                            <span className="currency">$</span>
                                            <span className="amount">300.0</span>
                                            <span className="month">/month per user</span>
                                        </div>
                                        <ul className="pricing-content">
                                            <li>
                                                <b>Agencies:</b> 4
                                            </li>
                                            <li>
                                                <b>Stops:</b> Unlimited
                                            </li>
                                            <li>
                                                <b>Routes</b> 50 combined
                                            </li>
                                            <li>
                                                <b>Import/export</b> Unlimited
                                            </li>
                                        </ul>
                                        <a href="#" className="pricingTable-signup">
                                            Buy Now
                                        </a>
                                        <a href="#" className="pricingTable-signup">
                                            Try For Free
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* privcing ends */}
                <hr style={{ height: 12 }} />
                {/* social media icons */}
              <FollowUs />
            </main>

            <Footer />

        </>
    );


};

export default Pricing;