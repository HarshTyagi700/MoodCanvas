import React, { useState ,useContext,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/Pinterest_Logo.svg.png';
import noteContext from '../../context/noteContext';
import './customNavbar.css'

const PinterestNavbar = ({ setInputVal}) => {

 const state= useContext(noteContext);
  const [searchText, setSearchText] = useState('');
  const navigate= useNavigate();
  const [username,setUsername]=useState(localStorage.getItem("username"));

  const handleSearch = async () => {
    try {
      // const formData = new FormData();
      // formData.append('keyword', searchText);

      const searchResponse = await fetch(`http://localhost:7000/pinterest/pins-api/search/?keyword=${searchText}`, {
        method: 'GET',
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        // body: formData
      });

      const searchResult = await searchResponse.json();
      // console.log(searchResult);
      const pinIds = searchResult.map((pin) => pin.id);

      const pinPromises = pinIds.map(async (pinId) => {
        const pinResponse = await fetch(`http://localhost:7000/pinterest/pins-api/pin/${pinId}`);
        const pinData = await pinResponse.json();
        // console.log(pinData);
        return pinData;
      });

      const pinsData = await Promise.all(pinPromises);
      // setSearchResults(pinsData);
      state.searchResult=pinsData;
      setInputVal(pinsData);
      // console.log('From State :');
      // console.log(state.searchResult);
    } catch (error) {
        
      console.error('Error searching pins:', error);
    }
  };



  const handleInputChange = (e) => {
    setSearchText(e.target.value);
    setInputVal([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const logout= () =>{
    localStorage.removeItem("username");
    localStorage.removeItem("useremail");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    state.username="";
    state.token="";
    state.useremail="";
    setUsername(null);
    window.location.reload();
    navigate("/");
  }

  const moveToCreatePin=()=>{
    navigate("/createpin");
  }

  const moveToMyPinBoard=()=>{
    navigate("/myboards");
  }

  //Checking whether user already logged in 
  useEffect(() => {
    // Simulate an asynchronous process (e.g., API calls, data fetching)
    // console.log(localStorage.getItem("isLoggedIn"));
   if(localStorage.getItem("username")!==null && localStorage.getItem("username").length>0){
    // console.log("Username from Local :",localStorage.getItem("username"));
    setUsername(localStorage.getItem("username"));
    // console.log(username);
    state.username=localStorage.getItem("username");
    // console.log("Username from State :",state.username);
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
          aria-describedby="search-addon"
          value={state.searchText}
          onChange={handleInputChange}
        />
        <button type="submit" className="btn btn-outline-primary">
          <i className="fas fa-search"></i>
        </button>
      </form>
      { localStorage.getItem("username")==null ? (
  
        <a href="/login">Login/Register</a>
      ) : (
        <>
        
          <span> <button className="createpin" onClick={moveToCreatePin}> Create Pin </button></span>
         <span> <button className="createpin" onClick={moveToMyPinBoard}> My PinBoards </button></span>
         <span style={{"color" : "white"}} > Namaste 🙏{localStorage.getItem("username").charAt(0).toUpperCase() + localStorage.getItem("username").slice(1)}</span>
         <span>  <button className="logout" onClick={logout}> Logout </button> </span> 

        </>
       
      )}

    </nav>
  );
};

export default PinterestNavbar;
