import { useState } from 'react';
import './theatre.css';
import { THEATRES_URL } from './theatreData';
import { HoverModal } from './HoverModal';

const MODAL_WIDTH = 280;
const APPROX_HALF_MODAL_HEIGHT = 90;

export function Theatre({ theatre }) {
  const [hoverDetails, setHoverDetails] = useState(null);
  const MODAL_HEIGHT = APPROX_HALF_MODAL_HEIGHT * 2;
  const handleMovieEnter = (movie, event) => {
  const {pageX, pageY} = event;
  const offset = 20;
  const left = Math.min( window.innerWidth - MODAL_WIDTH - offset,
      Math.max(offset, pageX - MODAL_WIDTH / 2),
  ); 

    const top = Math.max(offset, pageY - MODAL_HEIGHT - offset);

    setHoverDetails({
      movie : movie,
      position: {
        top,
        left,
      },
    });
  };

  const handleMovieLeave = () => {
    setHoverDetails(null);
  };

  const theatreUrl = THEATRES_URL.find(
    (th) => th.name === theatre.theatreName,
  )?.url;

  return (
    <section className="theatre">
      <header className="theatre__header">
        <h3 className="theatre__title">
          {theatre?.theatreName ? (
            <a
              href={theatreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="theatre__link"
            >
              {theatre.theatreName}
            </a>
          ) : (
            'Loading...'
          )}
        </h3>
      </header>
      {theatre?.shows?.length > 0 ? (
        theatre?.shows?.map((show) => {
          const movies = Array.isArray(show.movies) ? show.movies : [];

          return (
            <>
              <div className="date" key={show.date}>
                <h3>{show.date}</h3>
              </div>
              <table className="table-showtimes">
                <tbody>
                  {movies.length > 0 ? (
                    movies.map((movie) => (
                      <tr
                        key={`${show.date}-${movie.time}-${movie.name}`}
                        className="table-showtimes__row"
                        
                      >
                        <td className="td-showtimes time-cell">
                          {movie.time}</td>
                        <td className="td-showtimes movie"
                            onMouseEnter={(event) => handleMovieEnter(movie, event)}
                            onMouseLeave={handleMovieLeave}
                        >
                          {movie.name}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="table-showtimes__row">
                      <td className="td-showtimes time-cell">00:00</td>
                      <td className="td-showtimes movie">No Shows Today</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          );
        })
      ) : (
        <h3>No shows</h3>
      )}
      <HoverModal
        isVisible={Boolean(hoverDetails)}
        position={hoverDetails?.position}
        movie = {hoverDetails?.movie}
      />
    </section>
  );
}
