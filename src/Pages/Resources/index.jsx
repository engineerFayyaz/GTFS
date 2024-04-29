import React from "react";
import Header from "../../Components/Header"
import Subscribe from "../../Components/Subscribe"
import Footer from "../../Components/Footer"
import Services from "../../Components/Services";
import Tools from "../../Components/Tools";

const Resources = () => {

    return (
        <>
            <Header />
            <>
                <div className="hero hero-inner">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 mx-auto text-center">
                                <div className="intro-wrap">
                                    <h1 className="mb-0">Our Services</h1>
                                    <p className="text-white">
                                        Far far away, behind the word mountains, far from the countries
                                        Vokalia and Consonantia, there live the blind texts.{" "}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        <Services />
        <Tools />
            <Subscribe />
            <Footer />
        </>

    );
};

export default Resources;