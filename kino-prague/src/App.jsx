import { useCallback, useState } from 'react';
import './App.css'
import { TopBar } from './components/TopBar';

import { Theatre } from './components/Theatre';

const showTimings = [
  {
    'date' : '01-10-2025',
    'theatreName' : 'Kino Ponrepo',
    'shows' : [
      {
        'name' : 'Movie A', 
        'time' : '2 PM'
      },
      {
        'name' : 'Movie B', 
        'time' : '7 PM'
      }
    ]
  }, 
  {
    'date' : '02-10-2025',
    'theatreName': 'Kino Aero',
    'shows' : [
      {
        'name' : 'Movie C', 
        'time' : '2 PM'
      },
      {
        'name' : 'Movie D', 
        'time' : '7 PM'
      }
    ]
  }
];

const shows = [
  {
    date: '01-10-2025',
    movies : [
      {
        name: "Dune: Part Two",
        time: '4 PM'
      },
      {
        name: "Devil Wears Prada",
        time : '6 PM'
      }
    ]
  },
  {
    date: '02-10-2025',
    movies : [
      {
        name: "Saving Private Ryan",
        time: '3 PM'
      }
    ]
  },
  {
    date: '05-10-2025',
    movies : []
  }
];

const otherShows = [
  {
    date: '10-10-2025',
    movies : [
      {
        name: "Dune: Part Three",
        time: '12 PM'
      }
    ]
  },
]

const theatreData = [
  {
    theatreName : 'Kino Aero',
    shows
  },
  {
    theatreName : 'Kino Ponerepo',
    shows: otherShows
  }
];



function App() {
  
  const [currentTheatre, setCurrentTheatre] = useState(theatreData[0]);  

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
        onChangeTheatre = {handleTheatreChange}
      />
      <Theatre 
        theatre={currentTheatre}
      />
    </>
  )
}

export default App
