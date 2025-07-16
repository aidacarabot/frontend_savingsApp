import { useForm } from 'react-hook-form';
import { fetchData } from '../../utils/api/fetchData';
import { useNavigate } from 'react-router-dom';

const showErrorMessage = (message) => {
  alert(message); // O usa un componente para mostrar el mensaje
};

const showSuccessMessage = (message) => {
  alert(message); // O usa un componente para mostrar el mensaje
};

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    try {
     const response = await fetchData(
        '/users/login', // endpoint de login
        'POST',
        formData // Enviar los datos del formulario
      );

      // Verifica que la respuesta tenga el token
      if (response && response.token) {
        localStorage.setItem('token', response.token); // Guarda el token en localStorage
        showSuccessMessage('Login successful');

        // Redirigir a la página protegida (por ejemplo, el dashboard)
        navigate('/overview'); // Aquí cambia la ruta según lo que necesites
      } else {
        showErrorMessage('Login failed. Invalid credentials.');
      }
    } catch (error) {
      if(error) {
        showErrorMessage('Email or password is incorrect. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
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

      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;