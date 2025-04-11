import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ProductSearch = ({ category = "" }) => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim() === "") return;
    
    // If we're in a category page, we could add the category to the search query in the future
    // For now, just navigate to the search results page
    navigate(`/search-products/${keyword}/1`);
  };

  return (
    <div className="mb-5">
      <h1 className="text-5xl mb-2">Ürün Arayın</h1>
      <h3 className="mb-3 ml-1">Aradığınız ürünün ismini veya markasını girin</h3>
      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          placeholder="Ürün Arayın..."
          className="flex-grow border border-gray-300 rounded-l-md p-4 outline-none focus:border-blue-500"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button 
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r-md flex items-center justify-center"
        >
          <FiSearch size={18} />
        </button>
      </form>
    </div>
  );
};

export default ProductSearch; 