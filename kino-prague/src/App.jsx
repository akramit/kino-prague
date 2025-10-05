import { useCallback, useState } from 'react';
import './App.css'
import { TopBar } from './components/TopBar';
import { Theatre } from './components/Theatre';
import { theatreData } from './components/theatreData';

function App() {
  
  const [currentTheatre, setCurrentTheatre] = useState(theatreData[0]);  
  const theatreNames = theatreData.map( theatre => theatre.theatreName);

  const handleTheatreChange = useCallback((theatreName) => {
    const newTheatre = theatreData.find((theatre) => theatre.theatreName === theatreName);
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
