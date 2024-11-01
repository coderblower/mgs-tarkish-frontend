import React, { useState } from "react";
import search_icon from "../assets/search_icon.svg";

const SearchInput = ({
  newSearchValue,
  setNewSearchValue,
  setSearch,
  placeholder,
  search
}) => {

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewSearchValue(value);
  
    // Trigger search immediately if input is cleared
    if (value === "") {
      setSearch(" "); // Clear the search state immediately
    } else {
      setSearch(value); // Update search normally
    }
  };

  return (
    <div className="flex bg-[#D9D9D9] rounded-full ">
    <input
      value={newSearchValue}
      onChange={handleInputChange} // Using a function to handle changes
      className={`bg-transparent px-5 py-2 outline-none input_aprarnce_none w-full`}
      type="text"
      placeholder={placeholder}
    />

      {/* <img src={search_icon} /> */}
      <button
        onClick={() => setSearch(newSearchValue)}
        className="bg-[#1E3767] text-white px-4 py-2 rounded-r-full"
      >
        Search
      </button>
    </div>
  );
};

export default SearchInput;
