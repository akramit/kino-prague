
import './theatre.css'

export function Theatre({ theatre }) {

    return (
        <section className="theatre">
            <header className="theatre__header">
                <h3 className="theatre__title">{theatre.theatreName}</h3>
            </header>
            {theatre.shows.length > 0 ? (
                theatre.shows.map((show) => (
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
