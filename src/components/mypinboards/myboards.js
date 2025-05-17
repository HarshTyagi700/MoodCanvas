import React, { useState, useEffect } from "react";
// import pinboardImage from '../../assets/Pin';
import pinboardImage from "../../assets/PinBoard.jpg";
import Pin from "../pin/pin";

const MyBoards = () => {
  const [pinboards, setPinboards] = useState([]);
  const [pinsShow, setpinsShow] = useState(false);
  const [pinsList, setPinsList] = useState([]);
  const [pinBoard,setPinBoard]=useState();

  useEffect(() => {
    setpinsShow(false);
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
        console.log(pinboards);
      } catch (error) {
        console.error("Error fetching pinboards:", error);
      }
    };

    fetchPinboards();
    setpinsShow(false);
  }, []);

  const showPins = async (pinboard) => {
    try {
      const promises = (pinboard.pinIdList)?.map((pinId) =>
        fetch(`http://localhost:7000/pinterest/pins-api/pin/${pinId}`)
      );
      const responses = await Promise.all(promises);
      const pinResponses = await Promise.all(
        responses.map((response) => response.json())
      );
      setPinsList(pinResponses.filter((pin) => pin !== null));
      setpinsShow(true);
    } catch (error) {
      console.error("Error fetching pins:", error);
    }
  };

  const goBack=()=>{
   setpinsShow(false);
  };

  return (
    <>
      {pinsShow ? (
        
        <div style={{"margin":"10px"}}><br /><br /><br /><br />
            <button style={{"border":"5px solid red","background":"red","color":"white"}} onClick={goBack} > Back</button>
            <br /><br />
          {pinsList.map((pin) => (
            <Pin key={pin.id} pin={pin} />
          ))}
        </div>
      ) : (
        <div
          className="board-container"
          style={{ marginTop: "100px", display: "flex", flexWrap: "wrap" }}
        >
          {pinboards.map((pinboard) => (
            <div
              key={pinboard.pinBoardId}
              className="board-box"
              style={{ margin: "10px" }}
            >
              <img
                src={pinboardImage}
                alt={pinboard.pinBoardName}
                className="board-image"
                onClick={()=>showPins(pinboard)}
              />
              <div className="board-title">{pinboard.pinBoardName}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default MyBoards;
