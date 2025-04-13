import Categories from "../../components/home/Categories";
import Nav from "../../components/home/Nav";
import ProductSearch from "../../components/home/ProductSearch";
import AllProductsHome from "../../components/home/AllProductsHome";
import { useParams } from "react-router-dom";


const AllProducts = () => {
  const { page = 1 } = useParams();
  
  return (
    <>
      <Nav />
      <div className="my-container mt-10">
        <ProductSearch />
      </div>
      <div className="my-container mt-10">
        <Categories />
      </div>
      <div className="my-container mt-10">
        <AllProductsHome page={page} path='all-products' />
      </div>
    </>
  );
};
export default AllProducts;
