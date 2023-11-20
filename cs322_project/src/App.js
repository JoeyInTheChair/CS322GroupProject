// App.js
import React from 'react';
import SpotifyPlayer from './SpotifyPlayer';

const App = () => {
  // Replace 'YOUR_ACCESS_TOKEN' with the actual access token
  const accessToken = 'BQAVnf4WlfmmY3xM5NyBBz7TDvIZunAbBwbuRJ4xob60iGmO3VB_6ikyT0QkxpVRbtCxOJLR3bnijouiQF1wGeJA0JfwblIJQIUWrYp53q9O5xWtbQy691HsCCpkpFWnpRcVmf4uBf2vnEy_BnhsO-XRRDnc-Lbw73E6v_w5bbWveR29TNL4FX_-88tsMnWFvYdfO8XU'
  return (
    <div>
      <SpotifyPlayer token={accessToken} />
    </div>
  );
};

export default App;

