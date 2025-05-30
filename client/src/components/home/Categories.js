import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";  // Navigation modülünü import ediyoruz
import { useAllCategoriesQuery } from "../../store/services/categoryService";
import Skeleton from "../skeleton/Skeleton";
import Thumbnail from "../skeleton/Thumbnail";
import { useRef } from 'react'; // useRef hook'unu import ediyoruz

const Categories = () => {
  const { data, isFetching } = useAllCategoriesQuery();
  // Swiper instance'ını tutmak için ref oluşturuyoruz
  const swiperRef = useRef(null);

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
      <div className="w-full mb-10 relative">
        <Swiper
          modules={[Autoplay, Navigation]}
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
          // Swiper instance'ını ref'e atıyoruz
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {data.categories.map((category, index) => (
            <SwiperSlide
              className="w-[150px] overflow-hidden rounded-lg relative"
              key={index}
            >
              <div className="w-full h-[150px] rounded-lg overflow-hidden">
                <img
                  src={`../images/category_banners/${(category.name).toLowerCase()}.jpg`}
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

        <div className="flex justify-center items-center gap-8 my-8">
          <button 
            className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full text-white text-2xl shadow-lg hover:bg-blue-600 transition-colors"
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Önceki slide"
          >
            &#10094;
          </button>
          <button 
            className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full text-white text-2xl shadow-lg hover:bg-green-600 transition-colors"
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Sonraki slide"
          >
            &#10095;
          </button>
        </div>
      </div>
    )
  );
};

export default Categories;