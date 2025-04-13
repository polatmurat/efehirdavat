import { useParams } from "react-router-dom";
import Header from "../../components/home/Header";
import Nav from "../../components/home/Nav";
import { useCatProductsQuery } from "../../store/services/homeProducts";
import ProductCard from "../../components/home/ProductCard";
import Pagination from "../../components/Pagination";
import EnhancedHeading from "../../components/home/EnhancedHeading";
import ProductSkeleton from "../../components/home/ProductSkeleton";
import ProductSearch from "../../components/home/ProductSearch";

const CatProducts = () => {
  const { name, page = 1 } = useParams();
  const { data, isFetching } = useCatProductsQuery({
    name,
    page: parseInt(page),
  });
  return (
    <>
      <Nav />

      <div className="my-container mt-[70px] my-10">
        <ProductSearch category={name} />
        
        {isFetching ? (
          <ProductSkeleton />
        ) : data.count > 0 ? (
          <>
              <EnhancedHeading title={name} />
            <div className="flex flex-wrap -mx-5">
              {data.products.map((product) => {
                return <ProductCard product={product} key={product._id} />;
              })}
            </div>
            <Pagination
              page={parseInt(page)}
              perPage={data.perPage}
              count={data.count}
              path={`cat-products/${name}`}
              theme="light"
            />
          </>
        ) : (
          <p className="alert-danger">{name} kategorisinde ürün bulunamadı.</p>
        )}
      </div>
    </>
  );
};

export default CatProducts;
