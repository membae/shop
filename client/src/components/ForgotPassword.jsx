import React from 'react';

const ForgotPassword = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
          Forgot Password
        </h2>
        <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
          Enter your email and new password below.
        </p>

        <form className="mt-6">
          <div className="flex flex-col space-y-4">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="block w-full px-4 py-2 mt-1 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:ring"
                placeholder="Enter your email"
              />
            </div>

            {/* New Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                className="block w-full px-4 py-2 mt-1 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:ring"
                placeholder="Enter your new password"
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                className="block w-full px-4 py-2 mt-1 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:ring"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 mt-6 text-white bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
