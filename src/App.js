import React, { useState, useEffect,  } from 'react';
import './App.css';
import Header from './components/Header';
import Search from './components/Search';
import axios from 'axios';
import _ from 'lodash';
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
  Table,
  Snackbar,
  SnackbarContent,
} from '@material-ui/core';


const App = () => {
  const MOVIE_API_URL = `http://www.omdbapi.com/?apikey=80e5588b`;
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openSnackBar, setOpenSnackbar] = useState(false);
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


  const updateState = (newNominations, shouldUpdateLocalStorage = true) => {
    if (shouldUpdateLocalStorage) {
      window.localStorage.setItem('noms', JSON.stringify(newNominations));
    }
    setNominations(newNominations);
    if (newNominations.length > 4) {
      setOpenSnackbar(true);
    } else {
      setOpenSnackbar(false);
    }
  };

  const nominate = (id) => {
    if (alreadyExists(id) === -1) {
      for (const item of movies) {
        if (item.imdbID === id) {
          let a = _.cloneDeep(nominations);
          a.push(item);
          updateState(a);
        }
      }
    }
  };

  const remove = (id) => {
    let a = _.cloneDeep(nominations);
    a = a.filter((item) => item.imdbID !== id);
   updateState(a);
  };

  

  useEffect(() => {
    const initialNominations = JSON.parse(window.localStorage.getItem('noms'));
    console.log(initialNominations);
    // to Obj
    if (Array.isArray(initialNominations) && initialNominations.length) {
      updateState(initialNominations, false);
    }
  }, []);

  

  return (
    <Container className='App'>
    <Snackbar open={openSnackBar}>
    <SnackbarContent>😵‍💫 😵‍💫 😵‍💫 Whoa...looks like you already have more than 4 nominations!</SnackbarContent>
  </Snackbar>
      <Header text='The Shoppies' />
      <Search search={search} />

      
      <Grid
        container
        direction='row'
        justify='space-evenly'
        alignItems='flex-start'
        spacing={2}
      >
        <Grid item className='left_grid' xs={12} md={6} >
          <Typography className='movie-list'>
            See Our Library of Movies 🎬
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
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Poster</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {movies?.map((movie, id) => (
                  <TableRow key={id}>
                    <TableCell>
                      <Grid
                        container
                        direction='column'
                        justify='center'
                        alignItems='flex-start'
                      >
                        <Grid item>
                          <Typography variant='h4'>{movie.Title}</Typography>
                        </Grid>
                        <Grid item>
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
                      </Grid>
                    </TableCell>
                    <TableCell align='right'>
                      <Typography variant='subtitle1'>
                        <strong>({movie.Year})</strong>
                      </Typography>
                    </TableCell>
                    <TableCell component='th' scope='row'>
                      <img
                        width='200'
                        alt={`The movie titled: ${movie.Title}`}
                        src={
                          movie.Poster === 'N/A' ? defaultImage : movie.Poster
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Grid>
        <Grid item xs={12} md={6} className='right_grid'>
          <Typography className='movie-list'>
            <strong>My Nominated List 🍿</strong>
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Poster</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {nominations?.map((nom) => (
                <TableRow key={nom}>
                  <TableCell>
                    <Grid
                      container
                      direction='column'
                      justify='center'
                      alignItems='flex-start'
                    >
                      <Grid item>
                        <Typography variant='h4'>{nom.Title}</Typography>
                      </Grid>
                      <Grid item>
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
                    </Grid>
                  </TableCell>

                  <TableCell align='right'>
                    <Typography variant='subtitle1'>
                      <strong>({nom.Year})</strong>
                    </Typography>
                  </TableCell>
                  <TableCell component='th' scope='row'>
                    <img
                      item
                      className='img_grid'
                      width='200'
                      alt={`The movie titled: ${nom.Title}`}
                      src={nom.Poster === 'N/A' ? defaultImage : nom.Poster}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
