import React, { useState } from "react";


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
        <input
          value={searchValue}
          onChange={handleSearchInputChanges}
          type="text"
        />
        <button onClick={callSearchFunction} type="submit">SEARCH</button>
      </form>
    );
}

export default Search;