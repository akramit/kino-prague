import './theatre.css';

export function HoverModal({ isVisible, position, movie }) {
  if (!isVisible) {
    return null;
  }

  const { top, left } = position ?? {};

  return (
    <div
      className="hover-modal"
      style={{
        top,
        left,
      }}
      aria-hidden="true"
    >
      {/* {poster ? <img className="hover-modal__image" src={poster} alt={title} /> : null} */}
      <div className="hover-modal__content">
        <h4 className="hover-modal__title">{movie?.name}</h4>
        <p className="hover-modal__rating">IMDb: {movie?.rating ? movie.rating : 'NA'}</p>
        <p className="hover-modal__description">{movie?.plot}</p>
      </div>
    </div>
  );
}
