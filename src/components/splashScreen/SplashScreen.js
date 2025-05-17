import React from 'react';
import splashLogo from '../../assets/pinterest_pins.jpg'

const SplashScreen = () => {
  return (
    <div className="splash-screen" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className='circular'>
      <img src={splashLogo} alt="Pinterest" style={{ width: '400px' }} />
      </div>
      
      <div className="pulse-animation">

        <br></br>
        <h1 style={{ color: '#00000', fontSize: '2rem' }}>Where ideas are created and shared ..  😎</h1>
      </div>
    </div>
  );
};

export default SplashScreen;
