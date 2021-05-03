import React, { useState, useEffect } from "react";
import './App.css';
import Header from './components/Header';
import Movie from './components/Movie';
import Search from './components/Search';
import axios from 'axios';


const App = () => {
   const MOVIE_API_URL = `http://www.omdbapi.com/?i=tt3896198&apikey=80e5588b`; 
   const [loading, setLoading] = useState(false);
   const [movies, setMovies] = useState([]);
   const [errorMessage, setErrorMessage] = useState(null);
   
  useEffect(() => {
     axios
     .get(MOVIE_API_URL)
     .then(response => response.data)
     
     .then(response => {
       console.log(response)
       setMovies(response.Search);
       setLoading(false);
      });
    }, [MOVIE_API_URL]);
    
    
    const search = searchValue => {
    setLoading(true);
    setErrorMessage(null);

    axios
    .get(`http://www.omdbapi.com/?s=${searchValue}&apikey=80e5588b`)
      .then(response => response.data)
      .then(response => {
        console.log(response)
        if (response.Response) {
          setMovies(response.Search);
          setLoading(false);
        } else {
          setErrorMessage(response.Error);
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