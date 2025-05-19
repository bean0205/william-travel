const LoadingSpinner = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
    </div>
  );
};

export default LoadingSpinner;
