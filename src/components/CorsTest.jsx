import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { authAPI } from '../api/apiService';

const CorsTest = () => {
  const [corsStatus, setCorsStatus] = useState('Not tested');
  const [csrfStatus, setCsrfStatus] = useState('Not tested');
  const [loginStatus, setLoginStatus] = useState('Not tested');
  const [registerStatus, setRegisterStatus] = useState('Not tested');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get base URL from environment
  const getBaseUrl = () => {
    const useProduction = process.env.REACT_APP_USE_PRODUCTION === 'true';
    if (useProduction) {
      return process.env.REACT_APP_PROD_API_URL || 'https://chambersapi.logicera.in/api';
    } else {
      return process.env.REACT_APP_LOCAL_API_URL || 'http://127.0.0.1:8000/api';
    }
  };

  const testCors = async () => {
    setLoading(true);
    setError(null);
    setCorsStatus('Testing...');
    
    try {
      const response = await axios.get(`${getBaseUrl()}/cors-test`, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      console.log('CORS test response:', response);
      setCorsStatus(`Success: ${response.data.message}`);
    } catch (error) {
      console.error('CORS test error:', error);
      setCorsStatus(`Failed: ${error.message}`);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const testCsrf = async () => {
    setLoading(true);
    setError(null);
    setCsrfStatus('Testing...');
    
    try {
      const response = await authAPI.getCsrfCookie();
      console.log('CSRF test response:', response);
      setCsrfStatus(`Success: ${response.data.message || 'CSRF cookie set'}`);
    } catch (error) {
      console.error('CSRF test error:', error);
      setCsrfStatus(`Failed: ${error.message}`);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setError(null);
    setLoginStatus('Testing...');
    
    try {
      // Test login with test credentials
      const response = await authAPI.login({
        email: 'test@example.com',
        password: 'password123'
      });
      
      console.log('Login test response:', response);
      setLoginStatus(`Success: ${response.data.message || 'Login successful'}`);
    } catch (error) {
      console.error('Login test error:', error);
      setLoginStatus(`Failed: ${error.message}`);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const testRegister = async () => {
    setLoading(true);
    setError(null);
    setRegisterStatus('Testing...');
    
    try {
      // Generate a random email to avoid unique constraint errors
      const randomEmail = `test${Math.floor(Math.random() * 10000)}@example.com`;
      
      // Test registration with test data
      const response = await authAPI.register({
        name: 'Test User',
        email: randomEmail,
        password: 'password123',
        password_confirmation: 'password123'
      });
      
      console.log('Register test response:', response);
      setRegisterStatus(`Success: ${response.data.message || 'Registration successful'}`);
    } catch (error) {
      console.error('Register test error:', error);
      setRegisterStatus(`Failed: ${error.message}`);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">API Connection Test</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">CORS Test</h3>
          <p className="text-gray-600 mb-2">Status: {corsStatus}</p>
          <button 
            onClick={testCors}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Test CORS
          </button>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">CSRF Cookie Test</h3>
          <p className="text-gray-600 mb-2">Status: {csrfStatus}</p>
          <button 
            onClick={testCsrf}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Test CSRF Cookie
          </button>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">Login Test</h3>
          <p className="text-gray-600 mb-2">Status: {loginStatus}</p>
          <button 
            onClick={testLogin}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            Test Login
          </button>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">Registration Test</h3>
          <p className="text-gray-600 mb-2">Status: {registerStatus}</p>
          <button 
            onClick={testRegister}
            disabled={loading}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
          >
            Test Registration
          </button>
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        <p>API URL: {getBaseUrl()}</p>
        <p>Environment: {process.env.NODE_ENV}</p>
      </div>
    </div>
  );
};

export default CorsTest;