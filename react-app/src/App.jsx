//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import { TopBar } from './components/TopBar'
import { Theatre } from './components/theatre'

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

function App() {
  //const [count, setCount] = useState(0)
  const showTimes = [("2pm","2PM Mickey 17"), ('a', 'b')]
  return (
    <>
      <TopBar/>
      <Theatre 
        cinemaName="Kino Ponerepo"
        shows={shows}

      />
    </>
  )
}

export default App
