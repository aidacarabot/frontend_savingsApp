
const BASE_URL = import.meta.env.VITE_API_URL ?? "https://backend-savings-app.vercel.app/api/v1";

export const fetchData = async (endpoint, method = "GET", data = null, headers = {}) => {
   try {
    
    const isAuthEndpoint = !endpoint.includes('/login') && !endpoint.includes('/register');
    const token = localStorage.getItem('token');
    if (token && isAuthEndpoint) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    
    const options = {
      method, 
      headers: {
        ...headers, 
      },
    };

    if (data && data instanceof FormData) {
      options.body = data;
    } else if (data) {
      options.headers["Content-Type"] = "application/json"; 
      options.body = JSON.stringify(data); 
    }

    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const responseData = await response.json();

    if (!response.ok) {
      const err = { ...responseData, status: response.status };
      throw err;
    }
    return responseData;

  } catch (error) {
    console.error("Error in fetchData:", error);
    throw error;
  }
};