import { useState, useEffect } from "react";
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
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [displayPrice, setDisplayPrice] = useState(product.price);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [displayStock, setDisplayStock] = useState(product.stock);

  // Varyasyonları boyut ve renge göre grupla
  const groupedVariations = product.variations?.reduce((acc, variation) => {
    if (variation.size) {
      if (!acc.sizes) acc.sizes = [];
      if (!acc.sizes.includes(variation.size)) {
        acc.sizes.push(variation.size);
      }
    }
    if (variation.color) {
      if (!acc.colors) acc.colors = [];
      if (!acc.colors.includes(variation.color)) {
        acc.colors.push(variation.color);
      }
    }
    return acc;
  }, {}) || {};

  // Varyasyon seçildiğinde fiyatı güncelle
  const handleVariationSelect = (variation) => {
    setSelectedVariation(variation);
    setDisplayPrice(variation.price);
    setDisplayStock(variation.stock ? variation.stock : product.stock);
  };

  // Boyut seçildiğinde
  const handleSizeSelect = (size) => {
    // Eğer aynı boyut tekrar seçildiyse seçimi kaldır
    if (selectedSize === size) {
      setSelectedSize(null);
      setSelectedVariation(null);
      setDisplayPrice(product.price); // Ana ürün fiyatına dön
      setDisplayStock(product.stock); // Ana ürün stok bilgisine dön
      return;
    }

    // Yeni boyut seçildiğinde renk seçimini temizle
    setSelectedColor(null);
    setSelectedSize(size);

    // Sadece boyut varyasyonunu bul (renk olmadan)
    const variation = product.variations?.find(v => 
      v.size === size && (!v.color || v.color === '')
    );

    if (variation) {
      handleVariationSelect(variation);
    }
  };

  // Renk seçildiğinde
  const handleColorSelect = (color) => {
    // Eğer aynı renk tekrar seçildiyse seçimi kaldır
    if (selectedColor === color) {
      setSelectedColor(null);
      setSelectedVariation(null);
      setDisplayPrice(product.price); // Ana ürün fiyatına dön
      setDisplayStock(product.stock); // Ana ürün stok bilgisine dön
      return;
    }

    // Yeni renk seçildiğinde boyut seçimini temizle
    setSelectedSize(null);
    setSelectedColor(color);

    // Sadece renk varyasyonunu bul (boyut olmadan)
    const variation = product.variations?.find(v => 
      v.color === color && (!v.size || v.size === '')
    );

    if (variation) {
      handleVariationSelect(variation);
    }
  };

  // İlk yüklemede en düşük fiyatlı varyasyonu seç
  useEffect(() => {
    if (product.variations && product.variations.length > 0) {
      // En düşük fiyatlı varyasyonu bul
      const lowestPriceVariation = product.variations.reduce((lowest, current) => {
        return current.price < lowest.price ? current : lowest;
      }, product.variations[0]);

      setSelectedVariation(lowestPriceVariation);
      setDisplayPrice(lowestPriceVariation.price);
      setDisplayStock(lowestPriceVariation.stock);
      
      // Eğer en düşük fiyatlı varyasyonun boyutu varsa seç
      if (lowestPriceVariation.size) {
        setSelectedSize(lowestPriceVariation.size);
      }
      // Eğer en düşük fiyatlı varyasyonun rengi varsa seç
      if (lowestPriceVariation.color) {
        setSelectedColor(lowestPriceVariation.color);
      }
    }
  }, [product]);

  
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
            <Link to={`/cat-products/${product.categoryId}`} className="text-sm capitalize">{product.category || 'Ürün'}</Link>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-3xl font-bold text-gray-800 mb-3"
          >
            {product.title}
          </motion.h1>

          {/* Varyasyon Etiketi */}
          {product.variations && product.variations.length > 0 && (
            <motion.div 
              variants={itemVariants}
              className="mb-4"
            >
              <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                VARYASYONLU ÜRÜN
              </div>
            </motion.div>
          )}

          {userToken || adminToken ? (
            <motion.div 
              variants={itemVariants}
              className="flex items-center gap-4 my-6"
            >
              <span className="text-3xl font-bold text-indigo-600">
                {formatPrice(selectedVariation ? (selectedVariation.price ? selectedVariation.price : product.price) : product.price, product.currency)} 
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

          {/* Varyasyon Seçimi */}
          {product.variations && product.variations.length > 0 && (
            <>
              {/* Boyut Seçimi */}
              {groupedVariations.sizes && groupedVariations.sizes.length > 0 && (
                <motion.div variants={itemVariants} className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <TbRuler size={20} className="text-indigo-600" />
                    <h3 className="text-lg font-medium text-gray-700">
                      Boyut Seçiniz
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {groupedVariations.sizes.map((size) => (
                      <motion.button
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                          selectedSize === size 
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

              {/* Renk Seçimi */}
              {groupedVariations.colors && groupedVariations.colors.length > 0 && (
                <motion.div variants={itemVariants} className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <MdOutlineColorLens size={20} className="text-indigo-600" />
                    <h3 className="text-lg font-medium text-gray-700">
                      Renk Seçiniz
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {groupedVariations.colors.map((color) => (
                      <motion.div
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center border-2 ${
                          selectedColor === color 
                            ? 'border-indigo-600 transform scale-110' 
                            : 'border-transparent'
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: color }}
                        >
                          {selectedColor === color && (
                            <BsCheck2 className="text-white" size={16} />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Stock */}
              <motion.div variants={itemVariants} className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <BiCube size={20} className="text-indigo-600" />
                  <h3 className="text-lg font-medium text-gray-700">
                    Koli İçi Adet
                  </h3>
                </div>
                <p className="text-xl font-semibold text-gray-800 ml-7">
                  {displayStock}
                  {selectedVariation && (
                    <span className="text-sm text-gray-500 ml-2">
                      (Varyasyon: {selectedVariation.size || selectedVariation.color})
                    </span>
                  )}
                </p>
              </motion.div>
            </>
          )}

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
              Fiyarlarımıza KDV dahil değildir.
              {desc}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DetailsCard;