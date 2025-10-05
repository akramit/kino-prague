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

export const theatreData = [
  {
    theatreName : 'Kino Aero',
    shows
  },
  {
    theatreName : 'Ponerepo Cinema',
    shows: otherShows
  },
  {
    theatreName : 'Kino Lucerna',
    shows : []
  },
  {
    theatreName : 'Kino Svetozor',
    shows : []
  }, 
  {
    theatreName : 'Kino 35',
    shows : []
  },
  {
    theatreName : 'Kino Atlas',
    shows : []
  }
];