import React, { useEffect, useState } from 'react';
import logo from '../../assets/Mood_Canvas_Logo.jpeg';
import SplashScreen from '../splashScreen/SplashScreen';
import './../splashScreen/splashscreen.css'; 

const SearchPin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleSearch = async () => {
    try {
      const searchResponse = await fetch(`http://localhost:7000/pinterest/pins-api/search/?keyword=${encodeURIComponent(searchText)}`, {
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
      setSearchResults(pinsData);
    } catch (error) {
      console.error('Error searching pins:', error);
    }
  };

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div>
      {isLoading ? (
        <SplashScreen />
      ) : (
        <div>
          {/* NAVBAR */}
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
                value={searchText}
                onChange={handleInputChange}
              />
              <button type="submit" className="btn btn-outline-primary">
                <i className="fas fa-search"></i>
              </button>
            </form>
          </nav>

          {/* SEARCH RESULTS */}
          <h1 className="mt-5 pt-5">Search Pins</h1>
          <div className="row">
            {searchResults.length > 0 ? (
              searchResults.map((pin) => (
                <div key={pin.pinId} className="col-md-4 mb-4">
                  <div className="card">
                    <img
                      src={`data:image/png;base64,${pin.image.data}`}
                      alt={pin.title}
                      className="card-img-top"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{pin.title}</h5>
                      <p className="card-text">{pin.about}</p>
                      <p className="card-text">Uploaded By: {pin.userEmail?.split('@')[0]}</p>
                      <span>{!pin.likeCount ? `🤍` : `🧡`} {pin.likeCount > 0 && pin.likeCount}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">No search results found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPin;
