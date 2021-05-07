import { React, useState } from "react";
import {
  makeStyles,
  Grid,
  Paper,
  InputBase,
  IconButton,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  container: {
    display: "flex",
    "justify-content": "center",
    "margin-top": "7em",
  },
}));

const Search = (props) => {
  const [searchValue, setSearchValue] = useState("");
  const classes = useStyles();

  // Saves changes in the input to the state
  const handleSearchInputChanges = (e) => {
    setSearchValue(e.target.value);
  };

  const callSearchFunction = (e) => {
    e.preventDefault();
    props.search(searchValue);
  };

  return (
    <div className={classes.container}>
      <Grid
        container
        direction="row"
        justify="space-evenly"
        alignItems="flex-start"
      >
        <Grid item className="left_grid">
          <Paper component="div" elevation={3} className={classes.root}>
            <InputBase
              className={classes.input}
              placeholder="Search A Movie"
              inputProps={{ "aria-label": "search a movie" }}
              onChange={handleSearchInputChanges}
            />
            <IconButton
              className={classes.iconButton}
              type="submit"
              aria-label="search"
              onClick={callSearchFunction}
            >
              <SearchIcon />
            </IconButton>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Search;
