import React, { useEffect } from "react";
import search_icon from "../assets/search_icon.svg";
import delete_icon from "../../public/images/delete_icon.svg";


const SearchInput = ({
  newSearchValue,
  setNewSearchValue,
  setSearch,
  placeholder,
  search,
}) => {
  const handleClearSearch = () => {
    setNewSearchValue(""); // Clear the input value
    setSearch(""); // Clear the search state
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewSearchValue(value);
    setSearch(value); // Update search as the user types
  };

  // Synchronize `search` state with `newSearchValue` when `newSearchValue` is cleared
  useEffect(() => {
    if (newSearchValue === "") {
      setSearch("");
    }
  }, [newSearchValue, setSearch]);

  return (
    <div className="flex bg-[#D9D9D9] rounded-full">
      <input
        value={newSearchValue}
        onChange={handleInputChange}
        className="bg-transparent px-5 py-2 outline-none input_aprarnce_none w-full"
        type="text"
        placeholder={placeholder}
      />
      <button
        onClick={() => setSearch(newSearchValue)}
        className= { `bg-[#1E3767] text-white px-4 py-2 w-[120px] rounded-r-full`}
      >
        {search && (
         
            <img onClick={handleClearSearch} className="ml-5" src={delete_icon} alt="Clear Search" />
         
        ) || ( `Search` )}
      </button>
    </div>
  );
};

export default SearchInput;
