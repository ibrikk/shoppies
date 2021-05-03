import React from "react";

const defaultImage = "https://image.shutterstock.com/image-vector/no-image-available-sign-internet-600w-261719003.jpg";


const Movie = ({ movie }) => {
  const poster =
    movie.Poster === "N/A" ? defaultImage : movie.Poster;
  return (
    <div className="movie">
      <h2>{movie.Title}</h2>
      <div>
        <img
          width="200"
          alt={`The movie titled: ${movie.Title}`}
          src={poster}
        />
      </div>
      <p>({movie.Year})</p>
    </div>
  );
};


export default Movie;