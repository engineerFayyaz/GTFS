import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import T1Enroute from "./Pages/T1Enroute";
import T2Performance from "./Pages/T2Performance"
import About from "./Pages/About"
import Contact from "./Pages/ContactUs";
import Pricing from "./Pages/Pricing";
import T3Schedules from "./Pages/T3Schedules";
import T4GTFSStatic from "./Pages/T4GTFSStatic";
import T5GTFSRealtime from "./Pages/T5GTFSRealtime";
import T6Operations from "./Pages/T6Operations";
import T7Insights from "./Pages/T7Insights";
import T8Governance from "./Pages/T8Governance";
import SignIn from "./Pages/SignIn";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import PricingFaq from "./Pages/PricingFaq";
import UserFaq from "./Pages/UserFaq";
import DataGarenteeFaq from "./Pages/DataGarenteeFaq";
import TermsOfUse from "./Pages/TermofUse";
import Resources from "./Pages/Resources";
// import Home from "./Pages/Home";

const ProjectRoutes = () => {
  return (
    <>
      <React.Suspense fallback={<>Loading...</>}>
        <Router>
          <Routes>
            <Route path="/t1enroute" element={<T1Enroute />} />
            <Route path="/" element={<Home />} />
            <Route path="/t2Performance" element={< T2Performance />} />
            <Route path="/About" element={< About />} />
            <Route path="/SignIn" element={< SignIn />} />
            <Route path="/Resources" element={< Resources />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/Pricing" element={<Pricing />} />
            <Route path="/t3Schedules" element={<T3Schedules />} />
            <Route path="/T4GTFSStatic" element={<T4GTFSStatic />} />
            <Route path="/T5GTFSRealtime" element={<T5GTFSRealtime />} />
            <Route path="/T6Operations" element={<T6Operations />} />
            <Route path="/T7Insights" element={<T7Insights />} />
            <Route path="/T8Governance" element={<T8Governance />} />
            <Route path="/Privacy&Policy" element={<PrivacyPolicy />} />
            <Route path="/PricingFaq" element={<PricingFaq />} />
            <Route path="/UserFaq" element={<UserFaq />} />
            <Route path="/DataGarenteeFaq" element={<DataGarenteeFaq />} />
            <Route path="/TermOfUse" element={<TermsOfUse />} />
          </Routes>
        </Router>
      </React.Suspense>
    </>
  );
};

export default ProjectRoutes;
