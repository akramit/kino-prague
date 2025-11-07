import { useCallback, useEffect, useState } from 'react';
import './App.css'
import { TopBar } from './components/TopBar';
import { Theatre } from './components/Theatre';
import { THEATRE_DATA } from './components/theatreData';
// To be updated later
// import { LoadingSpinner } from './components/spinner'

const API_URL = 'https://kino-prague-production.up.railway.app/theatres'
const SERVER_2 = 'https://kino-prague.onrender.com/theatres'
// const DEV_URL = 'http://127.0.0.1:5001/theatres'

async function fetchTheatresData(endpoint) {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      const error = await response.text()
      console.log(error)
      return {status: 'failed', error: error}
    }
    const theatresData = await response.json();
    return {status: 'success', data: theatresData?.data}
  }
  catch (error) {
    console.error(error.message);
    return {status: 'failed', error: error}
  }
};

function App() {
  
  const [theatresData, setTheatresData] = useState(THEATRE_DATA);
  const [currentTheatre, setCurrentTheatre] = useState({});  
  const theatreNames = theatresData?.map( theatre => theatre?.theatreName);
  
  useEffect(() => {
    const updateTheatresData = (theatresData) => {
      setTheatresData(theatresData?.data);
      setCurrentTheatre(theatresData?.data?.[0]);
    }
    async function fetchData() {
      var theatresData = await fetchTheatresData(API_URL);
      if (theatresData?.status === 'success') {
        updateTheatresData(theatresData);
      }
      else {
        theatresData = await fetchTheatresData(SERVER_2);
        if (theatresData?.status === 'success') {
          updateTheatresData(theatresData);
        }
        else {
          console.error(theatresData?.error)
        }
      }
    }
    fetchData();
  }, [])

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
