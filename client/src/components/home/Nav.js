import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Search from "./Search";
import { toggleSearchBar } from "../../store/reducers/globalReducer";
import ExchangeRate from "./ExchangeRate";
const Nav = () => {
  const { userToken, user } = useSelector((state) => state.authReducer);  
  const { searchBar } = useSelector((state) => state.globalReducer);
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
                <FiSearch
                  size={22}
                  onClick={() => dispatch(toggleSearchBar())}
                />
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

              <li className="nav-li">
                <ExchangeRate />
              </li>

            </ul>
          </div>
        </div>
      </nav>
      <Search />
    </>
  );
};
export default Nav;
