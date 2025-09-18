//! FUNCION DE UTILIDAD PARA LAS PETICIONES HTTP AL BACKEND
const BASE_URL = "http://localhost:3000/api/v1"; 
//const BASE_URL = "https://backend-savings-app.vercel.app/api/v1"; 

// Función reutilizable para hacer peticiones HTTP al backend
export const fetchData = async (endpoint, method = "GET", data = null, headers = {}) => {
   try {
    //? Solo añade el token si NO es login ni register
    const isAuthEndpoint = !endpoint.includes('/login') && !endpoint.includes('/register');
    const token = localStorage.getItem('token');
    if (token && isAuthEndpoint) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    //? Configuración de las opciones para la petición HTTP
    const options = {
      method, // GET, POST, PUT, DELETE, etc.
      headers: {
        ...headers, // Otros headers personalizados que puedes necesitar, como un token de autenticación
      },
    };

    if (data && data instanceof FormData) {
      options.body = data;
    } else if (data) {
      options.headers["Content-Type"] = "application/json"; // Aseguramos que el contenido sea JSON
      options.body = JSON.stringify(data); // Convertimos el cuerpo a JSON si es necesario
    }

    //? Realizamos la petición con fetch y obtenemos la respuesta
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const responseData = await response.json(); // Convertimos la respuesta en formato JSON

    //? Verificamos si la respuesta es exitosa
    if (!response.ok) throw responseData;
    return responseData; // Devolvemos los datos de la respuesta

  } catch (error) {
    console.error("Error in fetchData:", error);
    throw error; // Lanza el error para que lo maneje quien llame a esta función
  }
};