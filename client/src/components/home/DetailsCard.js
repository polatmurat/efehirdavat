import { useState } from "react";
import { motion } from "framer-motion";
import h2p from "html2plaintext";
import htmlParser from "html-react-parser";
import { Toaster } from "react-hot-toast";
import { BsCheck2, BsArrowLeft, BsInfoCircle } from "react-icons/bs";
import { BiCube } from "react-icons/bi";
import { MdOutlineColorLens } from "react-icons/md";
import { TbRuler } from "react-icons/tb";
import { useSelector } from "react-redux";
import DetailsImage from "./DetailsImage";
import { Navigation, Pagination, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { formatPrice } from "../../utils/formatPrice";
import { Link } from "react-router-dom";

const DetailsCard = ({ product }) => {
  const { userToken, adminToken } = useSelector(state => state.authReducer);

  console.log(product);
  

  const [sizeState, setSizeState] = useState(
    product?.sizes?.length > 0 ? product.sizes[0] : null
  );
  const [colorState, setColorState] = useState(
    product?.colors?.length > 0 ? product.colors[0].color : null
  );
  
  let desc = h2p(product.description);
  desc = htmlParser(desc);

  // Resimleri bir array'e dönüştür
  const images = [
    product.image1,
    product.image2,
    product.image3
  ].filter(Boolean); // null veya undefined olanları filtrele
  


  // Animasyon varyantları
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };  

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-xl overflow-hidden shadow-xl"
    >
      <Toaster position="top-right" />
      
      <div className="flex flex-col md:flex-row">
        {/* Ürün Resimleri */}
        <div className="w-full md:w-1/2 p-4">
          <motion.div 
            variants={itemVariants}
            className="bg-gray-50 rounded-xl overflow-hidden"
          >
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation={true}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={images.length > 1}
              className="aspect-square rounded-xl"
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
          </motion.div>
        </div>
        
        {/* Ürün Detayları */}
        <div className="w-full md:w-1/2 p-6">
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-2 text-gray-500 mb-4"
          >
            <BsArrowLeft size={16} />
            <span className="text-sm">Katalog</span>
            <span className="text-sm">/</span>
            <Link to={`/cat-products/${product.category}`} className="text-sm capitalize">{product.category || 'Ürün'}</Link>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-3xl font-bold text-gray-800 mb-3"
          >
            {product.title}
          </motion.h1>

          {userToken || adminToken ? (
            <motion.div 
              variants={itemVariants}
              className="flex items-center gap-4 my-6"
            >
              <span className="text-3xl font-bold text-indigo-600">
                {formatPrice(product.price, product.currency)} 
              </span>
              <div
                className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full font-medium ${
                  product.isAvailable 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${product.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                {product.isAvailable ? 'STOKTA' : 'STOKTA DEĞİL'}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              variants={itemVariants}
              className="my-6 flex items-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-lg"
            >
              <BsInfoCircle size={20} />
              <span className="font-medium">
                Fiyatı görmek için giriş yapın
              </span>
            </motion.div>
          )}

          <motion.div 
            variants={itemVariants}
            className="h-px w-full bg-gray-200 my-6"
          ></motion.div>

          {/* Ürün Bedenleri */}
          {product.sizes && product.sizes.length > 0 && (
            <motion.div variants={itemVariants} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <TbRuler size={20} className="text-indigo-600" />
                <h3 className="text-lg font-medium text-gray-700">
                  Ürün Boyutları
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSizeState(size)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                      sizeState === size 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Ürün Renkleri */}
          {product.colors && product.colors.length > 0 && (
            <motion.div variants={itemVariants} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <MdOutlineColorLens size={20} className="text-indigo-600" />
                <h3 className="text-lg font-medium text-gray-700">
                  Renkler
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color, index) => (
                  <motion.div
                    key={index}
                    onClick={() => setColorState(color.color)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center border-2 ${
                      colorState === color.color 
                        ? 'border-indigo-600 transform scale-110' 
                        : 'border-transparent'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: color.color }}
                    >
                      {colorState === color.color && (
                        <BsCheck2 className="text-white" size={16} />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Koli İçi Adet */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <BiCube size={20} className="text-indigo-600" />
              <h3 className="text-lg font-medium text-gray-700">
                Koli İçi Adet
              </h3>
            </div>
            <p className="text-xl font-semibold text-gray-800 ml-7">
              {product.stock}
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="h-px w-full bg-gray-200 my-6"
          ></motion.div>

          {/* Açıklama */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-3">
              <BsInfoCircle size={18} className="text-indigo-600" />
              <h3 className="text-lg font-medium text-gray-700">
                Açıklama
              </h3>
            </div>
            <div className="prose prose-sm text-gray-600 ml-6 mt-2">
              {desc}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DetailsCard;