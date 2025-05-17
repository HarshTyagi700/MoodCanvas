import React, { useState } from "react";
import './createpin.css'
import { useNavigate } from 'react-router-dom';

const CreatePin = () => {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate=useNavigate();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleAboutChange = (e) => {
    setAbout(e.target.value);
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(selectedImage);
  };

  const handlePinUpload = async () => {
    try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("about", about);
        formData.append("image", image);
        formData.append("useremail",localStorage.getItem("useremail"));
  
        const response = await fetch(
          "http://localhost:7000/pinterest/pins-api/upload",
          {
            method: "POST",
            headers: {
                Authorization: localStorage.getItem("token"),
              },
            body: formData
          }
        );
  
        if (response.ok) {
          alert("Pin uploaded successfully")
          console.log("Pin uploaded successfully");
          setTitle("");
          setAbout("");
          setImage(null);
          setPreviewImage(null);
          navigate("/createpin");

          // Handle success case
        } else {
          console.error("Error uploading pin:", response.status);
          // Handle error case
        }
      } catch (error) {
        console.error("Error uploading pin:", error);
        // Handle error case
      }
  };

  return (
    
    <div className="create-pin-container">

      <h2>Create a Pin</h2>
      <div className="form-container">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={handleTitleChange}
        />
        <textarea
          placeholder="About"
          value={about}
          onChange={handleAboutChange}
        />
        <input type="file" onChange={handleImageChange} />
        {previewImage && (
          <img src={previewImage} alt="Pin Preview" className="preview-image" />
        )}
        <button onClick={handlePinUpload}>Upload Pin</button>
      </div>
    </div>
  );
};

export default CreatePin;
