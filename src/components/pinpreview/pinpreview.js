import React, { useEffect, useState } from "react";
// import "./pinpreview.css";

const PinPreview = ({pin}) => {
  const [comments, setComments] = useState([]);
  const [errorMsg, setErrorMsg] = useState();
  useEffect(() => {
    const fetchComments = async () => {
      try {
        // console.log(pin);
        const response = await fetch(
          `http://localhost:7000/pinterest/analytics-api/comments/pinid=${pin.id}`
        );
        const data = await response.json();

        if (!response.ok) {
          setErrorMsg(data.message);
          console.log("This is error message:", data.message);
          setComments(null);
          console.log(errorMsg);
        } else {
          setErrorMsg(null);
          setComments(data);
        }
      } catch (error) {
        console.error("Error fetching pins:", error);
      }
    };

    fetchComments();
  }, []);

  return (
    <>
      <div className="comments">
        {comments?.length > 0 &&
          comments.map((c) => (
            <div key={c.id}>
              {c.useremail} {c.comment}
              <br />
            </div>
          ))}
        <div>{errorMsg !== null &&  `${errorMsg}` }</div>
      </div>
    </>
  );
};

export default PinPreview;
