import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import { useAllCategoriesQuery } from "../../store/services/categoryService";
import Skeleton from "../skeleton/Skeleton";
import Thumbnail from "../skeleton/Thumbnail";

const Categories = () => {
  const { data, isFetching } = useAllCategoriesQuery();
  
  return isFetching ? (
    <div className="flex flex-wrap -mx-4 mb-10">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          className="w-6/12 sm:w-4/12 md:w-3/12 lg:w-[20%] xl:w-2/12 p-4"
          key={item}
        >
          <Skeleton>
            <Thumbnail height="150px" />
          </Skeleton>
        </div>
      ))}
    </div>
  ) : (
    data?.categories.length > 0 && (
      <div className="w-full mb-10">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView="6"
          breakpoints={{
            0: {
              slidesPerView: 2,
            },
            640: {
              slidesPerView: 3,
            },
            768: {
              slidesPerView: 4,
            },
            1080: {
              slidesPerView: 5,
            },
            1280: {
              slidesPerView: 6,
            },
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className="w-full h-[150px] mb-10"
        >
          {data.categories.map((category, index) => (
            <SwiperSlide
              className="w-[150px] overflow-hidden rounded-lg relative"
              key={index}
            >
              <div className="w-full h-[150px] rounded-lg overflow-hidden">
                <img
                  src={`./images/category_banners/${(category.name).toLowerCase()}.jpg`}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
              <div className="absolute inset-0 w-full h-full bg-black/50 flex items-center justify-center p-4 uppercase">
                <Link
                  to={`/cat-products/${category.name}`}
                  className="text-white text-base font-medium capitalize"
                >
                  {category.name}
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    )
  );
};

export default Categories;
