import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Search from "./Search";
import { toggleSearchBar } from "../../store/reducers/globalReducer";
import ExchangeRate from "./ExchangeRate";

const Nav = () => {
  const { user } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  return (
    <>
      <nav className="nav">
        <div className="my-container">
          <div className="flex justify-between items-center">
            <Link to="/">
              <img src="/images/main-logo2.png" className="h-[55px] object-cover" alt="logo" />
            </Link>
            <ul className="flex items-center">
              <li className="nav-li cursor-pointer">
                <FiSearch size={22} onClick={() => dispatch(toggleSearchBar())} />
              </li>
  
              <li className="nav-li">
                <Link to="/all-products/1">Tüm Ürünler</Link>
              </li>

              {user ? (
                <li className="nav-li">
                  <Link to="/user" className="nav-link">
                    {user?.name}
                  </Link>
                </li>
              ) : (
                <li className="nav-li">
                  <Link to="/login" className="nav-link">
                    Giriş Yap
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
  
      <Search />
  
      {/* Alt köşede sabit duran ExchangeRate kutusu */}
      <div className="fixed top-20 right-4 bg-white/80 backdrop-blur-md shadow-md rounded-lg px-8 py-2 text-sm z-50">
        <ExchangeRate />
      </div>
    </>
  );
  
};
export default Nav;
