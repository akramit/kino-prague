import './TopBar.css'

export function TopBar({ onChangeTheatre }) {
    const theatres = ['Kino Aero', 'Kino Ponerepo', 'Kino Svetohor']
    return (
        <header className="topbar">
            <div className="topbar__inner">
                <h2 className="topbar__title">Movie Showtimes</h2>
                <nav className="topbar__nav" aria-label="Theatres">
                    {theatres.map((theatre) => (
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
