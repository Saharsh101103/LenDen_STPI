const Skeleton = () => {
    return (
      <div className="flex items-center space-x-4">
        <div className="h-8 w-8 rounded-full bg-gray-300 animate-pulse" />
        <div className="flex flex-col">
          <div className="h-4 w-32 bg-gray-300 animate-pulse rounded" />
          <div className="h-3 w-24 bg-gray-300 animate-pulse rounded mt-1" />
        </div>
      </div>
    );
  };
  
  export default Skeleton;
  