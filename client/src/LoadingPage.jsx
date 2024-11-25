import React from "react";

const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
        <h1 className="mt-6 text-xl font-semibold text-gray-700">
          Loading user data...
        </h1>
        <p className="mt-2 text-gray-600">
          Please wait while we fetch the information.
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;
