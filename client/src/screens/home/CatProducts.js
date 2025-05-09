import { useParams } from "react-router-dom";
import Header from "../../components/home/Header";
import Nav from "../../components/home/Nav";
import { useCatProductsQuery } from "../../store/services/homeProducts";
import ProductCard from "../../components/home/ProductCard";
import Pagination from "../../components/Pagination";
import EnhancedHeading from "../../components/home/EnhancedHeading";
import ProductSkeleton from "../../components/home/ProductSkeleton";
import ProductSearch from "../../components/home/ProductSearch";
import { useFetchCategoryQuery } from "../../store/services/categoryService";

const CatProducts = () => {
  const { categoryId, page = 1 } = useParams();
  const { data: categoryData } = useFetchCategoryQuery(categoryId);
  const { data, isFetching } = useCatProductsQuery({
    categoryId,
    page: parseInt(page),
  });

  return (
    <>
      <Nav />

      <div className="my-container mt-[70px] my-10">
        <ProductSearch categoryId={categoryId} />
        
        {isFetching ? (
          <ProductSkeleton />
        ) : data.count > 0 ? (
          <>
              <EnhancedHeading title={categoryData?.category?.name || 'Kategori'} />
            <div className="flex flex-wrap -mx-5">
              {data.products.map((product) => {
                return <ProductCard product={product} key={product._id} />;
              })}
            </div>
            <Pagination
              page={parseInt(page)}
              perPage={data.perPage}
              count={data.count}
              path={`cat-products/${categoryId}`}
              theme="light"
            />
          </>
        ) : (
          <p className="alert-danger">Bu kategoride ürün bulunamadı.</p>
        )}
      </div>
    </>
  );
};

export default CatProducts;
