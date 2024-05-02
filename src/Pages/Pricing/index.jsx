import React, { useState } from "react";
import "./Pricing.css";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import FollowUs from "../../Components/FollowUs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "bootstrap";

const Pricing = () => {
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [buttonText, setButtonText] = useState("Choose");
  const navigate = useNavigate();

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setSelectedAmount(plans[plan].amount);
    setShowPaymentOptions(true);
    setShowModal(true);
    // if (plan === "bronze") {
    //     setButtonText("Chosen");
    // }
  };

  const handlePaymentMethodSelected = (method) => {
    if (method === "Stripe") {
      // Handle Stripe payment
      const stripePaymentURL = getStripePaymentURL(
        selectedPlan,
        selectedAmount
      );
      openPaymentWindow(stripePaymentURL);
    } else if (method === "PayPal") {
      // Handle PayPal payment
      const paypalPaymentURL = getPayPalPaymentURL(selectedAmount);
      openPaymentWindow(paypalPaymentURL);
    }

    // Reset the state after handling the payment method
    setShowPaymentOptions(false);
    setSelectedPlan("");
    setSelectedAmount(0);
    setButtonText("Choose");
  };

  // Function to generate the Stripe payment URL based on the selected plan
  // Function to generate the Stripe payment URL based on the selected plan
  const getStripePaymentURL = (plan, amount) => {
    let stripePaymentURL = "";
    // Generate the appropriate Stripe link based on the selected plan
    switch (plan) {
      case "bronze":
        stripePaymentURL = `https://buy.stripe.com/bronze?amount=${amount}`; // Replace with actual URL
        break;
      case "silver":
        stripePaymentURL = `https://buy.stripe.com/silver?amount=${amount}`; // Replace with actual URL
        break;
      case "gold":
        stripePaymentURL = `https://buy.stripe.com/gold?amount=${amount}`; // Replace with actual URL
        break;
      case "platinum":
        stripePaymentURL = `https://buy.stripe.com/platinum?amount=${amount}`; // Replace with actual URL
        break;
      default:
        break;
    }
    return stripePaymentURL;
  };

  // Function to generate the PayPal payment URL based on the selected amount
  const getPayPalPaymentURL = (amount) => {
    // Generate PayPal payment URL with selected amount
    return `https://www.paypal.com/paypalme?amount=${amount}&currency=USD`; // Replace with actual URL
  };

  // Function to open a payment window
  const openPaymentWindow = (paymentURL) => {
    const paymentWindow = window.open(paymentURL, "_blank");
    if (paymentWindow) {
      paymentWindow.focus();
    } else {
      toast.error("Popup blocked by the browser");
    }
  };

  // Define the plans object
  const plans = {
    bronze: {
      amount: 20.0,
      agencies: 1,
      stops: "Unlimited",
      routes: 2,
      import: "unlimited",
    },
    silver: {
      amount: 45.0,
      agencies: 1,
      stops: "Unlimited",
      routes: 5,
      import: "unlimited",
    },
    gold: {
      amount: 150.0,
      agencies: 2,
      stops: "Unlimited",
      routes: 20,
      import: "unlimited",
    },
    platinum: {
      amount: 300.0,
      agencies: 4,
      stops: "Unlimited",
      routes: 50,
      import: "unlimited",
    },
  };

  return (
    <>
      <Header />
      <main>
        {/* pricing cards */}
        <div className="untree_co-section pricing-info pb-0 mb-0">
          <div className="row text-center justify-content-center mb-5">
            <div className="col-lg-7">
              <p className="mb-0 text-light">
                Affordable Tools &amp; Calculators
              </p>
              <h2 className="section-title text-center text-light">
                Our Pricing Plans
              </h2>
            </div>
          </div>
          <div className="demo">
            <div className="container">
              <div className="row">
                {Object.keys(plans).map((planKey) => (
                  <div key={planKey} className="col-md-3 col-sm-6">
                    <div className="pricingTable">
                      <h3 className="title">
                        {planKey.charAt(0).toUpperCase() + planKey.slice(1)}
                      </h3>
                      <div className="price-value">
                        <span className="currency">$</span>
                        <span className="amount">{plans[planKey].amount}</span>
                        <span className="month">/month per user</span>
                      </div>
                      <ul className="pricing-content">
                        <li>
                          <b>Agencies:</b> {plans[planKey].agencies}
                        </li>
                        <li>
                          <b>Stops:</b> {plans[planKey].stops}
                        </li>
                        <li>
                          <b>Routes:</b> {plans[planKey].routes}
                        </li>
                        <li>
                          <b>Import/export:</b> {plans[planKey].import}
                        </li>
                      </ul>
                      <button
                        className="pricingTable-signup"
                        onClick={() => handleSelectPlan(planKey)}
                      >
                        {buttonText}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center my-5">
          {showPaymentOptions && (
            <div className="payment-options">
              <h3 className="text-light">Select Payment Method:</h3>
              <div>
                <button
                  className="btn btn-outline-success"
                  onClick={() => handlePaymentMethodSelected("Stripe")}
                >
                  Pay with Stripe
                </button>
                <button
                  className="btn btn-outline-info"
                  onClick={() => handlePaymentMethodSelected("PayPal")}
                >
                  Pay with PayPal
                </button>
              </div>
            </div>
          )}
        </div>
          </div>
        </div>
        {/* pricing ends */}
       

        <FollowUs />
      </main>

      <Footer />
    </>
  );
};

export default Pricing;
