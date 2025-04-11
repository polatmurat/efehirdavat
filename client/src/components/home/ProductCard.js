import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const ProductCard = ({ product }) => {
  const { userToken, adminToken } = useSelector(state => state.authReducer);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full sm:w-6/12 md:w-4/12 xl:w-3/12 px-5 py-10 border rounded"
      key={product._id}
    >
      <Link to={`/product/${product._id}`}>
        <div className="w-full">
          <img
            src={product.image1 ? (product.image1.startsWith('http') ? product.image1 : `/images/${product.image1}`) : '/images/No_image_available.svg'}
            alt="product"
            className="w-full h-[300px] object-cover"
            onError={(e) => {
              e.target.src = '/images/No_image_available.svg';
            }}
          />
        </div>
        <p className="uppercase text-base font-medium text-black my-2.5">
          {product.title || 'İsimsiz Ürün'}
        </p>
        <div className="flex justify-between">
          {userToken || adminToken ? (
            <>
              <span className="text-lg font-medium text-black">
                {product.price} {product.currency === 'TL' ? '₺' : '$'}
              </span>
            </>
          ) : (
            <span className="text-lg font-medium text-black">
              Fiyatı görmek için giriş yapın
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
