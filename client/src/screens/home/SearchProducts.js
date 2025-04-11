import { useParams } from "react-router-dom";
import Header from "../../components/home/Header";
import Nav from "../../components/home/Nav";
import { useSearchProductsQuery } from "../../store/services/homeProducts";
import ProductCard from "../../components/home/ProductCard";
import Pagination from "../../components/Pagination";
import ProductSkeleton from "../../components/home/ProductSkeleton";
import ProductSearch from "../../components/home/ProductSearch";

const SearchProducts = () => {
  const { keyword, page = 1 } = useParams();
  const { data, isFetching } = useSearchProductsQuery({
    keyword,
    page: parseInt(page),
  });
  return (
    <>
      <Nav />
      <div className="mt-[70px]">
        <Header>{keyword}</Header>
      </div>
      <div className="my-container my-10">
        <ProductSearch />
        
        {isFetching ? (
          <ProductSkeleton />
        ) : data.count > 0 ? (
          <>
            <p className="text-base font-medium text-gray-700">
            {keyword} kelimesi içeren {data.count} ürün listeleniyor.
            </p>
            <div className="flex flex-wrap -mx-5">
              {data.products.map((product) => {
                return <ProductCard product={product} key={product._id} />;
              })}
            </div>
            <Pagination
              page={parseInt(page)}
              perPage={data.perPage}
              count={data.count}
              path={`search-products/${keyword}`}
              theme="light"
            />
          </>
        ) : (
          <p className="alert-danger">
            {keyword} kelimesi içeren ürün bulunamadı.
          </p>
        )}
      </div>
    </>
  );
};

export default SearchProducts;
