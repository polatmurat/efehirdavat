import { Link } from "react-router-dom";
const Sidebar = ({ side, closeSidebar }) => {
  return (
    <div
      className={`fixed top-0 ${side} sm:left-0 w-64 h-screen bg-gray-800 z-10 transition-all`}
    >
      <i
        className="bi bi-x-lg absolute top-4 right-4 sm:hidden block cursor-pointer text-lg"
        onClick={closeSidebar}
      ></i>
      <div className="bg-white p-4">
        <Link to="/dashboard/products"><img src="/images/efe-logo.png" className="h-[240px] object-cover" alt="logo" /></Link>
      </div>
      <ul className="mt-4">
        <li className="px-4 cursor-pointer transition-all py-3 text-white flex items-center hover:bg-gray-600">
          <i className="bi bi-card-list mr-2 inline-block text-lg"></i>{" "}
          <Link to="/dashboard/products" className="text-base capitalize">
            Products
          </Link>
        </li>
        <li className="px-4 cursor-pointer transition-all py-3 text-white flex items-center hover:bg-gray-600">
          <i className="bi bi-people mr-2 inline-block text-lg"></i>{" "}
          <Link to="/dashboard/users" className="text-base capitalize">
            Users
          </Link>
        </li>
        <li className="px-4 cursor-pointer transition-all py-3 text-white flex items-center hover:bg-gray-600">
          <i className="bi bi-bar-chart mr-2 inline-block text-lg"></i>{" "}
          <Link to="/dashboard/categories" className="text-base capitalize">
            Categories
          </Link>
        </li>
      </ul>
    </div>
  );
};
export default Sidebar;
