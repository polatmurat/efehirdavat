import { useGetProductsQuery } from "../../store/services/productService";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import Pagination from "../Pagination"; // varsayılan konum, kendi yapına göre güncelleyebilirsin
import EnhancedHeading from "./EnhancedHeading";

const AllProductsHome = ({ page, path }) => {
  const { data, isFetching } = useGetProductsQuery({ page });
  
  return (
    <div className="my-container mt-10">
      <div className="flex justify-between items-center mb-5">
      <EnhancedHeading title={"Tüm Ürünler"} />
      </div>
      <div className="flex flex-wrap -mx-5 border-b-2 mb-5">
        {isFetching ? (
          <ProductSkeleton />
        ) : data?.products?.length > 0 ? (
          data.products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p className="text-gray-500 text-center w-full">Ürün bulunamadı.</p>
        )}
      </div>

      {/* Sayfalama */}
      {!isFetching && data?.count > data?.perPage && (
        <Pagination
          page={parseInt(page)}
          count={data.count}
          perPage={data.perPage}
          path={path === 'all-products' ? 'all-products' : 'page'}
          theme="light"
        />
      )}
    </div>
  );
};

export default AllProductsHome;
