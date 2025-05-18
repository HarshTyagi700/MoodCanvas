import React, { useState ,useContext,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/Mood_Canvas_Logo.jpeg';
import noteContext from '../../context/noteContext';
import './customNavbar.css'

const PinterestNavbar = ({ setInputVal }) => {
  const state = useContext(noteContext);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const [username, setUsername] = useState(localStorage.getItem("username"));

  const handleSearch = async (text) => {
    try {
      
      const searchResponse = await fetch(`http://localhost:7000/pinterest/pins-api/search/?keyword=${encodeURIComponent(text)}`, {
        method: 'GET',
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      const searchResult = await searchResponse.json();
      const pinIds = searchResult.map((pin) => pin.id);

      const pinPromises = pinIds.map(async (pinId) => {
        const pinResponse = await fetch(`http://localhost:7000/pinterest/pins-api/pin/${pinId}`);
        const pinData = await pinResponse.json();
        return pinData;
      });

      const pinsData = await Promise.all(pinPromises);
      state.searchResult = pinsData;
      setInputVal(pinsData);
    } catch (error) {
      console.error('Error searching pins:', error);
    }
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setSearchText(text);
    setInputVal([]);

    if (text.trim() !== '') {
      handleSearch(text); // 🔄 Triggers search on every keystroke
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchText);
  };

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("useremail");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    state.username = "";
    state.token = "";
    state.useremail = "";
    setUsername(null);
    window.location.reload();
    navigate("/");
  }

  const moveToCreatePin = () => {
    navigate("/createpin");
  }

  const moveToMyPinBoard = () => {
    navigate("/myboards");
  }

  useEffect(() => {
    if (localStorage.getItem("username")) {
      const storedUsername = localStorage.getItem("username");
      setUsername(storedUsername);
      state.username = storedUsername;
    }
  }, []);

  return (
    <nav className="navbar fixed-top navbar-light bg-dark">
      <a className="navbar-brand" href="/">
        <img src={logo} height="30em" className="d-inline-block align-top" alt="" />
      </a>

      <form className="d-flex input-group w-auto" onSubmit={handleSubmit}>
        <input
          type="search"
          className="form-control rounded"
          placeholder="Search for Pins .."
          aria-label="Search"
          value={searchText}
          style={{marginRight:"0.5rem"}}
          onChange={handleInputChange}
        />
        <button type="submit" className="btn btn-outline-primary">
          <i className="fas fa-search"></i>
        </button>
      </form>

      {username == null ? (
        <a className="logout" href="/login"><center>Login/Register</center></a>
      ) : (
        <>
          <span><button className="createpin" onClick={moveToCreatePin}>Create Pin</button></span>
          <span><button className="createpin" onClick={moveToMyPinBoard}>My PinBoards</button></span>
          <span style={{ color: "white" }}>Namaste 🙏 {username.charAt(0).toUpperCase() + username.slice(1)}</span>
          <span><button className="logout" onClick={logout}>Logout</button></span>
        </>
      )}
    </nav>
  );
};

export default PinterestNavbar;
