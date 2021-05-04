import React, { useState } from "react";
import {
  Button,
  TextField,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const StyledButton = withStyles({
  root: {
    background: 'black',
    borderRadius: 3,
    border: 0,
    color: 'white',
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgb(149, 191, 71)',
  },
  label: {
    textTransform: 'capitalize',
  },
})(Button);

const Search = (props) => {
  const [searchValue, setSearchValue] = useState("");
  
  const handleSearchInputChanges = (e) => {
    setSearchValue(e.target.value);
  }


  const callSearchFunction = (e) => {
    e.preventDefault();
    props.search(searchValue);
  }

  return (
      <form className="search">
      <TextField size='small' id="standard-basic" variant="outlined" value={searchValue}
      onChange={handleSearchInputChanges}
      type="text" />
        <StyledButton  variant='contained' size='small' onClick={callSearchFunction} type="submit">SEARCH</StyledButton>
      </form>
    );
}

export default Search;