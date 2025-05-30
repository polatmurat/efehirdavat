import Categories from "../../components/home/Categories";
import Nav from "../../components/home/Nav";
import Slider from "../../components/home/Slider";
import ProductSearch from "../../components/home/ProductSearch";
import AllProductsHome from "../../components/home/AllProductsHome";
import { useParams } from "react-router-dom";


const Home = () => {
  const { page = 1 } = useParams();
  return (
    <>
      <Nav />
      <div className="mt-[70px]">
        <Slider />
      </div>
      <div className="my-container mt-10">
        <ProductSearch />
      </div>
      <div className="my-container mt-10">
        <Categories />
      </div>
      <div className="my-container mt-10">
        <AllProductsHome page={page} />
      </div>
    </>
  );
};
export default Home;
