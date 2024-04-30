import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { app } from "../../FirebaseConfig"
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, signInWithRedirect } from "firebase/auth";
import "./signin.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {storeUserToLocalStorage} from "../../storage/loggedInUserLocalSt"
import Loader from "../../Components/Loader";

const SignIn = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [country, setCountry] = useState("");
  const [loading,setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      storeUserToLocalStorage(user); // Assuming your storeUserToLocalStorage function expects user data
      navigate("/");
      toast.success("Logged In Successfully");
    } catch (error) {
      console.error(error.message);
      toast.error("Invalid Login, Please try Again");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password); // Updated function call
      navigate("/");
      toast.success("Signup Successfully ");
      setLoading(false);
      setTimeout(() => {
        navigate("/");
      },1000)
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setGoogleLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      storeUserToLocalStorage(user); // Assuming your storeUserToLocalStorage function expects user data
      navigate("/");
      toast.success("Logged In with Google Successfully");
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to Sign In with Google");
    }
  };

  const handleFacebookSignIn = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      storeUserToLocalStorage(user); // Assuming your storeUserToLocalStorage function expects user data
      navigate("/");
      toast.success("Logged In with Facebook Successfully");
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to Sign In with Facebook");
    }
  };

  const handleTwitterSignIn = async () => {
    const provider = new TwitterAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      storeUserToLocalStorage(user); // Assuming your storeUserToLocalStorage function expects user data
      navigate("/");
      toast.success("Logged In with Twitter Successfully");
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to Sign In with Twitter");
    }
  };
  return (
    <>

    <ToastContainer />
      <div className="auth-container">
        <div className="forms-container">
          <div className="signin-signup">
            <form onSubmit={handleSignIn} className="sign-in-form">
              <h2 className="title">Sign in</h2>
              <div className="input-field">
                <i className="fas fa-user" />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-lock" />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn solid">Login</button>
              <p className="social-text">Or Sign in with social platforms</p>
              <div className="social-media">
              <button onClick={handleGoogleSignIn} className="social-icon">
                <i className="fab fa-google" />
              </button>
              <button onClick={handleFacebookSignIn} className="social-icon">
                <i className="fab fa-facebook-f" />
              </button>
              <button onClick={handleTwitterSignIn} className="social-icon">
                <i className="fab fa-twitter" />
              </button>
              {/* Add LinkedIn button and handler similarly */}
            </div>
            </form>
            <form onSubmit={handleSignUp} className="sign-up-form">
              <h2 className="title">Sign up</h2>
              <div className="sign_up_form_row">
                <div className="first-col">
                  <div className="input-field">
                    <i className="fas fa-user" />
                    <input type="text" placeholder="Username" required value={username}
                      onChange={(e) => setUsername(e.target.value)} />
                  </div>
                  <div className="input-field">
                    <i className="fas fa-envelope" />
                    <input type="email" placeholder="Email" required value={email}
                      onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="input-field">
                    <i className="fas fa-lock" />
                    <input type="password" placeholder="Password" required value={password}
                      onChange={(e) => setPassword(e.target.value)} />
                  </div>
                </div>
                <div className="second-col">
                  <div className="input-field">
                    <i className="fas fa-phone" />
                    <input type="number" placeholder="Number" required value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)} />
                  </div>
                  <div className="input-field">
                    <i className="fas fa-business-time" />
                    <input type="text" placeholder="Business Name" required value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)} />
                  </div>
                  <div className="input-field">
                    <i className="fas fa-flag" />
                    <input type="text" placeholder="Country" required value={country}
                      onChange={(e) => setCountry(e.target.value)} />
                  </div>
                </div>
              </div>
              <input type="submit" className="btn" defaultValue="Sign up" />
              <p className="social-text">Or Sign up with social platforms</p>
              <div className="social-media">
              <button onClick={handleGoogleSignIn} className="social-icon">
                <i className="fab fa-google" />
              </button>
              <button onClick={handleFacebookSignIn} className="social-icon">
                <i className="fab fa-facebook-f" />
              </button>
              <button onClick={handleTwitterSignIn} className="social-icon">
                <i className="fab fa-twitter" />
              </button>
              {/* Add LinkedIn button and handler similarly */}
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
