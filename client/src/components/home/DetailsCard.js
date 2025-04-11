import { useState } from "react";
import { motion } from "framer-motion";
import h2p from "html2plaintext";
import htmlParser from "html-react-parser";
import { Toaster } from "react-hot-toast";
import { BsCheck2 } from "react-icons/bs";
import { useSelector } from "react-redux";
import DetailsImage from "./DetailsImage";
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

const DetailsCard = ({ product }) => {
  const { userToken, adminToken } = useSelector(state => state.authReducer);
  console.log(product);
  
  const [sizeState, setSizeState] = useState(
    product?.sizes?.length > 0 && product.sizes[0].name
  );
  const [colorState, setColorState] = useState(
    product?.colors?.length > 0 && product.colors[0].color
  );

  let desc = h2p(product.description);
  desc = htmlParser(desc);
  

  // Resimleri bir array'e dönüştür
  const images = [
    product.image1,
    product.image2,
    product.image3
  ].filter(Boolean); // null veya undefined olanları filtrele

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-wrap -mx-5"
    >
      <Toaster />
      <div className="w-full order-2 md:order-1 md:w-6/12 p-5">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={true}
          pagination={{ clickable: true }}
          className="w-full"
        >
          {images.length > 0 ? (
            images.map((image, index) => (
              <SwiperSlide key={index}>
                <DetailsImage image={image} />
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <DetailsImage image={null} />
            </SwiperSlide>
          )}
        </Swiper>
      </div>
      <div className="w-full order-1 md:order-2 md:w-6/12 p-5">
        <h1 className="text-2xl font-bold text-gray-900 uppercase">
          {product.title}
        </h1>
        
        {userToken || adminToken ? (
          <div className="flex justify-between my-5">
            <span className="text-2xl font-bold text-gray-900">
              {product.price} {product.currency === 'TL' ? '₺' : '$'}
            </span>
          </div>
        ) : (
          <div className="my-5">
            <span className="text-xl font-medium text-black">
              Fiyatı görmek için giriş yapın
            </span>
          </div>
        )}

        {product.sizes.length > 0 && (
          <>
            <h3 className="text-base font-medium capitalize text-gray-600 mb-3">
              sizes
            </h3>
            <div className="flex flex-wrap -mx-1">
              {product.sizes.map((size, index) => (
                <div
                  className={`p-2 m-1 border border-gray-300 rounded cursor-pointer ${
                    sizeState === size && "bg-indigo-600"
                  }`}
                  key={index}
                  onClick={() => setSizeState(size)}
                >
                  <span
                    className={`text-sm font-semibold uppercase  ${
                      sizeState === size ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {size}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
        {product.colors.length > 0 && (
          <>
            <h3 className="text-base font-medium capitalize text-gray-600 mb-2 mt-3">
              colors
            </h3>
            <div className="flex flex-wrap -mx-1">
              {product.colors.map((color, index) => (
                <div
                  key={index}
                  onClick={() => setColorState(color.hexCode)}
                  className="border border-gray-300 rounded m-1 p-1 cursor-pointer"
                >
                  <span
                    className="min-w-[40px] min-h-[40px] rounded flex items-center justify-center"
                    style={{ backgroundColor: color.hexCode }}
                  >
                    {colorState === color.hexColor && (
                      <BsCheck2 className="text-white" size={20} />
                    )}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        <h3 className="text-base font-medium capitalize text-gray-600 mb-2 mt-3">
          Açıklama
        </h3>
        <div className="mt-4 leading-[27px] description">{desc}</div>
      </div>
    </motion.div>
  );
};

export default DetailsCard;
