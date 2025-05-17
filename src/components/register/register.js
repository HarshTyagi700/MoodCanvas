import React from "react";
import Grid from "@mui/material/Grid";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/pinterest_sphere.jpg";
import "./register.css";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigator = useNavigate();

  const registerFunction = async (event) => {
    event.preventDefault();

    // Perform validation checks
    if (!username || !emailId || !password || !firstName || !lastName) {
      alert("Please fill in all the fields.");
      return;
    }

    // Check password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    if (!password.match(passwordRegex)) {
      alert(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol."
      );
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:7000/pinterest/user-api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            emailId,
            password,
            firstName,
            lastName,
          }),
        }
      );
      if (response.ok) {
        console.log("Data Submitted Successfully");
        alert("User Sign Up was successfull");
        navigator("/");
      } else {
        console.log("Error Submitting data: ", response.status);
      }
    } catch (error) {
      console.log("Error Submitting Data", error);
    }
  };

  const checkUsernameExist = async () => {
    try {
        const formData = new FormData();
        formData.append("id", username);
        const response = await fetch(
          "http://localhost:7000/pinterest/user-api/check-user",
          {
            method: "POST",
            body: formData,
          }
        );
    
        if (!response.ok) {
          const errorData = await response.json();
          setErrorMessage(errorData.message);
          console.log("This is error message:", errorData.message);
        }
        else setErrorMessage(null);
      } catch (error) {
        console.log("Working");
        console.error("Already registered user found:", error);
      }
  };

  return (
    <Grid container>
      <Grid item xs={4}></Grid>
      <Grid item xs={4} className="signUpPageGrid">
        <div className="signUpPageMain">
          <div className="signUpPageLogoDiv">
            <img className="signUpPageLogo" src={logo} alt="Sign Up " />
          </div>
          <div className="signUpPageTextDiv">
            Sign Up to explore, create and share creative ideas ..
          </div>
          <div
            className="signUpInputFields"
            style={{ marginTop: "30px", paddingLeft: "30px" }}
          >
            <div>
              <form onSubmit={registerFunction}>
                <input
                  className="loginpage_text"
                  name="username"
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  onBlur={checkUsernameExist}
                  type="text"
                  placeholder="Enter Username"
                  required
                />
                <div style={{"color":"red"}}>{errorMessage != null && errorMessage} </div>

                <input
                  className="loginpage_text"
                  name="emailId"
                  type="email"
                  onChange={(e) => {
                    setEmailId(e.target.value);
                  }}
                  placeholder="Enter Email"
                  required
                />
                <input
                  className="loginpage_text"
                  name="password"
                  type="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  placeholder="Enter Password"
                  required
                />
                <input
                  className="loginpage_text"
                  name="firstName"
                  type="text"
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  placeholder="Your First Name.."
                  required
                />
                <input
                  className="loginpage_text"
                  name="lastName"
                  type="text"
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  placeholder="Your Last Name.."
                  required
                />

                <button
                  style={{ marginLeft: "5px" }}
                  type="submit"
                  className="loginpage_loginbutton"
                >
                  Sign Up
                </button>
              </form>
            </div>
          </div>
          <div
            className="signUpFooterText"
            style={{
              marginTop: "20px",
              color: "#73738A",
              textAlign: "center",
              paddingLeft: "30px",
              paddingRight: "30px",
            }}
          >
            Already Have an Account?{" "}
            <Link style={{ color: "blue" }} to="/Login">
              {" "}
              Login{" "}
            </Link>
          </div>
        </div>
      </Grid>
      <Grid item xs={4}></Grid>
    </Grid>
  );
};
