import React, { useEffect, useState } from 'react';
import SpotifyPlayer from './SpotifyService';

const App = () => {
   const [accessToken, setAccessToken] = useState('');
   const [isPlayerConnected, setIsPlayerConnected] = useState(false);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials&client_id=2b8a0cb69a80439991e0903cf7d060bd&client_secret=bab02efc51054534a414963364fe0378',
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          setAccessToken(data.access_token);
          console.log('[UPDATE TOKEN]: Access Token Received - ' + { accessToken });
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;

      script.onload = () => {
        window.onSpotifyWebPlaybackSDKReady = () => {
          const player = new window.Spotify.Player({
            name: 'Mixer One',
            getOAuthToken: cb => {
              cb(accessToken);
            },
          });
          console.log('[CONNECTED][UPDATE]: Attempting to connect to Spotify');

          player.connect().then(success => {
            if (success) {
              console.log('The Web Playback SDK successfully connected to Spotify!');
              setIsPlayerConnected(true);
              player.addListener('ready', ({ device_id }) => {
                console.log('[UPDATE][PLAY MUSIC]: Ready to play music!');
                console.log('Device ID', device_id);
              })
            } else {
              console.log('Failed to connect to Spotify');
            }
          });

          

        };
      };
      if(!isPlayerConnected) {
        fetchData();
      }
      document.body.appendChild(script);
      

      // Only run the effect when accessToken changes
    }, [accessToken, isPlayerConnected, setIsPlayerConnected]);


  
  return (
    <div>
      <SpotifyPlayer token={'BQDznLE9FjudM2vsT7C3wYmIbdCpaLnMG4r7rowhGLQ0QOTWPtqrUl-fnYwZDTyPysvcaz4tBaU3W1UnE3xYBIDRBFSbBuIx0An-xx4DQtCprDsDX_c'}/> 
    </div>
  );
};

export default App;