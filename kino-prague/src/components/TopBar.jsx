import './TopBar.css'

export function TopBar({ theatreNames = [ 'No Theatres'], onChangeTheatre }) {
    
    return (
        <header className="topbar">
            <div className="topbar__inner">
                <h2 className="topbar__title">
                    {/* <img src="./src/assets/movie1.png" alt="" className="icon" /> */}
                    Movie Showtimes
                    {/* <img src="./src/assets/movie1.png" alt="" className="icon" /> */}
                    </h2>
                <nav className="topbar__nav" aria-label="Theatres">
                    {theatreNames.map((theatre) => (
                        <button
                            key={theatre}
                            type="button"
                            className="topbar__button"
                            onClick={() => onChangeTheatre?.(theatre)}
                        >
                            {theatre}
                        </button>
                    ))}
                </nav>
            </div>
        </header>
    )
}
