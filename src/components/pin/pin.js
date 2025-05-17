import React, { useState, useContext, useEffect } from "react";
import PinPreview from "../pinpreview/pinpreview";
import Modal from "../temp/modal";
import noteContext from "../../context/noteContext";
import Badge from "@mui/material/Badge";
import { useNavigate } from "react-router-dom";
import { convertCompilerOptionsFromJson } from "typescript";
import "../../styles.css";

const Pin = ({ pin }) => {
  const [showPinDetails, setShowPinDetails] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [isLiked, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(pin.likeCount);
  const state = useContext(noteContext);
  const navigate = useNavigate();

  // const [isLoggedIn,set]

  useEffect(() => {
    // console.log(
    //   "Login ke baad in pin compo:",
    //   localStorage.getItem("useremail")
    // );
    const fetchLike = async () => {
      try {
        const formData = new FormData();
        // console.log("Pin rendered");
        // console.log(localStorage.getItem("isLoggedIn"));
        formData.append("useremail", localStorage.getItem("useremail"));
        formData.append("pinId", pin.id);
        const response = await fetch(
          "http://localhost:7000/pinterest/analytics-api/hasLiked",
          {
            method: "POST",
            body: formData,
          }
        );
        const hasLiked = await response.json();
        // console.log("useremail :", localStorage.getItem("useremail"));
        // console.log("pinid:", pin.id);
        state.isLiked = hasLiked;
        console.log("Like status:", hasLiked);
        setLike(hasLiked);
        // console.log(data);
      } catch (error) {
        console.log("Error occured while fetching like status.", error);
      }
    };
    fetchLike();
  }, []);

  // useEffect( () =>{

  // },[isLiked]);

  const pinDetailsHandler = () => {
    setShowPinDetails((s) => !s);
    console.log("Show pin status changed ", showPinDetails);
  };

  const handleClickOpen = () => () => {
    // setShowPinDetails(true);
    // console.log('Show pin status changed ', showPinDetails);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const toggleLike = () => {
    // console.log("Login hai??");
    // console.log(localStorage.getItem("isLoggedIn"));
    if (localStorage.getItem("isLoggedIn") == null) navigate("/login");
    const updateLike = async () => {
      try {
        const useremail = localStorage.getItem("useremail");
        const interactedPinId = pin.id;
        const liked = !isLiked;
        const response = await fetch(
          "http://localhost:7000/pinterest/analytics-api/updateLike",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ useremail, interactedPinId, liked }),
          }
        );

        console.log("Before likeStatus:", isLiked);

        if (localStorage.getItem("isLoggedIn") == null) navigate("/login");

        setLikeCount(likeCount + (isLiked ? -1 : 1));
        setLike(!isLiked);

        response.text().then((txt) => console.log(txt));
        // console.log("After likeStatus:",isLiked);
      } catch (error) {
        console.log("Error occured while updating like status.", error);
      }
    };
    updateLike();
  };

  return (
    <>
      <div className="col-md-4 mb-4">
        <div
          className="card"
        >
          <img
            src={`data:image/png;base64,${pin.image.data}`}
            alt={pin.title}
            onClick={pinDetailsHandler}
            className="card-img-top"
            style={{ height: "200px", objectFit: "cover" }}
          />

          <div className="card-body">
            <h5 className="card-title">{pin.title}</h5>
            <p className="card-text">{pin.about}</p>
            <p className="card-text">
              Uploaded By: {pin.userEmail.split("@")[0]}
            </p>
            <hr />
            {/* <span> {!pin.likeCount ? '🤍' : '🧡'} {pin.likeCount > 0 && pin.likeCount} {localStorage.getItem( "isLoggedIn") && isLiked && `You've liked this pin ..`} </span> */}
            <Badge badgeContent={likeCount} color="success">
              <span onClick={toggleLike}>{isLiked ? "🧡" : "🤍"}</span>
            </Badge>
          </div>
        </div>
        {showPinDetails && <Modal pin={pin} />}
      </div>
    </>
  );
};

export default Pin;
