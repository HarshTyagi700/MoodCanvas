import React, { useState, useEffect } from "react";
import pinboardImage from "../../assets/PinBoard.jpg";
import Pin from "../pin/pin";
import { Button, Typography } from "@mui/material";

const MyBoards = () => {
  const [pinboards, setPinboards] = useState([]);
  const [pinsShow, setPinsShow] = useState(false);
  const [pinsList, setPinsList] = useState([]);
  const [selectedBoardName, setSelectedBoardName] = useState("");

  useEffect(() => {
    const fetchPinboards = async () => {
      try {
        const formData = new FormData();
        formData.append("emailId", localStorage.getItem("useremail"));

        const response = await fetch(
          "http://localhost:7000/pinterest/pinboard-api/getPinboards",
          {
            method: "POST",
            headers: {
              Authorization: localStorage.getItem("token"),
            },
            body: formData,
          }
        );

        const data = await response.json();
        setPinboards(data);
      } catch (error) {
        console.error("Error fetching pinboards:", error);
      }
    };

    fetchPinboards();
  }, []);

  const showPins = async (pinboard) => {
    try {
      setSelectedBoardName(pinboard.pinBoardName);
      const promises = (pinboard.pinIdList || []).map((pinId) =>
        fetch(`http://localhost:7000/pinterest/pins-api/pin/${pinId}`)
      );
      const responses = await Promise.all(promises);
      const pinResponses = await Promise.all(responses.map((res) => res.json()));
      setPinsList(pinResponses.filter((pin) => pin !== null));
      setPinsShow(true);
    } catch (error) {
      console.error("Error fetching pins:", error);
    }
  };

  const goBack = () => {
    setPinsShow(false);
    setPinsList([]);
  };

  return (
    <>
      {pinsShow ? (
        <div style={{ margin: "2rem" }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            {selectedBoardName}
          </Typography>

          <Button
            variant="outlined"
            color="primary"
            onClick={goBack}
            sx={{ mb: 3 }}
          >
            ← Back to Boards
          </Button>

          {pinsList.length > 0 ? (
            <div
              className="pins-grid"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1.5rem",
              }}
            >
              {pinsList.map((pin) => (
                <Pin key={pin.id} pin={pin} />
              ))}
            </div>
          ) : (
            <Typography color="text.secondary" fontStyle="italic">
              This board doesn't contain any pins yet.
            </Typography>
          )}
        </div>
      ) : (
        <div
          className="board-container"
          style={{
            marginTop: "100px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "2rem",
            padding: "0 2rem",
          }}
        >
          {pinboards.length > 0 ? (
            pinboards.map((pinboard) => (
              <div
                key={pinboard.pinBoardId}
                className="board-box"
                onClick={() => showPins(pinboard)}
                style={{
                  width: "220px",
                  cursor: "pointer",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s ease-in-out",
                }}
              >
                <img
                  src={pinboardImage}
                  alt={pinboard.pinBoardName}
                  className="board-image"
                  style={{
                    width: "100%",
                    height: "140px",
                    objectFit: "cover",
                  }}
                />
                <div
                  className="board-title"
                  style={{
                    padding: "1rem",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    textAlign: "center",
                    backgroundColor: "#f9f9f9",
                    color: "#1976d2",
                  }}
                >
                  {pinboard.pinBoardName}
                </div>
              </div>
            ))
          ) : (
            <Typography variant="h6" color="text.secondary">
              No boards created yet.
            </Typography>
          )}
        </div>
      )}
    </>
  );
};

export default MyBoards;
