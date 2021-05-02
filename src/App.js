import React, { useState, useEffect } from "react";
import './App.css';
import Header from './components/Header';
import Movie from './components/Movie';
import Search from './components/Search';


const App = () => {
   const MOVIE_API_URL = `http://www.omdbapi.com/?i=tt3896198&apikey=80e5588b`; // you should replace this with yours
   const [loading, setLoading] = useState(false);
   const [movies, setMovies] = useState([]);
   const [errorMessage, setErrorMessage] = useState(null);
   
  useEffect(() => {
     fetch(MOVIE_API_URL)
     .then(response => response.json())
     
     .then(jsonResponse => {
       console.log(jsonResponse)
       setMovies(jsonResponse.Search);
       setLoading(false);
      });
    }, [MOVIE_API_URL]);
    
    
    const search = searchValue => {
    setLoading(true);
    setErrorMessage(null);

    fetch(`http://www.omdbapi.com/?s=${searchValue}&apikey=80e5588b`)
      .then(response => response.json())
      .then(jsonResponse => {
        if (jsonResponse.Response) {
          setMovies(jsonResponse.Search);
          setLoading(false);
        } else {
          setErrorMessage(jsonResponse.Error);
          setLoading(false);
        }
      });
  	};
    
    
    return (
     <div className="App">
      <Header text="The Shoppies" />
      <Search search={search} />
      <p className="App-intro">Sharing a few of our favourite movies</p>
      <div className="movies">
        {loading && !errorMessage ? (
         <span>loading...</span>
         ) : errorMessage ? (
          <div className="errorMessage">{errorMessage}</div>
        ) : (
          movies?.map((movie, index) => (
            <Movie key={`${index}-${movie.Title}`} movie={movie} />
          ))
        )}
      </div>
    </div>
  );
};


export default App;