import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Search from "./components/Search";
import axios from "axios";
import _ from "lodash";
import {
  Grid,
  Container,
  Typography,
  CircularProgress,
  IconButton,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Table,
  Snackbar,
  Paper,
} from "@material-ui/core";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

const App = () => {
  const MOVIE_API_URL = `https://www.omdbapi.com/?apikey=80e5588b`;
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openSnackBar, setOpenSnackbar] = useState(false);
  const [nominations, setNominations] = useState([]);

  const defaultImage =
    "https://image.shutterstock.com/image-vector/no-image-available-sign-internet-600w-261719003.jpg";

  // Search for a list of movies and send a GET request
  const search = (searchValue) => {
    setLoading(true);
    setErrorMessage(null);

    axios
      .get(MOVIE_API_URL + `&s=` + searchValue)
      .then((response) => response.data)
      .then((response) => {
        if (response.Response === "True") {
          setMovies(response.Search);
          setLoading(false);
        } else {
          setErrorMessage("Sorry, something went wrong!");
          setLoading(false);
        }
      });
  };

  // Validate if the nomination already exists
  const alreadyExists = (id) => {
    return nominations.findIndex((item) => item.imdbID === id);
  };

  // Checks if the local storage should be updated, useful if the app grow
  const updateState = (newNominations, shouldUpdateLocalStorage = true) => {
    if (shouldUpdateLocalStorage) {
      // Pass the data in a string format
      window.localStorage.setItem("noms", JSON.stringify(newNominations));
    }
    setNominations(newNominations);
    // Display a banner if a user has 5 or more nominations
    if (newNominations.length > 4) {
      setOpenSnackbar(true);
    } else {
      setOpenSnackbar(false);
    }
  };

  // Add a nomination
  const nominate = (id) => {
    if (alreadyExists(id) === -1) {
      for (const item of movies) {
        if (item.imdbID === id) {
          let newNominations = _.cloneDeep(nominations);
          newNominations.push(item);
          updateState(newNominations);
        }
      }
    }
  };

  // Remove a nomination
  const remove = (id) => {
    let newNominations = _.cloneDeep(nominations);
    newNominations = newNominations.filter((item) => item.imdbID !== id);
    updateState(newNominations);
  };

  useEffect(() => {
    // Parsing from string to an Object
    const initialNominations = JSON.parse(window.localStorage.getItem("noms"));
    if (Array.isArray(initialNominations) && initialNominations.length) {
      updateState(initialNominations, false);
    }
  }, []);

  return (
    <Container className="App">
      <Snackbar
        open={openSnackBar}
        message=" 😵‍💫 😵‍💫 😵‍💫 Whoa...looks like you already have more than 4 nominations!"
      ></Snackbar>
      <Header text="The Shoppies" />
      <Grid
        container
        direction="row-reverse"
        justify="space-evenly"
        spacing={2}
      >
        <Grid item xs={12} lg={4} className="right_grid">
          {nominations.length ? (
            <Paper component="div" elevation={3} className="nomContainer">
              <Typography variant="h6">
                <strong>My Nominated List 🍿</strong>
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Remove</TableCell>
                    <TableCell align="left">Title</TableCell>
                    <TableCell align="center">Year</TableCell>
                    <TableCell align="center">Poster</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {nominations?.map((nom) => (
                    <TableRow key={nom}>
                      <TableCell align="left">
                        <IconButton
                          color="secondary"
                          size="medium"
                          onClick={() => remove(nom.imdbID)}
                          aria-label="Remove"
                        >
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="h6">{nom.Title}</Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Typography variant="subtitle2">
                          ({nom.Year})
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <img
                          item
                          className="img_grid"
                          width="100"
                          alt={`The movie titled: ${nom.Title}`}
                          src={nom.Poster === "N/A" ? defaultImage : nom.Poster}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          ) : (
            ""
          )}
        </Grid>
        <Grid item className="left_grid" xs={12} lg={8}>
          <Search search={search} />
          {loading && !errorMessage ? (
            <CircularProgress
              className="spinner"
              color="primary"
            ></CircularProgress>
          ) : errorMessage ? (
            <Typography variant="h5" className="error">
              {errorMessage}
            </Typography>
          ) : movies.length ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Title</TableCell>
                  <TableCell align="center">Year</TableCell>
                  <TableCell align="center">Poster</TableCell>
                  <TableCell align="center">Add</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {movies?.map((movie, id) => (
                  <TableRow key={id}>
                    <TableCell align="left">
                      <Typography variant="h5">{movie.Title}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle1">
                        <strong>({movie.Year})</strong>
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <img
                        width="100"
                        alt={`The movie titled: ${movie.Title}`}
                        src={
                          movie.Poster === "N/A" ? defaultImage : movie.Poster
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        size="medium"
                        className={
                          alreadyExists(movie.imdbID) !== -1
                            ? "isDisabled"
                            : "nom_btn"
                        }
                        disabled={alreadyExists(movie.imdbID) !== -1}
                        onClick={() => nominate(movie.imdbID)}
                        aria-label="Nominate"
                      >
                        <CheckCircleOutlineIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            ""
          )}
        </Grid>
      </Grid>  
    </Container>
  );
};

export default App;
