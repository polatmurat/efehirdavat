import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGetCategoriesQuery } from "../store/services/categoryService";
import Spinner from "./Spinner";

const Slider = () => {
    const { data = {}, isFetching } = useGetCategoriesQuery();
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % (data?.categories?.length || 1));
        }, 5000);

        return () => clearInterval(timer);
    }, [data?.categories?.length]);

    if (isFetching) return <Spinner />;

    return (
        <div className="relative h-[300px] overflow-hidden">
            {data?.categories?.map((category, index) => (
                <Link
                    key={category._id}
                    to={`/cat-products/${category._id}`}
                    className={`absolute w-full h-full transition-opacity duration-500 ${
                        index === currentSlide ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <h2 className="text-white text-4xl font-bold uppercase">
                            {category.name}
                        </h2>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default Slider; 