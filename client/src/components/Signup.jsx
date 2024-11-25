import React, { useState } from 'react';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Link } from 'react-router-dom';
import config from '../../config';



const Signup = () => {
  const {api}=config
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const validate = (values) => {
    const errors = {};

    if (!values.firstName) {
      errors.firstName = 'First name is required';
    }

    if (!values.lastName) {
      errors.lastName = 'Last name is required';
    }

    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email address is invalid';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    }

    

    return errors;
  };

  const handleSubmit = async (values, { setSubmitting }) => {

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post(`${api}/signup`, {
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        password: values.password,
      });
      console.log("Response from API:", response); // Log API response

      setLoading(false);
      setSuccessMessage('Registration successful! Please check your email for verification.');
      setSubmitting(false);
    } catch (err) {
      console.error("Error during registration:", err); // Log any errors during registration
      if (err.response) {
        console.error("Error response data:", err.response.data); // Log response data for additional insights
        setError(`Registration failed: ${err.response.data.msg || 'Please try again.'}`);
      } else {
        setError('Registration failed. Please try again.');
      }
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>

      {error && <div className="bg-red-200 text-red-600 p-2 rounded mb-4">{error}</div>}
      {successMessage && <div className="bg-green-200 text-green-600 p-2 rounded mb-4">{successMessage}</div>}

      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-gray-700">First Name</label>
              <Field
                type="text"
                id="firstName"
                name="firstName"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="firstName" component="div" className="text-red-600 text-sm" />
            </div>

            <div className="mb-4">
              <label htmlFor="lastName" className="block text-gray-700">Last Name</label>
              <Field
                type="text"
                id="lastName"
                name="lastName"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="lastName" component="div" className="text-red-600 text-sm" />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <Field
                type="email"
                id="email"
                name="email"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700">Password</label>
              <Field
                type="password"
                id="password"
                name="password"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="password" component="div" className="text-red-600 text-sm" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className={`w-full py-3 px-4 bg-gray-900 text-white font-bold rounded-md ${loading || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'}`}
            >
              {loading || isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </button>
            <p className='ml-20'>Already registered? <Link to='/login' className='ml-2'>Login</Link></p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Signup;
