import React, { useEffect, useState, useContext } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import noteContext from "../../context/noteContext";
import { useNavigate } from "react-router-dom";

const Modal = ({ pin, liked }) => {
  const [open, setOpen] = React.useState(true);
  const [comments, setComments] = useState([]);
  const [isLiked, setLike] = useState(false);
  const state = useContext(noteContext);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLike(liked);

    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:7000/pinterest/analytics-api/comments/pinid=${pin.id}`
        );
        const data = await response.json();
        // Ensure comments is always an array
        setComments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching pins:", error);
        setComments([]); // fallback to empty array on error
      }
    };

    fetchComments();
  }, [liked, pin.id]);

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
    if (!newComment.trim()) return;

    const newCommentObj = {
      useremail: localStorage.getItem("useremail"),
      comment: newComment,
    };

    const addComment = async () => {
      try {
        const interactedPinId = pin.id;
        const useremail = localStorage.getItem("useremail");
        const comment = newComment;
        await fetch(`http://localhost:7000/pinterest/analytics-api/addComment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ interactedPinId, useremail, comment }),
        });
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    };

    addComment();

    // Safely update comments array state
    setComments(Array.isArray(comments) ? [...comments, newCommentObj] : [newCommentObj]);
    setNewComment("");
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          p: 2,
        },
      }}
    >
      <DialogTitle id="scroll-dialog-title" sx={{ fontWeight: "bold" }}>
        Pin Details
      </DialogTitle>
      <DialogContent dividers sx={{ bgcolor: "#fafafa" }}>
        <DialogContentText
          id="scroll-dialog-description"
          ref={descriptionElementRef}
          tabIndex={-1}
          sx={{ maxHeight: "60vh", overflowY: "auto" }}
        >
          <div
            className="card"
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              padding: "1rem",
              marginBottom: "1rem",
              backgroundColor: "white",
            }}
          >
            <img
              src={`data:image/png;base64,${pin.image.data}`}
              alt={pin.title}
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                borderRadius: "10px",
                marginBottom: "1rem",
              }}
            />
            <h5 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>{pin.title}</h5>
            <p style={{ marginBottom: "0.5rem" }}>{pin.about}</p>
            <p style={{ color: "#555", marginBottom: "0.5rem" }}>
              Uploaded By: <b>{pin.userEmail.split("@")[0]}</b>
            </p>
            <hr />
            <span style={{ fontSize: "1.2rem" }}>
              {state?.hasLiked ? "🧡" : "🤍"} {pin.likeCount > 0 && pin.likeCount}{" "}
              {localStorage.getItem("isLoggedIn") != null && "🗃️"}
            </span>
          </div>

          <div>
            <h6 style={{ marginBottom: "0.5rem" }}>Comments</h6>
            {Array.isArray(comments) && comments.length > 0 ? (
              comments.map((c, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "0.5rem 1rem",
                    marginBottom: "0.5rem",
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  }}
                >
                  <p style={{ fontWeight: "600", marginBottom: "0.25rem", color: "#333" }}>
                    {c.useremail.split("@")[0]} ➡️
                  </p>
                  <p style={{ margin: 0 }}>{c.comment}</p>
                </div>
              ))
            ) : (
              <p style={{ color: "#666", fontStyle: "italic" }}>No comments yet.</p>
            )}

            {localStorage.getItem("isLoggedIn") != null ? (
              <>
                <textarea
                  rows="3"
                  cols="40"
                  value={newComment}
                  onChange={handleCommentChange}
                  placeholder="Add a comment..."
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    marginTop: "1rem",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                ></textarea>
                <Button
                  variant="contained"
                  onClick={handleAddComment}
                  sx={{ mt: 1, bgcolor: "#1976d2", ":hover": { bgcolor: "#1565c0" } }}
                  disabled={!newComment.trim()}
                >
                  Add Comment
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                onClick={goToLogin}
                sx={{ mt: 2, width: "100%" }}
              >
                Login/Register to Comment
              </Button>
            )}
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
