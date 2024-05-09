import React from "react";
import FaqBannner from "../../Components/FaqBanner";
import RouteMap from "../../Components/RouteMap";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Subscribe from "../../Components/Subscribe";
import VehicleTracking from "../../Components/VehicleTracking";


export const Map = () => {

    return (
        <>
        <Header />
        <FaqBannner
        title="Route Map Planner"
        description="Enroute your Routes here"
        />
        <RouteMap />
        {/* <VehicleTracking /> */}
        <Subscribe />
        <Footer />
        </>
    )
}