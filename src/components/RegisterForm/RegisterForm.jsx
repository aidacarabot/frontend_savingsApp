import './RegisterForm.css';
import { useForm } from 'react-hook-form';
import { fetchData } from '../../utils/api/fetchData';
import { useNavigate } from 'react-router-dom';

//! Crear componente de error y success messages, también podemos crear useState o algo para esto
// Puedes agregar estas funciones de ejemplo o adaptarlas para tus mensajes
const showErrorMessage = (message) => {
  alert(message); // O usa un componente para mostrar el mensaje
};

const showSuccessMessage = (message) => {
  alert(message); // O usa un componente para mostrar el mensaje
};

const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const navigate = useNavigate(); // Para redirigir después del registro

  // Manejo de la validación de contraseñas
  const validatePasswordMatch = (value) => {
    if (value !== getValues('password')) {
      return "Passwords do not match";
    }
    return true;
  };

  const onSubmit = async (formData) => {
    try {
      const response = await fetchData(
        '/users/register', // endpoint
        'POST', // metodo
        formData, //datos del formulario
      );
      showSuccessMessage('Registration successful. Please log in.');
      console.log('Registration successful:', response);

        // Redirigir al login después de un registro exitoso
      navigate('/login'); // Esto redirige a la ruta de login
    } catch (error) {
      const errorMessage = error?.response?.error || 'There was an error during registration. Please try again.';
      showErrorMessage(errorMessage);
      console.error('Error during registration:', error);
    }

  };

  return (
        <form onSubmit={handleSubmit(onSubmit)} className="register-form">

      <div>
        <label htmlFor="name">Name:</label>
        <input {...register("name", { required: "Name is required" })} />
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="birthDate">Birth Date:</label>
        <input {...register("birthDate", { required: "Birth Date is required" })} type="date" />
        {errors.birthDate && <p>{errors.birthDate.message}</p>}
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input {...register("email", { required: "Email is required" })} type="email" />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input {...register("password", { required: "Password is required" })} type="password" />
        {errors.password && <p>{errors.password.message}</p>}
      </div>

      <div>
          <label htmlFor="repeatPassword">Repeat Password:</label>
          <input 
            {...register("repeatPassword", { 
              required: "Repeat Password is required", 
              validate: validatePasswordMatch 
            })} 
            type="password" 
          />
          {errors.repeatPassword && <p>{errors.repeatPassword.message}</p>}
        </div>


      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm