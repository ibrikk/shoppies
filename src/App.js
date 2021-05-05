import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Search from './components/Search';
import axios from 'axios';
import _ from 'lodash';
import Banner from 'react-js-banner';
import {
  Grid,
  Container,
  Typography,
  CircularProgress,
  Button,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
} from '@material-ui/core';

const App = () => {
  const MOVIE_API_URL = `http://www.omdbapi.com/?apikey=80e5588b`;
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [nominations, setNominations] = useState([]);

  const defaultImage =
    'https://image.shutterstock.com/image-vector/no-image-available-sign-internet-600w-261719003.jpg';

  // Table

  const search = (searchValue) => {
    setLoading(true);
    setErrorMessage(null);

    axios
      .get(MOVIE_API_URL + `&s=` + searchValue)
      .then((response) => response.data)
      .then((response) => {
        console.log(response);
        if (response.Response === 'True') {
          setMovies(response.Search);
          setLoading(false);
        } else {
          setErrorMessage('Sorry, something went wrong!');
          setLoading(false);
        }
      });
  };

  const alreadyExists = (id) => {
    return nominations.findIndex((item) => item.imdbID === id);
  };

  const nominate = (id) => {
    if (alreadyExists(id) === -1) {
      for (const item of movies) {
        if (item.imdbID === id) {
          let a = _.cloneDeep(nominations);
          a.push(item);
          setNominations(a);
        }
      }
    }
  };

  const remove = (id) => {
    let a = _.cloneDeep(nominations);
    a = a.filter((item) => item.imdbID !== id);
    setNominations(a);
  };

  return (
    <Container className='App'>
      <Header text='The Shoppies' />
      <Search search={search} />

      <Container>
        <Grid
          container
          direction='row'
          justify='space-evenly'
          alignItems='flex-start'
        >
          <Grid item className='search_result'>
            <Typography className='movie-list'>
              See Our Library of Movies 🎥
            </Typography>
            {loading && !errorMessage ? (
              <CircularProgress className='spinner' color='secondary'>
                ...loading
              </CircularProgress>
            ) : errorMessage ? (
              <Grid item className='errorMessage'>
                {errorMessage}
              </Grid>
            ) : (
              movies?.map((movie, id) => (
                <Grid item>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography className='movie_title' variant='h4'>
                          {movie.Title}
                        </Typography>
                      </TableCell>
                      <TableCell align='right'>
                        <Typography className='year' variant='subtitle1'>
                          <strong>({movie.Year})</strong>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow key={id}>
                      <TableCell component='th' scope='row'>
                        <Grid item className='img_grid'>
                          <img
                            width='200'
                            alt={`The movie titled: ${movie.Title}`}
                            src={
                              movie.Poster === 'N/A'
                                ? defaultImage
                                : movie.Poster
                            }
                          />
                        </Grid>
                        <Grid item className='nom_btn_container'>
                          <Button
                            variant='contained'
                            size='medium'
                            color='primary'
                            className={
                              alreadyExists(movie.imdbID) !== -1
                                ? 'isDisabled'
                                : 'nom_btn'
                            }
                            disabled={alreadyExists(movie.imdbID) !== -1}
                            onClick={() => nominate(movie.imdbID)}
                          >
                            NOMINATE
                          </Button>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Grid>
              ))
            )}
          </Grid>
          <Grid item>
            <Typography className='movie-list'>
              Your Nominated List 🍿
            </Typography>
            {nominations.length > 4 && (
              <Banner title='😵‍💫 😵‍💫 😵‍💫 Whoa...looks like you already have more than 4 nominations!' />
            )}
            {nominations?.map((nom) => (
              <Grid item>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant='h4' className='movie_title'>
                        {nom.Title}
                      </Typography>
                    </TableCell>
                    <TableCell align='right'>
                      <Typography className='year' variant='subtitle1'>
                        <strong>({nom.Year})</strong>
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={nom}>
                    <TableCell component='th' scope='row'>
                      <Grid item>
                        <img
                          item
                          className='img_grid'
                          width='200'
                          alt={`The movie titled: ${nom.Title}`}
                          src={nom.Poster === 'N/A' ? defaultImage : nom.Poster}
                        />
                      </Grid>
                      <Grid item className='rmv_btn_container'>
                        <Button
                          className='nom_btn'
                          variant='contained'
                          size='medium'
                          color='secondary'
                          onClick={() => remove(nom.imdbID)}
                        >
                          REMOVE
                        </Button>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
};

export default App;
