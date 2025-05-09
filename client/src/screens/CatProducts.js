import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetProductsByCategoryQuery } from "../store/services/productService";
import Wrapper from "./Wrapper";
import Spinner from "../components/Spinner";
import ProductCard from "../components/ProductCard";

const CatProducts = () => {
    const { categoryId } = useParams();
    const { data = {}, isFetching } = useGetProductsByCategoryQuery(categoryId);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [categoryId]);

    if (isFetching) return <Spinner />;

    return (
        <Wrapper>
            <div className="flex flex-wrap -mx-3">
                {data?.products?.length > 0 ? (
                    data.products.map((product) => (
                        <div key={product._id} className="w-full md:w-4/12 p-3">
                            <ProductCard product={product} />
                        </div>
                    ))
                ) : (
                    <p className="text-center w-full">Bu kategoride ürün bulunamadı.</p>
                )}
            </div>
        </Wrapper>
    );
};

export default CatProducts; 