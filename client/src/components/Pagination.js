import { Link } from "react-router-dom";

const Pagination = ({ page, count, perPage, path, theme }) => {
  const totalLinks = Math.ceil(count / perPage);
  let startLoop = page;
  let diff = totalLinks - page;

  if (diff <= 3) {
    startLoop = totalLinks - 3;
  }

  let endLoop = startLoop + 3;

  if (startLoop <= 0) {
    startLoop = 1;
  }

  // path parse edilecek, search parametresi varsa ayrılacak
  const [basePath, searchQuery] = path.split("?"); 
  const getLink = (pageNum) => {
    return `/${basePath}/${pageNum}${searchQuery ? `?${searchQuery}` : ""}`;
  };

  const links = () => {
    const allLinks = [];
    for (let i = startLoop; i <= endLoop && i <= totalLinks; i++) {
      allLinks.push(
        <li key={i} className="pagination-li">
          <Link
            className={` ${
              theme === "light" ? "pagination-link-light" : "pagination-link"
            }  ${page === i ? "bg-indigo-500 text-white" : ""}`}
            to={getLink(i)}
          >
            {i}
          </Link>
        </li>
      );
    }
    return allLinks;
  };

  const next = () => {
    if (page < totalLinks) {
      return (
        <li className="pagination-li">
          <Link
            className={`${
              theme === "light" ? "pagination-link-light" : "pagination-link"
            }`}
            to={getLink(page + 1)}
          >
            <i className="bi bi-chevron-double-right"></i>
          </Link>
        </li>
      );
    }
  };

  const prev = () => {
    if (page > 1) {
      return (
        <li className="pagination-li">
          <Link
            className={`${
              theme === "light" ? "pagination-link-light" : "pagination-link"
            }`}
            to={getLink(page - 1)}
          >
            <i className="bi bi-chevron-double-left"></i>
          </Link>
        </li>
      );
    }
  };

  return count > perPage ? (
    <ul className="flex mt-2">
      {prev()}
      {links()}
      {next()}
    </ul>
  ) : null;
};

export default Pagination;
