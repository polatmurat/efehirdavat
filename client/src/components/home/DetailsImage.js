const DetailsImage = ({ image }) => {
  return (
    <div className="w-full">
      <img
        src={image ? image.startsWith("http") ? image : `/images/${image}` : '/images/No_image_available.svg'}
        alt="product"
        className="w-full h-[500px] object-contain bg-gray-100"
        onError={(e) => {
          e.target.src = '/images/No_image_available.svg';
        }}
      />
    </div>
  );
};

export default DetailsImage;
