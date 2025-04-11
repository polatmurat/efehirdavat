import { FiSearch } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toggleSearchBar } from "../../store/reducers/globalReducer";

const Search = () => {
  const navgiate = useNavigate();
  const [state, setState] = useState("");
  const { searchBar } = useSelector((state) => state.globalReducer);
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  
  // Arama kutucuğu açıldığında otomatik odaklanma
  useEffect(() => {
    if (searchBar && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchBar]);
  
  const closeSearch = (e) => {
    const id = e.target.getAttribute("id");
    id === "search" && dispatch(toggleSearchBar());
  };
  
  const searchProducts = () => {
    if (state === "") {
      return;
    }
    navgiate(`/search-products/${state}/1`);
    dispatch(toggleSearchBar());
  };

  // Enter tuşuna basıldığında arama yapma
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchProducts();
    }
  };
  
  return (
    searchBar && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 w-full h-full bg-black/50 z-[300]"
        id="search"
        onClick={closeSearch}
      >
        <div className="flex -mx-8 justify-center">
          <div className="w-full sm:w-10/12 md:w-8/12 lg:w-6/12 px-8 mt-10 relative">
            <input
              ref={inputRef}
              type="text"
              name=""
              id=""
              className="w-full bg-white h-[50px] rounded outline-none pl-5 pr-14"
              placeholder="Ürünlerde Ara...."
              value={state}
              onChange={(e) => setState(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <FiSearch
              className="absolute top-[13px] right-12 text-2xl text-gray-500 cursor-pointer"
              onClick={searchProducts}
            />
          </div>
        </div>
      </motion.div>
    )
  );
};

export default Search;
