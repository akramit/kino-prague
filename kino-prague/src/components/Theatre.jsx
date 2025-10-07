
import './theatre.css'
import { THEATRES_URL } from './theatreData'



export function Theatre({ theatre }) {

    const theatreUrl = THEATRES_URL.find(th => th.name === theatre.theatreName)?.url;
    return (
        <section className="theatre">
            {/* <header className="theatre__header">
                <h3 className="theatre__title">{theatre?.theatreName ? theatre.theatreName : 'Loading...'}</h3>
            </header> */}
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
                theatre?.shows?.map((show) => (
                    <>
                        <div className="date">
                            <h3>{show.date}</h3>
                        </div>
                        <table class="table-showtimes">
                            {show.movies.length > 0 ?  (
                                show.movies.map((movie) => (
                                <tr><td class="td-showtimes time-cell">{movie.time}</td><td class="td-showtimes movie">{movie.name}</td></tr> 
                                ))
                            ) : (
                                <tr><td class="td-showtimes time-cell">00:00</td><td class="td-showtimes movie">No Shows Today</td></tr>
                            )}
                        </table>
                    </>
                ))
            ) : (
                <h3>No shows</h3>
            )}
        </section>
    )
}
