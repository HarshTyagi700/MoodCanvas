import React, { useEffect, useState, useContext } from "react";
// import * as React from 'react';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import noteContext from "../../context/noteContext";
// import './modal.css';
import { useNavigate } from 'react-router-dom';


const Modal = ({pin,liked}) => {
  const [open, setOpen] = React.useState(true);
  const [comments, setComments] = useState(() => []);
  const [isLiked,setLike]=useState(false);
  const state = useContext(noteContext);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();
  // const pinid = "647b5a3b9252b714dd1fd5d7";

  useEffect(() => {
    setLike(liked);
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:7000/pinterest/analytics-api/comments/pinid=${pin.id}`
        );
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching pins:", error);
      }
    };

    fetchComments();
  }, []);

  

  const handleClickOpen = () => () => {
    setOpen(true);

  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleAddComment = () => {
    // Assuming here that the comment is successfully added to the server and returned as a newCommentObj
    const newCommentObj = {
      useremail: localStorage.getItem("useremail"),
      comment: newComment,
    };
    const addComment = async () => {
      try {
        const interactedPinId=pin.id;
        const useremail=localStorage.getItem("useremail");
        const comment=newComment;
        const response = await fetch(
          `http://localhost:7000/pinterest/analytics-api/addComment`,{
            method: "POST",
            headers :{
              'Content-Type':'application/json'
            },
            body: JSON.stringify({interactedPinId,useremail,comment})
          }
        );
        // console.log(response.text());
      } catch (error) {
        console.error("Error fetching pins:", error);
      }
    };

    addComment();
  //  console.log(comments);
    // Updating the comments state with the new comment
    comments.length==0 ? setComments([newCommentObj]): setComments([...comments, newCommentObj]);

    // Clearing the comment input
    setNewComment("");
  };
  const goToLogin = async()=>{
    navigate("/login");
  }

  return (
    <>
      
      <div>
     
        <Dialog
          open={open}
          onClose={handleClose}
          scroll="paper"
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">Pin Details</DialogTitle>
          <DialogContent dividers={true}>
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
            >
              <div className="card">
                <img
                  src={`data:image/png;base64,${pin.image.data}`}
                  alt={pin.title}
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
                  <span>
                    {" "}
                    {state?.hasLiked ? "🧡" : "🤍" }{" "}
                    {pin.likeCount > 0 && pin.likeCount}{" "}
                    {localStorage.getItem("isLoggedIn")!=null && "🗃️"}
                  </span>
                </div>
              </div>
              Comments
              <br />
              {comments?.length > 0 &&
                comments.map((c) => (
                  <>
                  <div style={{border:"1px solid",marginBottom:"2px"}}>
                  <commenter style={{ color: "black", fontWeight: "bold"}}>
                   {c.useremail.split('@')[0]} ➡️ <br />
                   </commenter>
                    
                    {c.comment}
                     <br />
                  </div>
                  
                   
                  </>
                ))}
                {localStorage.getItem("isLoggedIn")!=null ? ( // Show comment box if user is logged in
                <>
                  <textarea
                    rows="3"
                    cols="40"
                    value={newComment}
                    onChange={handleCommentChange}
                    placeholder="Add a comment..."
                  ></textarea>
                  <button onClick={handleAddComment}>Add Comment</button>
                </>
              ) : ( // Show login/register button if user is not logged in
                <Button onClick={goToLogin}>Login/Register to Comment</Button>
              )}
                
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default Modal;
