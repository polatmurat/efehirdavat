import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BsCart3, BsEye } from "react-icons/bs";
import { BiCube } from "react-icons/bi";
import { useSelector } from "react-redux";
import { formatPrice } from "../../utils/formatPrice";

const ProductCard = ({ product }) => {
  const { userToken, adminToken } = useSelector(state => state.authReducer);

  // Animasyon varyantları
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: {
      y: -5,
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 }
    }
  };

  // Overlays için animasyon
  const overlayVariants = {
    initial: { opacity: 0 },
    hover: { opacity: 1, transition: { duration: 0.2 } }
  };

  // Ürün görüntüsü için url
  const imageUrl = product.image1
    ? (product.image1.startsWith('http') ? product.image1 : `/images/${product.image1}`)
    : '/images/No_image_available.svg';

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="w-full sm:w-6/12 md:w-4/12 xl:w-3/12 p-3"
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-md h-full flex flex-col transition-all duration-200">
        <Link to={`/product/${product._id}`} className="block h-full">
          {/* Image Container */}
          <div className="relative overflow-hidden aspect-square">
            {/* Image */}
            <img
              src={imageUrl}
              alt={product.title || "Ürün"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/images/No_image_available.svg';
              }}
            />

            {/* Hover Overlay */}
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center"
              variants={overlayVariants}
              initial="initial"
              whileHover="hover"
            >
              <motion.div
                className="bg-white p-3 rounded-full mx-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <BsEye size={20} className="text-indigo-600" />
              </motion.div>
            </motion.div>

            {/* Stok Durumu */}
            {product.isAvailable !== undefined && (
              <div className="absolute top-3 left-3">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${product.isAvailable
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                    }`}
                >
                  {product.isAvailable ? 'STOKTA' : 'STOKTA DEĞİL'}
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex-grow flex flex-col">
            {/* Category */}
            {product.category && (
              <div className="text-xs text-gray-500 uppercase mb-1">
                {product.category}
              </div>
            )}

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
              {product.title || 'İsimsiz Ürün'}
            </h3>

            {/* Stock */}
            <div className="flex items-center text-gray-600 text-sm mt-auto mb-2">
              <BiCube className="mr-1" />
              <span>Koli İçi Adet: {product.stock}</span>
            </div>

            {/* Price */}
            <div className="mt-2 pt-3 border-t border-gray-100">
              {userToken || adminToken ? (
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-indigo-600">
                    {formatPrice(product.price, product.currency)}
                  </span>
                  <div className="text-indigo-600">
                    <BsCart3 size={18} />
                  </div>
                </div>
              ) : (
                <div className="text-sm font-medium text-gray-500 italic">
                  Fiyatı görmek için giriş yapın
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;