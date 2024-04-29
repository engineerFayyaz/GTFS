import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import "./signin";
import "./signin.css";
const SignIn = () => {
    const navigate = useNavigate("");
  useEffect(() => {
    const sign_in_btn = document.querySelector("#sign-in-btn");
    const sign_up_btn = document.querySelector("#sign-up-btn");
    const container = document.querySelector(".auth-container");

    sign_up_btn.addEventListener("click", () => {
      container.classList.add("sign-up-mode");
    });

    sign_in_btn.addEventListener("click", () => {
      container.classList.remove("sign-up-mode");
    });
  });

  const handleLogin = () => {
    navigate("/");
  }   
  return (
    <>
      <div className="auth-container">
        <div className="forms-container">
          <div className="signin-signup">
            <form action="#" className="sign-in-form">
              <h2 className="title">Sign in</h2>
              <div className="input-field">
                <i className="fas fa-user" />
                <input type="text" placeholder="Username" required/>
              </div>
              <div className="input-field">
                <i className="fas fa-lock" />
                <input type="password" placeholder="Password" required/>
              </div>
              <input type="submit" defaultValue="Login" onClick={handleLogin} className="btn solid" />
              <p className="social-text">Or Sign in with social platforms</p>
              <div className="social-media">
                <a href="#" className="social-icon">
                  <i className="fab fa-facebook-f" />
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-twitter" />
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-google" />
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-linkedin-in" />
                </a>
              </div>
            </form>
            <form action="#" className="sign-up-form">
              <h2 className="title">Sign up</h2>
              <div className="sign_up_form_row">
                <div className="first-col">
                  <div className="input-field">
                    <i className="fas fa-user" />
                    <input type="text" placeholder="Username" required />
                  </div>
                  <div className="input-field">
                    <i className="fas fa-envelope" />
                    <input type="email" placeholder="Email" required />
                  </div>
                  <div className="input-field">
                    <i className="fas fa-lock" />
                    <input type="password" placeholder="Password" required />
                  </div>
                </div>
                <div className="second-col">
                  <div className="input-field">
                    <i className="fas fa-phone" />
                    <input type="number" placeholder="Number" required />
                  </div>
                  <div className="input-field">
                    <i className="fas fa-business-time" />
                    <input type="text" placeholder="Business Name" required />
                  </div>
                  <div className="input-field">
                    <i className="fas fa-flag" />
                    <input type="text" placeholder="Country" required />
                  </div>
                </div>
              </div>
              <input type="submit" className="btn" defaultValue="Sign up" />
              <p className="social-text">Or Sign up with social platforms</p>
              <div className="social-media">
                <a href="#" className="social-icon">
                  <i className="fab fa-facebook-f" />
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-twitter" />
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-google" />
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-linkedin-in" />
                </a>
              </div>
            </form>
          </div>
        </div>
        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>New here ?</h3>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Debitis, ex ratione. Aliquid!
              </p>
              <button className="transparent" id="sign-up-btn">
                Sign up
              </button>
            </div>
            <img src="/images/map.png" className="image" alt="" />
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>One of us ?</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
                laboriosam ad deleniti.
              </p>
              <button className="transparent" id="sign-in-btn">
                Sign in
              </button>
            </div>
          <img src="/images/circle.png" className="image" alt="" />
          </div>
        </div>
      </div>
    </>
  );
};
export default SignIn;
