const EnhancedHeading = ({title}) => {
  return (
    <div className="relative py-4 mb-8">
      <h2 className="text-3xl font-bold uppercase relative z-10 inline-block">
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {title}
        </span>
        <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
      </h2>
      <div className="absolute -bottom-1 left-0 w-20 h-1 bg-yellow-400 rounded-full transform translate-x-4"></div>
    </div>
  );
}

export default EnhancedHeading;
