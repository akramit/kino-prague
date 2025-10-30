import { useCallback, useEffect, useState } from 'react';
import './App.css'
import { TopBar } from './components/TopBar';
import { Theatre } from './components/Theatre';
import { THEATRE_DATA } from './components/theatreData';

const API_URL = 'https://kino-prague-production.up.railway.app/theatres'
// const DEV_URL = 'http://127.0.0.1:5001/theatres'

// async function fetchTheatresData() {
//   try {
//     const response = await fetch('https://kino-prague-production.up.railway.app/theatres');

//     if (!response.ok) {
//       console.log(" TEST MSG: server response failed")
//       return THEATRE_DATA;
//     }
//     const receivedData = await response.json();
//     return receivedData?.data;
//   }
//   catch (error) {
//     console.log(" TEST MSG: server response failed")
//     console.error(error);
//     return THEATRE_DATA;
//   }

// };

function App() {
  
  const [theatresData, setTheatresData] = useState(THEATRE_DATA);
  const [currentTheatre, setCurrentTheatre] = useState({});  
  const theatreNames = theatresData.map( theatre => theatre.theatreName);
  
  useEffect(() => {
    fetch(API_URL)
    .then(response => {
      if(!response.ok) {
        console.error('Error' + response.status);
        return {data: '', error: response.text}
      }
      return response.json();
    }) 
    .then(data => {
      setTheatresData(data?.data);
      setCurrentTheatre(data?.data[0]);
    })
    .catch(error => {
      console.error(error.message);
    })
  },[]);

  const handleTheatreChange = useCallback((theatreName) => {
    const newTheatre = theatresData.find((theatre) => theatre.theatreName === theatreName);
    if (newTheatre) {
      setCurrentTheatre(newTheatre);
    } else {
      setCurrentTheatre({theatreName: theatreName, shows: []});
    }
  });

  return (
    <>
      <TopBar
        theatreNames = {theatreNames}
        onChangeTheatre = {handleTheatreChange}
      />
      <Theatre 
        theatre={currentTheatre}
      />
    </>
  )
}

export default App
