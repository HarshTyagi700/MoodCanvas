import React, { useContext, useEffect, useRef, useState } from 'react';
import PinterestNavbar from './navbar/CustomNavbar';
import SplashScreen from './splashScreen/SplashScreen';
import './splashScreen/splashscreen.css';
import noteContext from '../context/noteContext';
import Pin from './pin/pin';


const Home = () => {
  const [pins, setPins] = useState([]);
  const state= useRef( useContext(noteContext));
  const[inputVal, setInputVal] = useState([]);
  const[showPinDetails,setShowPinDetails]=useState(false);
  const[isLoggedIn,setLoggedIn]=useState(localStorage.getItem("isLoggedIn"));

  useEffect(() => {
    // Fetch pins from the backend API
    // console.log(state.useremail);
    // console.log(state.username);
    // console.log(state.token);
    // console.log("Login ke baad in home compo:",localStorage.getItem("useremail"));
    setLoggedIn(localStorage.getItem("isLoggedIn"));
    const fetchPins = async () => {
      try {
        const response = await fetch('http://localhost:7000/pinterest/pins-api/all');
        const data = await response.json();
        // const shuffledData = data.sort((a, b) => 0.5 - Math.random());
        setPins(data);
      } catch (error) {
        console.error('Error fetching pins:', error);
      }
    };

    fetchPins();
  }, [isLoggedIn]);



  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Simulate an asynchronous process (e.g., API calls, data fetching)
    // console.log("Search Result from state :" + state.searchResult);
    setTimeout(() => {
      setIsLoading(false);
    }, 100); // Adjust the timeout duration as needed
  }, []);

  useEffect(() => {
    // Simulate an asynchronous process (e.g., API calls, data fetching)
    // console.log('useeffect runs')
    // console.log("Updating search results  :" + state.searchResult);
    setPins(state.searchResult);
    // console.log("Input State : ",state.searchResult); 
  }, [state.searchResult]);

  const pinDetailsHandler= () =>{
  setShowPinDetails(s => !s);
  console.log('Show pin status changed ', showPinDetails);
  }

  return (
    <div>
       {isLoading ? (<SplashScreen/>) : (
        <div>
 <PinterestNavbar setInputVal={setInputVal}/>
  <div className="row">

         { (  (inputVal)!=undefined && (inputVal).length > 0) ? (
          
         (inputVal).map((pin) => (
            <Pin key={pin.id} pin={pin}/>
          ))

       ) : (

          <>
          <h1>Home Page</h1>
        <div className="row">
     {pins!=undefined && pins.map((pin) => (
       <Pin key={pin.id} pin={pin}/>
     ))}
        </div>
          </>

        )}
      </div>
   
   
      
        </div>
       )}
     
    </div>
  );
};

export default Home;
