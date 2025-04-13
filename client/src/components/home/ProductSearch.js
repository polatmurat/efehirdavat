import { useState, useEffect, useRef } from "react";
import { FiSearch, FiTrendingUp } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ProductSearch = ({ category = "" }) => {
  const [keyword, setKeyword] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [displayText, setDisplayText] = useState("");
  useEffect(() => {
    const welcomeText = "Efe Hırdavat'a Hoşgeldiniz..";
    const finalText = "Ürün Arayın";
    let currentText = "";
    let i = 0;
    let mode = "typing"; // typing | deleting | final
    let interval;
  
    const updateText = () => {
      if (mode === "typing") {
        currentText = welcomeText.slice(0, i + 1);
        setDisplayText(currentText);
        i++;
        if (i === welcomeText.length) {
          mode = "deleting";
          i = welcomeText.length;
          setTimeout(() => {
            interval = setInterval(updateText, 30);
          }, 1000);
          clearInterval(interval);
        }
      } else if (mode === "deleting") {
        currentText = welcomeText.slice(0, i - 1);
        setDisplayText(currentText);
        i--;
        if (i === 0) {
          mode = "final";
          i = 0;
          clearInterval(interval);
          setTimeout(() => {
            interval = setInterval(updateText, 70);
          }, 200);
        }
      } else if (mode === "final") {
        currentText = finalText.slice(0, i + 1);
        setDisplayText(currentText);
        i++;
        if (i === finalText.length) {
          clearInterval(interval);
        }
      }
    };
  
    interval = setInterval(updateText, 60);
  
    return () => clearInterval(interval);
  }, []);
  
  

  // Örnek popüler aramalar - gerçek uygulamada API'den gelebilir
  const popularSearches = ["Transpalet", "Eldiven", "Baret", "Yapıştırıcı", "Kriko"];

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim() === "") return;

    // Eğer bir kategori sayfasındaysak, gelecekte arama sorgusuna kategoriyi ekleyebiliriz
    // Şimdilik, sadece arama sonuçları sayfasına yönlendir
    navigate(`/search-products/${keyword}/1`);
  };

  const handlePopularSearch = (term) => {
    setKeyword(term);
    navigate(`/search-products/${term}/1`);
  };

  return (
    <div className="mb-8 max-w-3xl mx-auto">
      <div className="text-center mb-6 mt-[90px]">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 min-h-[3.5rem]">
          {displayText}
        </h1>

        <p className="text-gray-600 text-lg">
          Aradığınız ürünün ismini veya markasını girin
        </p>
      </div>

      <div className={`relative transition-all duration-300 ${isFocused ? 'scale-105' : 'scale-100'}`}>
        <form
          onSubmit={handleSearch}
          className="flex shadow-lg rounded-xl overflow-hidden border-2 transition-colors duration-300"
          style={{ borderColor: isFocused ? '#3b82f6' : 'transparent' }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Ne aramak istersiniz?"
            className="flex-grow p-5 outline-none text-lg"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 flex items-center justify-center transition-colors duration-300"
            disabled={keyword.trim() === ""}
          >
            <FiSearch size={24} />
            <span className="ml-2 font-medium hidden md:inline">Ara</span>
          </button>
        </form>

        {/* Arama önerilerinin animasyonlu gölgesi */}
        <div
          className="absolute inset-x-0 h-6 -bottom-6 bg-gradient-to-b from-gray-100 to-transparent"
          style={{ opacity: isFocused ? 1 : 0, transition: 'opacity 0.3s' }}
        ></div>
      </div>

      {/* Popüler aramalar */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <div className="flex items-center mr-2 text-gray-500">
          <FiTrendingUp className="mr-1" />
          <span className="text-sm">Popüler:</span>
        </div>

        {popularSearches.map((term, index) => (
          <button
            key={index}
            onClick={() => handlePopularSearch(term)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors duration-300"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductSearch;